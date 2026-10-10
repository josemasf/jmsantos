---
title: "Matt Pocock Skills: cómo empezar sin cambiar todo tu proceso"
description: "Qué ofrece el repositorio mattpocock/skills, cómo elegir entre un plugin gestionado y archivos editables, y una forma gradual de incorporarlo a un proyecto real."
date: 2026-10-10
tags: [IA, agentes, skills, desarrollo de software, productividad, ingeniería]
category: Desarrollo profesional
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 1
image:
  src: /images/blog/52-matt-pocock-skills-flujo-desarrollo/matt-pocock-skills-flujo-desarrollo.png
  alt: Una persona organiza pequeñas tarjetas de instrucciones reutilizables alrededor de un flujo de trabajo de software, con un asistente que ayuda a preparar una tarea y una comprobación final.
  width: 1536
  height: 1024
---

Las skills de un agente pueden parecer otra colección de comandos que hay que aprender antes de ponerse a trabajar. Esa impresión cambia cuando se entienden como procedimientos pequeños y reutilizables: una forma de guiar una tarea que ya sabemos hacer, con contexto suficiente para que el modelo y la persona sigan un criterio compartido.

El repositorio [`mattpocock/skills`](https://github.com/mattpocock/skills) reúne prácticas de ingeniería que Matt Pocock utiliza en su trabajo con agentes. Su propuesta no es entregar un proceso cerrado que haya que seguir de principio a fin. Las skills están pensadas para ser pequeñas, componibles y adaptables; cada equipo puede introducirlas cuando resuelven una fricción concreta.

Esta serie parte de ese repositorio para explorar cómo incorporar sus ideas a un flujo de desarrollo real. No pretende sustituir la documentación de Matt ni presentar una receta universal. El repositorio evoluciona, así que conviene consultar el [README y las skills actuales](https://github.com/mattpocock/skills) antes de instalar o aplicar una recomendación. Para seguir sus explicaciones y novedades, también puedes acudir a [AI Hero](https://www.aihero.dev/), su [canal de YouTube](https://www.youtube.com/@mattpocockuk), [X](https://x.com/mattpocockuk) o [LinkedIn](https://www.linkedin.com/in/mapocock/).

## Una skill codifica un procedimiento que ya tiene un propósito

Una instrucción extensa dentro del prompt de cada sesión es difícil de mantener y fácil de olvidar. Una skill empaqueta un procedimiento con un objetivo y un contexto reconocibles, para que se pueda reutilizar cuando haga falta. Por ejemplo, antes de implementar un cambio con requisitos poco claros, una skill de _grilling_ ayuda a explorar el problema y a hacer explícitas las decisiones que todavía faltan.

El valor no está en invocar más comandos. Está en reducir instrucciones improvisadas y repetir prácticas de ingeniería que mejoran el trabajo. Si una skill no encaja con el proyecto, se adapta o se deja de usar; su presencia en el repositorio no la convierte en una obligación.

En el catálogo hay procedimientos que la persona activa de forma explícita, como una sesión para aclarar requisitos, y disciplinas que el modelo puede aplicar cuando detecta una tarea adecuada, como TDD o diagnóstico de errores. Esta diferencia afecta a cómo se usa cada skill: unas orquestan el flujo de trabajo, otras expresan un criterio reutilizable. Los detalles concretos están descritos en los archivos `SKILL.md` del repositorio.

## Elige cómo instalar según lo que necesites controlar

El README mantiene dos vías generales. Un plugin gestionado resulta cómodo cuando se quiere consumir el conjunto y recibir sus actualizaciones con el mecanismo de la herramienta. La instalación mediante [`skills.sh`](https://skills.sh/mattpocock/skills) copia archivos editables al proyecto, lo que facilita inspeccionarlos y adaptarlos, pero requiere ocuparse de las actualizaciones. No conviene instalar ambas vías para el mismo agente, porque las skills pueden quedar duplicadas.

Las instrucciones cambian según el agente, por lo que conviene copiar los comandos vigentes del README en el momento de la instalación. En el caso de Codex, el repositorio actualmente propone añadir el marketplace e instalar el plugin:

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

El plugin se actualiza al iniciar Codex. Para disponer de archivos editables, el README propone usar `skills` y elegir el agente de destino durante la instalación:

```bash
npx skills@latest add mattpocock/skills -a codex
```

En ese caso, la actualización se ejecuta manualmente con `npx skills@latest update`; si se quieren incorporar skills nuevas del repositorio, se vuelve a ejecutar `add` y se seleccionan. La elección depende de una necesidad práctica: plugin gestionado si prima consumir y actualizar con comodidad; copia editable si se quiere estudiar, cambiar y mantener el contenido dentro del propio proyecto.

## Configura el repositorio antes de adoptar el flujo

Una vez instalada la colección, el README recomienda ejecutar `/setup-matt-pocock-skills` una vez por repositorio. Ese procedimiento pregunta qué gestor de tareas se utiliza, qué etiquetas aplica el equipo al clasificar tickets y dónde se deben guardar los documentos que se generen. Son decisiones del proyecto, así que la configuración evita que las skills asuman una estructura que no existe.

La configuración inicial debería ser breve y concreta. No hace falta migrar el sistema de tareas, reorganizar la documentación ni adoptar un catálogo entero para probar una primera skill. Si el equipo usa GitHub Issues, por ejemplo, ese contexto debería reflejarse en la configuración en lugar de introducir una convención paralela.

## Empieza con un flujo pequeño

Una primera prueba puede limitarse a aclarar un requisito y después implementar el cambio:

```text
requisito
   ↓
/grill-with-docs
   ↓
decisiones suficientemente claras
   ↓
/implement
```

`/grill-with-docs` explora lo que se quiere construir y ayuda a registrar conocimiento de dominio que debería sobrevivir a la conversación, como términos compartidos o decisiones de arquitectura. `/implement` guía la ejecución de una tarea. No todos los cambios necesitan pasar por ambos pasos: una corrección pequeña y bien definida puede ir directamente a implementación; una tarea con reglas ambiguas se beneficia de aclararlas antes.

La sesión de preguntas tampoco debe convertirse en un interrogatorio interminable. La persona que dirige el trabajo puede responder, corregir supuestos y pedir una propuesta concreta cuando una decisión sea difícil de tomar solo con conversación. Si para decidir hace falta observar una interacción, puede ser más útil construir un prototipo pequeño y volver después a concretar el comportamiento.

## Añade complejidad cuando aparezca la necesidad

Después de probar el flujo en varias tareas, observa dónde se atasca el trabajo. Si las decisiones son claras, pero la implementación se vuelve difícil de revisar, puede tener sentido reforzar TDD y la revisión de código. Si una iniciativa no cabe en una sesión, entonces se puede explorar cómo convertir decisiones en una especificación y tickets autocontenidos. Cada pieza debería responder a un problema que el equipo ya ha visto.

Este orden también evita convertir las skills en una nueva checklist. Ejecutarlas todas en cada tarea consume contexto y atención, y puede añadir documentación sin mejorar decisiones ni feedback. El flujo debería ser proporcional al trabajo: lo mínimo necesario para entenderlo, implementarlo y comprobarlo con confianza.

Durante la serie iremos desde el alineamiento inicial y las decisiones de dominio hasta specs, tickets, TDD, arquitectura, bugs y delegación. Más adelante veremos cómo adaptar las skills al equipo y cómo aumentar la autonomía con límites adecuados. Cada entrega utilizará el repositorio actual como referencia y distinguirá entre las instrucciones originales y las decisiones que tomemos al aplicarlas.

La idea para empezar es sencilla: instala una sola vía para tu agente, configura el repositorio y prueba una skill en un problema real. Si mejora el trabajo, conserva el aprendizaje; si introduce pasos que no aportan, ajústala. El objetivo no es hablar más con la IA, sino crear un entorno donde buenas prácticas puedan repetirse sin tener que improvisarlas desde cero.
