---
title: "Wayfinder: decide el camino antes de abordar una iniciativa grande"
description: "Cómo usar Wayfinder para convertir una iniciativa incierta en un mapa compartido de decisiones y avanzar hasta que el trabajo esté listo para especificarse."
date: 2026-11-24
tags: [IA, agentes, planificación, arquitectura, discovery, Wayfinder]
category: Arquitectura
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 7
image:
  src: /images/blog/58-wayfinder-iniciativas-grandes-decisiones/wayfinder-mapa-decisiones.png
  alt: Un equipo traza un mapa con preguntas abiertas y rutas de decisión que convergen en un destino claro antes de comenzar la implementación.
  width: 1536
  height: 1024
---

Hay iniciativas cuyo problema inicial ocupa una frase, pero cuya solución exige comprender un sistema legacy, acordar cambios de dominio, validar contratos entre repositorios y planificar una migración. Empezar a programar puede sentirse productivo, aunque cada hallazgo obligue a rehacer la ruta. Si todavía no sabemos qué decisiones hacen falta para llegar a una solución, dividir el trabajo en tareas de implementación es prematuro.

La skill [`wayfinder`](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder) aborda ese momento. Su objetivo es mapear la incertidumbre como decisiones por resolver en un tracker compartido y trabajar esas decisiones hasta que el camino hacia el siguiente artefacto —por ejemplo, una spec— esté claro. Por defecto planifica; no convierte el mapa en una lista de entregables que ejecutar automáticamente.

## Nombra el destino antes de abrir el mapa

Un mapa necesita un destino: la especificación que se quiere entregar, una decisión técnica que debe quedar cerrada o un cambio concreto que ya pueda implementarse. Sin ese destino, la investigación puede crecer sin criterio para saber cuándo ha terminado.

Wayfinder registra el destino, el dominio, las skills y restricciones relevantes, decisiones ya tomadas, asuntos todavía desconocidos y aspectos fuera de alcance. El mapa funciona como índice de bajo detalle; cada ticket hijo conserva la pregunta específica que se debe resolver. Una decisión vive en un lugar, mientras el índice apunta a ella sin duplicar todo el razonamiento.

Los tickets de Wayfinder son preguntas, no tickets de implementación. Una pregunta puede requerir research, un prototipo, conversación guiada o una tarea investigativa. Su resultado es una decisión con evidencia suficiente para despejar la ruta. Si en mitad del análisis aparece un cambio que ya se sabe implementar, probablemente se ha alcanzado el borde del mapa y toca pasar a planning o ejecución.

## Distingue Wayfinder de un grill acotado

`grill-with-docs` ayuda a aclarar una idea que cabe en una sesión: qué problema resuelve, qué comportamiento importa y qué decisiones están abiertas. Wayfinder sirve cuando el propio camino todavía es demasiado grande o incierto para esa sesión. No compiten: un mapa puede producir preguntas que luego se exploran con un _grill_, un prototipo o research, y el resultado vuelve al mapa como una decisión tomada.

```text
idea acotada → grill → decisiones → spec o implementación

iniciativa con niebla → Wayfinder
                          ↓
                  decisiones pendientes
                          ↓
                 ruta suficientemente clara
                          ↓
                    spec y tickets
```

La frontera depende de la incertidumbre, no de una estimación de tamaño en puntos. Un cambio con pocas líneas puede requerir Wayfinder si la política de producto está abierta; una migración extensa puede tener una ruta clara y estar lista para descomponerse.

## Trabaja la frontera de decisiones pendientes

Las decisiones se relacionan: resolver el modelo de dominio puede permitir decidir el contrato API; el contrato puede aclarar qué partes del frontend se paralelizan. El _frontier_ es el conjunto de preguntas que ya se pueden abordar con los acuerdos existentes. Al cerrar una, otras se desbloquean; las que aún dependen de información ausente permanecen sin especificar.

Esta estructura ayuda a evitar investigación duplicada y ordenamientos arbitrarios. Cada sesión se orienta con el mapa completo y toma una pregunta lista para resolver. Los tickets cerrados dejan un resumen y un enlace al detalle, mientras el mapa se mantiene pequeño. Una pregunta nueva que emerge de la investigación puede añadirse cuando ya está definida; la incertidumbre que todavía no se puede formular queda registrada como niebla, no como ticket ficticio.

## No confundas investigación con avance de producto

Leer código, comparar enfoques y hacer prototipos pueden ser actividades valiosas, pero solo cuentan como progreso hacia el destino si reducen incertidumbre o cambian una decisión. El resultado debería indicar qué se aprendió, qué alternativa se eligió, por qué y qué pregunta sigue bloqueada.

Wayfinder es especialmente útil para legacy, migraciones, greenfield y cambios arquitectónicos transversales. En esos casos, la secuencia puede pasar por analizar el sistema actual, contrastar reglas de dominio, explorar una interacción y decidir contratos antes de fijar alcance. Los agentes ayudan a investigar y documentar cada decisión; las personas responsables siguen resolviendo trade-offs de producto y riesgo.

Cuando el mapa ya no tiene decisiones abiertas que impidan especificar o ejecutar, Wayfinder ha cumplido su cometido. Ese es el momento para usar `to-spec` y `to-tickets`, o para comenzar directamente si el trabajo cabe en una tarea acotada. El mapa sirve para encontrar el camino; el siguiente proceso es el que recorre la ruta.
