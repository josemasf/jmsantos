---
title: "Tests rápidos con Vitest: cómo aplicar la F de FIRST sin perder confianza"
description: "Seis decisiones prácticas para acelerar tests de Vue con Vitest y Testing Library, evitando optimizaciones que vuelven la suite menos fiable."
date: 2026-08-05
tags: [testing, vitest, vue, performance, CI/CD, clean-code]
category: Testing
---

Una suite lenta no solo consume minutos de CI: reduce la frecuencia con la que el equipo la ejecuta y hace más difícil detectar una regresión cerca del cambio que la introdujo. La **F** de _Fast_ en los principios FIRST persigue precisamente un feedback rápido.

Pero acelerar tests no consiste en sustituir cada interacción por el atajo más corto. Un test es útil cuando representa el comportamiento que importa y es rápido **para el nivel de confianza que aporta**. En Vue 3, Vitest y Testing Library, estas seis decisiones suelen ofrecer mejoras reales sin convertir la suite en una colección de pruebas frágiles.

## 1. Escribe de forma realista solo cuando el teclado forme parte del comportamiento

`user-event` reproduce una interacción de usuario completa y puede disparar varios eventos. Es la elección adecuada si queremos comprobar foco, navegación con teclado, validación mientras se escribe o una máscara de entrada. La propia librería explica la diferencia entre disparar un evento y simular una interacción completa en su [introducción a user-event](https://testing-library.com/docs/user-event/intro/).

Sin embargo, si el objetivo del test es comprobar qué hace el formulario **una vez que ya tiene un valor válido**, escribir carácter a carácter añade trabajo que no aporta evidencia. En un campo con `v-model`, Vue Testing Library ofrece `fireEvent.update`, que actualiza el control y emite el evento nativo adecuado.

```ts
import { fireEvent, render, screen } from "@testing-library/vue";
import ProfileForm from "./ProfileForm.vue";

it("envía el perfil con un correo válido", async () => {
  render(ProfileForm);

  await fireEvent.update(
    screen.getByRole("textbox", { name: /correo electrónico/i }),
    "ana@example.com",
  );

  await fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

  expect(screen.getByText(/perfil guardado/i)).toBeInTheDocument();
});
```

Reserva `user.type` para al menos un test que cubra el comportamiento al teclear. Para el resto, elige la interacción más pequeña que conserve el significado de la prueba. Consulta el [ejemplo de `v-model` de Vue Testing Library](https://testing-library.com/docs/vue-testing-library/examples/) si necesitas verificar el caso concreto.

## 2. Crea una instancia de `userEvent` por test

Usa `userEvent.setup()` dentro del propio test o en su `beforeEach`. Así cada prueba tiene su estado de interacción aislado y todas las acciones de esa prueba reutilizan la misma instancia.

```ts
import userEvent from "@testing-library/user-event";

it("permite editar y guardar un pedido", async () => {
  const user = userEvent.setup();

  render(OrderDetail, { props: { order } });

  await user.click(screen.getByRole("button", { name: /editar/i }));
  await user.click(screen.getByRole("button", { name: /guardar/i }));

  expect(screen.getByText(/pedido actualizado/i)).toBeInTheDocument();
});
```

El beneficio principal no es una promesa de milisegundos, sino evitar estado compartido y mantener el test claro. No crees la instancia en un `beforeAll`: una interacción no debe filtrarse a otra prueba.

## 3. Usa `getBy` y `findBy` según el momento en que aparece el elemento

La diferencia importante no es de microoptimización, sino de intención. `getBy*` falla inmediatamente si el elemento no está presente; `findBy*` devuelve una promesa y reintenta hasta que encuentra el elemento o vence el timeout. Testing Library documenta este comportamiento en su [guía de queries](https://testing-library.com/docs/queries/about/).

```ts
// El botón forma parte del render inicial: debe existir ya.
const saveButton = screen.getByRole("button", { name: /guardar/i });

// La alerta depende de una petición que termina después.
const successMessage = await screen.findByRole("status", { name: /guardado/i });
```

Usar `findBy` para todo oculta qué partes del flujo son realmente asíncronas. Usar `getBy` para una respuesta remota genera tests intermitentes. Además de ganar claridad, esta elección evita esperas innecesarias cuando el estado esperado nunca puede llegar.

## 4. Reduce renderizados, no la precisión de las aserciones

Montar una vista completa puede activar router, internacionalización, stores, plugins y stubs. Antes de agrupar varios `it` solo para ahorrar renderizados, pregúntate si cada prueba representa un comportamiento independiente. Tests demasiado grandes fallan con menos diagnóstico.

Una alternativa más sana es colocar la lógica pura en composables o funciones unitarias y dejar que el test de componente compruebe el flujo visible. Si varias aserciones describen una única condición inicial, sí es razonable mantenerlas juntas:

```ts
it("muestra el resumen del pedido cargado", () => {
  render(OrderDetail, { props: { order } });

  expect(
    screen.getByRole("heading", { name: /detalle del pedido/i }),
  ).toBeVisible();
  expect(screen.getByText("REF-12345")).toBeVisible();
  expect(screen.getByText("Entregado")).toBeVisible();
});
```

El ahorro sostenible suele venir de renderizar menos dependencias y de no usar JSDOM para probar lógica que no necesita DOM, no de fusionar escenarios inconexos.

## 5. Controla el tiempo: fake timers para debounce y throttle

Esperar un debounce real convierte un detalle de UX en tiempo de ejecución acumulado. Vitest permite sustituir los temporizadores con `vi.useFakeTimers()` y avanzar el reloj de forma explícita. Si combinas fake timers con `user-event`, configura `advanceTimers`; es la opción recomendada por [Testing Library](https://testing-library.com/docs/user-event/options/).

```ts
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.useFakeTimers();
  user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
});

afterEach(async () => {
  await vi.runOnlyPendingTimersAsync();
  vi.useRealTimers();
});

it("busca al terminar el debounce", async () => {
  render(CustomerSearch);

  await user.type(
    screen.getByRole("textbox", { name: /buscar cliente/i }),
    "acme",
  );
  await vi.advanceTimersByTimeAsync(300);

  expect(await screen.findByText("ACME Corp")).toBeVisible();
});
```

No actives fake timers como configuración global por defecto. Úsalos en las suites que dependen del tiempo y restaura siempre los reales. La [API de Vitest](https://vitest.dev/api/vi) detalla la diferencia entre ejecutar todos los timers y solo los pendientes.

## 6. Ajusta la CI después de medir

No hay una combinación universal de workers, pool y cobertura. Depende del número de núcleos, de la memoria disponible, del coste de JSDOM y de si el cuello de botella está en transformación, importación o ejecución.

Empieza con una medición reproducible y conserva el resultado en el log del pipeline. Después prueba cambios pequeños, uno por uno: separar proyectos unitarios y de integración, limitar workers si hay presión de memoria o ejecutar la cobertura en un job específico. Un punto de partida puede ser:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ci": "vitest run --maxWorkers=50%"
  }
}
```

`vitest run` es apropiado para CI porque ejecuta la suite una vez y termina. El valor de `maxWorkers` debe validarse en el runner real: más paralelismo puede acelerar una suite CPU-bound, pero también empeorar la contención de memoria. Evita presentar `--pool=forks`, `--silent` o un número fijo de workers como remedios universales.

## Un orden práctico para mejorar la suite

1. Mide duración total y por archivo antes de cambiar nada.
2. Elimina esperas reales, delays de UX y renderizados innecesarios de los tests más lentos.
3. Aísla el estado de stores, mocks, DOM y timers entre pruebas.
4. Separa los tests de lógica pura de los que necesitan renderizar UI.
5. Ajusta la concurrencia y la cobertura con datos del CI, no con supuestos sobre el runner.

La velocidad debe ser un requisito continuo. Una suite que da feedback rápido y conserva pruebas de interacción donde realmente hacen falta permite iterar con más seguridad, tanto en local como en CI.

## Recursos

- [Testing Library: prioridades y tipos de queries](https://testing-library.com/docs/queries/about/)
- [Vue Testing Library: API de `fireEvent.update`](https://testing-library.com/docs/vue-testing-library/api/)
- [Testing Library: opciones de `userEvent.setup`](https://testing-library.com/docs/user-event/options/)
- [Vitest: API de fake timers](https://vitest.dev/api/vi)
