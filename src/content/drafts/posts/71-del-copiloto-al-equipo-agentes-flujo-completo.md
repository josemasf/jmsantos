---
title: "Del copiloto al equipo de agentes: un flujo completo de ingeniería"
description: "Cómo conectar skills, contexto de repositorio, issues, delegación y feedback loops para construir un sistema de trabajo agéntico con límites claros."
date: 2027-02-23
tags: [IA, agentes, ingeniería, skills, arquitectura, testing, equipos]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 20
image:
  src: /images/blog/71-del-copiloto-al-equipo-agentes-flujo-completo/flujo-completo-equipo-agentes.png
  alt: Un flujo conecta conversación y decisiones con skills, documentación, tickets, agentes aislados, revisión y feedback que vuelve al repositorio.
  width: 1536
  height: 1024
---

La evolución importante del desarrollo con IA no consiste solo en tener un modelo más potente. Consiste en construir un entorno donde una tarea bien delimitada pueda ejecutarse con menos instrucciones improvisadas y el resultado se pueda evaluar con evidencia fiable. A lo largo de esta serie hemos recorrido las piezas de ese sistema: descubrir el problema, codificar prácticas, preparar trabajo delegable, organizar contexto y decidir cuánto riesgo podemos asumir.

Este artículo cierra la serie con un flujo de referencia. No es una metodología que haya que aplicar completa a cada cambio. Es un mapa para escoger qué pasos hacen falta según la claridad, el tamaño y el riesgo de una tarea. Si una parte no reduce incertidumbre ni mejora validación, no necesita convertirse en ceremonia.

## Primero aclara qué se quiere resolver

Si la petición es ambigua pero cabe en una sesión, [`grill-with-docs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) ayuda a explorar términos, comportamiento y decisiones. Cuando la duda necesita evidencia visual o ejecutable, un prototipo puede ayudar a comparar opciones y volver después a la conversación. Para una iniciativa demasiado grande o incierta, Wayfinder convierte el mapa de decisiones pendientes en una ruta que se pueda resolver por partes.

El resultado de esta etapa no tiene que ser una spec siempre. Un cambio pequeño y claro puede pasar directamente a implementación. El objetivo es que alguien responsable de producto o ingeniería haya cerrado las decisiones que el agente no debería inventar.

## Empaqueta decisiones cuando el trabajo cruza sesiones

Si la iniciativa necesita varios contextos o personas, `to-spec` sintetiza lo acordado y `to-tickets` corta el trabajo en entregas verticales con bloqueos explícitos. La spec conserva decisiones para ese trabajo; los acuerdos duraderos van a glosario, ADR o estándares. Cada ticket queda lo bastante autocontenido para implementarse con contexto fresco.

El tracker hace visible qué piezas componen el objetivo y qué frontera está lista. Issues, dependencias y sub-issues coordinan el avance; no sustituyen la definición de aceptación ni la decisión de prioridad.

## Delega ejecución dentro de límites conocidos

Una tarea clara puede asignarse a una persona o a un agente con una skill adecuada. Un bug difícil empieza por una reproducción y feedback loop; una feature protegida por pruebas puede recorrer TDD; una tarea con impacto amplio necesita más revisión y evidencia. Varias tareas independientes pueden trabajar en worktrees aislados y reunirse mediante una integración visible.

El nivel de autonomía depende de reversibilidad, blast radius y verificabilidad. Si una acción requiere permisos, credenciales o un paso irreversible, el agente puede preparar un wizard y dejar que la persona actúe en el punto necesario. Delegar una tarea no implica delegar la responsabilidad sobre el resultado del producto.

## Cierra el ciclo con evidencia y aprendizaje

La pull request devuelve cambios, decisiones y resultados de comprobación. Una revisión independiente mira el diff y el ticket; la demo valida si el producto resuelve lo esperado. Si el agente repitió una fricción, la retro puede convertirla en una regla automatizada, una skill, una mejora de navegación o documentación más precisa.

El ciclo queda así:

```text
problema
   ↓
grill o Wayfinder
   ↓
decisiones / spec
   ↓
tickets verticales
   ↓
implementación con skills y contexto
   ↓
tests, revisión e integración
   ↓
validación del resultado
   ↓
retro y mejora del entorno
   └──────────────→ siguiente cambio
```

Las skills hacen repetibles algunas disciplinas; el contexto compartido aporta términos, decisiones y límites; las issues convierten acuerdos en trabajo concreto; los agentes ejecutan dentro de esas fronteras; los feedback loops permiten revisar lo ocurrido. Cada componente cumple una función y ninguno sustituye al criterio de quienes construyen y mantienen el producto.

## Un buen sistema reduce la improvisación

No hace falta empezar por un equipo de agentes ni instalar todas las skills. Empieza con una tarea real, identifica dónde se atasca y añade la pieza que resuelve esa fricción: un test fiable, un ticket mejor definido, un término de glosario, una skill pequeña o una frontera arquitectónica más clara.

El objetivo final no es hablar mejor con la IA ni maximizar cuánto trabajo corre sin supervisión. Es crear un entorno donde las personas y los agentes entiendan qué resultado se busca, sepan dónde actuar y puedan demostrar que el cambio funciona. Esa es la diferencia entre usar un copiloto ocasional y construir un flujo de ingeniería que puede incorporar agentes sin perder el control.
