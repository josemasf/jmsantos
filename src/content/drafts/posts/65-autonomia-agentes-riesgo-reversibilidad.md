---
title: "¿Cuándo no delegar? Ajusta la autonomía al riesgo del cambio"
description: "Un marco para decidir cuánto trabajo puede delegarse según la reversibilidad, el impacto potencial y la evidencia disponible."
date: 2026-10-23
tags: [IA, agentes, seguridad, riesgo, arquitectura, desarrollo de software]
category: Arquitectura
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 14
image:
  src: /images/blog/65-autonomia-agentes-riesgo-reversibilidad/autonomia-agentes-riesgo.png
  alt: Una persona compara dos cambios, uno pequeño y reversible y otro de gran impacto, y ajusta cuánto control delega según las comprobaciones disponibles.
  width: 1536
  height: 1024
---
issue: 65

Preguntar «¿puede el agente hacerlo?» no basta para decidir si debería hacerlo sin supervisión. Una refactorización protegida por tests puede ser fácil de revisar y revertir; una migración de datos o un cambio de autorización puede afectar a usuarios de formas difíciles de reparar. El nivel de delegación debe depender de qué puede salir mal, a quién afecta y qué evidencia tenemos para detectar el error.

La skill [`pr`](https://github.com/mattpocock/skills/tree/main/skills/engineering/pr) ofrece vocabulario útil para esa conversación: si el cambio es una puerta de una o dos direcciones, cuál es su _blast radius_ y qué evidencia demuestra que funciona. Aunque la skill aplica ese análisis al cuerpo de un pull request, las mismas preguntas ayudan a definir límites de autonomía antes de empezar.

## Piensa en reversibilidad e impacto

Una puerta de dos direcciones permite cambiar de idea con un coste asumible; una de una dirección tiene consecuencias difíciles de revertir. No es una clasificación binaria perfecta: una migración puede tener rollback técnico y seguir siendo difícil de deshacer por efectos de negocio, o una UI puede parecer reversible pero cambiar un contrato usado por varios clientes.

El _blast radius_ describe qué partes del sistema, usuarios o procesos pueden verse afectados si algo sale mal. Un cambio acotado a una pantalla interna no tiene el mismo alcance que modificar facturación, permisos o datos compartidos. El riesgo aumenta cuando el impacto potencial es grande y la recuperación no está clara.

## Ajusta la delegación a las salvaguardas

Bug reproducible, feature pequeña con contrato claro o refactor protegido por una suite fiable suelen ser buenos candidatos para delegación amplia: el agente puede implementar, ejecutar las comprobaciones y devolver un diff revisable. La calidad de las pruebas y el aislamiento del cambio reducen el coste de detectar un error.

Autenticación, autorización, pagos, migraciones destructivas y decisiones arquitectónicas difíciles de revertir piden controles adicionales. El agente puede investigar, preparar un plan, generar código y enumerar verificaciones; una persona puede revisar primero las decisiones de diseño, exigir una copia de seguridad o ejecutar manualmente el paso de producción. La supervisión puede situarse en momentos concretos, no necesariamente durante cada edición.

Una escala práctica considera tres dimensiones:

| Condición | Más delegación | Más supervisión |
| --- | --- | --- |
| Claridad | Contrato y aceptación explícitos | Reglas de negocio todavía abiertas |
| Reversibilidad | Cambio fácil de retirar | Migración o estado externo difícil de recuperar |
| Evidencia | Tests rápidos y deterministas | Validación manual o datos de producción necesarios |

No es una puntuación automática. Sirve para hacer explícito por qué un cambio puede ejecutarse de forma autónoma y qué controles reducen el riesgo.

## Pide evidencia proporcional a las consecuencias

Para un cambio reversible, puede bastar con tests, lint, revisión del diff y un flujo de interfaz. Para una migración de esquema, también pueden hacer falta una copia de seguridad, un ensayo con datos representativos, límites de tiempo y un plan de rollback. Para permisos, conviene comprobar tanto las rutas autorizadas como las denegadas, incluyendo las comprobaciones del servidor.

Si no existe una forma fiable de verificar la operación, el agente no debería transformar una suposición en una acción irreversible. Puede preparar lo que se necesita para que la persona decida con información concreta. El objetivo no es reducir autonomía por defecto, sino aumentarla donde claridad, reversibilidad y feedback la hacen responsable.

Una política útil no dice «agentes sí» o «agentes no». Define qué trabajo puede avanzar, qué evidencia debe producirse y en qué punto se requiere una decisión humana. Ese límite puede cambiar a medida que mejora la arquitectura, aparecen tests y el equipo aprende qué tareas delegadas son fiables.
