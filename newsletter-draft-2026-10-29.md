# Newsletter quincenal · 2026-10-29

**Estado:** Newsletter Curator completado; Astro Content Writer y Editorial Reviewer han revisado el texto. Pendiente de aprobación del autor.
**Periodo de artículos:** 2026-10-15 (incluido) — 2026-10-29 (excluido).
**Destinatarios:** lectores suscritos voluntariamente a la newsletter del blog.

## Apertura

En las últimas dos semanas, el blog ha seguido una pregunta que afecta cada vez más al trabajo frontend: si un agente puede producir cambios en el repositorio, ¿qué necesita el equipo para entenderlos y decidir si son seguros? Los artículos recientes recorren esa pregunta desde la preparación de tareas hasta la arquitectura, las pruebas y la revisión. La idea que los conecta es sencilla: la velocidad de generar código solo aporta valor cuando el contexto y el feedback permiten mantenerlo.

## Lo publicado en las últimas dos semanas
- **[GitHub Issues como grafo de trabajo para un equipo de agentes](https://josemariasantos.com/blog/github-issues-grafo-trabajo-agentes/)** (2026-10-26) — Cómo relacionar specs, tickets implementables y dependencias para que personas y agentes trabajen sobre una frontera lista y compartan una fuente de verdad.
- **[Delegar trabajo en GitHub Agents sin perder el control](https://josemariasantos.com/blog/github-agents-delegar-con-control/)** (2026-10-25) — Cómo preparar tareas agent-ready, combinar roles con skills reutilizables y revisar el trabajo asíncrono que vuelve en forma de pull request.
- **[Cómo medir si trabajar con agentes mejora realmente el desarrollo](https://josemariasantos.com/blog/medir-impacto-agentes-desarrollo/)** (2026-10-24) — Qué métricas ayudan a evaluar el efecto de los agentes en el flujo de entrega y por qué contar líneas, prompts o skills puede incentivar el comportamiento equivocado.
- **[¿Cuándo no delegar? Ajusta la autonomía al riesgo del cambio](https://josemariasantos.com/blog/autonomia-agentes-riesgo-reversibilidad/)** (2026-10-23) — Un marco para decidir cuánto trabajo puede delegarse según la reversibilidad, el impacto potencial y la evidencia disponible.
- **[Human in the loop: prepara los pasos que un agente no debe ejecutar solo](https://josemariasantos.com/blog/human-in-the-loop-wizard-pasos-sensibles/)** (2026-10-22) — Cómo diseñar flujos donde el agente prepara y verifica el trabajo, mientras una persona realiza acciones sensibles, externas o difíciles de revertir.
- **[Cómo crear tu primera skill propia para un agente](https://josemariasantos.com/blog/crear-primera-skill-propia-agentes/)** (2026-10-21) — Un método para convertir una instrucción repetida en una skill pequeña, activable y comprobable con tareas reales del proyecto.
- **[De las skills de Matt a las skills de tu equipo](https://josemariasantos.com/blog/adaptar-skills-equipo-friccion-repetida/)** (2026-10-20) — Cuándo adaptar una skill externa, cómo conservar su intención y dónde colocar cada regla para construir un sistema de trabajo propio.
- **[Escribir código ya es barato. Mantenerlo sigue siendo carísimo.](https://josemariasantos.com/blog/ia-escribir-codigo-barato-entenderlo-caro/)** (2026-10-20) — La IA acelera la producción de código, pero no reemplaza el criterio necesario para integrarlo, validarlo y mantenerlo en un producto real.
- **[Research técnico: investiga antes de convertir una opinión en arquitectura](https://josemariasantos.com/blog/research-fuentes-primarias-arquitectura/)** (2026-10-19) — Un flujo para investigar decisiones técnicas con fuentes primarias, conservar los hallazgos y llevar la evidencia a una decisión o ADR.
- **[Tu repositorio también forma parte del contexto del agente](https://josemariasantos.com/blog/repositorio-contexto-agente/)** (2026-10-18) — Cómo la navegación, el lenguaje compartido, la arquitectura, las pruebas y el tooling determinan cuánto puede hacer un agente con seguridad.
- **[Retro para agentes: mejora el entorno, no solo el código](https://josemariasantos.com/blog/retro-agentes-mejorar-entorno-ingenieria/)** (2026-10-17) — Cómo convertir errores repetidos de agentes en mejoras de instrucciones, tooling, documentación y estándares sin inflar AGENTS.md.
- **[Wayfinder: decide el camino antes de abordar una iniciativa grande](https://josemariasantos.com/blog/wayfinder-iniciativas-grandes-decisiones/)** (2026-10-16) — Cómo usar Wayfinder para convertir una iniciativa incierta en un mapa compartido de decisiones y avanzar hasta que el trabajo esté listo para especificarse.
- **[Arquitectura para agentes: reduce la fricción antes de delegar más](https://josemariasantos.com/blog/arquitectura-agentes-reducir-friccion-codebase/)** (2026-10-15) — Por qué los agentes heredan los costes de una codebase difícil de navegar y cómo mejorar seams, interfaces y locality antes de aumentar su autonomía.


## Una idea útil

Un buen criterio para decidir qué delegar es preguntar cuánto cuesta detectar y revertir un error. Una tarea acotada, con pruebas observables y cambios reversibles, admite más autonomía. Si afecta datos, seguridad o decisiones difíciles de deshacer, conviene dividirla en pasos, exigir evidencia intermedia y reservar la acción final a una persona.


## Novedades para seguir

- **Vue:** Vue 3.5.44 se publicó el 13 de octubre y Vue 3.6.0-rc.13, el 23 de octubre. Esta última sigue siendo una candidata, así que conviene tratarla como pre lanzamiento. [Releases](https://github.com/vuejs/core/releases)
- **TypeScript:** TypeScript 7.0 ya figura como versión actual y 7.1 está en beta desde el 20 de octubre. La beta añade soporte para atributos de importación en declaraciones de módulos ambientales y `--target es2026`; al ser beta, conviene probarla en una rama. [Descargas](https://www.typescriptlang.org/download/) · [Anuncio de TypeScript 7.1 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/)
- **Testing:** Vitest 5 añade Trace View para Browser Mode y vitest doctor para explorar configuraciones alternativas. Las mejoras de velocidad publicadas dependen de la suite y su configuración. [Anuncio oficial](https://vitest.dev/blog/vitest-5)
- **IA:** Copilot Fusion pasó a disponibilidad general el 28 de octubre. En vez de elegir un modelo por tarea, el sistema los enruta y coordina según el nivel de esfuerzo; cada modelo utilizado se factura a su tarifa estándar, así que conviene tener en cuenta el coste. [Anuncio oficial de GitHub](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion/)

**Control editorial:** Newsletter Curator preparó esta edición con el generador local; Astro Content Writer revisó tono, selección y fuentes; Editorial Reviewer concluyó «listo como borrador para aprobación del autor». Los 13 enlaces a publicaciones y las cinco fuentes técnicas devolvieron HTTP 200. La plantilla Classic/Text Only documentada incluye enlace de baja y dirección en el pie; queda comprobar ese pie en la vista previa de Kit antes de enviar. Sin publicidad ni avances de borradores privados.
