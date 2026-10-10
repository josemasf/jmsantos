---
title: "Paralelismo con agentes: sesiones aisladas y trabajo integrable"
description: "Cómo repartir tickets entre sesiones y worktrees separados, mantener un contexto limpio y revisar cambios con independencia."
date: 2026-10-27
tags: [IA, agentes, Git, worktrees, paralelismo, code review]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 18
image:
  src: /images/blog/69-paralelismo-agentes-worktrees-contexto/paralelismo-agentes-worktrees.png
  alt: Tres agentes trabajan en áreas separadas desde tickets distintos y llevan sus cambios a una integración común con revisión independiente.
  width: 1536
  height: 1024
---
issue: 65

Lanzar varias sesiones de agentes en paralelo puede aumentar el trabajo completado, pero también multiplica los conflictos si todas modifican el mismo checkout o dependen de decisiones aún no cerradas. Un working tree compartido mezcla archivos, estado de Git y contexto de tareas; una sesión puede encontrar cambios que no hizo y atribuirlos al ticket equivocado.

La issue #65 propone aislar cada ticket en una sesión y worktree propios, y distinguir `implement` —una unidad— de `implement-spec`, que trabaja una spec completa como grafo. La documentación de [Git worktree](https://git-scm.com/docs/git-worktree) confirma que un repositorio puede mantener varios working trees asociados, con `HEAD` e índice propios aunque compartan parte de los metadatos.

## Paraleliza solo después de cerrar las dependencias

Una frontera lista para trabajar puede contener varios tickets independientes. Cada agente recibe uno con sus criterios de aceptación, la referencia al contexto compartido y un límite de alcance. Si dos tareas requieren decidir el mismo contrato o modificar una frontera común, conviene cerrar esa decisión o crear un paso de integración explícito antes de ejecutarlas simultáneamente.

El paralelismo no se obtiene creando más sesiones sobre la misma carpeta. Cada worktree debe tener una rama y un estado reconocible, y debe partir de la rama de integración actual. Esa separación limita cambios cruzados, conflictos de `HEAD` y stashes accidentales. También facilita abandonar una tarea sin dejar el estado de otra a medio modificar.

## Usa una sesión por ticket y una integración visible

Un ticket acotado puede implementarse, probarse y revisarse en su contexto propio. `implement-spec` organiza una iniciativa con varias tareas en una rama de integración y worktrees de implementación; las ramas se integran según avanza la frontera. Si la tarea cambia durante el trabajo, actualizar el ticket o devolver una pregunta explícita evita que el agente amplíe silenciosamente su alcance.

La integración debe hacer visibles los conflictos de código y de decisiones. Compartir un repositorio Git no significa que todas las ramas tengan automáticamente la misma base; conviene confirmar de qué commit parte el worktree y actualizarlo antes de mezclar sus cambios. La limpieza también forma parte del flujo: retirar worktrees terminados reduce ruido y evita reabrir estados antiguos por error.

## Revisa en un contexto que no racionalice el cambio

Quien implementó una tarea conoce las razones de su solución y puede pasar por alto un supuesto que la revisión debería cuestionar. Revisar desde un contexto separado y desde una base conocida ayuda a que la persona o el agente revisor observe el diff como una propuesta nueva: qué cambió, qué evidencia lo acompaña y si cumple el ticket.

El patrón propuesto en la issue es cerrar implementación y tests, integrar el cambio y lanzar una revisión independiente desde la base común. La revisión debe recibir el ticket y el diff real, no depender solo del resumen del implementador. Los resultados que requieran cambios vuelven a una tarea concreta; no se mezclan con otros tickets sin actualizar su alcance.

## La concurrencia necesita un límite de integración

Si todos los agentes trabajan sobre módulos sin conflictos, el cuello de botella puede desplazarse a CI o a la revisión. Si las tareas compiten por los mismos archivos o comparten una decisión, el paralelismo añade trabajo de reconciliación. Ajusta el número de sesiones a la independencia real de los tickets y a la capacidad del equipo para revisar los cambios.

Los worktrees reducen contaminación del estado local; no resuelven dependencias mal definidas ni garantizan compatibilidad entre cambios. Una estructura de tickets clara, ramas aisladas, integración frecuente y revisión independiente hacen que la concurrencia produzca piezas que se pueden combinar, en lugar de un conjunto de modificaciones que nadie sabe cómo reunir.
