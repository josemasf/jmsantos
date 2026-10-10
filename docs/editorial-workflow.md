# Flujo editorial del blog

## Responsabilidades y entregas

| Tarea                          | Responsable                                 | Skill                     | Entrega                                                             |
| ------------------------------ | ------------------------------------------- | ------------------------- | ------------------------------------------------------------------- |
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

`issue` es opcional para compatibilidad con artículos existentes. Añadirlo al
crear un artículo desde una issue tras verificar número y repositorio. Nunca
deducirlo del prefijo numérico del archivo. Puede apuntar a la issue de una serie;
el publicador registra cada artículo por separado y conserva el estado global
y el contenido de la issue. No cierra automáticamente las issues originales.

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

`content:check` valida ambos conjuntos, fechas, slugs, registros y órdenes de
serie, coherencia de imágenes sociales, assets y dimensiones. `--built` añade
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
