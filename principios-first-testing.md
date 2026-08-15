---
title: "Tus tests pasan, pero ¿son buenos? Aplicando los principios FIRST"
description: "Qué son los principios FIRST en testing y cómo aplicarlos con criterio en una suite moderna de frontend."
series: "Testing"
status: "draft"
---

# Tus tests pasan, pero ¿son buenos? Aplicando los principios FIRST

> **Nota editorial:** este artículo debe formar parte de la serie de testing. Conviene enlazar a otros artículos de la serie cuando un tema ya esté desarrollado en profundidad, evitando repetir contenido.

Que una suite de tests esté en verde no significa necesariamente que sea una buena suite.

Podemos tener cientos o miles de tests pasando y, aun así, encontrarnos con una base de pruebas lenta, frágil, dependiente del orden de ejecución o difícil de interpretar cuando algo falla.

Los principios **FIRST** proponen cinco propiedades que nos ayudan a evaluar la calidad de nuestros tests:

- **Fast**
- **Independent**
- **Repeatable**
- **Self-validating**
- **Timely**

Lo importante no es memorizar las siglas. Lo interesante es utilizarlas como una herramienta para detectar cuándo una decisión de testing empieza a tener un coste excesivo.

Un test no es bueno únicamente porque pase. También importa cuánto tarda, de qué depende, si siempre produce el mismo resultado, si deja claro qué ha fallado y si lo hemos escrito en el momento adecuado para proteger el comportamiento que estamos desarrollando.

## F — Fast

Los tests deben ser suficientemente rápidos como para que ejecutarlos de forma habitual no se convierta en una molestia.

Si una suite tarda tanto que el equipo evita lanzarla durante el desarrollo, hemos perdido una parte importante de su valor: el feedback rápido.

No voy a profundizar demasiado en este principio porque ya lo hemos tratado en una entrega específica de esta misma serie:

**[Tests rápidos con Vitest y el principio Fast de FIRST](https://josemariasantos.com/blog/tests-rapidos-vitest-principios-first/)**

En ese artículo analizamos con más detalle por qué la velocidad importa, cómo detectar una suite que empieza a degradarse y qué decisiones podemos tomar para mejorarla.

Aquí me interesa especialmente un matiz: **Fast no significa que todos nuestros tests deban ser unitarios ni que todos tengan que ejecutarse en milisegundos.**

### Cuando el test más rápido no es el mejor test

Hay comportamientos que resultan mucho más fáciles de comprobar en un navegador real.

Un buen ejemplo son determinadas librerías de componentes complejos, como **AG Grid**.

Podemos intentar montar el componente dentro de `jsdom`, simular APIs del navegador y añadir mocks hasta conseguir que el escenario funcione dentro de Vitest.

Es posible.

Pero también podemos terminar manteniendo una pequeña infraestructura de testing cuya única finalidad sea hacer funcionar fuera del navegador una librería diseñada precisamente para ejecutarse dentro de él.

En estos casos, un test con Playwright puede ser más lento, pero también puede resultar mucho más fácil de entender y mantener.

La propia documentación de AG Grid recomienda utilizar tests E2E en un navegador real para validar determinadas integraciones y comportamientos complejos.

Esto nos lleva a una idea importante:

> **El objetivo no es conseguir el test más rápido posible. Es conseguir el test más rápido que siga siendo fiable y mantenible para el comportamiento que queremos proteger.**

Podemos tener un test de 100 ms que necesite diez mocks, varios polyfills y conocimiento de detalles internos de la librería.

O podemos tener un test de Playwright que tarde algo más y reproduzca exactamente lo que hace el usuario.

FIRST no debería convertirse en:

> Fast por encima de todo.

Debe ayudarnos a entender los **trade-offs** que estamos aceptando.

| Enfoque | Velocidad | Fidelidad | Mantenimiento |
| --- | --- | --- | --- |
| Vitest + jsdom + muchos mocks | Muy alta | Media o baja | Puede ser alto |
| Playwright + navegador real | Menor | Alta | A menudo más sencillo |

No se trata de que AG Grid deba probarse siempre mediante E2E. Hay comportamientos sencillos que podemos cubrir perfectamente con tests unitarios o de componentes.

La clave es no forzar un nivel de testing simplemente porque sea más rápido.

## I — Independent

Un test debería poder ejecutarse de forma aislada sin depender de que otro test haya ocurrido antes.

Un ejemplo sencillo:

```ts
let user: User

it('creates a user', () => {
  user = createUser()
})

it('shows the user name', () => {
  expect(user.name).toBe('Jose')
})
```

El segundo test funciona mientras ejecutemos ambos en ese orden.

En cuanto alguien ejecuta únicamente:

```bash
vitest user.test.ts -t "shows the user name"
```

tenemos un problema.

El test depende del estado generado por otro test.

La solución no consiste únicamente en limpiar variables globales. La independencia también implica controlar estados compartidos, mocks, almacenamiento, servidores de MSW, timers o cualquier infraestructura que pueda sobrevivir entre tests.

Un buen test debería poder ejecutarse:

- solo;
- junto con otros;
- en cualquier orden;
- varias veces seguidas.

Y obtener siempre el mismo resultado.

## R — Repeatable

Un test debería producir el mismo resultado siempre que se ejecute bajo las mismas condiciones.

Esto parece obvio hasta que aparecen dependencias externas.

Por ejemplo:

```ts
const response = await fetch('https://api.example.com/users')
```

Si nuestro test depende directamente de esa API estamos introduciendo variables que no controlamos:

- disponibilidad de red;
- estado del servidor;
- datos existentes;
- autenticación;
- rate limits;
- cambios en la API.

Con MSW podemos controlar esa frontera:

```ts
server.use(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Jose' }
    ])
  })
)
```

Ahora el escenario pertenece al propio test.

Eso no significa que debamos mockear absolutamente todo.

Significa que debemos controlar aquello que puede hacer que el resultado deje de ser determinista.

Otros sospechosos habituales son:

- fechas;
- `Math.random`;
- zonas horarias;
- localStorage;
- variables de entorno;
- orden de respuestas asíncronas;
- datos compartidos entre tests.

Un test que falla una vez cada veinte ejecuciones no es un test exigente.

Es ruido.

## S — Self-validating

El propio test debe ser capaz de determinar si el comportamiento es correcto.

No debería necesitar que una persona interprete manualmente el resultado.

Por ejemplo:

```ts
expect(
  screen.getByRole('heading', { name: 'Usuarios' })
).toBeVisible()
```

Cuando falla, sabemos qué comportamiento esperábamos.

Esto conecta directamente con una de las ideas centrales de Testing Library: probar el sistema desde una perspectiva próxima a cómo lo utiliza una persona.

El problema aparece cuando nuestra validación necesita interpretación externa.

Por ejemplo, abusar de snapshots gigantes puede generar situaciones como esta:

```ts
expect(wrapper.html()).toMatchSnapshot()
```

El test falla.

Tenemos un diff de 400 líneas.

¿Se ha roto algo importante?

¿Ha cambiado una clase?

¿Es un cambio esperado?

¿Estamos protegiendo realmente un comportamiento?

Los snapshots pueden ser útiles, pero no deberían sustituir assertions que expresen claramente qué comportamiento queremos garantizar.

Un buen test debería responder rápidamente a dos preguntas:

1. ¿Qué esperaba que ocurriera?
2. ¿Qué comportamiento se ha roto?

## T — Timely

Los tests deberían escribirse suficientemente cerca del momento en el que desarrollamos el comportamiento.

Esto no tiene por qué convertirse en un debate sobre TDD.

Podemos escribir tests antes, durante o inmediatamente después de la implementación.

Lo importante es evitar que se conviertan en una tarea que posponemos indefinidamente.

Cuanto más tiempo pasa entre escribir el código y escribir su test, más difícil resulta recordar:

- qué decisiones tomamos;
- qué casos límite encontramos;
- qué comportamiento queríamos proteger;
- qué partes del código nos generaban dudas.

El contexto se pierde.

Y cuando semanas después alguien añade tests simplemente para aumentar cobertura, es fácil terminar probando la implementación en lugar del comportamiento.

Timely no significa necesariamente:

> Hay que escribir siempre el test antes del código.

Significa:

> Escribe el test mientras todavía entiendes perfectamente qué problema estás resolviendo.

## FIRST no es una checklist

Aquí está probablemente la parte más importante de estos principios.

FIRST no debería utilizarse como una auditoría donde todos los tests tengan que obtener un diez en las cinco categorías.

Los principios pueden entrar en tensión.

Un test E2E probablemente será menos **Fast** que un test unitario.

Pero puede ofrecernos mucha más confianza para determinados comportamientos.

Un test de integración puede necesitar más infraestructura para ser **Repeatable**.

Un test extremadamente aislado puede ser rápido e independiente y, al mismo tiempo, aportar muy poca confianza sobre el comportamiento real de la aplicación.

Podemos volver al ejemplo de AG Grid.

Elegir Playwright significa aceptar conscientemente que ese test será más lento.

A cambio podemos conseguir:

- mayor fidelidad con el navegador real;
- menos mocks;
- menos conocimiento de detalles internos;
- un escenario más próximo al comportamiento del usuario;
- posiblemente menos mantenimiento.

No estamos incumpliendo FIRST.

Estamos utilizando FIRST para entender qué estamos sacrificando y qué estamos obteniendo a cambio.

## Antes de mirar la cobertura

Cuando revisamos la salud de una suite de tests solemos mirar rápidamente un porcentaje:

```text
Coverage: 87%
```

Puede ser útil.

Pero no nos dice si la suite es buena.

Podemos tener un 95 % de cobertura y una suite que nadie quiere ejecutar.

Por eso, antes de obsesionarnos con el porcentaje, podemos hacernos cinco preguntas:

- ¿Ejecuto los tests constantemente durante el desarrollo?
- ¿Puedo ejecutar cualquier test de forma aislada?
- ¿Obtengo siempre el mismo resultado?
- ¿Cuando un test falla entiendo rápidamente qué comportamiento se ha roto?
- ¿Estoy escribiendo los tests mientras todavía entiendo el código que quiero proteger?

Si alguna respuesta empieza a ser **no**, probablemente FIRST nos esté indicando dónde mirar.

## Conclusión

FIRST no nos dice qué framework utilizar.

Tampoco nos dice cuántos tests unitarios, de integración o E2E debemos tener.

Nos ofrece algo más útil: un vocabulario para hablar sobre la calidad de nuestra estrategia de testing.

Podemos utilizarlo para detectar suites demasiado lentas, tests que comparten estado, escenarios no deterministas, assertions que no explican nada o pruebas que siempre dejamos para después.

Y, sobre todo, nos ayuda a recordar algo que a veces olvidamos:

> **El objetivo no es tener muchos tests. Es tener tests en los que podamos confiar.**

---

## Notas pendientes para revisión

- [ ] Confirmar el enlace definitivo al artículo anterior sobre Fast dentro de la serie.
- [ ] Añadir enlace a la documentación oficial de AG Grid sobre testing/E2E.
- [ ] Revisar si interesa añadir un ejemplo real de un componente Vue con AG Grid.
- [ ] Valorar enlazar otros artículos de la serie sobre Vitest, Testing Library o MSW.
- [ ] Ajustar frontmatter a la estructura real del blog Astro antes de publicar.
