---
title: "Tu repositorio también forma parte del contexto del agente"
description: "Cómo la navegación, el lenguaje compartido, la arquitectura, las pruebas y el tooling determinan cuánto puede hacer un agente con seguridad."
date: 2026-12-08
tags: [IA, agentes, documentación, arquitectura, DX, mantenibilidad]
category: Arquitectura
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 9
image:
  src: /images/blog/60-repositorio-contexto-agente/repositorio-contexto-agentes.png
  alt: Un agente recorre un mapa claro del repositorio que conecta glosario, módulos, pruebas y herramientas hasta una ruta de cambio validada.
  width: 1536
  height: 1024
---

Cuando un agente propone un cambio inadecuado, es tentador responder con un prompt más largo. A veces falta una instrucción; otras, el repositorio no ofrece una forma fácil de encontrar la convención correcta, entender el dominio o comprobar el resultado. El contexto de trabajo no empieza y termina en el texto del prompt: también vive en la estructura, los nombres, los documentos y las señales que el código puede producir.

El README de [`mattpocock/skills`](https://github.com/mattpocock/skills) conecta varios de esos elementos: un lenguaje compartido, arquitectura comprensible, tests y tooling que dan feedback, además de skills que codifican procedimientos reutilizables. En conjunto, forman parte del entorno que guía el trabajo del agente. Es una forma de ver la codebase como contexto operativo, no solo como el lugar donde se escribirá el cambio.

## Haz que el conocimiento se pueda encontrar

Un documento puede contener la respuesta correcta y ser prácticamente inútil si nadie sabe que existe. La navegación del repositorio debe ayudar a localizar instrucciones específicas, glosarios, decisiones de arquitectura, comandos de desarrollo y documentación por área. Un índice corto en el archivo de entrada suele ser más útil que copiar todos los detalles en un único documento cargado en cada sesión.

Los nombres coherentes también reducen ambigüedad. Si el mismo concepto aparece con etiquetas distintas en una API, un módulo y una guía, el agente debe inferir si son sinónimos o conceptos diferentes. Un glosario puede fijar los términos de dominio; los ADR pueden explicar por qué se eligió una frontera; los ejemplos de código muestran cómo se aplica una convención.

## La arquitectura es una forma de contexto

Una codebase organizada alrededor de módulos con interfaces comprensibles permite rastrear un cambio y sus consecuencias. Cuando la lógica está duplicada o repartida por capas que se atraviesan entre sí, el agente debe investigar más, puede pasar por alto una regla y necesita una validación más amplia.

Esto conecta con [la arquitectura para agentes](/blog/arquitectura-agentes-reducir-friccion-codebase/), pero el enfoque aquí es cómo esa estructura funciona como información disponible para cada tarea. Los seams, el ownership y la locality ayudan a saber dónde actuar y qué no modificar. No hace falta crear una arquitectura nueva para la IA: hay que hacer explícitas las fronteras que ya necesita mantener el producto.

## Las pruebas y herramientas responden preguntas

Una instrucción puede pedir «no rompas compatibilidad», pero una prueba de contrato o una comprobación de tipos ofrece evidencia de que la compatibilidad se conserva. Los tests, linters, scripts de desarrollo y comandos de CI explican qué se espera del cambio y permiten que agente y persona comprueben el resultado con la misma señal.

Si el feedback es lento, difícil de interpretar o no existe, el contexto está incompleto: el agente puede modificar código sin un modo rápido de averiguar si siguió la intención. La calidad del entorno depende tanto de encontrar archivos como de poder ejecutar comprobaciones que distingan un cambio correcto de uno que solo parece razonable.

## Decide dónde vive cada regla

No conviene añadir cada aprendizaje a `AGENTS.md`. Orientación general y navegación pueden estar en ese punto de entrada; detalles del dominio en su glosario; decisiones técnicas duraderas en ADR; criterio de juicio en estándares; reglas mecánicas en lint, compilador, tests o CI; procesos repetibles en skills. Esta separación reduce duplicación y permite que cada instrucción aparezca cerca de la tarea que la necesita.

Una retro de trabajo con agentes puede identificar qué pieza falta. Si la persona corrige repetidamente el mismo patrón, pregúntate si debe automatizarse o documentarse. Si varios agentes no encuentran una guía, añade un enlace en la navegación. Si una decisión se repite en cada issue, conserva el término o contrato donde el equipo pueda consultarlo.

## El contexto empieza a ser parte del diseño

El sistema alrededor del código no elimina la necesidad de contexto en cada sesión. Hace que una parte mayor de ese contexto sea estable, compartida y verificable. Un repositorio navegable, con lenguaje común, interfaces claras, feedback fiable y procesos explícitos, reduce cuánto debe reconstruir cada persona o agente antes de contribuir.

Por eso, antes de probar un modelo más autónomo, observa qué información necesita para completar una tarea de forma correcta. Si la respuesta solo existe en la memoria de quien conoce el sistema, esa dependencia es una limitación real de ingeniería. Mejorar el contexto compartido beneficia la delegación, pero también la incorporación de nuevos compañeros y el mantenimiento futuro.
