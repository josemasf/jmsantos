---
title: "TDD para agentes: el feedback fiable acelera más que generar código"
description: "Cómo aplicar ciclos red-green a tareas de agentes, elegir seams observables y evitar tests frágiles que ralentizan la validación del software."
date: 2026-10-13
tags: [TDD, testing, IA, agentes, Vitest, arquitectura, calidad]
category: Testing
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 4
image:
  src: /images/blog/55-tdd-agentes-feedback-loop-fiable/tdd-agentes-feedback-loop.png
  alt: Una persona y un asistente recorren un ciclo de prueba fallida, cambio de código y comprobación verde sobre la interfaz observable de un módulo.
  width: 1536
  height: 1024
---

Un agente puede producir una primera implementación en pocos minutos. Si después tardamos mucho en averiguar si el cambio funciona, esa velocidad inicial no se traduce en una entrega rápida. El agente necesita feedback que llegue pronto y que señale un comportamiento real; cuando las pruebas son lentas, aleatorias o difíciles de interpretar, cada iteración cuesta más y las hipótesis erróneas pueden acumularse.

La skill [`tdd`](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd) de Matt Pocock trata el desarrollo guiado por pruebas como un ciclo **red → green**: escribir una prueba de comportamiento que falla, implementar lo mínimo para hacerla pasar y repetir con una porción vertical cada vez. El propósito no es imponer tests antes de conocer el problema, sino construir una señal fiable durante el cambio.

## La unidad del ciclo es un comportamiento observable

Un test útil describe una capacidad que importa a quien usa el producto o a quien llama a un módulo. «La persona puede cancelar una reserva confirmada dentro del plazo permitido» comunica mejor el resultado que «el método `cancelReservation` llama a `bookingService.update`». El primer test puede seguir siendo válido aunque cambien nombres, clases y organización interna; el segundo falla cuando se mueve una llamada aunque el comportamiento permanezca igual.

El ciclo red-green refuerza esa orientación. Primero se escribe una prueba que muestra el comportamiento ausente; después se implementa lo mínimo necesario para que pase. La siguiente prueba aporta un caso nuevo que enseña algo sobre el comportamiento. Se avanza en cortes pequeños, evitando escribir un lote de tests para una solución todavía imaginada y construir luego todo de una vez.

La guía actual de TDD insiste en no escribir tests acoplados a detalles internos, ni verificaciones tautológicas donde el valor esperado repite el mismo cálculo que la implementación. También distingue el ciclo de implementación de la refactorización: en ese flujo, primero se completa el comportamiento y después se revisa la estructura. La secuencia concreta puede variar según el proyecto, pero la señal que se busca es siempre útil: cada test debe poder discrepar con el código cuando el comportamiento es incorrecto.

## Acordar el seam antes de escribir pruebas

Un _seam_ es el punto donde un módulo expone su interfaz y permite observar o cambiar su comportamiento. Elegir el seam correcto determina qué ve la prueba y qué queda fuera. Una prueba de interfaz puede validar una ruta completa de usuario; una prueba sobre una función de dominio puede ser adecuada para una regla pura; un test que alcanza métodos privados suele indicar que la frontera escogida no coincide con el comportamiento que queremos proteger.

La skill `tdd` recomienda acordar los seams de prueba antes de escribir tests: describir qué captura cada seam y qué no cubre. Así el equipo decide dónde invertir el esfuerzo antes de generar una suite que solo confirma una forma interna de implementar. Cuando no hay claridad sobre la interfaz o el módulo, la decisión es de diseño y puede requerir revisar primero la forma del módulo.

No significa que todo cambio necesite una ceremonia para autorizar cada test. En una sesión con un agente, basta con dejar explícito el punto de observación en el plan: por ejemplo, «comprobaremos que el formulario muestra el error devuelto por la API mediante el flujo público de envío». Si el seam propuesto obliga a consultar internals o a simular medio sistema, es momento de reconsiderar el diseño o elegir otro nivel de prueba.

## Vue: comprobar la interfaz como la usa la persona

En una aplicación Vue, un seam útil para una interacción suele ser el componente o la página renderizados con sus controles, eventos y mensajes visibles. Con [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/), una prueba puede buscar el botón accesible para cancelar, activarlo y comprobar el resultado que aparece. El test se centra en el contrato visible, no en cuántos métodos internos se llamaron ni en el orden de los watchers.

Si la pantalla realiza una petición HTTP, [MSW](https://mswjs.io/docs/) permite responder en el límite de red sin sustituir el cliente que usa la aplicación. El componente sigue atravesando su flujo normal y la prueba puede comprobar estados de carga, confirmación y error. Esto da al agente una señal más fiel que un mock de una función interna, además de facilitar la reproducción local de cada escenario.

Una secuencia pequeña podría ser:

1. La prueba muestra que la pantalla ofrece una acción de cancelación para una reserva elegible.
2. El cambio habilita la acción y envía la solicitud al confirmar.
3. Una prueba nueva comprueba el mensaje de éxito o el error que la API devuelve.

Cada paso cierra una parte verificable del comportamiento. Si el test requiere muchos detalles de estado interno para probarlo, la pantalla quizá mezcla responsabilidades o expone un seam poco útil.

## ASP.NET y Blazor: elige una frontera que preserve el flujo real

En ASP.NET, [`WebApplicationFactory`](https://learn.microsoft.com/aspnet/core/test/integration-tests) permite levantar la aplicación para pruebas de integración y hacer peticiones HTTP a través del pipeline configurado. Un test puede comprobar el status, el contrato de respuesta y el resultado observable desde el cliente. Si hay una dependencia externa —por ejemplo, un proveedor de pago— se sustituye esa dependencia en su seam, mientras el resto del recorrido se mantiene lo más real posible.

En Blazor, [bUnit](https://bunit.dev/) ofrece un entorno para renderizar componentes y verificar su salida e interacciones. Las pruebas pueden comprobar qué ve la persona cuando cambia un parámetro o se produce una respuesta, sin inspeccionar campos privados. Si el componente se conecta a una API o servicio externo, conviene controlar esa dependencia en el límite adecuado y conservar la lógica del componente bajo prueba.

El marco cambia, pero el criterio permanece: elegir el seam público más alto que dé una señal rápida y legible para el comportamiento en cuestión. Una prueba de integración tiene sentido cuando la interacción entre módulos es parte del riesgo. Para una transformación pura, una prueba directa puede aportar una señal más rápida sin perder relevancia.

## Los mocks pertenecen a los límites del sistema

Los mocks reducen la variabilidad y el coste de pruebas, pero pueden dar una falsa sensación de cobertura si reemplazan módulos propios que deberían estar colaborando. La guía de TDD recomienda usarlos en límites externos como APIs de terceros, tiempo, aleatoriedad o algunos sistemas de almacenamiento. En el interior del código que controlamos, es preferible comprobar el comportamiento desde una interfaz real y dejar que los módulos colaboren.

Cuando sustituir una dependencia externa es difícil, puede ser señal de que el código crea el cliente desde dentro en lugar de recibirlo a través de un seam. Una interfaz explícita permite inyectar un adaptador de prueba sin hacer que cada colaborador interno sea configurable. El objetivo no es maximizar la facilidad para mockear, sino mantener un contrato pequeño que sea útil para el sistema y para quien lo prueba.

Las pruebas también deben tener una fuente independiente para el resultado esperado. Si el test calcula la expectativa con la misma lógica que el código, ambos pueden repetir el mismo error y seguir pasando. Un ejemplo conocido, una regla acordada o un resultado literal hacen que la prueba realmente pueda detectar una discrepancia.

## Los flaky tests hacen que el feedback pierda valor

Un test que falla sin que cambie el comportamiento no es solo una molestia ocasional. Alarga la investigación, obliga a repetir ejecuciones y puede llevar a que una señal roja se ignore o que el agente modifique código para perseguir una causa que no existe. A medida que crecen las iteraciones delegadas, esa incertidumbre se multiplica: cada falso fallo puede interrumpir una tarea y consumir tiempo de contexto en diagnósticos improductivos.

Para reducir esa variabilidad, controla el tiempo y la aleatoriedad cuando sean parte del escenario, limpia el estado compartido y evita depender de servicios remotos o del orden de ejecución. Si una prueba falla de forma intermitente, conviene construir un modo reproducible de observarla antes de pedir al agente que cambie producción. Una solución que silencia el fallo sin explicar su causa solo deteriora la señal.

Antes de aumentar la autonomía, comprueba que las herramientas que evalúan el cambio sean razonablemente rápidas y deterministas: typecheck, lint, tests relevantes y CI reproducible. No es una lista de requisitos universales para cualquier repositorio. Es una forma de ver que el feedback que utilizará el agente refleja cambios reales y se puede repetir después.

## Más pruebas no equivalen a más confianza

Una suite amplia puede seguir siendo débil si comprueba el estado privado, replica la implementación o no detecta regresiones que importan. El número de tests no dice qué parte del producto protegen. Resulta más útil preguntar qué comportamiento podría romperse, a través de qué seam lo observaríamos y si esa prueba fallaría ante un cambio incorrecto.

El feedback fiable acorta el camino entre hipótesis y evidencia. Un test rojo ofrece un caso concreto que el agente puede investigar; uno verde reduce la incertidumbre sobre ese comportamiento; una secuencia incremental limita cuánto código hay que explicar si el resultado no encaja. Así, TDD no acelera porque garantice que cada primera solución sea correcta, sino porque ayuda a detectar pronto cuándo no lo es.

Cuando se delega implementación, la persona sigue decidiendo qué contratos importan y qué riesgos deben probarse. El agente puede recorrer el ciclo con rapidez, pero necesita seams claros y tests que hablen del producto. La velocidad útil viene de obtener una señal fiable después de cada cambio, no solo de escribir más código entre una comprobación y la siguiente.
