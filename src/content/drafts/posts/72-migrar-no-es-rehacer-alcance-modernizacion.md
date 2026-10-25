---
title: "Migrar no es rehacer: cómo mantener el alcance bajo control"
description: "Distingue migración, retirada y rediseño para modernizar una aplicación sin reabrir todas las decisiones de producto a la vez."
date: 2026-11-03
tags: [migración, modernización, arquitectura, producto, legacy]
category: Arquitectura
issue: 85
image:
  src: /images/blog/72-migrar-no-es-rehacer-alcance-modernizacion/portada-migrar-no-es-rehacer.webp
  alt: Una persona de ingeniería y otra de producto acuerdan el alcance en un puente que conecta un sistema heredado con una aplicación modular, ante tres rutas para migrar, retirar o rediseñar.
  width: 1536
  height: 1024
---

Una migración suele empezar con un objetivo que parece técnico: pasar de un framework a otro, sustituir una aplicación de escritorio por una web o llevar un sistema a una plataforma que la organización pueda mantener. Después aparece una propuesta razonable en apariencia: ya que vamos a tocarlo, podríamos mejorar también este flujo, cambiar aquella regla y revisar cómo funciona el proceso completo.

Algunas de esas mejoras serán necesarias. Otras llevan años esperando una decisión de producto. Si todas entran en el mismo alcance, el equipo deja de tener una migración acotada y pasa a resolver a la vez compatibilidad, rediseño, dependencias y prioridades. El riesgo no está en querer mejorar el producto; está en no distinguir qué trabajo se está haciendo ni quién debe decidirlo.

## La misma conversación reaparece con cada tecnología

Al cambiar de tecnología, es fácil pensar que el trabajo consiste en reproducir la aplicación actual con herramientas nuevas. Sin embargo, el comportamiento de un sistema no siempre está descrito en un único lugar. Puede estar repartido entre pantallas, validaciones, servicios, procesos manuales y decisiones que el equipo ya no recuerda. Al reconstruirlo, aparecen preguntas que la tecnología anterior había mantenido escondidas: ¿este paso sigue siendo necesario?, ¿se puede eliminar?, ¿quién confirma esta excepción?, ¿debería funcionar de otra manera?

Ese descubrimiento es útil, pero no convierte automáticamente cada duda en parte de la migración. Si una pregunta cambia el comportamiento que espera el usuario, hace falta una decisión funcional. Si requiere una adaptación para que la nueva plataforma opere con seguridad o compatibilidad, puede formar parte del trabajo técnico. Y si no hay una respuesta disponible, el bloqueo necesita responsable y fecha de revisión; dejarlo abierto indefinidamente también cambia el alcance.

## Migrar, retirar y rediseñar son decisiones distintas

Para cada funcionalidad conviene decidir qué resultado se busca. Las tres opciones siguientes no agotan todas las estrategias posibles, pero ayudan a que una conversación ambigua se convierta en una decisión explícita.

| Decisión | Cuándo encaja | Qué debe quedar acordado |
| --- | --- | --- |
| **Migrar** | La funcionalidad sigue siendo necesaria y su comportamiento actual es aceptable en el destino. | Qué comportamiento observable se conserva y cómo se comprobará. |
| **Retirar** | Producto confirma que la funcionalidad ya no aporta valor o tiene que desaparecer. | Quién confirma la retirada, qué dependencias hay que revisar y cómo se comunica. |
| **Rediseñar** | Existe una mejora de producto que merece cambiar el comportamiento. | El nuevo resultado esperado, su responsable y si forma parte de esta entrega o de otra iniciativa. |

La distinción importa porque cada opción tiene un criterio de éxito diferente. Para migrar, se comprueba que el comportamiento acordado se mantiene. Para retirar, se valida que no quedan consumidores o dependencias que necesiten esa capacidad. Para rediseñar, se revisa si el nuevo flujo satisface la necesidad que motivó el cambio. Una sola lista de tareas puede incluir las tres, pero conviene que no se confundan bajo la etiqueta de «migración».

## La paridad funcional orienta; no obliga a copiarlo todo

Conservar el comportamiento es un buen punto de partida cuando el objetivo consiste en cambiar la plataforma y reducir la incertidumbre del cambio. No significa reproducir cada detalle sin examinarlo. Si el comportamiento actual expone un riesgo de seguridad, depende de una capacidad que no existe en el destino o entra en conflicto con requisitos actuales, la migración necesita adaptarlo.

La diferencia está en poder explicar el motivo. «La nueva plataforma no admite este patrón» describe una restricción técnica que se debe demostrar. «El flujo confunde a las personas» plantea un problema de producto que necesita evidencia y una decisión de quien responde por el producto. «Este paso parece antiguo» expresa una sospecha, no una autorización para retirarlo. Registrar esas razones evita que una adaptación necesaria se pierda entre preferencias y que una mejora deseable se cuele como requisito técnico.

Las guías de modernización también separan el traslado de una carga de trabajo de la mejora de sus capacidades y recomiendan identificar el resultado que justifica el cambio. Son marcos orientados principalmente a workloads y migraciones de plataforma; no definen por sí mismos cómo debe abordarse una transición entre frameworks o de escritorio a web. Aun así, refuerzan una pregunta práctica: ¿qué resultado aprobado requiere este cambio y qué modificación mínima lo consigue?

## Las decisiones necesitan dueño y plazo

El equipo técnico puede describir lo que hace el sistema, señalar riesgos y proponer alternativas. Producto debe resolver qué resultado funcional se quiere cuando las opciones cambian la experiencia o las reglas de negocio. El liderazgo técnico puede ayudar a separar dependencias, definir cortes que permitan avanzar y hacer visibles las consecuencias de cada opción. Estas responsabilidades pueden repartirse de otra forma según la organización, pero no deberían quedar implícitas.

Una tabla breve puede mantener el trabajo en movimiento:

| Situación | Decisión provisional | Responsable y siguiente paso |
| --- | --- | --- |
| Funcionalidad vigente y utilizada | Migrar conservando el comportamiento acordado. | Desarrollo define cómo verificar la paridad. |
| Funcionalidad posiblemente obsoleta | No retirarla por intuición. | Producto confirma uso, valor y retirada. |
| Mejora deseable pero no imprescindible | Registrar una iniciativa separada. | Producto prioriza cuándo abordarla. |
| Dependencia de otro equipo o sistema | Limitar el trabajo bloqueado y explicitar el impacto. | Asignar responsable y fecha de respuesta. |
| Riesgo de seguridad o incompatibilidad real | Evaluar y adaptar antes de continuar con ese flujo. | Desarrollo documenta evidencia y propone opciones; los responsables afectados deciden. |

El plazo no es una formalidad de seguimiento. Si una decisión no llega, el equipo necesita saber qué puede continuar sin ella, qué parte queda bloqueada y cuándo escalarla. Así se evita que una duda local detenga toda la transición o que el equipo tome una decisión de producto porque el calendario aprieta.

## Modernizar primero puede hacer más barato mejorar después

Separar una mejora no significa descartarla. Una migración puede crear límites más claros, contratos más explícitos y pruebas que faciliten cambiar el comportamiento en otra iteración. En algunos casos, la adaptación y el rediseño sí deben viajar juntos: por ejemplo, cuando mantener el proceso actual conservaría un riesgo relevante o cuando la nueva plataforma cambia de forma inevitable la interacción.

Lo útil es describir la excepción y su coste. Si se añade un rediseño ahora, ¿qué aumenta en esfuerzo, coordinación y verificación? Si se aplaza, ¿qué riesgo o trabajo duplicado se acepta? Cuando esas consecuencias son visibles, la decisión deja de depender del impulso de «aprovechar que estamos aquí» y puede tomarse con criterio de producto y técnico.

## Los agentes aceleran la ejecución, no acuerdan el producto

Las herramientas de IA pueden ayudar a localizar pantallas, reglas, dependencias y diferencias entre el sistema antiguo y el nuevo. También pueden acelerar cambios mecánicos una vez definidos los criterios. Eso reduce parte del coste de explorar e implementar, pero no convierte una funcionalidad encontrada en una funcionalidad que deba conservarse, retirarse o rediseñarse.

De hecho, si la implementación avanza más rápido, las decisiones pendientes pueden hacerse visibles antes. Un agente puede mostrar que dos rutas aplican reglas distintas; no sabe por sí solo cuál expresa la política vigente. Puede proponer un cambio de interfaz; no puede decidir si mejora el proceso del negocio. Esas conclusiones necesitan evidencia y responsables humanos.

## Una migración necesita un límite que se pueda explicar

Antes de iniciar cada corte, conviene poder responder tres preguntas: qué comportamiento se traslada, qué excepciones se aceptan y qué cambios quedan fuera. Si no hay respuesta para una funcionalidad, se registra la duda con responsable y fecha, y se avanza por las partes que sí están claras.

Modernizar no exige reinventar todos los procesos a la vez. Exige saber qué se conserva, qué se elimina y qué cambia, además de por qué y quién lo ha decidido. **La pregunta para la próxima migración es sencilla: qué parte del retraso viene de problemas técnicos y qué parte de decisiones de producto que todavía no tienen dueño?**

## Referencias

- [Microsoft Cloud Adoption Framework: Modernization preparation](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/modernize/prepare-organization-cloud-modernization) — diferencia migración y modernización, y describe responsabilidades en iniciativas de modernización.
- [Martin Fowler: Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) — analiza objetivos, partición gradual y entrega incremental al modernizar sistemas legacy.
- [AWS Prescriptive Guidance: Migration strategies](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html) — referencia de estrategias para migraciones de workloads a AWS, no una taxonomía universal para migraciones de producto.
