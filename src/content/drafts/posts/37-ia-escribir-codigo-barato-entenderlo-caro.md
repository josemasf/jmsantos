---
title: "Escribir código ya es barato. Mantenerlo sigue siendo carísimo."
description: "La IA acelera la producción de código, pero no reemplaza el criterio necesario para integrarlo, validarlo y mantenerlo en un producto real."
date: 2026-10-20
tags: [IA, arquitectura, mantenimiento, calidad, equipos, desarrollo de software]
category: Frontend
image:
  src: /images/blog/37-ia-escribir-codigo-barato-entenderlo-caro/escribir-codigo-barato-mantenerlo-carisimo.png
  alt: Una persona genera bloques de código mientras sostiene un gran mapa de conexiones de software que necesita organizar.
  width: 1536
  height: 1024
series:
  slug: mantenibilidad-frontend-coste-de-entender
  order: 1
---

La IA ha reducido de forma notable el coste de producir una primera versión de muchas piezas de software: una función, un formulario, una migración, una batería inicial de tests o una explicación de una API. Es una mejora real. El error aparece cuando se confunde velocidad de producción con velocidad de entrega sostenible. Generar líneas no resuelve por sí mismo dónde deben vivir, qué contrato respetan, qué información no deben exponer ni cómo sabremos que continúan funcionando dentro de seis meses.

El cuello de botella sigue siendo entender. Entender el problema antes de codificar, el sistema antes de integrarlo y el cambio antes de aprobarlo. Cuando escribir resulta más barato, esas decisiones ganan peso relativo: una solución mediocre puede multiplicarse más rápido por el repositorio, y el coste de revisar o retirar código innecesario también crece.

## La salida correcta no equivale a la decisión correcta

Un asistente puede proponer una implementación plausible con muy poco contexto. Eso resulta útil para explorar alternativas, desbloquear una tarea o automatizar trabajo repetitivo. Sin embargo, una respuesta correcta en aislamiento puede ser incorrecta para el producto: quizá duplica una abstracción existente, introduce una dependencia que no encaja, ignora una regla de permisos o maneja mal un estado de error que el equipo ya conoce.

Por eso el prompt no debería acabar con «genera el código». Debe incluir el objetivo, los límites y la evidencia necesaria para aceptar el cambio. ¿Qué comportamiento protege? ¿Qué módulo es dueño de la decisión? ¿Qué datos son sensibles? ¿Qué prueba demostraría que la alternativa propuesta funciona en el recorrido real? Estas preguntas no ralentizan la IA; evitan que acelere en la dirección equivocada.

## La arquitectura se vuelve más importante, no menos

Un repositorio con fronteras claras da mejores instrucciones y mejores revisiones. Si los adaptadores de API, las reglas de dominio y los componentes visuales tienen responsabilidades reconocibles, es más fácil pedir un cambio acotado y verificar que no atraviesa límites indebidos. En un sistema donde todo puede importar de todo, la herramienta puede generar código que parece coherente porque no existe una frontera que pueda violar explícitamente.

La documentación breve también gana valor. Un ADR, una guía de contribución o un ejemplo canónico no tienen que explicar cada detalle; sirven para hacer visibles decisiones que de otro modo solo viven en la memoria del equipo. Son contexto reutilizable para personas y para herramientas.

## La revisión cambia de foco

Revisar cambios asistidos no consiste en detectar si “parecen escritos por IA”. El origen no determina la calidad. La revisión debería concentrarse en contratos, efectos, accesibilidad, seguridad, rendimiento y pruebas. Un diff grande que compila puede seguir ocultando una simplificación incorrecta de una regla de negocio o un error en un caso límite.

Es preferible pedir cambios pequeños y verificables. Una tarea puede usar IA para plantear un test antes de la implementación, comparar una API con sus consumidores o localizar duplicaciones. Luego, una persona decide qué opción encaja y confirma el resultado con el mismo rigor que aplicaría a código escrito manualmente. La velocidad es valiosa cuando mantiene ciclos de feedback cortos, no cuando convierte la revisión en una lectura imposible.

## Usa la IA para reducir trabajo mecánico, no criterio

Hay usos especialmente productivos: generar datos de prueba iniciales, explicar un módulo para orientar una investigación, preparar transformaciones repetitivas o proponer casos de error que aún no se habían considerado. También puede ayudar a encontrar código muerto o inconsistencias, siempre como una fuente de hipótesis que hay que validar.

En cambio, delegar decisiones sin contexto sobre permisos, datos, límites de dominio o estrategia de observabilidad crea una deuda nueva. La herramienta puede producir una respuesta convincente, pero no asume el coste de operar y mantener esa respuesta. Ese coste sigue siendo del equipo.

## Conclusión

Escribir software más deprisa no hace que entenderlo sea más barato. Hace más visible que la ventaja competitiva está en mantener coherencia: decidir qué construir, dónde encaja, cómo demostrar que funciona y cuándo conviene borrar lo que sobra. La IA puede ampliar la capacidad del equipo si se apoya en buenos límites, pruebas y revisión; sin ellos, solo acelera la acumulación de incertidumbre.

Este cierre conecta con toda la serie: la deuda técnica, la señal de los tests, la CI, la observabilidad y la cohesión de los componentes son mecanismos para que el código siga siendo comprensible cuando ya no recordamos quién lo escribió.
