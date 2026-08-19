---
title: "Qué es un ADR y por qué tu equipo debería usarlos"
description: "Guía práctica sobre Architecture Decision Records (ADR): qué son, cuándo crearlos, qué deben contener, y cómo implementar el proceso en tu equipo de desarrollo."
date: 2025-12-12
tags: [arquitectura, ADR, documentación, equipos, buenas prácticas]
category: Arquitectura
image:
  src: /images/blog/09-que-es-un-adr-arquitectura/adr-arquitectura.png
  alt: Ilustración de un documento de decisión que conecta opciones arquitectónicas y valida una ruta.
  width: 1536
  height: 1024
---

Un **Architecture Decision Record (ADR)** es un documento que describe una elección arquitectónica que hace el equipo sobre un aspecto importante del software que está construyendo. No es un RFC, no es un diseño técnico — es el **registro de una decisión ya tomada**, con su contexto y consecuencias.

## ¿Por qué necesitas ADRs?

¿Alguna vez te has preguntado "por qué se hizo así"? ¿O has visto a un nuevo miembro del equipo intentar cambiar algo que se decidió hace meses por razones que nadie recuerda?

Los ADRs resuelven exactamente ese problema. Son la **memoria institucional** de las decisiones técnicas.

## ¿Cuándo crear un ADR?

Cada vez que el equipo toma una decisión que sea **arquitectónicamente significativa**:

- **Estructura**: patrones como microservicios, monolito, micro-frontends
- **Requisitos no funcionales**: seguridad, alta disponibilidad, tolerancia a fallos
- **Dependencias**: acoplamiento entre componentes
- **Interfaces**: APIs y contratos publicados
- **Técnicas de construcción**: librerías, frameworks, herramientas y procesos

Las entradas más comunes al proceso de ADR son los **requisitos funcionales y no funcionales** del proyecto.

## ¿Qué debe contener un ADR?

Como mínimo, tres secciones:

### 1. Contexto

Las circunstancias que provocan la decisión. ¿Qué problema existe? ¿Qué limitaciones hay? ¿Qué opciones se consideraron?

```markdown
## Contexto

Los equipos están usando tres patrones diferentes para gestionar
notificaciones en la UI, generando inconsistencia y confusión.
```

### 2. Decisión

La decisión en sí misma, clara y sin ambigüedades.

```markdown
## Decisión

Adoptamos un componente unificado `AlertsHandler` que gestiona
todos los tipos de notificación (Alert, Banner, Snackbar) según
las guías de Material Design.
```

### 3. Consecuencias

Los efectos de la decisión — tanto positivos como negativos.

```markdown
## Consecuencias

### Positivas

- Un solo componente para todas las notificaciones
- Consistencia visual entre módulos

### Negativas

- Los equipos deben migrar sus implementaciones actuales
- Curva de aprendizaje para la nueva API
```

## El poder del "por qué"

> Uno de los aspectos más poderosos de la estructura de ADR es que **se centra en el motivo de la decisión**, no en cómo se implementó.

Comprender **por qué** se tomó una decisión facilita que:

- Nuevos miembros del equipo la adopten
- Otros arquitectos no la anulen sin contexto
- El equipo pueda revisarla cuando cambien las circunstancias

## Ciclo de vida de un ADR

Los ADRs tienen estados:

```
[Borrador] → [Propuesto] → [Aceptado] → [Sustituido/Deprecado]
```

**Regla clave**: cuando el equipo acepta un ADR, **se vuelve inmutable**. Si nuevos conocimientos requieren una decisión diferente, se crea un nuevo ADR que sustituye al anterior, enlazándolo.

## Proceso de adopción

### 1. Identificación

Cualquier miembro del equipo puede identificar la necesidad de un ADR cuando:

- Hay desacuerdo sobre cómo resolver algo
- Se va a tomar una decisión que afecta a múltiples equipos
- Se elige una tecnología o patrón nuevo

### 2. Redacción

Un miembro del equipo redacta el ADR usando una plantilla estándar.

### 3. Revisión

El equipo revisa el ADR en una reunión o de forma asíncrona. Se discuten las alternativas y consecuencias.

### 4. Aceptación

El equipo acepta (o rechaza) el ADR. Si se acepta, se vuelve parte del registro de decisiones.

### 5. Revisión periódica

Los ADRs deben revisarse periódicamente para verificar que siguen siendo válidos ante cambios en el contexto.

## Plantilla mínima

```markdown
# ADR-XXX: [Título descriptivo]

**Estado**: [Borrador | Propuesto | Aceptado | Sustituido por ADR-YYY]
**Fecha**: YYYY-MM-DD
**Autor**: [Nombre]

## Contexto

[¿Qué problema existe? ¿Qué opciones hay?]

## Decisión

[¿Qué decidimos hacer?]

## Consecuencias

### Positivas

- [...]

### Negativas

- [...]

## Alternativas consideradas

### Alternativa 1: [Nombre]

**Descartada** porque: [razón]

### Alternativa 2: [Nombre]

**Descartada** porque: [razón]
```

## Ejemplos reales de ADRs útiles

- **Cuándo usar `<iframe>` para integrar servicios de terceros** → evalúa alternativas (API, redirect, scripts) con consecuencias de seguridad y rendimiento.
- **Estandarización de tablas de datos** → define criterios mínimos obligatorios para todos los equipos.
- **Cuándo usar Alert, Banner o Snackbar** → clarifica el uso de cada componente de notificación según Material Design.

## Conclusiones

1. **Los ADRs no son burocracia** — son la documentación más valiosa que puede tener un equipo.
2. **Escríbelos cuando la decisión importa**, no para todo.
3. **Céntrate en el "por qué"**, no en el "cómo".
4. **Hazlos inmutables** — si cambia el contexto, crea uno nuevo.
5. **Revísalos periódicamente** — un ADR desactualizado es peor que no tener ADR.

## Recursos

- [ADR GitHub Organization](https://adr.github.io/)
- [AWS Prescriptive Guidance: ADRs](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/welcome.html)
- [Michael Nygard's ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record)
