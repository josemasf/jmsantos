---
title: "Fixtures, factories y handlers de MSW: organiza escenarios de test escalables"
description: "Una estructura práctica para separar datos de prueba, variaciones y respuestas HTTP con Vitest, MSW y TypeScript en aplicaciones Vue 3."
date: 2026-08-09
tags: [testing, MSW, Vitest, Vue, TypeScript, mocks, API]
category: Testing
series:
  title: "Testing moderno en Vue: confianza sin fragilidad"
  slug: testing-moderno-vue-confianza-sin-fragilidad
  order: 4
  description: "Una guía práctica para construir una suite de tests rápida, realista y mantenible en Vue 3."
---

Al principio, un mock cabe en el propio test. Un objeto con dos propiedades y un `vi.mock` parecen suficientes. El problema aparece cuando el mismo usuario debe ser administrador, no tener permisos, tener una suscripción caducada y además recibir una respuesta incompleta de la API. Los datos se copian, los nombres dejan de explicar el escenario y cambiar el contrato obliga a editar decenas de archivos.

La solución no consiste en crear una capa de abstracción para cada JSON. Consiste en separar tres responsabilidades que suelen mezclarse:

| Pieza | Responde a | Ejemplo |
| --- | --- | --- |
| *Fixture* | ¿Cuál es un dato válido y reconocible? | Un producto o usuario base. |
| *Factory* | ¿Cómo creo una variante sin repetir todo el objeto? | Un usuario sin permisos. |
| *Handler* | ¿Qué responde la API en este escenario? | `GET /api/profile` devuelve 403. |

Esta organización complementa el uso de [MSW en Vue 3](/blog/msw-vue-mocks-api-desarrollo-tests/) y hace que los tests escritos con [Testing Library](/blog/testing-library-vue-tests-refactors/) sigan leyéndose como historias de usuario.

## Una estructura pequeña y explícita

No hace falta replicar la arquitectura de producción. Una carpeta próxima a los mocks suele bastar:

```text
src/
  mocks/
    browser.ts
    node.ts
    handlers/
      profile.ts
      products.ts
      index.ts
    fixtures/
      profile.ts
      product.ts
    factories/
      profile.ts
```

Las *fixtures* contienen ejemplos válidos y fáciles de reconocer. No deben ser una colección de datos aleatorios ni un volcado de una respuesta real con información sensible.

```ts
// src/mocks/fixtures/profile.ts
export const profileFixture = {
  id: "usr_ana",
  name: "Ana García",
  email: "ana@example.com",
  permissions: ["profile:read", "profile:write"],
} as const;
```

Un nombre como `Ana García` aporta más contexto al fallo que `Test User`. La fixture también funciona como referencia rápida del contrato que espera el frontend.

## Usa factories para las variaciones, no para ocultar el escenario

Una factory parte del valor válido y permite sobrescribir únicamente aquello que importa en el test. Su API debe ser sencilla: un objeto parcial de cambios es suficiente en la mayoría de aplicaciones.

```ts
// src/mocks/factories/profile.ts
import { profileFixture } from "../fixtures/profile";

type Profile = typeof profileFixture;

export function createProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    ...profileFixture,
    ...overrides,
  };
}
```

Ahora un escenario expresa la diferencia relevante sin volver a declarar correo, identificador y permisos:

```ts
const readOnlyProfile = createProfile({
  permissions: ["profile:read"],
});
```

Una factory no necesita generar valores aleatorios para ser útil. El azar dificulta reproducir un fallo y casi nunca añade señal a un test de componente. Si debes crear más de un elemento, acepta un identificador o sobrescribe los campos que necesiten distinguirse.

```ts
export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "product-keyboard",
    name: "Teclado compacto",
    price: 89,
    inStock: true,
    ...overrides,
  };
}
```

Evita factories con opciones mágicas como `createProfile("blocked")` si ocultan qué cambia. Una función especializada sí es razonable cuando representa un concepto de negocio repetido y estable:

```ts
export function createReadOnlyProfile(): Profile {
  return createProfile({ permissions: ["profile:read"] });
}
```

## Haz que los handlers hablen de HTTP

Los handlers de MSW describen el límite de red, no la lógica de presentación. Un handler por defecto cubre el camino habitual y se exporta para iniciar el servidor en Vitest o el worker durante el desarrollo.

```ts
// src/mocks/handlers/profile.ts
import { http, HttpResponse } from "msw";
import { profileFixture } from "../fixtures/profile";

export const profileHandlers = [
  http.get("/api/profile", () => HttpResponse.json(profileFixture)),
];
```

El índice solo reúne los dominios de la API:

```ts
// src/mocks/handlers/index.ts
import { profileHandlers } from "./profile";
import { productHandlers } from "./products";

export const handlers = [...profileHandlers, ...productHandlers];
```

Con este diseño, un componente no importa fixtures ni sabe que MSW existe. Solicita la API mediante su cliente o composable habitual y el test observa lo que se muestra. Esa separación mantiene el código de producción libre de detalles exclusivos de test.

## Sobrescribe un escenario en el test que lo necesita

Un handler global no debe intentar cubrir todos los estados posibles. Si hiciera eso, acabaría siendo un simulador difícil de leer. Define el caso especial cerca del test que lo necesita y deja que `server.resetHandlers()` restaure el comportamiento tras cada prueba.

```ts
import { http, HttpResponse } from "msw";
import { render, screen } from "@testing-library/vue";
import { server } from "@/mocks/node";
import ProfilePanel from "./ProfilePanel.vue";

it("oculta la acción de editar a quien solo puede consultar", async () => {
  server.use(
    http.get("/api/profile", () =>
      HttpResponse.json(
        createProfile({ permissions: ["profile:read"] }),
      ),
    ),
  );

  render(ProfilePanel);

  expect(
    await screen.findByRole("heading", { name: /ana garcía/i }),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", { name: /editar perfil/i }),
  ).not.toBeInTheDocument();
});
```

El test declara el dato que transforma el resultado visible: los permisos. No verifica si el componente usa un `computed`, una directiva o una librería de interfaz para ocultar el botón.

## Distingue errores de negocio, HTTP y datos vacíos

Una respuesta de red no disponible, una autorización rechazada y una lista vacía no son la misma situación. Representarlos con handlers diferentes aclara qué experiencia debe tener la persona usuaria.

```ts
export const productErrorHandler = http.get("/api/products", () =>
  HttpResponse.json(
    { message: "Servicio no disponible" },
    { status: 503 },
  ),
);

export const emptyProductsHandler = http.get("/api/products", () =>
  HttpResponse.json([]),
);
```

Un error HTTP permite comprobar el estado de error y una acción de reintento. Una lista vacía permite comprobar un estado vacío que, en muchas interfaces, debe orientar sobre el siguiente paso. No conviertas ambos escenarios en `[]` ni intentes representar un error lanzando una excepción desde el componente de test.

## Mantén el contrato a la vista

MSW no valida por sí mismo que backend y frontend compartan el mismo contrato. Su papel es interceptar solicitudes y ofrecer respuestas controladas. Por eso conviene tipar las fixtures con los tipos que use la aplicación, o al menos crear un tipo local explícito cuando esos tipos aún no estén centralizados.

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export const productFixture: Product = {
  id: "product-keyboard",
  name: "Teclado compacto",
  price: 89,
  inStock: true,
};
```

Cuando cambia el contrato, TypeScript hará visibles muchas inconsistencias antes de llegar al navegador. Para contratos compartidos entre servicios siguen siendo necesarios los mecanismos que el equipo adopte —por ejemplo, especificaciones OpenAPI, pruebas de contrato o tipos generados—; los handlers no los reemplazan.

## Señales de que la estructura está creciendo mal

- Una fixture necesita condiciones o lógica: probablemente debería ser una factory o un handler.
- Una factory tiene veinte opciones y cada test usa combinaciones poco comprensibles: divide los conceptos de dominio.
- Un handler global cambia según variables ocultas: sobrescribe el caso dentro del test.
- Los componentes importan datos desde `src/mocks`: el límite de test ha llegado a producción.
- Un error de API se representa con los mismos datos que un estado vacío: faltan escenarios explícitos.

La organización correcta no se mide por el número de carpetas, sino por cuánto tarda alguien en entender un test. Al leerlo, debería quedar claro quién es la persona simulada, qué responde el servidor y qué comportamiento se espera en pantalla.

En el último artículo de la serie reuniremos errores habituales de suites Vue con Vitest: mocks que ocultan regresiones, esperas arbitrarias, estado compartido y pruebas acopladas a detalles internos.
