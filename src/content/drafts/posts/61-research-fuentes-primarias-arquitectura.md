---
title: "Research técnico: investiga antes de convertir una opinión en arquitectura"
description: "Un flujo para investigar decisiones técnicas con fuentes primarias, conservar los hallazgos y llevar la evidencia a una decisión o ADR."
date: 2026-10-19
tags: [IA, agentes, research, arquitectura, documentación, toma de decisiones]
category: Arquitectura
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 10
image:
  src: /images/blog/61-research-fuentes-primarias-arquitectura/research-tecnico-fuentes-primarias.png
  alt: Una persona y un asistente comparan documentos oficiales y ejemplos de código, y organizan la evidencia en una nota antes de tomar una decisión técnica.
  width: 1536
  height: 1024
---

Una conversación sobre una librería o arquitectura puede producir argumentos convincentes sin comprobar qué soporta la versión actual, cuál es el comportamiento por defecto o qué limitación documenta el proyecto. Cuando una opinión técnica afecta a una migración, una API o una decisión difícil de revertir, conviene separar la exploración de la conclusión y buscar evidencia en quien mantiene la fuente.

La skill [`research`](https://github.com/mattpocock/skills/tree/main/skills/engineering/research) plantea un procedimiento sencillo: formular una pregunta, investigarla en fuentes primarias de alta confianza y guardar los hallazgos en un archivo Markdown con citas. El conocimiento relevante sale del chat y puede revisarse más tarde con las fuentes a mano.

## Formula una pregunta que se pueda responder

«¿Qué framework es mejor?» es demasiado amplia para una investigación que vaya a orientar una decisión. «¿La versión soportada ofrece una API estable para cancelar una petición en curso?» tiene un objeto y evidencia buscable. Conviene aclarar qué decisión dependerá del resultado, qué versión o entorno importa y qué queda fuera del análisis.

Una pregunta acotada evita que el agente acumule enlaces sin criterio. También permite reconocer cuándo encontró suficiente evidencia: una especificación, documentación del mantenedor, código fuente o changelog que responde directamente al comportamiento en cuestión.

## Prioriza la fuente que posee el dato

Para saber qué acepta una API, consulta su documentación oficial o implementación. Para una propuesta de estándar web, busca la especificación correspondiente. Para un cambio de versión, revisa release notes y guías de migración del proyecto. Artículos, foros y redes pueden ayudar a descubrir términos o casos reales, pero sus afirmaciones deberían conducir a la fuente primaria que las confirma.

Esta distinción importa porque una explicación secundaria puede corresponder a otra versión, omitir restricciones o describir un caso particular como regla general. Una investigación trazable deja claro qué afirma la fuente y qué inferencia se hace a partir de ella. Si las fuentes oficiales no resuelven la duda, el resultado debe conservar esa incertidumbre en lugar de presentarla como certeza.

## Guarda hallazgos con citas y alcance

Una nota útil explica la pregunta, resume los hallazgos, enlaza las fuentes que respaldan cada afirmación y anota límites o datos que no se pudieron confirmar. Así otra persona puede verificar el razonamiento y actualizarlo cuando cambie la librería.

La nota de research no es automáticamente un ADR. La investigación aporta evidencia; el equipo decide qué hacer. Si la evidencia conduce a una elección arquitectónica con alternativas reales y consecuencias duraderas, un ADR puede registrar la decisión y su razón. Si la consulta responde una duda puntual de implementación, quizá baste con añadir una referencia a la spec o al issue.

## El agente prepara, el equipo interpreta

Un agente puede leer documentación, comparar APIs y resumir diferencias con rapidez. Aun así, la relevancia depende del contexto: una característica disponible no siempre se ajusta a nuestros requisitos, coste operativo o límites de compatibilidad. Quien decide debe evaluar qué evidencia cambia la decisión y qué trade-offs siguen siendo de producto o arquitectura.

Un flujo manejable sería:

```text
pregunta concreta
       ↓
fuentes primarias
       ↓
hallazgos con citas y límites
       ↓
grill de opciones y consecuencias
       ↓
decisión o ADR, si corresponde
```

El último paso devuelve la investigación al proceso de decisión. Investigar no es retrasar la implementación por principio; es invertir en conocimiento cuando una suposición incorrecta podría encarecer el cambio. Y si tras revisar fuentes la elección sigue siendo incierta, esa incertidumbre también es un resultado que conviene hacer visible.
