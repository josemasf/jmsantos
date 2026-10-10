---
title: "Scrum en equipos con agentes: de las reuniones de estado a las decisiones"
description: "Cómo evolucionan los roles de Product Owner, Tech Lead y developer, y qué propósito conservan las ceremonias de Scrum cuando parte de la ejecución se delega a agentes."
date: 2026-12-29
tags: [Scrum, IA, agentes, equipos, producto, arquitectura, desarrollo de software]
category: Cultura de equipo
image:
  src: /images/blog/51-scrum-equipos-agentes/scrum-equipos-agentes.png
  alt: Tres integrantes de un equipo deciden juntos alrededor de un punto central mientras pequeños robots ayudan con tareas asíncronas y devuelven un resultado validado.
  width: 1536
  height: 1024
---
issue: 66

En la [serie sobre desarrollo agéntico](/blog/ciclo-desarrollo-ia-chatgpt-codex-agentes/), he recorrido cómo convertir decisiones en especificaciones, trabajo delegable y ciclos de feedback. Ese flujo plantea una pregunta organizativa que merece una respuesta propia: si parte de la investigación, la implementación y la revisión puede avanzar de forma asíncrona con agentes, ¿qué deberían hacer las personas y qué sentido conservan las ceremonias de Scrum?

Los agentes no eliminan al Product Owner, al Tech Lead, a los developers ni a Scrum. Cambian dónde aporta valor cada rol y hacen más visible qué reuniones sirven para compartir información y cuáles necesitamos para decidir juntos. Una regla útil para empezar es sencilla: si una reunión existe principalmente para transmitir información, probemos a moverla a un canal asíncrono; si existe para tomar una decisión entre varias personas, probablemente siga mereciendo un espacio compartido.

## El Product Owner decide el problema y el resultado

Cuando escribir historias, explicar requisitos o dividir tickets consume buena parte del tiempo de producto, resulta tentador imaginar que un agente puede asumir el papel del PO. Puede preparar un primer borrador, señalar contradicciones y preguntar por condiciones que faltan. Eso reduce trabajo mecánico, pero no resuelve las decisiones que dan dirección al producto.

El Product Owner sigue siendo responsable de explicar por qué se hace un cambio, para quién, qué problema intenta resolver y qué comportamiento significaría éxito. También decide prioridad, aceptación y trade-offs: por ejemplo, qué parte del alcance queda fuera para lanzar antes, o qué riesgo de experiencia se acepta. Un modelo puede detectar que falta una política de cancelación; no puede inventar cuál debería ser esa política para el negocio.

Por tanto, el PO no necesita transformarse en _prompt engineer_. Su aportación principal está en hacer explícitas las decisiones de producto y mantenerlas coherentes entre necesidades, prioridades y resultados. Los agentes pueden ayudar a explorar alternativas y preparar artefactos; la responsabilidad sobre el valor esperado y los límites de la solución continúa en las personas que conocen el producto y responden por él.

## El Tech Lead diseña límites para el trabajo

El Tech Lead también desplaza su atención. Si los agentes pueden investigar código, proponer cambios y resolver dudas locales, el TL dedica menos tiempo a ser el punto por el que pasa cada pregunta. Gana peso el diseño del sistema en el que trabajan tanto las personas como los agentes: contratos claros, fronteras entre módulos, ownership, estándares, estrategia de pruebas y ciclos de feedback fiables.

Esto incluye mantener instrucciones útiles en `AGENTS.md`, definir _skills_ cuando una tarea recurrente necesita contexto específico y asegurar que CI proporcione señales comprensibles. Incluye también establecer límites de autonomía: qué cambios puede preparar un agente, qué permisos necesita y qué decisiones requieren revisión humana. Estos límites no son burocracia añadida; son parte de la arquitectura de un proceso donde más trabajo puede avanzar sin coordinación continua.

El cambio importante es pasar de controlar cada paso de ejecución a diseñar condiciones para que el trabajo sea seguro y revisable. El TL sigue tomando decisiones técnicas y ayudando a resolver riesgos, pero procura que el conocimiento no dependa de estar disponible para contestar cada duda. Un buen contrato o una prueba útil permite que el equipo avance sin convertir al Tech Lead en un cuello de botella.

## El developer aporta más que código escrito a mano

La presencia de agentes no conduce a una cadena en la que el developer desaparece después de entregar una tarea. El developer entiende la necesidad, decide el diseño local, selecciona qué delegar, inspecciona el resultado, integra los cambios y responde por la calidad de lo que llega al producto. Puede escribir menos líneas manualmente y, aun así, hacer más trabajo de ingeniería.

Delegar una implementación no elimina el juicio necesario para comprobar si encaja con el sistema, si respeta sus contratos y si resuelve el problema original. Tampoco elimina el trabajo de construir feedback loops: tests que revelen regresiones, herramientas que permitan reproducir fallos y revisiones que aporten evidencia. La contribución humana se desplaza desde producir cada pieza hacia orientar, verificar y conectar piezas dentro de un producto coherente.

Por eso, medir la productividad por la cantidad de código generado o por tickets cerrados puede dar una imagen engañosa. Importan la calidad de las decisiones, el tiempo hasta obtener feedback fiable, la facilidad para mantener el cambio y el resultado que experimenta quien usa el producto. La velocidad de ejecución solo es útil si el equipo puede absorber y validar lo que produce.

## Discovery gana importancia cuando ejecutar es más barato

La fase de discovery debería mantenerse y centrarse en comprender el problema, formular hipótesis, explorar comportamientos y construir entendimiento compartido. Según la incertidumbre, puede incluir prototipos o pruebas con usuarios. La secuencia sigue siendo reconocible: problema, preguntas, hipótesis, exploración, decisiones y una comprensión común de qué se va a intentar.

Cuando aumenta la capacidad de ejecución, una decisión equivocada puede propagarse más deprisa. Un agente puede producir una implementación plausible a partir de una descripción incompleta, y varias tareas delegadas pueden amplificar la misma suposición. Por eso discovery no es una demora antes de “hacer trabajo real”: ayuda a reducir el riesgo de hacer con eficiencia algo que no resuelve la necesidad.

## Refinement: preparar en asíncrono y reunirse por las dudas abiertas

El refinement pierde valor cuando consiste principalmente en leer una historia en voz alta para que el equipo reciba información. Una preparación previa puede pedir a agentes que revisen una especificación y señalen ambigüedades, dependencias, casos límite o términos que admiten varias interpretaciones. El equipo llega entonces con preguntas concretas, en lugar de descubrirlas línea a línea durante la reunión.

La conversación conjunta sigue siendo útil cuando hay que resolver una ambigüedad de producto, acordar un contrato entre componentes o negociar un alcance. La estimación también puede servir para hablar de riesgo e incertidumbre, siempre que no se convierta en una promesa de precisión que el trabajo no permite. El refinement puede ser más corto o menos frecuente si el trabajo asíncrono deja claras las preguntas; no hace falta conservar una duración fija cuando ya no cumple su propósito.

## La daily pasa de informar a coordinar

El formato clásico —qué hice ayer, qué haré hoy y si tengo bloqueos— aporta poco si el estado ya está actualizado en el tablero, las pull requests y los registros de ejecución. Repetir en una llamada lo que cualquier integrante puede consultar añade sincronía sin resolver necesariamente nada.

La conversación diaria puede centrarse en dependencias, decisiones pendientes, riesgos y bloqueos que requieren coordinación. Si no hay nada que coordinar, basta una actualización asíncrona o una reunión muy breve. El objetivo no es rendir cuentas ante el grupo, sino detectar a tiempo dónde el trabajo de una persona, equipo o agente necesita una decisión de otra parte.

## Planning: acordar objetivo, capacidad y riesgos

La planificación de sprint sigue siendo un momento para decidir qué resultado merece prioridad y qué capacidad humana crítica requiere. La pregunta útil no es solo cuántos puntos caben: también qué queremos conseguir, qué dependencias pueden impedirlo, qué riesgos debemos vigilar y qué trabajo necesita atención directa del equipo.

Un agente puede ayudar a descomponer trabajo o señalar tareas que parecen paralelizables, pero esa propuesta depende de la calidad del contexto y no sustituye el compromiso del equipo. La planificación no debería microgestionar cada paso que hará un agente; sí debe dejar claros los objetivos, los límites de alcance y las condiciones que disparan una revisión o un cambio de plan.

## Review y demo: comprobar si el producto resuelve lo acordado

La review conserva su valor porque una implementación correcta no demuestra por sí sola que el producto sea el correcto. Tests verdes, una revisión de código satisfactoria y una ejecución sin errores son evidencia importante sobre el cambio, pero no responden a la pregunta de producto: ¿es esto realmente lo que queríamos?

La demo permite inspeccionar el comportamiento en contexto, discutir efectos que no estaban en los criterios iniciales y decidir qué hacer después. Esa evaluación necesita a las personas que entienden el problema, y puede revelar que la solución cumple la especificación pero que la especificación debe evolucionar. La calidad técnica ayuda a entregar; la review ayuda a comprobar el resultado.

## Retrospectiva humana y revisión del entorno de agentes

La retrospectiva sigue siendo necesaria para hablar de cómo trabaja el equipo: qué decisiones llegaron tarde, dónde hubo fricción entre roles, qué dependencias bloquearon el flujo y qué conviene cambiar. La llegada de agentes añade una segunda línea de inspección más técnica: ¿tenían instrucciones suficientes?, ¿era difícil navegar por el repositorio?, ¿falló el tooling?, ¿faltaba una prueba o documentación?, ¿los límites de autonomía eran apropiados?

Son perspectivas relacionadas, pero sus acciones pueden ser distintas. Una mejora de equipo puede consistir en aclarar quién decide una regla de negocio; una mejora del entorno puede ser añadir una comprobación automática o corregir instrucciones obsoletas. Conviene que ambas terminen en cambios concretos y responsables, en vez de crear una ceremonia adicional que solo genere una lista de problemas.

## Refinement técnico bajo demanda

Las sesiones técnicas amplias tienen sentido cuando hay una decisión difícil de revertir, un cambio de contrato importante, dependencias entre equipos o un riesgo relevante que requiere varias perspectivas. Para tareas acotadas, un documento breve con alternativas y preguntas abiertas puede permitir que las personas adecuadas revisen la propuesta sin convocar a todo el equipo.

La disponibilidad de agentes para explorar el código o comparar opciones tampoco convierte cada decisión en una decisión colectiva. El Tech Lead y los developers pueden preparar evidencia de forma asíncrona y pedir una conversación cuando el coste de equivocarse o el impacto transversal lo justifiquen. Así la reunión sirve para resolver el trade-off y no para narrar la investigación previa.

## Estimar incertidumbre y dependencias, no velocidad del agente

Los agentes pueden acelerar investigación, escritura, generación de tests y refactorizaciones. Eso no elimina la incertidumbre, el legado desconocido, las dependencias externas ni el tiempo humano necesario para decidir e integrar. Un ticket pequeño pero ambiguo puede bloquear varios días; uno grande y bien delimitado puede ser fácil de repartir y validar.

Por eso, las conversaciones de planificación y estimación deberían hacer visibles preguntas como cuánta incertidumbre queda, qué dependencias deben resolverse, qué impacto tendría un error y qué intervención humana será crítica. La velocidad observada de un agente en una tarea no garantiza el mismo resultado en otra: el contexto, las herramientas disponibles y el coste de validar cambian el trabajo real.

| Práctica | Enfoque útil cuando hay agentes |
| --- | --- |
| Discovery | Acordar problema, hipótesis, comportamiento y decisiones |
| Refinement | Resolver ambigüedades que no quedaron cerradas en asíncrono |
| Planning | Alinear objetivo, prioridad, capacidad y riesgo |
| Daily | Coordinar dependencias, bloqueos y decisiones |
| Review / demo | Validar el producto y el resultado esperado |
| Retrospectiva | Mejorar el sistema humano y el entorno de ingeniería |
| Refinement técnico | Reunir a las personas implicadas ante trade-offs relevantes |

## Una cadencia humana alrededor de la ejecución asíncrona

Scrum puede seguir ofreciendo una cadencia para alinear prioridades, inspeccionar el producto y mejorar el sistema mientras la ejecución ocurre de forma más continua y asíncrona. El trabajo puede fluir por un tablero como en Kanban, con agentes y personas tomando tareas cuando están preparadas, mientras el sprint mantiene un horizonte común para decidir qué resultado perseguir y cuándo revisarlo.

No es necesario imponer una frontera rígida entre esos enfoques. Lo importante es que el equipo distinga el flujo de ejecución de los momentos que necesitan atención compartida. El estado se consulta; las decisiones se discuten; los resultados se inspeccionan; los problemas del proceso se convierten en acciones. Si una ceremonia no ayuda a hacer alguna de esas cosas, merece rediseñarse.

Un flujo de trabajo posible empieza por el problema y el resultado que define producto. PO, developers y TL exploran las decisiones que todavía importan; la especificación recoge acuerdos y riesgos; las tareas preparadas se reparten entre personas y agentes; la evidencia vuelve en forma de cambios, pruebas y pull requests; finalmente, el equipo revisa si el producto cumple el objetivo y aprende de las fricciones del proceso.

Si quieres ver cómo convertir decisiones en especificaciones, tickets ejecutables, feedback loops y trabajo delegable, en la [serie sobre desarrollo agéntico](/blog/ciclo-desarrollo-ia-chatgpt-codex-agentes/) profundizo en ese flujo desde la perspectiva de ingeniería.

## Las reuniones deben proteger el espacio de decisión

Los agentes pueden automatizar parte del trabajo y reducir el coste de producir una primera solución. Las ceremonias deberían conservar el tiempo compartido donde el equipo lo necesita: para crear alineamiento, tomar decisiones, inspeccionar resultados y mejorar su forma de trabajar. El resto de la información puede viajar por artefactos y canales asíncronos bien mantenidos.

Cuando aumenta la capacidad de ejecución, el cuello de botella se desplaza hacia la calidad de las decisiones. El reto de Scrum en equipos con agentes no consiste en añadir una reunión para cada herramienta nueva, sino en liberar tiempo de coordinación rutinaria para dedicarlo a decidir qué merece construirse, bajo qué límites y cómo sabremos que ha funcionado.
