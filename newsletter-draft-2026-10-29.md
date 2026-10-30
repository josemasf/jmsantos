<!-- BORRADOR INTERNO · NO ENVIAR NI PUBLICAR SIN REVISIÓN EDITORIAL -->
**Estado:** validado por Astro Content Writer y Editorial Reviewer; sincronizado como borrador privado en Kit. Pendiente de aprobación del autor y revisión visual antes de cualquier envío.
**Fecha prevista de envío:** 2026-11-02.
**Periodo de artículos:** 2026-10-19 (incluido) — 2026-11-02 (excluido).
**Destinatarios:** lectores suscritos voluntariamente.

## Asunto y preheader · metadatos para Kit
**Asunto:** Migrar por casos de uso, no por pantallas
**Preheader:** Qué necesita el equipo para recuperar el comportamiento antes de rehacer una interfaz.

<!-- INICIO DEL CUERPO EDITORIAL: revisar y copiar solo tras aprobación -->
*Lo que aprendo construyendo software · 2 de noviembre de 2026*

# Antes de migrar pantallas, recupera el comportamiento

En una migración de escritorio a web, copiar formularios puede conservar la superficie y perder reglas escondidas en permisos, procedimientos o flujos secundarios. El reto frontend es descubrir qué hace cada caso de uso y pactar el contrato con backend antes de construir otra interfaz. Así se puede migrar un recorrido completo y comprobar diferencias antes de extender el patrón.

## Lectura destacada
**[Migrar un legacy multi-repositorio con agentes: casos de uso antes que pantallas](https://josemariasantos.com/blog/migracion-legacy-multi-repo-agentes/)** — Cómo descubrir el comportamiento de una aplicación de escritorio, acordar contratos y migrar casos de uso completos entre repositorios con ayuda de agentes.

La lectura propone seguir reglas y efectos de una operación, acordar entrada, salida y errores entre Vue y .NET, y migrar una capacidad vertical. Contrastar el resultado con el legado convierte cada diferencia en una decisión visible. [Lee el artículo](https://josemariasantos.com/blog/migracion-legacy-multi-repo-agentes/).

## Para profundizar
- **[Evolucionar una arquitectura sin reescribir el sistema](https://josemariasantos.com/blog/evolucionar-arquitectura-sin-reescribir-sistema/)** — Cambiar límites concretos y conservar comportamiento con pasos reversibles.
- **[Paralelismo con agentes: sesiones aisladas y trabajo integrable](https://josemariasantos.com/blog/paralelismo-agentes-worktrees-contexto/)** — Aislar tickets y paralelizar cuando sus dependencias estén resueltas.


## Lecturas rápidas
- [GitHub Issues como grafo de trabajo para un equipo de agentes](https://josemariasantos.com/blog/github-issues-grafo-trabajo-agentes/)
- [Delegar trabajo en GitHub Agents sin perder el control](https://josemariasantos.com/blog/github-agents-delegar-con-control/)
- [Cómo medir si trabajar con agentes mejora realmente el desarrollo](https://josemariasantos.com/blog/medir-impacto-agentes-desarrollo/)
- [¿Cuándo no delegar? Ajusta la autonomía al riesgo del cambio](https://josemariasantos.com/blog/autonomia-agentes-riesgo-reversibilidad/)
- [Human in the loop: prepara los pasos que un agente no debe ejecutar solo](https://josemariasantos.com/blog/human-in-the-loop-wizard-pasos-sensibles/)
- [Cómo crear tu primera skill propia para un agente](https://josemariasantos.com/blog/crear-primera-skill-propia-agentes/)
- [De las skills de Matt a las skills de tu equipo](https://josemariasantos.com/blog/adaptar-skills-equipo-friccion-repetida/)
- [Escribir código ya es barato. Mantenerlo sigue siendo carísimo.](https://josemariasantos.com/blog/ia-escribir-codigo-barato-entenderlo-caro/)
- [Research técnico: investiga antes de convertir una opinión en arquitectura](https://josemariasantos.com/blog/research-fuentes-primarias-arquitectura/)
- [Tu repositorio también forma parte del contexto del agente](https://josemariasantos.com/blog/repositorio-contexto-agente/)
- [Retro para agentes: mejora el entorno, no solo el código](https://josemariasantos.com/blog/retro-agentes-mejorar-entorno-ingenieria/)
- [Wayfinder: decide el camino antes de abordar una iniciativa grande](https://josemariasantos.com/blog/wayfinder-iniciativas-grandes-decisiones/)
- [Arquitectura para agentes: reduce la fricción antes de delegar más](https://josemariasantos.com/blog/arquitectura-agentes-reducir-friccion-codebase/)

## Una idea para aplicar

Antes de implementar una pantalla nueva, describe un caso de uso con cuatro piezas: quién lo ejecuta, qué datos necesita, qué estados o errores puede devolver y qué efectos secundarios produce. Después, compara el mismo recorrido en el sistema antiguo y el nuevo con una prueba de paridad. Esa pequeña ficha ayuda a descubrir reglas omitidas antes de que se multipliquen entre componentes.

## Cuatro señales del ecosistema

- **Vue:** 3.5.44 es la versión estable más reciente; 3.6.0-rc.13 sigue siendo preliminar. [Releases](https://github.com/vuejs/core/releases)
- **TypeScript:** la beta 7.1 añade atributos de importación en módulos ambientales y `--target es2026`. [Anuncio](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/)
- **Testing:** Vitest 5 ofrece Trace View para Browser Mode y `vitest doctor` para comparar configuraciones. [Anuncio](https://vitest.dev/blog/vitest-5)
- **IA:** Copilot Fusion coordina modelos y factura cada uno a tarifa estándar; GitHub anunció un descuento temporal del 30 % para planes de pago. [Anuncio](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion/)

## Una pregunta para cerrar

En una migración que tengas cerca, ¿qué caso de uso elegirías para comprobar primero la paridad entre lo antiguo y lo nuevo? Si te apetece, responde a este correo.

José María Santos · josemariasantos.com
<!-- FIN DEL CUERPO EDITORIAL -->

---

<!-- ANEXO INTERNO: NUNCA COPIAR A KIT NI PUBLICAR -->
## Inventario de fuentes (solo uso interno)
- **[Migrar un legacy multi-repositorio con agentes: casos de uso antes que pantallas](https://josemariasantos.com/blog/migracion-legacy-multi-repo-agentes/)** — Cómo descubrir el comportamiento de una aplicación de escritorio, acordar contratos y migrar casos de uso completos entre repositorios con ayuda de agentes. (2026-10-28)
- **[Cómo evolucionar una arquitectura sin reescribir el sistema](https://josemariasantos.com/blog/evolucionar-arquitectura-sin-reescribir-sistema/)** — Un método para mejorar un sistema en producción mediante fronteras claras, cambios reversibles y migraciones guiadas por el coste real de cambiarlo. (2026-10-27)
- **[Paralelismo con agentes: sesiones aisladas y trabajo integrable](https://josemariasantos.com/blog/paralelismo-agentes-worktrees-contexto/)** — Cómo repartir tickets entre sesiones y worktrees separados, mantener un contexto limpio y revisar cambios con independencia. (2026-10-27)
- **[GitHub Issues como grafo de trabajo para un equipo de agentes](https://josemariasantos.com/blog/github-issues-grafo-trabajo-agentes/)** — Cómo relacionar specs, tickets implementables y dependencias para que personas y agentes trabajen sobre una frontera lista y compartan una fuente de verdad. (2026-10-26)
- **[Delegar trabajo en GitHub Agents sin perder el control](https://josemariasantos.com/blog/github-agents-delegar-con-control/)** — Cómo preparar tareas agent-ready, combinar roles con skills reutilizables y revisar el trabajo asíncrono que vuelve en forma de pull request. (2026-10-25)
- **[Cómo medir si trabajar con agentes mejora realmente el desarrollo](https://josemariasantos.com/blog/medir-impacto-agentes-desarrollo/)** — Qué métricas ayudan a evaluar el efecto de los agentes en el flujo de entrega y por qué contar líneas, prompts o skills puede incentivar el comportamiento equivocado. (2026-10-24)
- **[¿Cuándo no delegar? Ajusta la autonomía al riesgo del cambio](https://josemariasantos.com/blog/autonomia-agentes-riesgo-reversibilidad/)** — Un marco para decidir cuánto trabajo puede delegarse según la reversibilidad, el impacto potencial y la evidencia disponible. (2026-10-23)
- **[Human in the loop: prepara los pasos que un agente no debe ejecutar solo](https://josemariasantos.com/blog/human-in-the-loop-wizard-pasos-sensibles/)** — Cómo diseñar flujos donde el agente prepara y verifica el trabajo, mientras una persona realiza acciones sensibles, externas o difíciles de revertir. (2026-10-22)
- **[Cómo crear tu primera skill propia para un agente](https://josemariasantos.com/blog/crear-primera-skill-propia-agentes/)** — Un método para convertir una instrucción repetida en una skill pequeña, activable y comprobable con tareas reales del proyecto. (2026-10-21)
- **[De las skills de Matt a las skills de tu equipo](https://josemariasantos.com/blog/adaptar-skills-equipo-friccion-repetida/)** — Cuándo adaptar una skill externa, cómo conservar su intención y dónde colocar cada regla para construir un sistema de trabajo propio. (2026-10-20)
- **[Escribir código ya es barato. Mantenerlo sigue siendo carísimo.](https://josemariasantos.com/blog/ia-escribir-codigo-barato-entenderlo-caro/)** — La IA acelera la producción de código, pero no reemplaza el criterio necesario para integrarlo, validarlo y mantenerlo en un producto real. (2026-10-20)
- **[Research técnico: investiga antes de convertir una opinión en arquitectura](https://josemariasantos.com/blog/research-fuentes-primarias-arquitectura/)** — Un flujo para investigar decisiones técnicas con fuentes primarias, conservar los hallazgos y llevar la evidencia a una decisión o ADR. (2026-10-19)
- **[Tu repositorio también forma parte del contexto del agente](https://josemariasantos.com/blog/repositorio-contexto-agente/)** — Cómo la navegación, el lenguaje compartido, la arquitectura, las pruebas y el tooling determinan cuánto puede hacer un agente con seguridad. (2026-10-18)
- **[Retro para agentes: mejora el entorno, no solo el código](https://josemariasantos.com/blog/retro-agentes-mejorar-entorno-ingenieria/)** — Cómo convertir errores repetidos de agentes en mejoras de instrucciones, tooling, documentación y estándares sin inflar AGENTS.md. (2026-10-17)
- **[Wayfinder: decide el camino antes de abordar una iniciativa grande](https://josemariasantos.com/blog/wayfinder-iniciativas-grandes-decisiones/)** — Cómo usar Wayfinder para convertir una iniciativa incierta en un mapa compartido de decisiones y avanzar hasta que el trabajo esté listo para especificarse. (2026-10-16)
- **[Arquitectura para agentes: reduce la fricción antes de delegar más](https://josemariasantos.com/blog/arquitectura-agentes-reducir-friccion-codebase/)** — Por qué los agentes heredan los costes de una codebase difícil de navegar y cómo mejorar seams, interfaces y locality antes de aumentar su autonomía. (2026-10-15)

## Novedades contrastadas (solo uso interno)
- Vue releases: Vue 3.5.44 estable y Vue 3.6.0-rc.13 marcada como pre lanzamiento; consulta realizada el 29-10-2026. https://github.com/vuejs/core/releases
- TypeScript: 7.1 Beta anunciada el 20-10-2026; la fuente describe atributos de importación en módulos ambientales y `--target es2026`. https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/
- Vitest: el anuncio de Vitest 5 describe Trace View para Browser Mode y `vitest doctor`; disponible desde 03-09-2026. https://vitest.dev/blog/vitest-5
- GitHub: Copilot Fusion GA anunciado el 28-10-2026; enruta y coordina modelos y factura cada modelo al precio estándar del proveedor. https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion/

## Próximamente · Propuestas pendientes de aprobación (solo uso interno)
- [ ] **2026-11-03** — Migrar no es rehacer: cómo mantener el alcance bajo control. Candidato privado; no enlazar ni prometer fecha. Pendiente de aprobar por el redactor.
- [ ] **2026-11-10** — Push notifications en una PWA: arquitectura antes que claves. Candidato privado; no enlazar ni prometer fecha. Pendiente de aprobar por el redactor.

## Antes de programar en Kit (solo uso interno)
- [x] Newsletter Curator selecciona una tesis y una lectura principal por relevancia; reescribe las descripciones automáticas.
- [x] Asunto, preheader, apertura, lectura protagonista, idea aplicable y cierre no contienen placeholders.
- [x] Astro Content Writer valida el valor autónomo, la voz, la estructura, las URL y recomienda precisar la promoción temporal de Fusion (incorporada).
- [x] Editorial Reviewer valida rigor, privacidad, fechas, accesibilidad editorial y publicidad; sin bloqueantes en Markdown.
- [ ] El autor aprueba la versión final y cualquier anticipo o publicidad.
- [x] Se conserva en Kit la plantilla «JMSantos · Newsletter Editorial»; falta comprobar visualmente el render en móvil, escritorio y clientes principales.
- [x] 20 destinos únicos del cuerpo comprobaron HTTP 200; falta confirmar en la vista de Kit el footer de baja y datos legales.
- [ ] Programar manualmente el Broadcast en Kit. El workflow NUNCA envía correos.
<!-- FIN DEL ANEXO INTERNO -->
