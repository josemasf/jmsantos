---
title: "Guía de Rendimiento en Tests con Vitest: Defendiendo la 'F' de los Principios FIRST"
description: "Identificación de 6 malas prácticas habituales que ralentizan la suite de pruebas unitarias en Vue y Vitest, y cómo solucionarlas para conseguir pipelines de CI ultrarrápidos."
pubDate: "2026-08-05"
heroImage: "/blog-placeholder-vitest-first.jpg"
tags: ["vitest", "vue", "testing", "performance", "ci-cd", "clean-code"]
---

Como equipos de desarrollo, nuestra suite de pruebas automatizadas debe cumplir estrictamente con los principios **FIRST**[cite: 1]:

* **Fast (Rápido)** ⚡[cite: 1]
* **Independent (Independiente)**[cite: 1]
* **Repeatable (Repetible)**[cite: 1]
* **Self-validating (Auto-validable)**[cite: 1]
* **Timely (Oportuno)**[cite: 1]

Cuando la letra **F** falla y los tests dejan de ser rápidos, los desarrolladores evitan ejecutarlos localmente antes de cada *commit*[cite: 1]. Como consecuencia, las Pull Requests acumulan cuellos de botella en la CI/CD y perdemos la capacidad de entregar valor de forma ágil y segura[cite: 1].

En esta guía repasamos **6 malas prácticas habituales** detectadas en proyectos con Vue 3 y Vitest que ralentizan las pruebas, junto con sus soluciones técnicas y ejemplos de código refinados[cite: 1].

---

## 1. El cuello de botella del tipeo síncrono (`userEvent.type`) en formularios extensos

### ❌ El problema
`userEvent.type()` simula de manera hiperrealista a un usuario interactuando con el teclado[cite: 1]. Para una cadena como `'usuario@ejemplo.com'` (19 caracteres), la librería dispara síncronamente eventos de `keydown`, `keypress`, `input` y `keyup` 19 veces consecutivas[cite: 1].

Si el formulario cuenta con validación reactiva (Vuelidate, VeeValidate) o máscaras de entrada complejas, la aplicación se ve obligada a recalcular watchers, directivas y re-renderizar partes del DOM virtual por cada letra[cite: 1]. En tests de integración donde solo nos interesa rellenar datos para pulsar un botón de envío, esto supone un desperdicio masivo de CPU[cite: 1].

### 🛠️ Solución
Para campos largos, descripciones o inputs en tests de integración donde no testeamos la máscara en sí, debemos usar:

* `user.paste()`: Simula pegar del portapapeles en un solo golpe de renderizado[cite: 1].
* `fireEvent.update()`: Modifica directamente el `v-model` del input de forma instantánea omitiendo eventos físicos de teclado[cite: 1].

```typescript
import { fireEvent, screen } from '@testing-library/vue'

// ❌ Lento (~5 segundos por test de formulario extenso)
private async fillFormWithUserEvent(value: string) {
  const textbox = screen.getByRole('textbox', { name: /email/i })
  await userEvent.clear(textbox)
  await userEvent.type(textbox, value) // Escribe carácter por carácter
}

// ⚡ Ultra rápido (< 0.1 segundos)
private async fillFormFast(value: string) {
  const textbox = screen.getByRole('textbox', { name: /email/i })
  // Inyecta el valor completo en el v-model al instante
  await fireEvent.update(textbox, value) 
}
```[cite: 1]

---

## 2. Inicialización repetida del entorno virtual de `userEvent`

### ❌ El problema
Llamar directamente a las importaciones globales como `userEvent.click()` o `userEvent.type()` obliga a la librería a limpiar, inicializar y reconfigurar los manejadores de eventos virtuales (ratón, teclado, foco) en cada interacción individual del test[cite: 1].

```typescript
// ⚠️ Ineficiente
import userEvent from '@testing-library/user-event'

it('debe enviar el formulario', async () => {
  await userEvent.click(editButton)   // Inicializa ecosistema de eventos
  await userEvent.type(input, 'Data') // Vuelve a inicializar desde cero
  await userEvent.click(saveButton)   // Vuelve a inicializar desde cero
})
```[cite: 1]

### 🛠️ Solución
Instanciar `userEvent.setup()` una sola vez en el bloque `beforeEach` de la suite y reutilizar la instancia `user` local[cite: 1].

```typescript
import userEvent from '@testing-library/user-event'

describe('Suite de detalles de pedido', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    // ⚡ Inicializa una única instancia virtual por test
    user = userEvent.setup() 
  })

  it('debe enviar el formulario', async () => {
    await user.click(editButton)   // Reutiliza la configuración
    await user.click(saveButton)   // Reutiliza la configuración
  })
})
```[cite: 1]

---

## 3. Abuso de consultas asíncronas (`findBy*`) en elementos síncronos

### ❌ El problema
Las consultas `find*` (`findByRole`, `findByText`) devuelven promesas[cite: 1]. De fondo, ejecutan un bucle de reintentos (*polling*) con un timeout de hasta 1000–5000 ms. Si un elemento ya existe síncronamente en el DOM (porque no depende de llamadas a APIs ni animaciones), utilizar `find*` introduce una latencia oculta mientras Node resuelve las microtareas de la promesa[cite: 1].

```typescript
// ⚠️ Ineficiente
async function clickSaveButton() {
  // Espera asíncrona innecesaria por un botón que ya está renderizado
  const saveButton = await screen.findByRole('button', { name: /guardar/i })
  await userEvent.click(saveButton)
}
```[cite: 1]

### 🛠️ Solución
Aplica esta regla general de selección:
* Usa `getBy*` para elementos que deban aparecer de forma síncrona tras una interacción[cite: 1]. Es inmediato y, si falla, lanza un error explícito al instante[cite: 1].
* Usa `findBy*` únicamente cuando esperes la resolución de una petición asíncrona (ej. mocks de API con MSW) o transiciones complejas[cite: 1].

```typescript
// ⚡ Recuperación instantánea del DOM
function clickSaveButton(userInstance: ReturnType<typeof userEvent.setup>) {
  const saveButton = screen.getByRole('button', { name: /guardar/i })
  return userInstance.click(saveButton)
}
```[cite: 1]

---

## 4. Renderizados redundantes para validar datos estáticos en el arranque

### ❌ El problema
Montar un componente pesado (como vistas contenedor o formularios principales) tiene un alto coste de ciclo de vida (inicialización de stores en Pinia, stubs del Router, inyección de i18n)[cite: 1]. Si creamos tests unitarios individuales pequeños para comprobar textos estáticos iniciales, pagamos el coste de renderizado y desmontaje múltiples veces[cite: 1].

```typescript
// ⚠️ Ineficiente: 2 renderizados completos para datos estáticos iniciales
it('debe mostrar el código de referencia', () => {
  render(OrderDetail, renderOptions)
  expect(screen.getByText('REF-12345')).toBeVisible()
})

it('debe mostrar la fecha del pedido', () => {
  render(OrderDetail, renderOptions) 
  expect(screen.getByText('10/05/2026')).toBeVisible()
})
```[cite: 1]

### 🛠️ Solución
Agrupar las aserciones del estado inicial de carga en un único test unificado y descriptivo[cite: 1]. Pasamos de $N$ renderizados costosos a exactamente 1[cite: 1].

```typescript
it('debe mostrar toda la información inicial tras cargar con éxito', () => {
  // ⚡ Un solo renderizado para todas las validaciones estáticas iniciales
  render(OrderDetail, renderOptions)

  expect(screen.getByText('Detalle del Pedido')).toBeInTheDocument()
  expect(screen.getByText('REF-12345')).toBeVisible()
  expect(screen.getByText('10/05/2026')).toBeVisible()
  expect(screen.getByText('Entregado')).toBeVisible()
})
```[cite: 1]

---

## 5. Temporizadores residuales (Debounce/Throttle) y errores de `ReferenceError: window is not defined` en CI

### ❌ El problema
Componentes de filtrado, autocompletados o búsquedas predictivas suelen utilizar retardo (*debounce* / *throttle*) para limitar peticiones[cite: 1].

Cuando escribimos texto en la prueba, componentes con *debounce* agendan un `setTimeout` en segundo plano[cite: 1]. Si el test realiza sus aserciones y finaliza antes de que se cumpla el temporizador, Vitest destruye el entorno simulado (JSDOM) y limpia el objeto global `window` para dar paso a la siguiente suite[cite: 1]. Cuando el temporizador agendado se despierta milisegundos después en el hilo de Node, intenta acceder a `window`, no lo encuentra y provoca un fallo inesperado en la CI[cite: 1].

### 🛠️ Solución
1. Activar los *Fake Timers* de Vitest en el `beforeEach`[cite: 1].
2. Vincular el temporizador de `userEvent` para que avance sincronizado con Vitest[cite: 1].
3. Drenar y restaurar cualquier timer pendiente en el `afterEach` antes de destruir el entorno[cite: 1].

```typescript
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import CustomerSearchSelector from './CustomerSearchSelector.vue'

describe('CustomerSearchSelector', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    vi.useFakeTimers() // 1. Reemplazamos timers reales por virtuales
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }) // 2. Sincronizamos userEvent
  })

  afterEach(() => {
    vi.runOnlyPendingTimers() // 3. Consumimos temporizadores residuales pendientes
    vi.useRealTimers()        // 4. Restauramos los timers del sistema
  })

  it('debe filtrar clientes tras el retardo del debounce', async () => {
    render(CustomerSearchSelector)
    const searchInput = screen.getByLabelText(/buscar cliente/i)
    
    await user.click(searchInput)
    await user.type(searchInput, 'ACME') // El debounce interno queda completamente bajo control
    
    expect(screen.getByText('ACME Corp')).toBeInTheDocument()
  })
})
```[cite: 1]

---

## 6. Configuración deficiente de los scripts de ejecución en la CI

### ❌ El problema
Las máquinas o agentes de CI estándar (como Azure DevOps o GitHub Actions) suelen disponer de únicamente 2 vCPUs y límites estrictos de memoria RAM[cite: 1].

Cuando ejecutamos Vitest en la CI con el comando predeterminado de desarrollo, Vitest intenta paralelizar el trabajo utilizando hilos/workers basados en la CPU de la máquina host[cite: 1]. En entornos limitados, la sobrecarga por intercambio de contexto (*context switching*) y fugas de memoria en JSDOM provocan:
* Ralentización extrema de la suite (los tests tardan el doble en la CI que en local)[cite: 1].
* Errores aleatorios de falta de memoria (`JavaScript heap out of memory`)[cite: 1].
* Cálculo innecesario de cobertura de código (`--coverage`) en Pull Requests rápidas, añadiendo una penalización del 30% al 50% de tiempo[cite: 1].

### 🛠️ Solución
Optimizar el script de ejecución en el `package.json` distinguiendo el entorno local del entorno de Integración Continua[cite: 1]:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ci": "vitest run --silent --pool=forks --maxWorkers=2"
  }
}
```[cite: 1]

### ¿Por qué esta configuración para la CI?
* **`run`**: Fuerza a Vitest a ejecutarse una sola vez y salir (evita el modo *watch*)[cite: 1].
* **`--silent`**: Desactiva los `console.log` / `console.error` de la consola durante la ejecución, ahorrando ciclos de CPU al renderizar logs masivos en los agentes de CI[cite: 1].
* **`--pool=forks`**: En lugar de usar hilos compartidos (*Worker Threads*), utiliza procesos independientes ligeros[cite: 1]. JSDOM suele acumular fugas de memoria al compartir hilos; los procesos aislados liberan la memoria de forma impecable al terminar cada suite[cite: 1].
* **`--maxWorkers=2`**: Limita la concurrencia a la cantidad exacta de núcleos reales disponibles en el agente de la CI[cite: 1].

---

## Conclusión

Optimizar la suite de pruebas no requiere sacrificar la calidad de las aserciones ni el realismo de los tests[cite: 1]. Aplicando buenas prácticas como la actualización directa con `fireEvent` en formularios grandes, la gestión consciente de los temporizadores virtuales y la limitación de procesos en el agente de CI, es posible **reducir los tiempos de ejecución en más de un 70%** y garantizar la estabilidad de los pipelines[cite: 1].
