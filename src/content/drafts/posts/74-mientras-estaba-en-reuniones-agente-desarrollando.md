---
title: "Mientras estaba en reuniones, un agente seguía desarrollando"
description: "Una experiencia con dos tareas delegadas a un agente durante una jornada con reuniones, una iteración visual y validación humana, sin convertir el tiempo transcurrido en una promesa de productividad."
date: 2027-02-16
issue: 14
tags: [IA, agentes, Tech Lead, delegación, productividad, validación humana]
category: Desarrollo profesional
image:
  src: /images/blog/mientras-estaba-en-reuniones-agente-desarrollando/portada.webp
  alt: "Una persona participa en una reunión mientras un agente desarrolla una visualización; ambos recorridos terminan en una revisión humana con una marca de validación."
  width: 1536
  height: 1024
---

La pregunta que más se repite cuando hablamos de inteligencia artificial aplicada al desarrollo suele ser cuánto código puede producir en menos tiempo. Para un Tech Lead, sin embargo, escribir código es solo una parte del trabajo. También hay reuniones, decisiones, apoyo al equipo y problemas que requieren atención en el momento. En ese contexto, me interesaba observar qué cambia cuando una implementación puede avanzar mientras yo atiendo otra responsabilidad.

En una experiencia concreta, el proceso completo duró cuatro horas. Durante esa ventana asistí a tres reuniones de equipo y un agente completó dos subtareas de una mejora funcional, incluida una visualización. El resultado necesitó una iteración adicional antes de que pudiera validarlo. Es un caso útil para pensar sobre delegación asíncrona, pero no permite afirmar que ahorré cuatro horas ni calcular cuánto más rápido fue el trabajo: no medí por separado mi tiempo activo, el tiempo de ejecución del agente ni un equivalente de desarrollo tradicional.

## El trabajo empieza antes de asignar una tarea

La mejora partía de requisitos y de un desglose que ya se había acordado. Con esa base, utilicé IA conectada al gestor de tareas para crear dos subtareas, cada una con criterios de aceptación, y registrar una dependencia explícita entre ellas. Antes de crear los elementos, el agente comprobó la configuración real del gestor.

El primer intento falló porque faltaban campos obligatorios que no se habían especificado. El agente consultó los metadatos del sistema, corrigió la operación y verificó que las tareas quedaran registradas correctamente. Esa recuperación importa porque las herramientas externas tienen contratos concretos: ante un rechazo, la respuesta útil es inspeccionar el contrato y corregir la solicitud, no rellenar campos por intuición.

Las subtareas se asignaron después a un agente de desarrollo, que completó ambas implementaciones. La separación entre preparación y ejecución dejó trazabilidad sobre qué había que resolver y qué dependía de qué. También limitó el encargo a unidades de trabajo más manejables que una petición abierta para «terminar la mejora».

## Delegar la ejecución no elimina la revisión

Mientras el agente trabajaba, yo seguí con otras responsabilidades, incluidas tres reuniones. Eso no convirtió la tarea en autónoma en el sentido de que el resultado pudiera aceptarse sin intervención humana. Al volver, tuve que comprobar si lo implementado resolvía la necesidad y si la visualización era adecuada.

La gráfica representaba los datos correctamente, pero su solución visual no me pareció suficientemente buena. En una iteración posterior concreté una preferencia por TanStack Chart que no estaba en la petición original. El resultado final quedó validado después de ese feedback. Esa secuencia no demuestra por sí sola que el agente debiera haber inferido una preferencia que nunca recibió; sí muestra que la corrección funcional y la adecuación de una solución a las convenciones del producto son criterios distintos.

Cuando una expectativa es general —por ejemplo, una librería aprobada por el equipo o una regla del Design System— conviene incorporarla al contexto estable del repositorio. Si solo aplica a una tarea, corresponde dejarla en sus criterios o restricciones. Añadir contexto reutilizable puede evitar que una decisión recurrente dependa de conversaciones aisladas; no hace falta convertir cada preferencia puntual en una instrucción global.

## Qué significan cuatro horas y tres reuniones

El dato confirmado es tiempo transcurrido de principio a fin: cuatro horas desde que empezó la preparación hasta la validación final. Dentro de ese periodo hubo tres reuniones, se completaron dos subtareas y se hizo una iteración sobre la visualización. No tengo una medición del tiempo humano activo ni del tiempo neto que el agente pasó ejecutando, y tampoco una comparación con cuánto habría tardado una persona haciendo el mismo trabajo.

Por eso, esas cuatro horas no son horas ahorradas ni una medida de productividad multiplicada. Lo que sí describen es una ventana en la que el avance de implementación no dependió de que yo mantuviera atención continua sobre el código. En un rol con responsabilidades que se alternan, esa independencia temporal puede ser valiosa, aunque el beneficio concreto dependa de la calidad del resultado y del coste de revisarlo.

| Dato confirmado | Alcance |
| --- | --- |
| Cuatro horas | Tiempo transcurrido desde la preparación hasta la validación final |
| Tres reuniones | Reuniones atendidas dentro de esa ventana |
| Dos subtareas | Implementaciones que el agente completó |
| Una iteración | Mejora de la visualización después de revisar el resultado |

## Corrección funcional y calidad de producto son preguntas distintas

Una implementación puede representar correctamente los datos y seguir necesitando trabajo para encajar en el producto. La primera comprobación pregunta si el comportamiento cumple lo acordado. La segunda pregunta si la solución resulta adecuada para las personas usuarias y coherente con las decisiones técnicas existentes.

En este caso, la preferencia tecnológica apareció durante la iteración, no en la petición inicial. Para valorar el primer resultado, por tanto, hay que tener en cuenta qué información tenía disponible el agente. Eso no obliga a aceptar cualquier solución: la revisión humana sigue evaluando el resultado frente a los criterios expresados, detecta diferencias relevantes y concreta el siguiente paso cuando una expectativa estaba implícita.

La iteración tampoco debería convertirse automáticamente en una ronda de prompts cada vez más largos. Si el feedback revela una convención duradera, el repositorio puede aprenderla mediante documentación o configuración compartida. Si describe una decisión específica de esa vista, debe permanecer en el alcance de la tarea. Así el equipo mejora el contexto donde realmente hacía falta.

## Qué debería comprobar quien lidera el cambio

Que una tarea termine no demuestra que esté lista para integrarse o para llegar a producción. La validación debería ser proporcional al impacto del cambio y apoyarse en evidencias adecuadas: el comportamiento frente a los criterios de aceptación, pruebas relevantes, mantenibilidad, arquitectura, experiencia de usuario y posibles modificaciones fuera de alcance. Si existen riesgos de integración o decisiones que exceden la autonomía concedida, deben volver a la persona responsable.

Estas son comprobaciones recomendables para un flujo de trabajo; no afirmo que todas formaran parte de este caso. La experiencia confirma que validé el resultado final, pero no documenta si hubo una pull request, qué pruebas se ejecutaron o cómo se revisó el código. Separar lo observado de lo que conviene hacer evita transformar una anécdota en una demostración de calidad que no es.

## El cuello de botella se desplaza

Cuando parte de la ejecución puede avanzar sin atención constante, el trabajo no desaparece: cambian las dependencias. La claridad de los requisitos, la calidad de los contratos, la disponibilidad para resolver decisiones, la capacidad de revisar y la confianza en las pruebas adquieren más peso. Si el contexto es incompleto, el agente puede avanzar en una interpretación plausible y devolver después un cambio que necesita corrección.

El papel del Tech Lead se desplaza hacia preparar límites útiles, delegar unidades revisables, evaluar evidencias y ayudar al equipo a aprender de las iteraciones que se repiten. Eso no significa dejar de programar ni de tomar decisiones técnicas. Significa que el progreso puede continuar durante algunos intervalos en los que la persona está ocupada con otro trabajo, siempre que el alcance permita esa separación y la revisión siga teniendo un lugar claro.

No obtuve una medida de cuánto más rápido programé. Vi dos tareas completadas y validadas dentro de una jornada de cuatro horas que también incluía tres reuniones. La diferencia práctica fue que la implementación avanzó mientras yo atendía otras responsabilidades, y que el resultado todavía necesitó criterio y feedback humanos para quedar como quería.
