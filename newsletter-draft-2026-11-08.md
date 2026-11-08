<!-- BORRADOR INTERNO · NO ENVIAR NI PUBLICAR SIN REVISIÓN EDITORIAL -->
**Estado:** versión revisada directamente aplicando los criterios de Astro Content Writer; pendiente de revisión independiente de Editorial Reviewer y aprobación del autor.
**Periodo consolidado:** 2026-10-05 (incluido) — 2026-11-08 (excluido).
**Motivo:** combina la edición prevista para el 19 de octubre, que no se envió por un problema de verificación del proveedor, con la edición prevista para el 8 de noviembre.

## Asunto y preheader · metadatos para Kit
**Asunto:** ¿Qué debería cambiar en una migración?
**Preheader:** Separa lo que el sistema debe conservar de las mejoras que necesitan otra decisión.

<!-- INICIO DEL CUERPO EDITORIAL: revisar y copiar solo tras aprobación -->
*Lo que aprendo construyendo software · 8 de noviembre*

# Una migración también pone a prueba el contexto del equipo

Cambiar de plataforma parece, al principio, un problema de implementación. Después aparecen las preguntas difíciles: ¿este comportamiento sigue siendo necesario?, ¿quién confirma la excepción?, ¿es una adaptación técnica o una mejora de producto? Si esas respuestas viven solo en la memoria de unas pocas personas, tanto el equipo como sus herramientas de IA tendrán que reconstruirlas sobre la marcha. El resultado puede ser una migración que crece sin que nadie haya acordado ampliar su alcance. Hay una forma concreta de evitarlo: hacer visibles el comportamiento esperado, las decisiones pendientes y quién puede resolverlas.

## Lectura destacada

**[Migrar no es rehacer: cómo mantener el alcance bajo control](https://josemariasantos.com/blog/migrar-no-es-rehacer-alcance-modernizacion/)**

La lectura principal de esta edición es una guía para poner ese límite. Distingue tres decisiones que suelen esconderse bajo la palabra «migración»: conservar un comportamiento, retirar una función o rediseñarla. Para cada una cambia el criterio de éxito y, a menudo, también la persona que debe decidir. Si estás trasladando un sistema, esta distinción te ayudará a detectar qué puede avanzar ya y qué requiere una decisión explícita de producto.

[Lee cómo acotar el alcance de una migración](https://josemariasantos.com/blog/migrar-no-es-rehacer-alcance-modernizacion/)

## Para profundizar

**[El repositorio también es contexto para el agente](https://josemariasantos.com/blog/repositorio-contexto-agente/)**  
Las convenciones, los límites entre módulos y las pruebas indican qué se puede cambiar y cómo comprobarlo. Una lectura útil si parte de la dificultad está en que el conocimiento del sistema no se encuentra con facilidad.

**[Un flujo de ingeniería para trabajar con agentes](https://josemariasantos.com/blog/del-copiloto-al-equipo-agentes-flujo-completo/)**  
Cómo combinar contexto, tareas delimitadas y revisión humana para que delegar ejecución no signifique delegar también las decisiones que corresponden al equipo.

## Una idea para aplicar

Elige una función que vaya a migrarse y completa estas tres frases antes de implementarla: «Se conserva…», «Se adapta porque…» y «Queda fuera…». Si no puedes completar alguna, anota la pregunta y a quién corresponde resolverla. Así una duda no se convierte silenciosamente en trabajo adicional ni en una decisión tomada por quien solo intentaba desbloquear la tarea.

## Otras lecturas de estas semanas

Si estás preparando cambios grandes, también pueden servirte estas lecturas:

- [Reduce la fricción de la codebase antes de delegar](https://josemariasantos.com/blog/arquitectura-agentes-reducir-friccion-codebase/)
- [Investiga antes de convertir una opinión en arquitectura](https://josemariasantos.com/blog/research-fuentes-primarias-arquitectura/)
- [Aísla tareas paralelas para poder integrar y revisar](https://josemariasantos.com/blog/paralelismo-agentes-worktrees-contexto/)
- [Organiza dependencias entre tareas de un equipo de agentes](https://josemariasantos.com/blog/github-issues-grafo-trabajo-agentes/)
- [Evoluciona la arquitectura sin reescribir el sistema](https://josemariasantos.com/blog/evolucionar-arquitectura-sin-reescribir-sistema/)

En una migración reciente, ¿qué decisión costó más separar del trabajo técnico: conservar, retirar o rediseñar una función? Puedes responder a este correo; me interesa saber dónde aparece esa frontera en vuestro trabajo.

José María Santos · [josemariasantos.com](https://josemariasantos.com/)
<!-- FIN DEL CUERPO EDITORIAL -->

---

<!-- ANEXO INTERNO: NUNCA COPIAR A KIT NI PUBLICAR -->
## Verificaciones y pendientes (solo uso interno)
- Se contrastaron títulos, fechas y descripciones en `src/content/posts/` para las ediciones del 19 de octubre y 8 de noviembre. No se incluyeron drafts ni anticipos.
- Las URL se construyeron desde los slugs del repositorio; no se verificó respuesta en producción.
- Se revisó directamente la tesis, jerarquía, asunto, preheader, apertura, resúmenes, idea aplicable y enlaces descriptivos aplicando las instrucciones locales de Astro Content Writer. No se invocó un agente especializado independiente.
- Editorial Reviewer aún no ha revisado el texto; el borrador en Kit sigue pendiente de esa revisión y de aprobación del autor.
- No se comprobó el renderizado en móvil, escritorio ni clientes de correo. Revisar también enlaces legales y baja gestionados por Kit antes del envío.
- No se incluyó publicidad.
<!-- FIN DEL ANEXO INTERNO -->
