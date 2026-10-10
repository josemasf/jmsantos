---
title: "Delegar trabajo en GitHub Agents sin perder el control"
description: "Cómo preparar tareas agent-ready, combinar roles con skills reutilizables y revisar el trabajo asíncrono que vuelve en forma de pull request."
date: 2027-01-26
tags: [IA, agentes, GitHub, issues, pull requests, delegación]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 16
image:
  src: /images/blog/67-github-agents-delegar-con-control/github-agents-delegacion.png
  alt: Una tarea clara sale de un issue hacia un agente que prepara cambios y evidencias, y vuelve como una pull request para revisión humana.
  width: 1536
  height: 1024
---

Un agente que trabaja en segundo plano puede ahorrar tiempo de espera, pero solo si la tarea se puede ejecutar sin convertir cada decisión importante en una pregunta bloqueante. Asignar una iniciativa completa descrita en una issue padre suele transferir demasiada ambigüedad. Una unidad pequeña, con contexto y criterio de aceptación, ofrece un encargo más claro y un resultado que el equipo puede revisar.

GitHub permite trabajar con agentes de programación en tareas asíncronas. Su [documentación sobre coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents) describe cómo se les pueden asignar issues o iniciar tareas desde la experiencia de agentes, y cómo el trabajo puede volver en forma de pull request. La disponibilidad y los pasos concretos dependen de las políticas y configuración habilitadas para el repositorio.

## El agente realiza el trabajo; la skill guía cómo lo realiza

No hace falta crear un agente diferente para cada skill. Un rol como frontend engineer, bug fixer, reviewer o analista de legacy identifica el tipo de trabajo y la perspectiva que debe aplicar. Una skill aporta una disciplina reutilizable, como TDD, diagnóstico o revisión de código. Mantener separadas ambas ideas evita multiplicar agentes que solo difieren por un procedimiento.

Las instrucciones del repositorio describen el contexto estable; la issue concreta define la tarea. Un agente no debería depender de que su perfil contenga una copia completa de cada decisión del proyecto. Puede cargar la skill adecuada, consultar la documentación relevante y trabajar dentro de los límites expresados por el issue.

## Usa los tickets como frontera de delegación

Antes de dividir el trabajo, discovery y especificación resuelven el problema y los trade-offs. Después, los tickets verticales convierten ese resultado en capacidades acotadas que pueden implementarse y comprobarse. Una tarea lista para agente describe qué comportamiento debe funcionar y qué evidencia lo demuestra; no se limita a «haz cambios en backend» o «termina la feature».

Los criterios de aceptación, las dependencias, las convenciones locales y los comandos de validación hacen que el ticket pueda ejecutarse con contexto fresco. La issue padre conserva el propósito global y sus relaciones con el plan, pero no debe asignarse como si fuera una unidad implementable cuando contiene una spec extensa y varios caminos independientes.

## Revisa el resultado, no solo que exista una PR

Una pull request demuestra que el agente produjo una propuesta de cambio. La revisión debe comprobar el contrato, el alcance, la evidencia de pruebas y las decisiones donde el agente tuvo que asumir algo. Si el cambio es visual, también puede requerir observarlo en contexto; si toca permisos o datos, la evidencia debe incluir esos escenarios.

El trabajo asíncrono no elimina el feedback humano. Cambia el momento en el que llega: la persona entrega una unidad clara, continúa con otra tarea y evalúa el resultado cuando vuelve. Si una misma duda se repite entre agente y persona, no siempre se resuelve con más conversación; puede indicar que falta una decisión o una regla en el entorno.

## Paraleliza según las fronteras reales

Varias tareas pueden avanzar en paralelo cuando no compiten por la misma decisión, archivo o recurso compartido. Dependencias explícitas ayudan a encontrar el conjunto listo para empezar. Si los tickets necesitan un contrato pendiente, primero hay que cerrar ese contrato; si son verticales independientes, no es necesario esperar a que uno complete una capa técnica entera antes de iniciar el otro.

Delegar con control significa dar autonomía sobre la ejecución dentro de límites conocidos, exigir evidencia proporcional al riesgo y mantener responsabilidad humana sobre el resultado del producto. Skills consistentes y tareas autocontenidas permiten esa delegación sin convertir cada PR en una nueva conversación desde cero.
