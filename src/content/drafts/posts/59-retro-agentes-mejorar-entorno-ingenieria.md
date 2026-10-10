---
title: "Retro para agentes: mejora el entorno, no solo el código"
description: "Cómo convertir errores repetidos de agentes en mejoras de instrucciones, tooling, documentación y estándares sin inflar AGENTS.md."
date: 2026-10-17
tags: [IA, agentes, retrospectiva, DX, documentación, calidad]
category: Cultura de equipo
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 8
image:
  src: /images/blog/59-retro-agentes-mejorar-entorno-ingenieria/retro-entorno-agentes.png
  alt: Un equipo revisa una sesión de trabajo con agentes y clasifica una fricción repetida como mejora automática, regla compartida o documentación de navegación.
  width: 1536
  height: 1024
---
issue: 65

Cuando un agente repite un error, la reacción habitual es corregir la última modificación y continuar. Si vuelve a pasar en tareas similares, quizá el problema no sea esa línea de código: puede faltar una instrucción, un chequeo automático, un ejemplo de arquitectura o una forma sencilla de encontrar la información correcta.

La skill [`retro`](https://github.com/mattpocock/skills/tree/main/skills/engineering/retro) mira precisamente ese entorno de trabajo: navegación, tooling, comprobaciones automáticas, estándares de código, acceso a información y reglas que no aportan nada. No es una retrospectiva Agile para debatir cómo se siente el equipo ni sustituye la conversación humana sobre coordinación; se centra en mejorar el contexto con el que el agente realiza trabajo de ingeniería.

## Separa fricción del equipo y fricción del entorno

La retro de equipo puede revelar decisiones tardías, handoffs difíciles o desacuerdos entre roles. La retro del entorno pregunta por qué el agente no encontró un módulo, por qué el lint no detectó un error mecánico, qué test faltaba o si una instrucción le empujó a seguir un camino incorrecto. Ambos planos se influyen, pero sus acciones son distintas.

Una sesión útil parte de una evidencia concreta: un diff, una ejecución, una corrección manual repetida o una explicación que la persona tuvo que reescribir. Sin ejemplos, la conversación puede convertirse en una lista de preferencias generales. Con evidencia, es posible identificar si el problema fue mecánico, de criterio, de acceso a información o de límites de autonomía.

## Coloca cada regla donde pueda actuar

Un error mecánico repetido debería resolverse en la capa más fiable disponible. Si una convención puede comprobarse con lint, tipos, tests o CI, automatizarla evita pedir al agente que la recuerde en cada tarea. Un error de criterio puede requerir un estándar breve con ejemplos. Una definición de dominio pertenece al glosario; una decisión arquitectónica duradera, a un ADR; una navegación útil, a las instrucciones del repositorio.

La regla práctica es ubicar el conocimiento según su función:

```text
orientación y navegación → AGENTS.md
significado compartido → GLOSSARY.md
decisión arquitectónica → ADR
criterio que requiere juicio → CODING_STANDARDS.md
condición verificable → lint / test / CI
procedimiento repetible → SKILL.md
```

No toda fricción requiere una nueva skill. Si el agente no encontraba un directorio, mejora la navegación. Si omitió una validación que puede automatizarse, añade un chequeo. Si la corrección solo se aplica a un caso, no generalices una regla que no se ha repetido.

## Mantén las instrucciones principales pequeñas

`AGENTS.md` suele ser la puerta de entrada al repositorio. Si se convierte en una enciclopedia, oculta lo importante entre detalles y consume contexto en todas las tareas. Conviene que dé orientación general, comandos y enlaces hacia documentos más específicos, no que copie íntegramente cada estándar, skill y descripción de dominio.

Una retro debería priorizar las fricciones por frecuencia e impacto. Si una instrucción no ha cambiado ningún resultado, puede retirarse. Si un error se resolvió con una nueva regla y no vuelve a aparecer, la mejora ha funcionado. Las reglas antiguas también necesitan revisarse: una recomendación que dejó de aplicar puede guiar a los agentes en la dirección equivocada.

## Cierra con cambios concretos y observables

El resultado de la retro no es una lista de ideas, sino pocas modificaciones con responsable y señal de éxito. Por ejemplo: añadir un comando de verificación al README; automatizar una regla repetida en CI; aclarar qué paquete posee un contrato; o actualizar una skill que quedó desfasada.

En la siguiente tarea se puede comprobar si el cambio redujo la corrección manual o mejoró la evidencia devuelta por el agente. Así la sesión alimenta una mejora progresiva del sistema de ingeniería. La revisión humana sigue teniendo su propio espacio; esta retro complementa esa mirada con una pregunta operacional: ¿qué debería cambiar en el repositorio para que la próxima tarea sea más fácil de ejecutar y verificar?
