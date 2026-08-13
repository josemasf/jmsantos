---
title: "10 errores comunes al testear aplicaciones Vue con Vitest (y cómo evitarlos)"
description: "Diez problemas frecuentes en suites Vue con Vitest, Testing Library y MSW, con alternativas prácticas para escribir pruebas más fiables y mantenibles."
date: 2026-08-07
tags: [testing, Vitest, Vue, Testing Library, MSW, calidad, refactorización]
category: Testing
image:
  src: /images/blog/26-errores-testing-vue-vitest/errores-testing-vue-vitest.png
  alt: Ilustración de una ruta de pruebas con obstáculos técnicos y soluciones señalizadas.
  width: 1536
  height: 1024
series:
  title: "Testing moderno en Vue: confianza sin fragilidad"
  slug: testing-moderno-vue-confianza-sin-fragilidad
  order: 5
  description: "Una guía práctica para construir una suite de tests rápida, realista y mantenible en Vue 3."
---

Una suite de tests puede tener muchos archivos y seguir ofreciendo poca confianza. El síntoma no siempre es una cobertura baja: a menudo son pruebas que fallan de forma intermitente, que se reescriben en cada refactor o que obligan a mockear media aplicación para comprobar un botón.

Vitest, Testing Library y MSW ayudan, pero no sustituyen las decisiones de diseño. Estos diez errores aparecen con frecuencia en aplicaciones Vue 3 y son oportunidades concretas para mejorar la señal de la suite.

## 1. Comprobar estado interno en lugar de comportamiento

```ts
expect(wrapper.vm.isLoading).toBe(false);
```

Ese estado puede desaparecer, dividirse o derivarse de otra fuente sin que el producto cambie. Comprueba qué puede observar una persona usuaria:

```ts
expect(screen.queryByRole("status", { name: /cargando/i })).not.toBeInTheDocument();
expect(await screen.findByText(/perfil guardado/i)).toBeVisible();
```

[Testing Library en Vue](/blog/testing-library-vue-tests-refactors/) explica cómo priorizar roles y nombres accesibles para que el test proteja un contrato útil.

## 2. Usar clases CSS como selectores de test

Una clase como `.btn-primary` pertenece al diseño, no a la interacción. Cambiar el sistema visual, extraer un componente o renombrar una utilidad debería ser posible sin romper una prueba funcional.

```ts
screen.getByRole("button", { name: /guardar/i });
```

Si no hay una forma semántica de encontrar el elemento, revisa primero su etiqueta o su rol. `data-testid` es apropiado para elementos sin identidad accesible estable, no como sustituto de marcar correctamente un formulario.

## 3. Añadir esperas arbitrarias

```ts
await new Promise((resolve) => setTimeout(resolve, 500));
```

Una espera fija hace la suite más lenta y no garantiza que el estado ya esté listo en una máquina cargada. Espera la evidencia del resultado:

```ts
expect(
  await screen.findByRole("alert", { name: /no se ha podido guardar/i }),
).toBeVisible();
```

Para un *debounce* o un temporizador que forme parte del requisito, usa fake timers solo en esa suite y restaura los timers reales al terminar.

## 4. Mockear `fetch` o el módulo de API en cada test de componente

Mockear una función pura puede ser correcto. Pero si un componente carga datos, sustituir su cliente de API por completo obliga al test a conocer detalles internos y dispersa las respuestas de la API por la suite.

MSW intercepta la petición en el borde de red. El componente usa el mismo cliente y el test cambia solo la respuesta del servidor. Consulta [la guía de MSW](/blog/msw-vue-mocks-api-desarrollo-tests/) para configurar el ciclo de vida global y [fixtures, factories y handlers](/blog/fixtures-factories-handlers-msw-tests/) para organizar los escenarios.

## 5. Compartir estado entre tests

Stores, handlers de MSW, temporizadores y el DOM pueden dejar residuos para el siguiente test. Cuando el orden de ejecución importa, la suite se vuelve difícil de diagnosticar.

```ts
afterEach(() => {
  server.resetHandlers();
  vi.useRealTimers();
});
```

Inicializa una store nueva por prueba o restaura su estado explícitamente. No confíes en que el orden actual de los archivos se mantenga cuando Vitest ejecute en paralelo.

## 6. Abusar de snapshots

Un snapshot grande suele actualizarse con una pulsación sin que nadie lea la diferencia. Eso no convierte el cambio en una regresión detectada.

Los snapshots pequeños pueden ser útiles para una salida estable —por ejemplo, una función que transforma una estructura compleja—, pero para un componente prioriza una o varias aserciones que expresen el comportamiento importante: contenido, control disponible, error o evento emitido.

## 7. Usar `data-testid` en cada elemento

```ts
screen.getByTestId("save-button");
```

Un test id no comprueba que el botón tenga nombre accesible ni que sea distinguible para una tecnología de asistencia. Prefiere `getByRole("button", { name: /guardar/i })`. Reserva el test id para gráficas, regiones complejas o elementos cuyo rol y texto no proporcionen una identidad fiable.

## 8. Tratar todos los casos de API como el camino feliz

Una lista vacía, un 403 y un 503 requieren interfaces diferentes. Si el único mock devuelve siempre dos productos, no se prueba qué ocurre cuando la aplicación necesita informar, reintentar u orientar.

```ts
server.use(
  http.get("/api/products", () =>
    HttpResponse.json({ message: "Servicio no disponible" }, { status: 503 }),
  ),
);
```

Nombra los handlers y factories según el escenario de negocio. Un test que lee `emptyProductsHandler` o `createReadOnlyProfile()` explica más que un objeto anónimo de cien líneas.

## 9. Hacer pruebas de componente gigantes

Si para comprobar una validación de correo necesitas montar la aplicación completa, varias stores y todos los proveedores, el coste de cada escenario crecerá muy rápido. Divide las fronteras:

- Prueba funciones puras con entradas y salidas.
- Prueba composables con estado y efectos propios.
- Prueba componentes con sus props, eventos y comportamiento visible.
- Reserva los flujos completos para unos pocos casos de integración o E2E.

La división no significa mockear todos los hijos. Significa que cada prueba tenga una responsabilidad clara y el nivel de integración adecuado a la confianza que busca.

## 10. Optimizar la ejecución antes de medir

Reducir workers, activar forks o eliminar interacciones de usuario puede empeorar la confianza sin resolver el cuello de botella. Primero identifica si el tiempo se consume en setup, transformaciones, JSDOM, red simulada o los propios tests.

El artículo sobre [tests rápidos con Vitest](/blog/tests-rapidos-vitest-principios-first/) propone una forma de medir y mejorar una suite sin convertirla en una colección de atajos frágiles.

## Una revisión breve para cada pull request

Antes de aprobar un cambio de tests, revisa estas preguntas:

- ¿El test describe una tarea o resultado del usuario?
- ¿El selector se basa en semántica accesible cuando es posible?
- ¿Los estados de carga, vacío y error están representados cuando tienen interfaz propia?
- ¿El estado, los handlers y los temporizadores se restauran entre pruebas?
- ¿La prueba usa el nivel de integración más pequeño que conserva la confianza necesaria?

No hay una suite perfecta ni una proporción universal de unitarios, integración y E2E. Sí hay una regla práctica: cada prueba debe aportar evidencia clara de un comportamiento valioso y fallar por un motivo que merezca investigar.

Con esto termina la serie **Testing moderno en Vue: confianza sin fragilidad**. La velocidad de Vitest, los escenarios HTTP de MSW y las pruebas centradas en usuario solo funcionan bien juntos cuando la suite hace explícitos sus contratos y mantiene sus datos de prueba legibles.
