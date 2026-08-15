---
title: "MSW en Vue 3: mocks de API fiables para desarrollo, Vitest y Storybook"
description: "Cómo centralizar mocks HTTP con Mock Service Worker en una aplicación Vue 3 para reutilizarlos en desarrollo local, tests con Vitest y Storybook sin duplicar contratos."
date: 2026-05-01
tags: [MSW, Vue, testing, Vitest, Storybook, mocks, API]
category: Testing
image:
  src: /images/blog/19-msw-vue-mocks-api-desarrollo-tests/msw-vue-mocks-api.png
  alt: Ilustración de un intermediario de red que distribuye respuestas coherentes a desarrollo y pruebas.
  width: 1536
  height: 1024
series:
  slug: testing-moderno-vue-confianza-sin-fragilidad
  order: 2
---

Los mocks de API suelen empezar como una solución puntual: un `vi.mock` para desbloquear un test o un JSON estático para poder terminar una pantalla antes de que exista el backend. El problema aparece cuando cada contexto inventa su propia respuesta. La vista funciona con un dato, Storybook muestra otro y los tests dependen de un tercero. Cuando cambia el contrato, ninguno avisa de forma clara qué se ha quedado obsoleto.

[Mock Service Worker (MSW)](https://mswjs.io/docs/) permite extraer el comportamiento de red a una capa independiente. Intercepta solicitudes HTTP y devuelve respuestas simuladas, tanto en el navegador como en Node.js. La idea no es ocultar la red dentro de un mock del cliente HTTP: es definir una fuente de verdad reutilizable para el comportamiento que espera el frontend.

En este artículo construiremos una estructura para Vue 3 y TypeScript que sirve en tres lugares:

- Desarrollo local, mediante un *Service Worker*.
- Tests de componentes e integración con Vitest, mediante un servidor de MSW en Node.js.
- Historias de Storybook, sobrescribiendo solo el escenario que cada historia necesita.

Los ejemplos usan MSW 2, Vue 3 y `fetch`, pero el enfoque también funciona si el cliente HTTP es Axios: MSW intercepta la solicitud saliente, no una función concreta de la aplicación.

## Por qué no basta con hacer mock de `fetch` o del módulo de API

Un mock de módulo es una herramienta válida para aislar una dependencia en un test unitario. Por ejemplo, una función pura no necesita una capa HTTP realista. Pero, al probar un componente que carga una lista, interceptar en el borde de la red aporta una señal más útil: el componente, el cliente HTTP y el tratamiento de la respuesta participan tal y como lo harían en la aplicación.

La diferencia práctica es importante:

| Enfoque | Qué se sustituye | Riesgo habitual |
| --- | --- | --- |
| `vi.mock("./api")` | La implementación del módulo | El test conoce detalles internos y cada suite inventa sus datos. |
| `vi.stubGlobal("fetch")` | Una API global | Hay que recrear respuestas, errores y cabeceras a mano. |
| MSW | La comunicación HTTP saliente | Requiere mantener los handlers alineados con el contrato. |

MSW no elimina la necesidad de tests unitarios ni valida por sí solo el contrato del backend. Su valor está en simular la red con la misma definición en varios entornos y permitir que el test compruebe comportamiento observable: qué ve la persona usuaria ante carga, éxito o error.

## Estructura: handlers compartidos y arranques específicos por entorno

Una estructura pequeña evita que los mocks se conviertan en una segunda aplicación:

```text
src/
  mocks/
    handlers.ts
    browser.ts
    node.ts
    fixtures/
      products.ts
  test/
    setup.ts
```

`handlers.ts` contiene las rutas y sus respuestas por defecto. `browser.ts` y `node.ts` solo adaptan esos handlers al entorno. Las fixtures son datos legibles que se pueden reutilizar, no una copia completa de una base de datos.

Instala MSW como dependencia de desarrollo y genera el archivo que el navegador necesita. En una aplicación Astro o Vite convencional, el directorio público es `public`:

```bash
pnpm add -D msw
pnpm exec msw init public --save
```

El comando debe dejar `public/mockServiceWorker.js` accesible desde la raíz de la aplicación. Si ese archivo devuelve un 404, MSW no podrá interceptar peticiones en el navegador. La [integración de navegador de MSW](https://mswjs.io/docs/integrations/browser/) explica este requisito y el uso de `setupWorker`.

## Define respuestas realistas, pero mínimas

Empieza por el contrato que consume la pantalla. Para una lista de productos, una fixture puede contener los campos que el frontend usa de verdad:

```ts
// src/mocks/fixtures/products.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

export const products: Product[] = [
  { id: "p-001", name: "Teclado compacto", price: 89 },
  { id: "p-002", name: "Ratón ergonómico", price: 54 },
];
```

No conviertas una fixture en una representación ficticia de todos los campos que ofrece el backend. Los datos de prueba deben expresar un escenario: lista vacía, resultado con elementos, permiso denegado o error de red. Cuanto más significado tengan, más fácil será entender por qué existe cada test e historia.

Después, declara el comportamiento HTTP con `http` y `HttpResponse`:

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { products } from "./fixtures/products";

const apiUrl = "https://api.example.test";

export const handlers = [
  http.get(`${apiUrl}/products`, () => {
    return HttpResponse.json(products);
  }),

  http.get(`${apiUrl}/products/:id`, ({ params }) => {
    const product = products.find((item) => item.id === params.id);

    if (!product) {
      return HttpResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),
];
```

Usa una URL base coherente con la configuración de tu cliente HTTP. Si la aplicación lee `VITE_API_URL`, una opción es construir el handler a partir de una constante compartida y documentar qué valor se usa en cada entorno. Evita rutas demasiado amplias, como `http.get("*")`: pueden interceptar peticiones no relacionadas y ocultar una configuración incorrecta.

## Activa MSW en el navegador solo cuando lo necesites

En el navegador, MSW registra un *Service Worker*. Crea el adaptador:

```ts
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

Y actívalo desde el punto de entrada de Vue antes de montar la aplicación. El `await` evita una carrera entre el primer render y el registro del worker:

```ts
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({ onUnhandledRequest: "bypass" });
}

await enableMocking();

createApp(App).mount("#app");
```

La condición explícita `VITE_ENABLE_MSW` hace que el mock sea una decisión del entorno, no una sorpresa para quien ejecute el proyecto. En producción no se inicia el worker. Durante el desarrollo puede ser razonable usar `"bypass"` para que una ruta sin handler siga llegando al backend real; si el objetivo es detectar huecos en los mocks, usa `"error"` temporalmente y corrige las solicitudes no previstas.

## Configura el servidor de MSW para Vitest

Node.js no dispone de *Service Workers*. Para tests, MSW proporciona `setupServer`, que intercepta el tráfico HTTP del proceso de Node:

```ts
// src/mocks/node.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

El ciclo de vida debe ser global y, sobre todo, restaurar los handlers tras cada prueba:

```ts
// src/test/setup.ts
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../mocks/node";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
```

Registra el archivo en Vitest. La propiedad exacta depende de si tu configuración vive en `vite.config.ts` o `vitest.config.ts`, pero el resultado es el mismo:

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

La secuencia `listen`, `resetHandlers` y `close` no es ceremonial. `resetHandlers` evita que un override definido en una prueba afecte a la siguiente, mientras que `close` restaura los módulos de red al terminar la suite. Es el ciclo de vida recomendado por la [integración de MSW con Node.js](https://mswjs.io/docs/integrations/node/).

Con `onUnhandledRequest: "error"`, un test falla si intenta llamar a una URL que no está descrita. Es una protección útil contra tests que dependen accidentalmente de la red, URLs mal construidas o nuevos endpoints sin escenario definido.

## Prueba el comportamiento, no las llamadas internas

Supongamos que `ProductList.vue` muestra un encabezado mientras carga y los productos una vez obtenidos. Un test no necesita saber si el componente invoca `fetch`, Axios o un composable; debe comprobar el resultado:

```ts
import { render, screen } from "@testing-library/vue";
import { expect, it } from "vitest";
import ProductList from "./ProductList.vue";

it("muestra los productos devueltos por la API", async () => {
  render(ProductList);

  expect(screen.getByRole("status", { name: /cargando productos/i })).toBeVisible();

  expect(
    await screen.findByRole("heading", { name: /teclado compacto/i }),
  ).toBeVisible();
  expect(screen.getByText("89 €")).toBeVisible();
});
```

El handler por defecto cubre el camino de éxito. Para representar un caso particular, sobreescribe el handler solo dentro del test:

```ts
import { http, HttpResponse } from "msw";
import { server } from "../mocks/node";

it("informa cuando no se pueden cargar los productos", async () => {
  server.use(
    http.get("https://api.example.test/products", () => {
      return HttpResponse.json({ message: "Servicio no disponible" }, { status: 503 });
    }),
  );

  render(ProductList);

  expect(
    await screen.findByRole("alert", { name: /no se han podido cargar los productos/i }),
  ).toBeVisible();
});
```

`server.use` añade el escenario a la prueba actual y el `afterEach` global lo elimina. De este modo, el caso excepcional está junto a la expectativa que lo justifica y no altera el comportamiento por defecto de otros tests.

## Reutiliza los handlers en Storybook sin perder escenarios

Storybook puede usar MSW para que una historia represente un estado de red completo: contenido, lista vacía, error o carga lenta. Configura el inicializador de MSW de acuerdo con la integración de tu versión de Storybook y registra los handlers base. Después, una historia puede sobrescribir una ruta:

```ts
// ProductList.stories.ts
import type { Meta, StoryObj } from "@storybook/vue3";
import { http, HttpResponse } from "msw";
import ProductList from "./ProductList.vue";

const meta = {
  component: ProductList,
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://api.example.test/products", () =>
          HttpResponse.json({ message: "Servicio no disponible" }, { status: 503 }),
        ),
      ],
    },
  },
};
```

La API concreta de Storybook puede cambiar entre versiones, por lo que conviene comprobar la documentación de su integración antes de copiar la inicialización. La regla de diseño sí permanece: el escenario visible debe estar declarado en la historia y el comportamiento común debe vivir en los handlers compartidos.

## Cuatro reglas para que los mocks sigan siendo útiles

1. **Nombra los escenarios por su efecto.** `emptyProductList` comunica más que `products2`. Un dato de prueba debe explicar qué pantalla o regla activa.
2. **No uses los mocks para afirmar que se hizo una petición.** El usuario no percibe una llamada HTTP; percibe contenido, una carga o un error. Si necesitas comprobar una integración HTTP concreta, hazlo en una prueba específica de cliente o contrato.
3. **Modela errores que la interfaz pueda tratar.** Un `401`, un `404`, un `503` y una desconexión no siempre deben producir el mismo mensaje ni la misma acción disponible.
4. **Revisa los handlers cuando cambie el contrato.** Generar tipos desde OpenAPI o mantener ejemplos de respuestas aprobados por backend reduce divergencias, pero no sustituye las pruebas de contrato entre servicios.

## Cuándo no usar MSW

MSW no es obligatorio en cada test. Para validar una función que transforma datos, un test unitario directo es más rápido y más claro. Tampoco sustituye un test E2E contra un entorno integrado cuando necesitas validar autenticación real, infraestructura o el contrato desplegado.

Úsalo cuando el comportamiento HTTP forme parte del flujo que estás comprobando y quieras que ese mismo flujo sea reproducible en local, en tests y en documentación visual. Esa es la frontera en la que una capa compartida de mocks deja de ser una comodidad y se convierte en una herramienta de mantenimiento.

## Recursos

- [Mock Service Worker: introducción y filosofía](https://mswjs.io/docs/)
- [MSW: integración en navegador con `setupWorker`](https://mswjs.io/docs/integrations/browser/)
- [MSW: integración en Node.js y ciclo de vida de tests](https://mswjs.io/docs/integrations/node/)
- [Testing Library: guía de queries](https://testing-library.com/docs/queries/about/)
