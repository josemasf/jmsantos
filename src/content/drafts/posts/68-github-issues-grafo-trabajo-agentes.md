---
title: "GitHub Issues como grafo de trabajo para un equipo de agentes"
description: "Cómo relacionar specs, tickets implementables y dependencias para que personas y agentes trabajen sobre una frontera lista y compartan una fuente de verdad."
date: 2027-02-02
tags: [IA, agentes, GitHub, issues, planificación, task graph]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 17
image:
  src: /images/blog/68-github-issues-grafo-trabajo-agentes/issues-grafo-tareas-agentes.png
  alt: Una issue principal conecta varios tickets verticales, algunos disponibles y otros bloqueados por decisiones previas, formando un grafo de trabajo.
  width: 1536
  height: 1024
---

Una lista de issues muestra tareas, pero no siempre revela qué trabajo puede empezar ahora, qué depende de una decisión ni cómo una entrega pequeña contribuye a una iniciativa mayor. Cuando varias personas y agentes avanzan a la vez, esa estructura afecta directamente a la coordinación. El issue tracker puede servir como mapa compartido del trabajo, siempre que las relaciones expresen dependencias reales y las unidades sean ejecutables.

La skill [`to-tickets`](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets) divide una conversación o una spec en cortes verticales y declara qué tickets bloquean a otros. [`implement-spec`](https://github.com/mattpocock/skills/tree/main/skills/engineering/implement-spec) consume ese grafo y busca la frontera de tickets cuyos bloqueos ya se han resuelto. La expresión «runtime de agentes» es una metáfora para ese ciclo operativo: GitHub conserva el estado y las relaciones; personas y agentes realizan el trabajo.

## Separa la issue padre de las unidades implementables

Una spec padre describe un resultado más amplio y el contexto común; un ticket hijo entrega una capacidad completa y verificable. La padre no debería asignarse a un agente como si fuera una sola tarea cuando contiene varias decisiones o cortes. Cada hijo necesita comportamiento esperado, aceptación, alcance y evidencia suficientes para ejecutarse con contexto fresco.

GitHub admite jerarquías mediante sub-issues y dependencias entre issues con relaciones «blocked by» y «blocking». Son conceptos distintos: la jerarquía muestra qué tickets componen una iniciativa; el bloqueo dice que uno no puede comenzar hasta que otro termine. Una relación temática no debería convertirse automáticamente en dependencia.

## Encuentra la frontera lista para trabajar

En un grafo, la _ready frontier_ contiene tickets que todavía están abiertos y cuyos bloqueos ya están cerrados. Esa frontera puede tener varios elementos: es el trabajo que puede empezar en paralelo sin esperar decisiones previas. Cuando un ticket se completa, cambia el conjunto disponible y el siguiente grupo se vuelve visible.

```text
                   SPEC
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     buscar       filtrar     ver detalle
        │                       │
        └──────────┐            │
                   ▼            │
                exportar ◄──────┘
```

El grafo es útil solo si cada nodo describe trabajo real. Una dependencia artificial reduce paralelismo; un ticket que agrupa toda la iniciativa vuelve a esconder la coordinación dentro de una caja; dividir por capas técnicas puede producir tareas sin salida funcional demostrable.

## Conserva estado y contexto en el tracker

La issue debe registrar qué se entrega y qué evidencia permite revisarlo. Las relaciones de bloqueo orientan el orden, pero no reemplazan la descripción. Un proyecto puede añadir labels, milestones o vistas para mostrar estado y ownership, siempre que no cree varias fuentes de verdad para la misma decisión.

GitHub documenta [sub-issues y dependencias](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies) para organizar jerarquía y bloqueos. La combinación permite que el issue tracker sea más que un backlog plano: muestra el alcance del objetivo, su descomposición y el trabajo que se puede tomar ahora.

## El tracker coordina, el equipo sigue decidiendo

El grafo no decide prioridad de producto ni resuelve automáticamente un trade-off técnico. Tampoco hace que una tarea ambigua se convierta en delegable por añadir un label. Si dos tickets revelan una decisión compartida que no estaba en la spec, el equipo debe detenerse y registrar el acuerdo antes de repartir supuestos diferentes.

Usar issues como runtime significa actualizar el estado a medida que cambia el trabajo, mantener dependencias honestas y permitir que agentes tomen unidades claras sin reconstruir todo el plan. El tracker conecta decisiones y ejecución; la calidad del grafo depende de cómo se escriben sus tickets y de que alguien mantenga las relaciones fieles a la realidad.
