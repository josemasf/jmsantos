# Flujo editorial del blog

## Responsabilidades y entregas

| Tarea                          | Responsable                                 | Skill                     | Entrega                                                             |
| ------------------------------ | ------------------------------------------- | ------------------------- | ------------------------------------------------------------------- |
| Coordinar artículo de inicio a fin | Editorial Orchestrator | editorial-dedup y prepublish-check según fase | Issue, dossier, borrador, imagen real cuando se requiera, revisión independiente y estado verificado |
| Preparar newsletter quincenal    | Newsletter Curator → Astro Content Writer → Editorial Reviewer → autor | — | Borrador fundamentado, revisiones y aprobación manual. Ver `docs/newsletter.md` |
| Elegir tema y ordenar backlog  | Editorial Planner                           | editorial-dedup           | Ficha con tesis, evidencia pendiente, duplicados y siguiente acción |
| Contrastar afirmaciones        | Technical Researcher                        | research-sources          | Tabla de afirmación, fuente primaria, fecha, versión y límites      |
| Crear o mejorar el borrador    | Astro Content Writer                        | seo                       | Markdown, metadatos e issue de origen verificada                    |
| Diseñar la portada             | Visual Asset Prompt Designer                | —                         | Prompt, variantes, composición y alt                                |
| Generar e integrar la imagen   | Asistente con generador de imágenes         | prepublish-check          | Asset real optimizado, dimensiones y frontmatter                    |
| Revisar y preparar publicación | Editorial Reviewer                          | prepublish-check          | Hallazgos y resultado de los comandos ejecutados                    |
| Preparar LinkedIn/X            | Astro Content Writer                        | social-distribution       | Textos por canal y URL verificada                                   |
| Revisar vigencia               | Technical Researcher → Astro Content Writer | content-refresh           | Cambios sustentados y updatedDate cuando proceda                    |
| Modificar la interfaz          | Asistente de desarrollo                     | astro-ui-layout-architect | Cambios en layouts/components y evidencia visual                    |

Los agentes de `.github/agents/` definen roles; las skills de `.agents/skills/`
definen procedimientos. Seleccionar el agente en Copilot o leer su archivo al
usar otro asistente. Cargar solo las skills necesarias. La skill de UI existente
está en `.github/skills/astro-ui-layout-architect/`. Estas instrucciones no se
ejecutan solas: los únicos procesos recurrentes son los workflows configurados.

## Orquestación de artículos

Usar `.github/agents/editorial-orchestrator.agent.md` como **punto de entrada**
cuando se pida desarrollar un post completo. Editorial Planner sigue siendo el
especialista en backlog, tesis y duplicados; **no** es responsable de gestionar
las ejecuciones de los demás agentes.

```text
Issue verificada + calendario
            ↓
Editorial Planner (si hace falta definir / deduplicar)
            ↓
Technical Researcher (si hay afirmaciones que contrastar)
            ↓
Astro Content Writer → borrador con issue: N
            ├───────────────┐
            ↓               ↓
Visual Asset Prompt Designer (dirección visual; no archivo de imagen)
            ↓
Asset real generado e integrado, si el post lo exige
            ↓
Editorial Reviewer (revisión independiente, solo lectura)
            ├─ requiere cambios → redactor → revisor (máximo 2 ciclos)
            └─ listo → validaciones + informe al autor
```

**Contrato de fases:** cada rol recibe el número/URL de issue en `josemasf/jmsantos`,
la tesis vigente, decisiones de alcance, archivos relevantes, lo que puede editar
y su resultado esperado. La persona que orquesta comprueba esas entregas y no
marca una fase como completada hasta observar evidencia. No lanzar edición y
revisión simultáneas sobre un mismo artículo. Investigación y propuesta visual
pueden solaparse con escritura **solo si** el contexto necesario ya está cerrado
y no se pisan los archivos.

**Límites operativos y aprobación:**

- Los agentes de VS Code **no** se ejecutan por definir flechas en Markdown.
  En el harness **Local** la delegación se realiza con el toolset `agent`
  habilitado; en **Copilot** el runtime usa su herramienta nativa `task`.
  Revisar la selección de herramientas y el harness activo. Si la delegación no
  existe o está deshabilitada, el coordinador debe indicar qué roles **no han
  sido realmente invocados** y ofrecer ejecución manual; no simular resultados.
- Un prompt de portada no equivale a un archivo gráfico. Si el diseño aprobado
  requiere imagen, integrarla con una herramienta de imágenes disponible,
  comprobar la ruta, el alt y las dimensiones; si no se puede, bloquear esa
  entrega concreta.
- **Revisión independiente obligatoria** antes de declarar `listo para
  programar`. Errores bloqueantes vuelven al redactor y después al revisor.
  Sin revisión no hay aprobación, aunque los tests pasen.
- No mover drafts a posts, activar el publicador, modificar fechas aprobadas,
  publicar en redes, ni cerrar issues por defecto. El flujo habitual acaba en
  un borrador preparado y validado, no en su publicación.
- El orquestador entrega una tabla de fase, estado, evidencia/bloqueo, además
  de issue, ruta, fecha y próxima acción. No atribuir una fase a otro agente si
  se hizo directamente o no se pudo ejecutar.

**Uso en VS Code:** seleccionar `Editorial Orchestrator` en el selector de agentes
y encargar «Desarrolla un borrador de la issue #96, revisa duplicados, contrasta
fuentes, prepara portada si corresponde, solicita revisión independiente y no
publiques». Se mantiene el calendario de borradores sin cambios.

## Ficha e información compartida

Usar la issue existente como ficha, conservando su alcance y enlaces:

- Lector, problema concreto y tesis.
- Valor diferencial frente a posts, drafts e issues.
- Esquema de 4–6 puntos, ejemplo verificable y límites.
- Fuentes primarias y afirmaciones pendientes de contraste.
- Serie y dependencias, cuando corresponda.
- Estado editorial, archivo, fecha propuesta o aprobada y siguiente acción.

Distinguir idea, por investigar, esquema, borrador, listo, programado y publicado.
Una issue cerrada no demuestra publicación. La carpeta `posts` refleja el
contenido publicado en el repositorio; comprobar la web si se necesita demostrar
que el despliegue está disponible. En desarrollo Astro también muestra drafts.

Escribir en español de España desde el criterio de un Frontend Tech Lead:
problemas, decisiones, costes y aprendizajes útiles. No inventar vivencias,
resultados, citas ni estadísticas. Anonimizar casos privados y excluir informes
internos, nombres de equipos/empresas/personas y combinaciones identificativas.

## Límite entre coordinación interna y publicación

La issue de origen es una **ficha editorial interna**, no una referencia bibliográfica. Puede proporcionar tesis, ejemplos y decisiones a los agentes, y debe conservarse como `issue: N` en el frontmatter; nunca se cita ni enlaza en el texto público del post, newsletters o redes. En particular, no escribir «la issue #N propone» ni enlazar a `github.com/josemasf/jmsantos/issues/N`. La exposición al lector debe ser autónoma.

Los enlaces editoriales deben apuntar a páginas realmente publicadas y verificadas: artículos del blog, documentación oficial y recursos públicos relevantes. El estado de una issue, aunque esté cerrada, no prueba que una publicación exista. Una ausencia de fuente pública no se resuelve inventando un enlace. El redactor comprueba esta frontera y el revisor la trata como bloqueante; `pnpm content:check` incorpora una comprobación automatizada de referencias internas.

## Frontmatter, series e issues

El contrato de datos está en `src/data/post-schema.ts`, importado por
`src/content.config.ts` y el control de calidad. El slug procede del nombre de
archivo sin extensión ni prefijo numérico inicial; no existe un campo `slug`.

```yaml
title: "Título de trabajo"
description: "Resumen preciso del problema y aprendizaje."
date: 2026-11-03
tags: [Vue, Testing]
category: Testing
issue: 123 # Ejemplo sintético: reemplazar por una issue real de josemasf/jmsantos.
series:
  slug: testing-moderno-vue-confianza-sin-fragilidad
  order: 7
```

`issue: N` es **obligatorio para todos los borradores** en
`src/content/drafts/posts/` y debe apuntar a una ficha editorial verificable de
`josemasf/jmsantos`. El agente redactor debe buscar y abrir la issue antes de
escribir el frontmatter: una issue individual cuando sea el origen de ese artículo
o la issue de la serie cuando agrupe sus capítulos. Si la idea fue fusionada,
usar la ficha que conserva el contenido. Si no existe, crear una ficha de
seguimiento antes de programar; nunca adivinar el número por el prefijo ni usar
una issue parecida sin confirmar la relación. El revisor valida esta trazabilidad.

Para **artículos publicados históricos**, `issue` continúa siendo opcional por
compatibilidad. La CI y el dry-run de publicación bloquean borradores sin issue;
el publicador registra cada artículo por separado, conserva el estado global y
no cierra automáticamente las issues originales.

Registrar título y descripción de la serie en `src/data/blog-series.ts`.
`series` solo admite `slug`, `order` e `image` opcional. Usar órdenes positivos,
únicos y consecutivos en el conjunto de capítulos. Si se define `series.image`,
repetir el mismo objeto en todos los capítulos. Tiene prioridad social sobre la
imagen individual; el layout sigue mostrando `image` como portada del artículo.

## Fechas y publicación

Leer `src/content/drafts/README.md` y ejecutar el dry run antes de programar.
Conservar fechas ya acordadas, incluidos calendarios de series con otra cadencia.
Para un calendario nuevo, proponer una publicación semanal y comprobar huecos
con todos los posts y drafts. Crear borradores por defecto; una fecha vencida
en `drafts/posts` activa la publicación automática al incorporarse a master.
No asignar una fecha vencida a un texto en investigación. No publicar otros
borradores como efecto secundario de escribir un artículo.

El workflow revisa fechas **cada día a las 08:00 de Europe/Madrid**, con dos cron
UTC y selección según horario de verano/invierno. Mueve todos los drafts vencidos,
valida, hace commit en master, actualiza las issues indicadas por `issue` y crea
el aviso de lote existente. Netlify despliega desde master.

## Imágenes y validación

Diseñar primero la dirección de arte con Visual Asset Prompt Designer. Para
generar, usar un generador disponible; si no lo hay, informar del asset pendiente.
Un prompt no es una imagen entregada. Usar SVG/código para diagramas exactos.

Guardar la imagen final en `public/images/blog/<slug>/`. Optimizar sin borrar
el original ni sobrescribir una portada existente:

```bash
pnpm images:optimize -- /ruta/portada-original.png public/images/blog/mi-post/portada.webp
```

Usar `width` y `height` reales y alt descriptivo. Previsualizar composición y
recorte. `pnpm images:upload` es una sincronización remota aparte y requiere las
credenciales de Cloudinary; mantener siempre el fallback local.

```bash
pnpm test:content
pnpm content:check
pnpm lint
pnpm astro check
pnpm build
pnpm content:check -- --built
pnpm publish:scheduled -- --dry-run
```

`content:check` valida ambos conjuntos, exige issue de origen en drafts,
fechas, slugs, registros y órdenes de serie, coherencia de imágenes sociales,
assets y dimensiones. `--built` añade
enlaces a rutas del blog en el HTML final, incluidos los generados por referencias
Markdown. No verifica fuentes externas, privacidad, calidad de la tesis ni
ejecución de ejemplos: esas comprobaciones requieren revisión editorial.

La CI `Calidad de contenido` ejecuta estas validaciones en PR y master. El
workflow de publicación repite los controles antes de subir el lote. Los
comandos de revisión no publican ni envían textos a redes sociales.

El workflow conserva el manifiesto `publication.json` como artifact durante 30 días.
Si falla la sincronización de issues después del push, la publicación ya existe:
volver a ejecutar `script/sync-publication-issues.mjs` con el manifiesto del lote,
`GH_TOKEN`, `GITHUB_REPOSITORY` y `SITE_URL`. La actualización es idempotente por
slug. No republicar ni crear nuevas issues para corregir solo ese registro.
