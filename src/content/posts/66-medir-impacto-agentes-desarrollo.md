---
title: "Cómo medir si trabajar con agentes mejora realmente el desarrollo"
description: "Qué métricas ayudan a evaluar el efecto de los agentes en el flujo de entrega y por qué contar líneas, prompts o skills puede incentivar el comportamiento equivocado."
date: 2026-10-24
tags: [IA, agentes, métricas, productividad, calidad, equipos]
category: Cultura de equipo
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 15
image:
  src: /images/blog/66-medir-impacto-agentes-desarrollo/metricas-flujo-agentes.png
  alt: Un equipo observa un tablero que relaciona tiempo de entrega, ciclos de revisión y errores con calidad y feedback, sin medir el volumen de código generado.
  width: 1536
  height: 1024
---

La cantidad de código generado por IA es fácil de contar y difícil de interpretar. Más líneas pueden significar más funcionalidad, más boilerplate o más trabajo que habrá que revisar y retirar. Si un equipo usa esa cifra para decidir si los agentes mejoran la productividad, corre el riesgo de optimizar el volumen producido en lugar del resultado entregado.

La propuesta de la issue #65 es medir el flujo y la calidad: cuánto tarda el trabajo desde que está listo hasta la pull request, cuántas rondas de revisión requiere, cuánta aclaración necesita antes de implementar y qué bugs o retrabajo aparecen después. El principio es evaluar el sistema completo, no atribuir cada resultado a la herramienta por sí sola.

## Empieza por una pregunta de mejora

Antes de elegir métricas, define qué decisión cambiaría el dato. ¿Queremos saber si las tareas llegan mejor preparadas? Observa las aclaraciones necesarias antes de implementar. ¿Queremos reducir espera de feedback? Mide cuánto dura una ejecución completa de CI y cuánto tarda el equipo en responder a una PR. ¿Queremos saber si el retrabajo baja? Sigue defectos posteriores y cambios de alcance.

Sin una pregunta, un dashboard puede producir números que no orientan acciones. Y si se comparan semanas con distinto tamaño o riesgo de tareas, una mediana de tiempo bruto puede sugerir una mejora que solo refleja una mezcla más sencilla de trabajo.

## Combina velocidad con señales de calidad

Métricas de flujo como tiempo desde «ready» hasta PR o desde PR hasta merge pueden mostrar dónde se acumula espera. Las rondas de revisión, defectos posteriores, retrabajo después de integrar frontend y backend, y la proporción de tareas que llegan con evidencia aportan señales de calidad y coordinación.

También importa la tasa de aclaraciones antes de implementar, el scope creep y cuántos tickets terminan sin intervención adicional. Ninguna métrica aislada demuestra autonomía: una tarea puede cerrarse rápido porque se redujo el alcance, y una intervención humana puede ser precisamente la decisión que evita un defecto caro.

La duración y estabilidad del feedback loop son señales relevantes. Una batería más rápida puede acelerar iteraciones, pero solo si conserva cobertura de comportamientos que importan. Reducir minutos quitando tests que detectan regresiones sería mejorar la cifra mientras empeora el sistema.

## Evita objetivos que distorsionan el trabajo

Lines of code, cantidad de prompts, número de skills activadas o porcentaje de código atribuido a IA no describen valor para la persona usuaria. Convertir cualquiera de estas medidas en un objetivo puede fomentar prompts más numerosos, tareas artificialmente pequeñas o aceptar código porque fue generado deprisa.

Incluso las métricas de proceso requieren contexto y cuidado. Usarlas para comparar individuos suele ocultar el tamaño, la incertidumbre y las dependencias de las tareas. Es más útil mirar tendencias de equipo, combinar medidas y revisar ejemplos concretos de trabajo antes de concluir que una práctica causó un cambio.

## Construye una línea base y evalúa cambios pequeños

Registra una línea base antes de introducir un cambio grande en el flujo. Después prueba una intervención acotada —por ejemplo, tickets más autocontenidos o una suite determinista— y observa qué cambia junto a las métricas y los ejemplos de calidad. Evita adjudicar todo el efecto al agente si también cambian las herramientas, el equipo o la naturaleza del trabajo.

El objetivo no es maximizar autonomía. Es aumentar el throughput sin degradar calidad ni entendimiento. Si una métrica mejora pero el equipo pierde visibilidad sobre decisiones o aparecen más bugs, el sistema no ha mejorado. Medir sirve cuando hace visible ese intercambio y permite cambiar el proceso con evidencia.
