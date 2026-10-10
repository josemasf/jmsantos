---
title: "Cómo crear tu primera skill propia para un agente"
description: "Un método para convertir una instrucción repetida en una skill pequeña, activable y comprobable con tareas reales del proyecto."
date: 2026-10-21
tags: [IA, agentes, skills, documentación, productividad, ingeniería]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 12
image:
  src: /images/blog/63-crear-primera-skill-propia-agentes/crear-skill-agente-proceso.png
  alt: Una persona convierte una instrucción repetida en una tarjeta de procedimiento breve que se prueba con varios escenarios antes de incorporarse al repositorio.
  width: 1536
  height: 1024
---
issue: 65

La primera skill propia no debería empezar como una guía exhaustiva de todo lo que el equipo sabe. Suele nacer de algo más concreto: una instrucción que se repite, una secuencia que se olvida o un resultado que distintos agentes producen de forma inconsistente. El objetivo es empaquetar una responsabilidad acotada, no escribir una metodología completa.

El catálogo de [`mattpocock/skills`](https://github.com/mattpocock/skills) ofrece ejemplos de distintos tamaños y formas de activación. Antes de crear otra, busca si una skill existente ya resuelve la necesidad y si el contexto local puede añadirse mediante documentación o configuración. Una skill nueva implica mantenimiento, así que debe ahorrar fricción de manera reconocible.

## Elige una tarea que se repita y tenga un resultado

Una tarea apropiada tiene un disparador que se puede describir y una salida que se puede revisar. Por ejemplo, analizar un caso de uso legacy podría producir los puntos de entrada, formularios implicados, reglas conocidas, permisos, efectos secundarios y preguntas aún no resueltas. Eso es más concreto que «ayuda con el sistema legacy», que mezcla investigación, decisiones y posiblemente implementación.

Define quién la activa. Una skill dirigida por la persona puede iniciar un procedimiento o hacer preguntas explícitas. Una skill invocable por el modelo puede aportar una disciplina que se aplica cuando la tarea encaja. El frontmatter puede expresar su nombre, descripción y si el modelo no debe invocarla automáticamente; sigue el formato vigente de la plataforma y del repositorio.

## Escribe el flujo, no un ensayo

Una skill pequeña suele necesitar propósito, condiciones de uso, pasos de trabajo, fuentes de contexto y forma del resultado. Instrucciones específicas y ejemplos breves ayudan más que repetir valores generales como «sé cuidadoso». Si un paso requiere buscar información, especifica qué fuente debe consultarse; si un hallazgo es una decisión humana, aclara que se debe dejar abierto y no inventar.

Mantén fuera aquello que tiene un lugar más estable. Las convenciones de dominio pueden vivir en un glosario enlazado; reglas de arquitectura, en ADR o estándares; comprobaciones mecánicas, en tooling. La skill debe indicar cuándo leer esas fuentes, no duplicar su contenido entero.

## Comprueba la skill con tareas reales

Una skill que parece clara al leerla puede producir salidas vagas, introducir preguntas irrelevantes o asumir archivos que no existen. Pruébala con varios casos del repositorio: uno directo, uno con datos incompletos y otro que debería quedar fuera de su alcance. Observa si el trigger permite reconocer cuándo usarla, si la salida es útil y qué instrucciones obligaron al agente a adivinar.

Revisa también los no-op: pasos que aparecen en todos los casos aunque no cambien el resultado. Una skill demasiado larga puede gastar contexto sin modificar el comportamiento. Quita pasos redundantes y separa una responsabilidad si el documento empieza a pedir resultados diferentes para problemas distintos.

## Versiona y mantén el procedimiento

Si la skill es específica del repositorio, guardarla junto al código permite revisar sus cambios y mantenerlos cerca de las herramientas a las que apunta. Describe su propósito en el frontmatter para que la persona o el agente pueda encontrarla. Si depende de servicios o rutas que cambian, revisa las instrucciones cuando cambien esas interfaces.

Una buena skill no elimina el juicio. Hace repetible el trabajo que ya se entiende y marca el punto donde hace falta una decisión, una fuente externa o una revisión humana. Empieza por una fricción frecuente, crea un procedimiento pequeño y conserva solo las instrucciones que mejoran la siguiente ejecución.
