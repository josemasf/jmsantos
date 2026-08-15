---
title: "Tus tests pasan, pero ¿son buenos? Cómo aplicar los principios FIRST"
description: "Qué son los principios FIRST en testing y cómo usarlos para evaluar una suite de Vue con Vitest, Testing Library, MSW y Playwright."
date: 2026-09-15
tags: [testing, Vitest, Vue, Testing Library, MSW, Playwright, calidad]
category: Testing
image:
  src: /images/blog/32-principios-first-testing-calidad-suite/principios-first-testing-editorial.png
  alt: Recorrido dibujado a mano con cinco pruebas conectadas que termina en una marca de verificación verde.
  width: 1672
  height: 941
series:
  slug: testing-moderno-vue-confianza-sin-fragilidad
  order: 6
---

Una suite en verde no es necesariamente una buena suite. Podemos tener cientos de pruebas que pasan y seguir dependiendo de un orden de ejecución concreto, de una API externa o de un _snapshot_ de cuatrocientas líneas que nadie sabe revisar. Cuando eso ocurre, los tests siguen existiendo, pero dejan de ofrecer el feedback y la confianza por los que se escribieron.

Los principios **FIRST** proponen cinco propiedades para evaluar esa calidad: _Fast_, _Independent_, _Repeatable_, _Self-validating_ y _Timely_. No son una receta para que todos los tests sean iguales ni una escala con la que puntuar cada archivo. Funcionan mejor como vocabulario para detectar el coste de una decisión: cuánto tarda una prueba, qué estado comparte, qué variables deja fuera de control, qué explica cuando falla y cuándo se escribió.

## F — Fast: rápido para la confianza que aporta

Una suite debe ejecutarse con la frecuencia suficiente para formar parte del desarrollo cotidiano. Si tarda tanto que el equipo solo la lanza antes de abrir una _pull request_, una regresión tarda más en aparecer y es más difícil relacionarla con el cambio que la introdujo. La velocidad, por tanto, no es un detalle de infraestructura: determina la calidad del ciclo de feedback.

Eso no obliga a reducir cada prueba a una función aislada ni a exigir milisegundos a toda costa. Hay comportamientos cuya representación fiel requiere un navegador real. AG Grid, por ejemplo, documenta limitaciones de `jsdom` relacionadas con el layout y la virtualización, y recomienda E2E para validar integraciones complejas en un navegador. En ese caso, un flujo de Playwright puede tardar más que una prueba de componente, pero evitar _polyfills_, mocks y conocimiento de detalles internos que acabarían encareciendo el mantenimiento. Consulta la [guía de testing de AG Grid para Vue](https://www.ag-grid.com/vue-data-grid/testing/) si trabajas con ese tipo de interfaz.

| Enfoque                         | Velocidad | Fidelidad                          | Coste de mantenimiento   |
| ------------------------------- | --------- | ---------------------------------- | ------------------------ |
| Vitest + `jsdom` + varios mocks | Alta      | Media o baja, según la integración | Puede crecer rápidamente |
| Playwright + navegador real     | Menor     | Alta                               | A menudo más directo     |

El objetivo no es encontrar el test más rápido de forma aislada, sino el más rápido que conserve evidencia fiable del comportamiento. Para mejorar el tiempo de respuesta de Vitest sin eliminar esa evidencia, empieza por [tests rápidos con Vitest](/blog/tests-rapidos-vitest-principios-first/).

## I — Independent: cada test prepara su propio escenario

Un test independiente puede ejecutarse solo, junto a otros y en cualquier orden. Si necesita que otro haya creado una variable, insertado datos o configurado un mock antes, el resultado depende de un estado que no se ve al leerlo.

```ts
let user: User;

it("crea un usuario", () => {
  user = createUser();
});

it("muestra el nombre del usuario", () => {
  expect(user.name).toBe("Jose");
});
```

La segunda prueba solo pasa si la primera se ha ejecutado antes. Además de hacer imposible filtrarla con `vitest -t`, este patrón se vuelve impredecible cuando la suite se paraleliza. La alternativa es describir el estado inicial en el mismo test —o en una preparación que se ejecute antes de cada uno— y limpiar explícitamente cualquier infraestructura compartida.

```ts
it("muestra el nombre del usuario", () => {
  const user = createUser({ name: "Jose" });

  expect(user.name).toBe("Jose");
});
```

Las variables de módulo son solo el caso más visible. Una store de Pinia, los handlers de MSW, `localStorage`, los temporizadores falsos o el DOM pueden filtrar estado a la siguiente prueba. Restablecerlos forma parte del escenario, no es una tarea de limpieza opcional. La sección sobre [errores comunes al testear con Vitest](/blog/errores-testing-vue-vitest/) contiene ejemplos de ese ciclo de vida.

Como diagnóstico puntual, Vitest permite aleatorizar tanto archivos como tests con [`--sequence.shuffle`](https://vitest.dev/config/sequence/):

```bash
vitest run --sequence.shuffle
```

Es una forma útil de descubrir pruebas que solo pasan porque otra se ejecutó antes. No conviene dejarlo activado como norma en el flujo diario o en CI: el orden aleatorio pierde la optimización habitual que inicia antes los archivos más lentos y puede hacer más difícil reproducir un fallo. Cuando aparezca una dependencia, corrige el estado compartido; si necesitas repetir la misma ejecución durante la investigación, fija una semilla con `--sequence.seed=1234`.

## R — Repeatable: controla lo que puede variar

Una prueba repetible produce el mismo resultado cuando se ejecuta bajo las mismas condiciones. La red real es una fuente evidente de incertidumbre: disponibilidad, autenticación, datos de producción y límites de uso pueden modificar el resultado sin que cambie el frontend. También lo hacen el reloj, las zonas horarias, `Math.random`, las variables de entorno o una respuesta asíncrona que llega en un orden diferente.

MSW permite que el test sea propietario de la respuesta HTTP que necesita, sin sustituir el cliente de red del componente:

```ts
import { http, HttpResponse } from "msw";

server.use(
  http.get("/api/users", () => HttpResponse.json([{ id: 1, name: "Jose" }])),
);
```

Así, el escenario no depende de que un servidor externo tenga precisamente un usuario disponible. El aislamiento será efectivo si cada prueba restaura los handlers que modifica y crea sus datos de forma explícita. [MSW en Vue 3](/blog/msw-vue-mocks-api-desarrollo-tests/) explica cómo centralizar esa infraestructura, mientras que [fixtures, factories y handlers](/blog/fixtures-factories-handlers-msw-tests/) ayuda a que los datos sigan siendo legibles cuando los escenarios crecen.

Un test que falla una de cada veinte ejecuciones no es más exigente: añade ruido y acostumbra al equipo a reintentarlo en lugar de investigar una regresión. La repetibilidad es una condición para que un fallo sea una señal útil.

## S — Self-validating: el fallo debe explicar el contrato roto

El test tiene que poder determinar automáticamente si el comportamiento es correcto. Una aserción orientada a la interfaz expresa la expectativa y permite diagnosticarla sin inspección manual:

```ts
expect(screen.getByRole("heading", { name: "Usuarios" })).toBeVisible();
```

Cuando falla, sabemos qué elemento visible esperábamos. Esta forma de probar encaja con Testing Library: el contrato que interesa proteger es el que puede observar una persona usuaria, no la estructura interna que hoy utiliza el componente.

Los _snapshots_ no son incompatibles con este principio, pero conviene limitar su tamaño y propósito. Un _snapshot_ pequeño de una transformación estable puede detectar un cambio relevante. En cambio, comparar todo el HTML de una pantalla suele producir diferencias largas donde se mezclan clases, atributos y contenido. Antes de actualizarlo, hay que responder si el cambio representa una regresión o una modificación intencionada; una aserción sobre el mensaje, el control o el resultado importante suele contestar esa pregunta mejor. [Testing Library en Vue](/blog/testing-library-vue-tests-refactors/) profundiza en cómo elegir consultas que resistan un _refactor_.

## T — Timely: escribe el test mientras el comportamiento está claro

_Timely_ no obliga a adoptar TDD ni a escribir siempre la prueba antes de la implementación. Significa que el test se escribe lo bastante cerca del desarrollo como para recordar qué caso límite se descubrió, qué comportamiento se acordó y qué parte del cambio podría romperse después.

Cuando las pruebas se dejan para semanas más tarde, el contexto se pierde. Es fácil acabar verificando cómo está construido el componente porque es lo que queda a la vista, en vez de recuperar la necesidad que motivó el cambio. Escribir el test antes, durante o justo después de implementar son tres momentos válidos; aplazarlo hasta una campaña genérica de cobertura rara vez conserva la misma precisión.

## FIRST no es una checklist

Los principios entran en tensión. Una prueba E2E suele ser menos _Fast_ que una unitaria; una integración con más infraestructura puede requerir más preparación para ser _Repeatable_; una prueba muy aislada puede ser rápida e independiente y, aun así, aportar poca evidencia sobre el flujo real. FIRST no elimina esas decisiones: ayuda a hacerlas explícitas.

Antes de perseguir un porcentaje de cobertura, revisa la suite con estas cinco preguntas:

- ¿La ejecuto durante el desarrollo o la evito por lenta?
- ¿Puedo lanzar cualquier test aislado y en otro orden?
- ¿Su resultado cambia por red, tiempo, datos o estado compartido?
- ¿Entiendo qué comportamiento se ha roto cuando falla?
- ¿La prueba se escribió mientras el requisito y sus casos límite seguían claros?

Una cobertura alta puede coexistir con respuestas preocupantes a cualquiera de ellas. FIRST no indica cuántos tests unitarios, de integración o E2E necesita una aplicación. Su valor es recordar que una suite útil es aquella en la que el equipo puede confiar: rápida para dar feedback, controlada para no fallar al azar y clara para que cada fallo merezca atención.
