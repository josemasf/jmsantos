---
title: "De las skills de Matt a las skills de tu equipo"
description: "Cuándo adaptar una skill externa, cómo conservar su intención y dónde colocar cada regla para construir un sistema de trabajo propio."
date: 2026-10-20
tags: [IA, agentes, skills, equipos, arquitectura, documentación]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 11
image:
  src: /images/blog/62-adaptar-skills-equipo-friccion-repetida/adaptar-skill-equipo.png
  alt: Un equipo prueba una skill general en su flujo real y adapta sus instrucciones con términos, herramientas y acuerdos propios del repositorio.
  width: 1536
  height: 1024
---

Instalar una skill y cambiarla inmediatamente puede parecer una forma de adaptarla al equipo. Pero personalizar antes de probarla significa que aún no sabemos qué parte aporta valor ni qué fricción queremos resolver. Es fácil acabar manteniendo una versión propia que se aleja de la práctica original sin evidencias de que funcione mejor.

El repositorio [`mattpocock/skills`](https://github.com/mattpocock/skills) está pensado para permitir uso gestionado o copia editable. Esa elección plantea dos necesidades diferentes: consumir una colección y recibir sus cambios, o disponer de los archivos para inspeccionarlos y adaptarlos. No es necesario personalizar desde el primer día. Primero usa una skill en tareas reales y observa qué instrucciones se repiten, qué contexto falta y qué resultados necesitan corrección manual.

## Adapta a partir de una fricción que vuelve

Una señal para personalizar puede ser que TDD omita sistemáticamente los seams que el equipo considera importantes, que el code review no consulte un estándar local o que la skill de diagnóstico no use las herramientas de observabilidad del proyecto. Una ocurrencia aislada quizá no justifique mantener una variante; un patrón repetido permite identificar una regla que el flujo debería hacer visible.

El cambio debería conservar el propósito de la skill y añadir el contexto local necesario: convenciones del dominio, comandos existentes, tecnología o límites que no aparecen en una guía general. Si la personalización altera el objetivo original o mezcla varias tareas, considera una skill propia más específica.

## Coloca cada aprendizaje en el lugar adecuado

Las skills no son el contenedor para todas las reglas. Una orientación sobre dónde están los módulos pertenece al `AGENTS.md` de navegación; la terminología del producto, al glosario; una decisión arquitectónica duradera, a un ADR; una regla mecánica, al lint, compilador, test o CI; el criterio que requiere juicio puede vivir en estándares; un proceso repetible, en un `SKILL.md`.

Esta distinción evita que una skill se convierta en un manual del repositorio. La skill organiza una actividad y puede apuntar a la fuente de verdad. El glosario no debería incluir instrucciones de implementación, y `AGENTS.md` no debería copiar toda la documentación que cada tarea podría necesitar.

## Mantén accesible el origen y actualiza con intención

Con un plugin gestionado, las actualizaciones pueden llegar automáticamente, pero la copia local puede no ser el lugar donde se edita. Con archivos editables, el equipo puede cambiar y versionar las instrucciones junto al código, aunque debe decidir cuándo traer mejoras del proyecto original. El README del repositorio describe actualmente ambos caminos y sus diferencias.

Antes de adaptar, conserva una referencia a la fuente y anota qué problema local motivó el cambio. Cuando actualices la skill, vuelve a comprobar la adaptación: una nueva versión puede resolver la fricción que originó el fork o modificar el flujo de forma incompatible. No mantener el origen hace difícil separar decisiones propias de cambios upstream.

## Una skill propia es una decisión de equipo

Una variante local merece mantenerse cuando contiene conocimiento que el equipo posee y la skill original no puede conocer: estructura de repositorios, herramientas aprobadas, contratos internos o un proceso repetible de ese dominio. Si la diferencia es solo una preferencia de redacción, quizá no compense mantener otra copia.

La progresión es observar, acordar, adaptar y revisar. Así las skills dejan de ser una caja negra externa, pero tampoco se convierten en un catálogo de instrucciones particulares improvisadas. Un buen sistema combina prácticas reutilizables con contexto local en el lugar donde realmente ayuda a trabajar.
