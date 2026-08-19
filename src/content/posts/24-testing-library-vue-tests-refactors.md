---
title: "Testing Library en Vue: tests que sobreviven a los refactors"
description: "Cómo escribir tests de componentes Vue 3 centrados en comportamiento observable, consultas accesibles e interacciones de usuario para refactorizar con confianza."
date: 2026-07-10
tags: [testing, Testing Library, Vue, Vitest, accesibilidad, refactorización]
category: Testing
image:
  src: /images/blog/24-testing-library-vue-tests-refactors/testing-library-vue-refactors.png
  alt: Ilustración de un test que observa el comportamiento visible de un componente mientras cambia su interior.
  width: 1536
  height: 1024
series:
  slug: testing-moderno-vue-confianza-sin-fragilidad
  order: 3
---

Un refactor debería poder cambiar la estructura interna de un componente sin obligarnos a reescribir sus tests. Sin embargo, es fácil acabar con una suite que conoce demasiado: clases CSS, nombres de métodos, estado de un composable o la jerarquía exacta del HTML. Entonces el test falla aunque la persona usuaria siga pudiendo completar la misma tarea.

[Testing Library](https://testing-library.com/docs/guiding-principles/) propone otro punto de vista: probar el componente de una forma parecida a como se utiliza. En Vue 3, esto significa renderizar el componente, encontrar controles mediante semántica accesible e interactuar con ellos. No es una prohibición absoluta de revisar implementación; es una decisión sobre qué evidencia merece protegerse.

Este artículo parte de una aplicación con Vitest. Si necesitas mejorar el tiempo de respuesta de la suite, empieza por [tests rápidos con Vitest](/blog/tests-rapidos-vitest-principios-first/). Si el componente depende de una API, combina estos tests con [MSW en Vue 3](/blog/msw-vue-mocks-api-desarrollo-tests/) para que la red simulada no convierta el test en un mock de sus propios detalles.

## El contrato que importa es el que ve la persona usuaria

Imagina un formulario de perfil. El componente puede usar un `ref`, un composable o una store para guardar el estado; puede cambiar Vuetify por controles nativos; incluso puede extraer el botón a otro componente. Nada de eso debería invalidar un test que comprueba que una persona introduce un correo válido, guarda y recibe confirmación.

Un test frágil suele inspeccionar cómo está construido el componente:

```ts
import { mount } from "@vue/test-utils";

const wrapper = mount(ProfileForm);

await wrapper.find(".email-input").setValue("ana@example.com");
await wrapper.find(".submit-button").trigger("click");

expect(wrapper.vm.isSaved).toBe(true);
```

El problema no es que estas APIs sean incorrectas. El problema es el contrato: la clase y `isSaved` son decisiones internas. Renombrar una clase por diseño o sustituir una variable por un estado derivado rompe el test sin revelar una regresión.

La misma intención, expresada mediante comportamiento observable, tiene una vida útil mayor:

```ts
import { fireEvent, render, screen } from "@testing-library/vue";
import { expect, it } from "vitest";
import ProfileForm from "./ProfileForm.vue";

it("guarda el perfil cuando el correo es válido", async () => {
  render(ProfileForm);

  await fireEvent.update(
    screen.getByRole("textbox", { name: /correo electrónico/i }),
    "ana@example.com",
  );
  await fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

  expect(await screen.findByText(/perfil guardado/i)).toBeVisible();
});
```

El test sigue describiendo lo mismo aunque cambie la implementación. Además, sus consultas hacen una pregunta útil: ¿el formulario tiene una etiqueta asociada al campo y un botón con un nombre comprensible?

## Empieza por consultas que una tecnología de asistencia pueda entender

La prioridad de una consulta no depende de que sea más corta. Depende de lo próxima que esté a la experiencia real. `getByRole` suele ser la primera opción porque utiliza el rol semántico y el nombre accesible del elemento.

```ts
screen.getByRole("button", { name: /guardar cambios/i });
screen.getByRole("heading", { name: /datos de facturación/i });
screen.getByRole("alert", { name: /no se ha podido guardar/i });
screen.getByRole("textbox", { name: /correo electrónico/i });
```

El nombre accesible puede proceder del texto del elemento, de un `label` correctamente asociado o de atributos ARIA. Si una consulta razonable no encuentra el control, no añadas un selector inmediatamente: primero revisa el marcado.

```vue
<!-- Difícil de identificar y sin etiqueta visible -->
<input placeholder="correo" />

<!-- La etiqueta forma parte del contrato accesible -->
<label for="email">Correo electrónico</label>
<input id="email" v-model="email" type="email" />
```

Esta regla también evita una trampa frecuente: buscar texto que no representa una interacción. Para una notificación de error usa `role="alert"`; para una carga, un `role="status"` con un nombre que explique qué está ocurriendo. El test y la accesibilidad se refuerzan mutuamente, pero uno no sustituye una auditoría de accesibilidad completa.

## Elige la consulta según el momento de la aserción

Las tres variantes más habituales tienen significados distintos:

| Consulta     | Cuándo usarla                                     | Si no encuentra el elemento                 |
| ------------ | ------------------------------------------------- | ------------------------------------------- |
| `getBy...`   | El elemento ya debe estar en el DOM.              | Falla de inmediato.                         |
| `findBy...`  | El elemento aparece tras una operación asíncrona. | Espera hasta el límite configurado y falla. |
| `queryBy...` | Quieres comprobar que algo no existe.             | Devuelve `null`.                            |

Un ejemplo de carga y error lo deja claro. No hace falta añadir una espera manual ni consultar una propiedad interna para saber cuándo ha terminado la petición:

```ts
it("informa del error si no se puede cargar el perfil", async () => {
  render(ProfilePanel);

  expect(
    screen.getByRole("status", { name: /cargando perfil/i }),
  ).toBeVisible();

  expect(
    await screen.findByRole("alert", {
      name: /no se ha podido cargar el perfil/i,
    }),
  ).toBeVisible();
  expect(
    screen.queryByRole("status", { name: /cargando perfil/i }),
  ).not.toBeInTheDocument();
});
```

En este escenario, MSW puede responder con un error HTTP sin alterar el cliente de API ni el composable. El test comprueba la transición que importa: del estado de carga al mensaje que podrá leer la persona usuaria.

## Interactúa como una persona cuando la interacción sea relevante

`fireEvent` es útil para preparar un control cuando la secuencia exacta de eventos no forma parte de lo que quieres probar. Para comportamientos de teclado, foco, validación mientras se escribe o navegación entre campos, `user-event` ofrece una aproximación más realista.

```ts
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";

it("muestra un error al abandonar un correo no válido", async () => {
  const user = userEvent.setup();
  render(ProfileForm);

  await user.type(
    screen.getByRole("textbox", { name: /correo electrónico/i }),
    "correo-inválido",
  );
  await user.tab();

  expect(
    screen.getByText(/introduce una dirección de correo válida/i),
  ).toBeVisible();
});
```

No conviene convertir cada preparación de datos en una simulación de tecleo. Si un test solo necesita arrancar con un valor válido para verificar el envío, `fireEvent.update` expresa mejor esa intención y ejecuta menos trabajo. Reserva `user-event` para los casos en que la forma de interactuar sea parte del requisito.

## `data-testid` es una salida deliberada, no el punto de partida

Hay elementos cuyo texto o rol no ofrece una identidad estable: una gráfica, una región decorativa que debe permanecer presente o una fila concreta dentro de una visualización compleja. En esos casos, un `data-testid` puede ser el contrato más claro.

```vue
<section aria-label="Evolución mensual de ventas">
  <SalesChart data-testid="sales-chart" :points="points" />
</section>
```

```ts
expect(screen.getByTestId("sales-chart")).toBeVisible();
```

No uses un `data-testid` para evitar añadir un `label` a un campo ni porque sea más rápido que pensar en el nombre accesible. Si el selector aparece en casi cada elemento del componente, probablemente esté ocultando una semántica que falta o un test demasiado centrado en estructura.

## Prueba los límites, no cada detalle de la colaboración interna

Un componente puede delegar en varios hijos y composables. La prueba de integración del componente debe comprobar el resultado de esa colaboración sin conocer cada llamada. Los módulos puros y los composables con lógica propia pueden tener sus propios tests unitarios, con entradas y salidas claras.

Por ejemplo, si `ProfileForm` emite un evento tras validar el formulario, comprobar el evento es una buena frontera pública del componente:

```ts
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

it("emite los datos normalizados al enviar", async () => {
  const user = userEvent.setup();
  const { emitted } = render(ProfileForm);

  await user.type(screen.getByRole("textbox", { name: /nombre/i }), "  Ana  ");
  await user.type(
    screen.getByRole("textbox", { name: /correo electrónico/i }),
    "ana@example.com",
  );
  await user.click(screen.getByRole("button", { name: /guardar/i }));

  expect(emitted().save).toEqual([[{ name: "Ana", email: "ana@example.com" }]]);
});
```

El evento es parte del contrato del componente: el padre necesita poder reaccionar a él. En cambio, no hace falta verificar que el método `normaliseProfile` se invocó ni cuántas veces cambió un `ref`. En la implementación, mantén ese límite igual de claro: props como entradas de solo lectura y eventos explícitos hacia arriba.

## Qué hacer cuando un refactor rompe un test

Antes de actualizar una aserción, formula una pregunta: ¿ha cambiado el comportamiento que importa o solo el modo de implementarlo?

- Si cambió el texto, el flujo o el control con el que interactúa la persona usuaria, actualiza el test y revisa si el cambio era intencionado.
- Si solo cambió una clase, un componente hijo o el estado interno, busca una consulta por rol, etiqueta o resultado visible que describa la intención original.
- Si el test no puede expresar su intención sin acoplarse al DOM, tal vez el componente no ofrece una frontera observable suficiente. Añadir una etiqueta, un estado de carga semántico o un evento público suele ser una mejora del producto, no un truco de testing.

Una suite resistente no es la que nunca falla durante un refactor. Es la que falla cuando el cambio altera un comportamiento valioso y explica con claridad cuál es ese comportamiento.

## Lista de comprobación antes de dar por bueno un test

- ¿El nombre del test describe una tarea o un resultado, en lugar de un método interno?
- ¿La primera consulta posible es por rol y nombre accesible?
- ¿Usas `findBy...` solo para contenido que aparece de forma asíncrona y `queryBy...` para ausencias?
- ¿La interacción reproduce teclado, foco o escritura solo cuando esos detalles forman parte del requisito?
- ¿El test seguiría teniendo sentido si cambia la librería visual o se extrae un componente hijo?

Cuando la respuesta es afirmativa, el test protege una capacidad del producto, no una fotografía de la implementación. En el siguiente artículo de la serie separaremos _fixtures_, _factories_ y _handlers_ para que esos escenarios sigan siendo fáciles de leer a medida que aumente la suite.
