---
title: "Specs y tickets para agentes: cuándo ayudan y cuándo sobran"
description: "Cuándo convertir una conversación en una especificación, cómo dividir el trabajo en tickets verticales y por qué cada tarea debe poder ejecutarse con contexto fresco."
date: 2026-10-27
tags: [IA, agentes, arquitectura, gestión de producto, desarrollo de software, planificación]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 3
image:
  src: /images/blog/54-specs-tickets-cuando-aportan-valor/specs-tickets-trabajo-vertical.png
  alt: Un equipo convierte decisiones compartidas en una especificación y después en pequeñas entregas verticales, cada una representada por una ruta completa hasta una comprobación.
  width: 1536
  height: 1024
---

Una especificación puede aclarar trabajo complejo, pero también puede convertirse en un documento que nadie consulta. Un conjunto de tickets puede permitir que varias personas y agentes trabajen en paralelo, pero también puede repartir una funcionalidad en tareas por capas que no producen nada utilizable hasta el final. La pregunta útil no es si todo trabajo necesita una spec; es qué forma de preparación reduce más riesgo para este cambio.

En el artículo anterior vimos cómo explorar una necesidad con [`grill-with-docs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) y distinguir las decisiones que ya podemos cerrar de las que requieren investigar o prototipar. Cuando el resultado de esa conversación revela trabajo que excede una sesión, dos skills ayudan a empaquetar lo aprendido: [`to-spec`](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-spec) sintetiza el contexto acordado y [`to-tickets`](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets) lo divide en unidades ejecutables.

## La especificación tiene un coste y una fecha de caducidad

Una spec merece la pena cuando evita reconstruir decisiones durante varias sesiones o cuando distintas personas deben implementar partes de una iniciativa con los mismos criterios. Puede reunir el problema, el comportamiento esperado, las decisiones de implementación que ya se han tomado, los seams de prueba y los límites de alcance. Su utilidad está en hacer transferible la intención mientras se ejecuta ese trabajo.

No hace falta crearla para un cambio que cabe en una sesión y tiene un comportamiento claro. Si una persona puede entender el problema, implementarlo y validarlo directamente desde la conversación o el ticket, escribir otro documento solo duplica el contexto. En el otro extremo, para una migración o una funcionalidad que cruza varios módulos, empezar a implementar desde una petición breve puede dejar decisiones incompatibles en cada tarea delegada.

Una guía aproximada es:

```text
cambio pequeño y claro
→ conversación breve
→ implementación

trabajo que cruza sesiones o responsabilidades
→ conversación y decisiones
→ spec
→ tickets
→ implementación por unidades
```

El tamaño no se mide únicamente en líneas de código. Una modificación corta con una regla de negocio incierta puede requerir más preparación que un cambio amplio pero mecánico. Lo que importa es si el contexto y las decisiones caben en la misma sesión sin perder precisión.

## `to-spec` sintetiza acuerdos; no sustituye el discovery

La skill `to-spec` parte de la conversación y del conocimiento existente del código para redactar una especificación. No está diseñada para entrevistar de nuevo a quien solicita el cambio. Si hay decisiones esenciales sin resolver, conviene volver al _grill_ o investigar antes de pedir la síntesis. De lo contrario, la spec corre el riesgo de presentar supuestos como si fueran acuerdos.

La especificación debería distinguir qué se sabe, qué se ha decidido y qué queda fuera. El formato actual de la skill incluye una descripción del problema desde la perspectiva de usuario, la solución, historias de usuario, decisiones de implementación, decisiones de testing, elementos fuera de alcance y notas adicionales. Al tratarse de una herramienta para implementar una iniciativa concreta, puede incluir decisiones técnicas que no pertenecen a documentos duraderos del proyecto.

El paso de `grill` a `to-spec` debería ocurrir en el mismo contexto de trabajo: la síntesis necesita conservar las respuestas, las alternativas discutidas y las decisiones que aparecieron durante la exploración. Si la conversación descubre un concepto de dominio que el equipo usará a futuro, su significado puede ir al glosario. Si deja una decisión arquitectónica difícil de revertir y con alternativas reales, quizá merezca un ADR. La spec conecta esos acuerdos con la tarea presente; no sustituye el conocimiento que debe mantenerse más allá de ella.

## Divide por comportamiento completo, no por capas técnicas

Una spec grande no se vuelve ejecutable por dividirla automáticamente en «base de datos», «backend», «frontend» y «tests». Esas tareas reparten la arquitectura entre tickets, pero ninguna entrega una capacidad demostrable al terminar. Además, obligan a coordinar a varias personas antes de que exista un recorrido funcional que se pueda revisar.

`to-tickets` propone _tracer bullets_: cortes verticales estrechos que atraviesan las capas necesarias y dejan un comportamiento completo, aunque limitado. Imaginemos una pantalla para consultar stock. Una primera entrega podría permitir buscar un producto y mostrar su disponibilidad; la siguiente añadiría el filtrado por almacén; otra cubriría el estado sin resultados. Cada ticket tiene un resultado visible y puede probarse por separado.

En cambio, repartir la misma funcionalidad así retrasa el feedback:

```text
#1 Crear tablas de inventario
#2 Añadir endpoints de stock
#3 Construir la pantalla de consulta
#4 Incorporar las pruebas
```

Cada ticket vertical deja una ruta completa:

```text
#1 El usuario consulta el stock de un producto
#2 El usuario filtra el stock por almacén
#3 El usuario entiende cuándo no hay resultados
```

Un corte vertical no significa que cada ticket deba rediseñar todas las capas ni que deba duplicar lógica. Significa que se entrega el mínimo camino coherente necesario para demostrar una parte del comportamiento. Si hay que prefactorizar una frontera para hacer ese camino seguro, la preparación debe ser acotada; los grandes refactors mecánicos son una excepción que puede necesitar una secuencia expand–migrate–contract.

## Las dependencias expresan bloqueos reales

Los tickets también forman un grafo. Una relación «bloqueado por» debe representar una dependencia que impide empezar, no una preferencia de orden ni una relación temática. Si dos cortes pueden desarrollarse y probarse de manera independiente, mantenerlos desbloqueados permite que el equipo trabaje en paralelo. Si uno necesita el contrato o el comportamiento de otro para ser correcto, esa dependencia debe hacerse explícita.

La skill recomienda declarar los bloqueos al proponer el desglose y revisar si cada uno es realmente necesario. Los tickets sin bloqueos forman la primera frontera lista para empezar; cuando terminan, desbloquean los siguientes. Esto permite repartir trabajo sin asignar a un agente una spec padre que describe una iniciativa completa pero no una tarea implementable.

Un ticket preparado debe ser suficientemente autocontenido para una sesión nueva: explicar el comportamiento, sus criterios de aceptación y cualquier decisión que afecte a su solución. Así la persona o el agente que lo implemente no necesita heredar toda la conversación de discovery, ni inferir el contexto a partir de otros tickets vagamente relacionados.

## Mantén el mismo contexto para decidir y uno fresco para ejecutar

La continuidad del contexto importa durante la preparación: `grill → to-spec → to-tickets` conserva el hilo de decisiones y permite que los tickets reflejen los acuerdos, no solo el resumen superficial del problema. Una vez que el desglose está revisado y cada ticket es autocontenido, conviene iniciar la ejecución con contexto limpio para cada unidad de trabajo.

Esta separación reduce dos problemas distintos. Si se pierde el contexto antes de redactar la spec, hay que volver a explicar decisiones o se completan huecos con suposiciones. Si se lleva todo el historial de una iniciativa al agente que implementa un ticket, puede recibir información innecesaria y acabar abordando trabajo que no forma parte de su unidad.

La frontera útil está entre decidir y ejecutar. Discovery establece qué queremos y bajo qué restricciones; la spec conserva esas decisiones para el trabajo coordinado; los tickets empaquetan cortes implementables; cada sesión de ejecución toma uno de ellos y devuelve evidencia sobre el resultado.

## Revisa el desglose antes de publicarlo

`to-tickets` no debería convertir una primera propuesta en trabajo publicado automáticamente. Su proceso actual pide presentar los tickets, sus bloqueos y el comportamiento que entrega cada uno, y revisar con la persona usuaria si el tamaño y las dependencias son correctos. Esa revisión permite detectar tickets demasiado grandes, cortes que no son demostrables o dependencias que solo expresan una secuencia cómoda.

Cuando el desglose está aprobado, se publica en el tracker configurado. Si se parte de una issue existente, cada unidad debería quedar relacionada con ella y las dependencias deberían usar los vínculos nativos cuando estén disponibles. La issue padre explica el objetivo general; no es una tarea que se asigne a un agente para que implemente todo de una vez.

## Una decisión práctica para cada cambio

Antes de escribir una spec, pregunta si el trabajo excede una sesión, si necesita coordinación entre responsabilidades o si las decisiones deben seguir disponibles para nuevas sesiones. Si la respuesta es no, probablemente basta un ticket claro y una conversación directa. Si es sí, sintetiza primero las decisiones acordadas y divide después por comportamientos demostrables.

La calidad del proceso no se mide por el número de documentos ni de tickets. Una spec es útil si ayuda a preservar decisiones sin fingir que será documentación eterna. Un ticket es útil si alguien puede terminarlo, comprobarlo y mostrar qué comportamiento nuevo funciona. Cuando cada unidad tiene una salida completa y verificable, el equipo obtiene feedback antes y puede delegar con más seguridad.
