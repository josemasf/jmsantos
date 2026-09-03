---
title: "MSW no es solo para tests: desarrollar frontend sin esperar al backend"
description: "Cómo usar MSW y un contrato de API acordado para desarrollar frontend y backend en paralelo, validar escenarios antes de implementar y aprovechar la IA sin delegarle las decisiones importantes."
date: 2026-12-08
tags: [MSW, frontend, testing, API, OpenAPI, IA, contract-first]
category: Frontend
image:
  src: /images/blog/46-msw-contract-first-frontend-backend-ia/msw-contract-first-frontend-backend-ia.png
  alt: Un contrato de API conecta un frontend con MSW y un backend generado en paralelo con ayuda de inteligencia artificial.
  width: 1536
  height: 1024
---

En muchos equipos el desarrollo de una funcionalidad sigue una secuencia casi automática: negocio define una necesidad, backend prepara los endpoints y frontend empieza cuando la API está disponible. El problema no es que exista una dependencia entre ambas partes. El problema es convertir esa dependencia en una espera.

Frontend no necesita que el backend esté terminado para empezar. Necesita saber contra qué contrato va a trabajar.

Si la petición, la respuesta, los errores y los estados relevantes están acordados, [MSW](/blog/msw-vue-mocks-api-desarrollo-tests/) permite convertir ese contrato en una frontera ejecutable desde el primer día. La interfaz puede desarrollarse contra una API que todavía no existe, explorar casos difíciles y detectar carencias antes de que backend haya escrito la implementación real.

La llegada de la IA hace este enfoque todavía más interesante. Con un contrato preciso y escenarios ya validados desde frontend, incluso una persona especializada en frontend puede generar una primera implementación backend asistida por IA. No porque haya dejado de necesitar conocimiento de backend, sino porque la tarea ha cambiado: ya no consiste en inventar una API, sino en implementar un comportamiento previamente acordado.

## El bloqueo no está en el backend, está en la ambigüedad

Cuando frontend pregunta «¿está ya el endpoint?», normalmente está mezclando dos necesidades diferentes. Una es disponer de un servidor al que hacer peticiones. La otra, mucho más importante, es conocer qué puede pedir y qué puede recibir.

Imagina una pantalla de detalle de cliente. Para construirla necesitamos saber qué devuelve `GET /customers/:id`, qué campos pueden ser nulos, cómo se representa un cliente inactivo, qué ocurre si no existe y qué respuesta recibimos cuando la persona no tiene permisos. Nada de eso exige que exista una base de datos o un controlador desplegado.

Podemos acordar primero un contrato:

```yaml
paths:
  /customers/{id}:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Customer"
        "403":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ApiError"
        "404":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ApiError"

components:
  schemas:
    Customer:
      type: object
      required: [id, name, email, status]
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
        status:
          type: string
          enum: [active, inactive]
```

OpenAPI es una forma cómoda de expresarlo, pero la idea no depende de una herramienta concreta. Lo importante es que el contrato sea suficientemente explícito para que dos implementaciones independientes puedan trabajar contra él.

En ese momento la dependencia cambia. Frontend deja de depender de que backend termine su trabajo y ambas partes pasan a depender de un acuerdo común.

```text
                 Contrato de API
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
            MSW             Backend
             │                 │
             ▼                 ▼
          Frontend       Implementación real
             │                 │
             └────────┬────────┘
                      ▼
               mismo comportamiento
```

## MSW convierte el contrato en algo que se puede usar

Un documento de OpenAPI puede estar perfectamente escrito y seguir escondiendo decisiones que nadie ha comprobado en una interfaz real. MSW ayuda porque obliga a convertir el acuerdo en escenarios concretos.

```ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/customers/:id", ({ params }) => {
    if (params.id === "404") {
      return HttpResponse.json(
        {
          code: "CUSTOMER_NOT_FOUND",
          message: "Customer not found",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      id: params.id,
      name: "Ada Lovelace",
      email: "ada@example.com",
      status: "active",
    });
  }),
];
```

Con ese handler podemos construir la pantalla usando el mismo cliente HTTP que utilizará producción. No sustituimos una función interna ni enseñamos al componente que está trabajando con un mock. La petición sale de la aplicación y MSW responde en la frontera de red.

Esto permite comprobar desde muy pronto el estado de carga, los datos válidos, una respuesta vacía, un `403`, un `404`, un error inesperado o una respuesta lenta. En [fixtures, factories y handlers con MSW](/blog/fixtures-factories-handlers-msw-tests/) explico una forma de organizar esos escenarios sin terminar con una colección de objetos duplicados difíciles de mantener.

La ventaja importante no es solo que frontend pueda avanzar. Es que la interfaz empieza a ejercer presión sobre el contrato antes de que implementarlo sea caro.

## Un mock útil no imita al backend: ambos respetan el mismo contrato

Hay una forma peligrosa de trabajar con mocks: frontend inventa respuestas para poder avanzar y, semanas después, intenta adaptarlas a lo que backend ha construido. En ese caso hemos creado dos APIs diferentes y MSW solo ha retrasado el problema.

Por eso no conviene tratar el mock como una versión provisional del backend. El contrato es la referencia. MSW representa escenarios válidos de ese contrato y backend implementa la otra parte.

La diferencia parece pequeña, pero cambia la conversación. Si frontend necesita un nuevo campo, no debería añadirlo únicamente al handler. Se discute y modifica el contrato. Si backend descubre que un estado no puede representarse como habíamos pensado, tampoco debería cambiar silenciosamente la respuesta. Se actualiza el acuerdo y ambos lados evolucionan juntos.

Así evitamos que los mocks se conviertan en una segunda aplicación. No necesitan reglas de negocio complejas, persistencia ni una reproducción completa del servidor. Su responsabilidad es mucho más acotada: representar respuestas significativas que el consumidor debe saber manejar.

## Los casos difíciles son más baratos antes de tener backend

Una API real no siempre es el mejor sitio para preparar todos los estados necesarios durante el desarrollo. Para comprobar un error concreto quizá haya que modificar datos, buscar un usuario con permisos determinados o depender de que un servicio externo falle justo cuando lo necesitamos.

Con MSW podemos hacer esos estados explícitos:

```ts
export const customerScenarios = {
  active: http.get("/api/customers/:id", () =>
    HttpResponse.json(activeCustomer),
  ),

  forbidden: http.get("/api/customers/:id", () =>
    HttpResponse.json(
      { code: "FORBIDDEN", message: "Not allowed" },
      { status: 403 },
    ),
  ),

  unavailable: http.get("/api/customers/:id", () =>
    HttpResponse.json(
      { code: "SERVICE_UNAVAILABLE", message: "Try again later" },
      { status: 503 },
    ),
  ),
};
```

Eso permite desarrollar el comportamiento de la interfaz y reutilizar posteriormente los mismos escenarios en tests. Un error deja de ser algo que «ya probaremos cuando backend pueda provocarlo» y pasa a ser una decisión visible del producto.

Además, esta fase suele revelar huecos. Quizá un `404` no sea suficiente porque necesitamos diferenciar entre «no existe» y «ya no está disponible». Puede aparecer un campo que realmente debe admitir `null`, un estado intermedio que no habíamos modelado o una operación que necesita idempotencia porque la interfaz puede reintentarse.

Detectar esas preguntas en un handler barato es mejor que descubrirlas después de integrar dos implementaciones completas.

## Frontend y backend pueden trabajar realmente en paralelo

Con un contrato acordado, el flujo deja de ser una cadena y se parece más a dos trabajos paralelos.

Backend puede implementar autenticación, reglas de negocio, persistencia y observabilidad mientras frontend construye la experiencia completa contra MSW. Ambos lados tienen algo verificable desde el principio.

El momento de integración también cambia. En lugar de descubrir entonces cómo se comporta la API, deberíamos comprobar que la implementación real respeta lo que ya habíamos usado. Si el contrato se ha mantenido, sustituir MSW por la URL real debería ser un cambio poco emocionante.

Que «no pase nada» durante esa integración es una buena señal. Significa que las decisiones importantes se tomaron antes.

## La IA amplía lo que puede implementar un perfil frontend

Aquí aparece una consecuencia que hace unos años era menos realista. Una persona de frontend que conoce el problema, ha participado en el contrato y ha construido todos los escenarios del consumidor dispone de bastante contexto para pedir a un agente de IA una primera implementación del backend.

La diferencia está en la instrucción.

No es lo mismo pedir:

> Crea un backend para gestionar clientes.

que pedir:

> Implementa este contrato OpenAPI. Respeta estos códigos de error, estas reglas de autorización y estos estados. Sigue la arquitectura existente del repositorio y añade tests que demuestren los casos ya definidos.

En el segundo caso hemos reducido muchísimo el espacio de decisión. El agente no necesita inventar cómo se llama el endpoint, qué forma tiene la respuesta o qué errores deben existir. Puede concentrarse en implementar una especificación concreta dentro de unas convenciones conocidas.

Esto no convierte automáticamente a una persona de frontend en especialista backend. Sí cambia el límite de lo que puede construir con seguridad cuando dispone de buenas restricciones y revisión.

Una implementación generada puede ser perfectamente válida en la superficie y tener problemas en decisiones que no aparecen en el contrato HTTP: autorización real, transacciones, concurrencia, consultas ineficientes, índices, protección de datos, observabilidad, reintentos, idempotencia o límites operativos. Ahí sigue siendo necesario criterio específico de backend y, según el contexto, una revisión por alguien con experiencia en esa parte del sistema.

La IA puede escribir el código. El equipo sigue siendo responsable de demostrar que ese código es correcto dentro del sistema.

## El contrato reduce la ambigüedad que recibe la IA

Este es, para mí, el punto más interesante de combinar contract-first con desarrollo asistido.

Los modelos funcionan mejor cuando la tarea tiene límites visibles. Un contrato de API, unos esquemas, ejemplos de handlers, convenciones del repositorio y tests existentes son contexto reutilizable. En lugar de explicar el sistema entero en cada prompt, proporcionamos artefactos que ya contienen decisiones del equipo.

Por eso la IA no elimina la necesidad de diseñar bien una API. Hace que diseñarla bien sea todavía más importante.

Un contrato ambiguo produce mocks ambiguos, una implementación backend ambigua y prompts llenos de decisiones implícitas. Un contrato explícito permite que frontend, backend, tests y agentes trabajen alrededor de la misma referencia.

## Los tests pueden cerrar el círculo

Los handlers que utilizamos durante el desarrollo no tienen por qué desaparecer cuando llega el backend. Pueden seguir protegiendo el comportamiento del frontend en Vitest, Testing Library o Storybook mientras las pruebas de contrato comprueban que el servidor real mantiene la misma forma y semántica.

No significa ejecutar la misma prueba cuatro veces. Cada nivel responde a una pregunta distinta:

- MSW permite verificar cómo reacciona el consumidor ante escenarios controlados.
- Los tests del backend protegen reglas, autorización y persistencia cerca de su implementación.
- Las pruebas de contrato comprueban que proveedor y consumidor siguen hablando el mismo idioma.
- Unos pocos E2E confirman que las piezas reales funcionan juntas en recorridos importantes.

Esta separación encaja con una estrategia de [testing proporcional al riesgo](/blog/testing-proporcional-riesgo/): no necesitamos llevar todos los estados al navegador ni depender del backend real para demostrar cada comportamiento.

## Un flujo contract-first práctico

No hace falta implantar una metodología enorme. Para una funcionalidad nueva, el proceso puede ser bastante pequeño.

Primero se define el comportamiento que necesita el producto. Después frontend y backend acuerdan petición, respuesta, errores y casos relevantes. Ese acuerdo se lleva a un contrato versionado y frontend crea los handlers de MSW necesarios para trabajar con él.

A partir de ahí ambos lados pueden avanzar en paralelo. La interfaz ayuda a validar si el contrato es suficiente; cualquier cambio vuelve al acuerdo en lugar de quedarse escondido en un mock. Backend implementa la especificación —de forma manual o con ayuda de IA— y añade la evidencia necesaria para sus propias responsabilidades.

Cuando ambas partes están listas, la integración comprueba una hipótesis que ya llevamos tiempo utilizando: que las dos implementaciones respetan el mismo contrato.

No hemos eliminado la coordinación. Hemos movido la coordinación al momento en el que es más barata: antes de escribir gran parte del código.

## MSW es una herramienta de colaboración

MSW suele entrar en un proyecto porque queremos tests más realistas. Ese sigue siendo un uso excelente, pero limitarlo a testing deja fuera una parte importante de su valor.

Puede desacoplar calendarios de frontend y backend, hacer visibles estados difíciles, preparar demos antes de disponer de todos los servicios, facilitar conversaciones sobre una API y convertir un documento de contrato en algo que realmente consume una interfaz.

Con IA aparece una posibilidad adicional: el mismo conjunto de restricciones que permite desarrollar el frontend sin backend puede servir para que un agente implemente una primera versión del proveedor. Cuanto mejor definidos estén el contrato, los escenarios y las reglas, menos tiene que inventar la herramienta.

Quizá la mejor señal de que hemos diseñado bien una integración no sea que frontend y backend hayan trabajado juntos todo el tiempo, sino que hayan podido trabajar separados y, al juntarlos, apenas haya pasado nada.
