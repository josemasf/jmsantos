---
title: "Migrar un legacy multi-repositorio con agentes: casos de uso antes que pantallas"
description: "Cómo descubrir el comportamiento de una aplicación de escritorio, acordar contratos y migrar casos de uso completos entre repositorios con ayuda de agentes."
date: 2026-10-28
tags: [IA, agentes, legacy, migración, .NET, Vue, arquitectura]
category: Arquitectura
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 19
image:
  src: /images/blog/70-migracion-legacy-multi-repo-agentes/migracion-legacy-multi-repo.png
  alt: Un equipo analiza una aplicación de escritorio y sus datos, define un contrato y migra un caso de uso completo hacia una interfaz web con validación de paridad.
  width: 1536
  height: 1024
---
issue: 65

Migrar una aplicación de escritorio a web no consiste en reemplazar cada formulario por una pantalla equivalente. En un sistema legacy, las reglas de negocio pueden vivir en la interfaz, los accesos a datos pueden llamar directamente a procedimientos almacenados y el comportamiento puede depender de varios repositorios. Generar una nueva UI rápidamente no resuelve qué hace realmente el sistema ni dónde deberían vivir sus responsabilidades.

La [issue #64 del repositorio](https://github.com/josemasf/jmsantos/issues/64) plantea una transición concreta: una aplicación de escritorio .NET, una base de datos con stored procedures, un backend .NET y un frontend Vue, organizados en repositorios independientes. El eje del artículo es migrar casos de uso completos, no mapear formularios uno a uno.

## Empieza por descubrir el caso de uso

Para un caso como consultar pedidos, crear o cancelar una operación, el análisis debe seguir el recorrido actual: punto de entrada en el escritorio, reglas aplicadas, permisos, procedimientos almacenados, estados y efectos secundarios. Un analista de legacy puede recopilar evidencia; un analista de base de datos puede explicar las consultas y escrituras. Esos perfiles condensan contexto para que frontend y backend no tengan que leer cada repositorio completo.

La investigación debe distinguir comportamiento observado de comportamiento deseado. Una regla implementada en un formulario puede ser accidental o contradictoria con otra ruta. El equipo decide qué conservar, corregir o dejar fuera, y registra términos y excepciones para que los agentes no transformen código existente en una especificación incuestionable.

## Encapsula responsabilidades detrás de un contrato

Una arquitectura de transición puede dirigir Vue por HTTP a un backend .NET que concentra casos de uso, validaciones y acceso a datos, mientras mantiene temporalmente los stored procedures:

```text
Vue → API .NET → caso de uso y validaciones → stored procedure
```

La primera fase no necesita eliminar procedimientos almacenados por principio. Se pueden clasificar según si solo acceden a datos, combinan persistencia con lógica, contienen reglas críticas o parecen no tener consumidores conocidos. La extracción de reglas puede priorizarse después, con evidencia sobre su función y riesgo.

El contrato HTTP permite que frontend y backend avancen en paralelo una vez que se han acordado entrada, salida, errores y estados relevantes. Frontend puede simular el contrato con MSW mientras backend implementa la ruta real. La integración compara los dos recorridos y descubre divergencias antes de migrar la siguiente capacidad.

## Migra en cortes verticales y comprueba paridad

Evita construir primero todas las APIs, después todas las pantallas y dejar la integración para el final. Una unidad completa —consultar pedidos o crear un pedido— atraviesa descubrimiento, contrato, backend, frontend e integración. Después de validar ese camino, puede comenzar el siguiente caso de uso.

Cuando sea viable, characterization o parity tests ejecutan el mismo input sobre el comportamiento legacy y el nuevo backend y comparan resultados. Esto resulta especialmente útil para cálculos, descuentos, impuestos, stock, estados, permisos o facturación. Una diferencia no implica automáticamente que la versión nueva esté mal: obliga a decidir si se detectó un bug antiguo o una pérdida de comportamiento intencionada.

## Coordina repositorios sin mezclar todo el contexto

GitHub puede conservar issues, dependencias y contratos de trabajo; un workspace multi-root en VS Code facilita la investigación local sin convertir los repositorios en uno solo. Un repositorio de coordinación opcional puede guardar specs, glosario y ADR compartidos si el equipo necesita una fuente de verdad común.

Los agentes no tienen por qué leer todas las bases de código. El analista de legacy y el de datos pueden producir hallazgos citados y decisiones; después los implementadores trabajan con el contrato y el ticket que necesitan. Un revisor de migración puede comprobar paridad y compatibilidad entre los repositorios. Cada rol reduce el contexto requerido, pero las decisiones y los contratos siguen siendo visibles para el equipo.

El orden es descubrir, decidir, especificar, cortar por caso de uso, implementar, integrar y comparar. Los agentes pueden acelerar la exploración y ejecución; no resuelven por sí solos si una diferencia es una regla de negocio, un bug histórico o un cambio de producto. El cuello de botella continúa siendo entender y delimitar el sistema antes de reemplazarlo.
