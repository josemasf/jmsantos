---
title: "Antes de pedir una feature, aclara el problema con tu agente"
description: "Cómo usar grill-with-docs para explorar requisitos, distinguir decisiones conversables de preguntas que necesitan un prototipo y dejar el contexto importante por escrito."
date: 2026-10-11
tags: [IA, agentes, producto, requisitos, domain modeling, prototipos, arquitectura]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 2
image:
  src: /images/blog/53-entender-problema-grill-with-docs/grill-with-docs-alinear-problema.png
  alt: Una persona y un asistente revisan un árbol de decisiones que parte de una necesidad y termina en acuerdos y una prueba visual.
  width: 1536
  height: 1024
---

«Hazme esta funcionalidad» parece una instrucción suficiente hasta que el agente entrega algo que compila, pero responde a una interpretación distinta de la que teníamos en mente. El problema suele aparecer antes de escribir código: faltaba acordar qué necesidad queríamos resolver, qué comportamiento era importante y qué condiciones no debían cambiar.

En el [artículo anterior](/blog/introducir-matt-pocock-skills-flujo-desarrollo/) presentamos las skills de Matt Pocock como procedimientos reutilizables que pueden introducirse cuando resuelven una fricción concreta. Una de las más relevantes para cerrar la brecha entre intención e implementación es [`grill-with-docs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs). No genera una especificación completa por arte de magia: organiza una conversación para entender qué estamos construyendo y, cuando una decisión queda clara, ayuda a conservar parte de ese conocimiento en documentos del proyecto.

## El primer fallo suele ser el desalineamiento

Quien pide un cambio suele tener una imagen mental incompleta: conoce el problema y algunos ejemplos, pero no ha enumerado todas las reglas, excepciones o estados de interfaz. El agente recibe esas palabras y completa los huecos con supuestos plausibles. La salida puede ser coherente y técnicamente correcta, aunque no represente lo que el equipo necesitaba.

Una conversación de _grilling_ intenta hacer visibles esos huecos antes de implementar. En vez de tratar la petición inicial como una especificación, el agente explora las decisiones que dependen de ella y las organiza como un árbol: una respuesta puede abrir nuevas preguntas, mientras otras ramas todavía no se pueden resolver. La skill `grilling` describe el proceso como una entrevista por rondas, en la que se plantean las preguntas cuyas dependencias ya están claras.

Eso no significa que la persona deba responder en silencio a un cuestionario interminable. Quien dirige el _grill_ aporta contexto, corrige interpretaciones y también puede orientar la investigación: pedir que el agente inspeccione una ruta del código, comparar opciones o resumir las decisiones y dudas que siguen abiertas. El objetivo es avanzar hacia entendimiento compartido, no maximizar el número de preguntas.

## Una petición ambigua contiene decisiones de distinto tipo

Imaginemos una funcionalidad para cancelar una reserva. «Añade un botón para cancelar» deja abiertas preguntas de producto y de implementación: ¿se permite cancelar una reserva ya confirmada?, ¿hasta qué momento?, ¿se revierte el cobro?, ¿qué ocurre si la operación tarda?, ¿puede cancelarse solo una parte?, ¿quién recibe la notificación? No todas esas decisiones pertenecen al mismo rol ni se responden mirando el código.

El _grill_ ayuda a separar lo que sabemos, lo que debe decidir producto y lo que necesita exploración técnica. Si la regla de cancelación depende de una política comercial, el agente puede señalar la ausencia y presentar las alternativas, pero no inventar la política. Si el comportamiento actual del sistema no está claro, puede investigar el flujo existente y aportar evidencia. Si la solución depende de cómo se presenta el estado al usuario, una conversación quizá baste para algunas decisiones y un prototipo puede ayudar con otras.

Una clasificación práctica es preguntar qué clase de evidencia resolvería cada duda:

- **Decisión conceptual:** basta acordar una regla, un término o un límite de alcance.
- **Hecho del sistema:** hay que inspeccionar código, documentación, datos o contratos existentes.
- **Decisión de interacción:** conviene observar un flujo ejecutable o una variación visual.
- **Incertidumbre de alto impacto:** hace falta investigar alternativas antes de cerrar el diseño.

La clasificación evita discutir como si todas las respuestas fueran preferencias personales. Una regla de negocio puede necesitar a producto; un hecho del sistema, investigación; una interacción confusa, un prototipo; una decisión irreversible, evidencia y discusión técnica.

## Dirige la conversación hacia decisiones útiles

Una conversación efectiva no consiste en aceptar cada pregunta tal como aparece. Si varias opciones son razonables, pide al agente que las compare con sus consecuencias y que haga explícito qué supuesto está usando. Si una pregunta requiere conocimiento del proyecto, pídele que busque primero en el repositorio. Si la respuesta depende de una persona responsable de producto o seguridad, registra que sigue abierta en vez de rellenar el vacío con una conjetura.

Por ejemplo, ante la pregunta «¿qué hacemos si la cancelación falla?», una respuesta útil podría distinguir entre el estado de la reserva, el resultado del pago y el mensaje mostrado al usuario. Esa separación revela si estamos tratando una única operación atómica o varias acciones con resultados parciales. La persona puede entonces decidir la política de producto y pedir al agente que compruebe cómo se refleja hoy esa operación en el código.

También es razonable detener el _grill_ cuando la decisión está suficientemente clara para el siguiente paso. Si quedan detalles de bajo riesgo que pueden resolverse durante la implementación, no es necesario cerrarlos todos por anticipado. Si el alcance ha crecido hasta cruzar varias áreas, sistemas o sesiones, la señal puede ser que el problema requiere una exploración más amplia, como la que aborda [Wayfinder](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder), en lugar de seguir añadiendo preguntas a una única sesión.

## Conversación o prototipo: usa la evidencia adecuada

Algunas decisiones se resuelven con lenguaje: qué significa «reserva activa», quién puede cancelar o qué resultado espera negocio. Otras se vuelven difíciles de explicar sin algo tangible. Si el equipo discute si el usuario debe elegir una fecha en un modal, revisar una pantalla de confirmación o volver al listado con un estado actualizado, una descripción textual puede dejar a cada persona imaginando una interfaz distinta.

En ese caso, un prototipo puede responder una pregunta concreta antes de construir la solución de producción. La skill [`prototype`](https://github.com/mattpocock/skills/tree/main/skills/engineering/prototype) distingue entre explorar una lógica o modelo de estados y probar variaciones visuales de una interfaz. El prototipo es desechable y debería mostrar qué decisión intenta resolver; no es una implementación temprana que deba convertirse por inercia en código final.

Un recorrido posible sería:

```text
/grill-with-docs
       │
       ├─ decisión conceptual → conversación y acuerdo
       │
       ├─ hecho desconocido → investigación en el sistema
       │
       └─ interacción difícil de imaginar → prototipo
                                      ↓
                              volver al grill
```

Después de ver el prototipo, se vuelve a la conversación para confirmar qué se ha aprendido y qué queda por decidir. Así la herramienta visual reduce incertidumbre en una rama concreta; no toma el lugar de la conversación de producto ni la convierte automáticamente en una especificación definitiva.

## Conserva el lenguaje compartido, no cada respuesta del chat

Cuando una conversación resuelve términos del dominio, la skill `domain-modeling` propone contrastarlos con el vocabulario existente y actualizar el glosario en el momento en que se acuerdan. Por ejemplo, si «cancelar» significa anular toda la reserva antes de confirmar y «devolver» describe una operación posterior sobre el pago, esa distinción puede evitar que producto, backend y frontend usen una misma palabra para conceptos diferentes.

El glosario debe recoger términos y sus significados, no convertirse en una especificación técnica. Una decisión de arquitectura puede merecer un ADR cuando sea difícil de revertir, sorprenda a futuros lectores y refleje un trade-off real. Las decisiones de alcance de una única tarea pueden quedar en el ticket o en la especificación de esa tarea; no toda respuesta necesita ser documentación permanente.

El criterio es que el conocimiento sobreviva solo donde vaya a ser útil de nuevo. Guardar cada detalle del chat produce ruido; no registrar nunca los términos y decisiones que se repiten obliga a reconstruirlos en cada sesión. La documentación emerge de acuerdos que han demostrado ser relevantes, no del volumen de conversación.

## Cuándo parar y pasar a implementación

Antes de cerrar la fase de descubrimiento, resume el problema, el comportamiento esperado, las decisiones confirmadas y las preguntas que siguen abiertas. Una implementación acotada puede empezar cuando las dudas restantes no cambian el resultado central o pueden verificarse con feedback rápido. Si para avanzar hace falta elegir una política de producto todavía desconocida, el bloqueo es una decisión pendiente, no una instrucción que el modelo deba adivinar.

La misma petición puede terminar en caminos diferentes. Un cambio pequeño y claro puede pasar directamente a implementación. Una interacción con varias alternativas puede necesitar un prototipo y después una implementación acotada. Una iniciativa grande o llena de incertidumbre puede necesitar Wayfinder para ordenar decisiones antes de producir una especificación. La herramienta adecuada depende del problema y del coste de equivocarse.

`grill-with-docs` es útil cuando convierte supuestos invisibles en decisiones que las personas responsables pueden confirmar. Su resultado no se mide por cuántas preguntas hizo el agente ni por cuántos archivos creó. Se mide por si el equipo entiende mejor qué quiere construir, por qué lo quiere y qué evidencia permitirá comprobarlo.
