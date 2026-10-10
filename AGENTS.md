# AGENTS Registry

Este repositorio mantiene agentes personalizados para tareas específicas.

## Flujo y selección por tarea

Leer [el flujo editorial](docs/editorial-workflow.md) antes de editar contenido o
su automatización. Ese documento define contratos de entrega, estados, privacidad,
fechas, series, imágenes y validaciones. Cargar solo el rol y las skills aplicables.

| Agente                       | Objetivo                                                       | Archivo                                                |
| ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| Editorial Planner            | Elegir temas, ordenar backlog y detectar duplicados.           | `.github/agents/editorial-planner.agent.md`            |
| Technical Researcher         | Contrastar fuentes, versiones y ejemplos.                      | `.github/agents/technical-researcher.agent.md`         |
| Astro Content Writer         | Redactar y actualizar artículos desde una ficha contrastada.   | `.github/agents/astro-content-writer.agent.md`         |
| Editorial Reviewer           | Revisar rigor, estilo, privacidad y preparación para publicar. | `.github/agents/editorial-reviewer.agent.md`           |
| Visual Asset Prompt Designer | Diseñar dirección de arte y prompts de imágenes.               | `.github/agents/visual-asset-prompt-designer.agent.md` |

| Skill                     | Tarea                                                      | Archivo                                             |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| editorial-dedup           | Comparar ideas con posts, drafts e issues.                 | `.agents/skills/editorial-dedup/SKILL.md`           |
| research-sources          | Contrastar afirmaciones con fuentes primarias.             | `.agents/skills/research-sources/SKILL.md`          |
| prepublish-check          | Revisar contenido, assets y evidencias antes de programar. | `.agents/skills/prepublish-check/SKILL.md`          |
| social-distribution       | Preparar textos de LinkedIn/X.                             | `.agents/skills/social-distribution/SKILL.md`       |
| content-refresh           | Actualizar contenido preservando URL e historial.          | `.agents/skills/content-refresh/SKILL.md`           |
| seo                       | Revisar metadatos y SEO del blog Astro.                    | `.agents/skills/seo/SKILL.md`                       |
| astro-ui-layout-architect | Implementar cambios de interfaz.                           | `.github/skills/astro-ui-layout-architect/SKILL.md` |

Para Copilot, seleccionar el agente por nombre. En Codex u otro asistente, leer
el archivo `.agent.md` correspondiente y aplicar sus instrucciones dentro del
encargo del usuario. Las skills se invocan por tarea; no son procesos recurrentes.

El planificador entrega la ficha; el investigador aporta evidencia; el redactor
crea el Markdown; el revisor devuelve hallazgos. El agente visual diseña prompts:
la generación e integración del asset corresponde al asistente con herramienta
de imágenes. Un prompt no cuenta como portada terminada.

### Restricciones compartidas

- No inventar vivencias, fuentes ni resultados. Anonimizar ejemplos profesionales
  y mantener documentos privados fuera del repositorio y de issues públicas.
- No publicar drafts vencidos como efecto secundario de planificar o redactar.
- Conservar fechas aprobadas y verificar qué fechas activan autopublicación.
- No enviar difusión social como parte de preparar textos.
- Registrar solo comprobaciones realmente ejecutadas y sus límites.

### Layouts de posts disponibles

La ruta `src/pages/blog/[slug].astro` selecciona automáticamente el layout de cada artículo según el frontmatter del post. Los agentes no deben importar layouts desde el Markdown ni duplicar HTML de portada dentro del cuerpo del artículo.

| Caso de uso                            | Layout generado                   | Cómo activarlo                              |
| -------------------------------------- | --------------------------------- | ------------------------------------------- |
| Artículo estándar sin imagen destacada | `src/layouts/Post.astro`          | Usar solo los campos obligatorios del post. |
| Artículo con imagen destacada          | `src/layouts/PostWithImage.astro` | Añadir el objeto `image` al frontmatter.    |
| Artículo perteneciente a una serie     | `src/layouts/SeriesPost.astro`    | Añadir el objeto `series` al frontmatter.   |

Campos obligatorios comunes para todos los posts:

```yaml
title: "Título del artículo"
description: "Descripción SEO y resumen editorial."
date: 2026-08-08
tags: [Astro, Frontend]
category: Frontend
```

Para un post con imagen destacada:

```yaml
image:
  src: /images/blog/slug-del-post/nombre-descriptivo.png
  alt: Descripción accesible de la imagen.
  caption: Texto opcional de pie de imagen.
  width: 1536
  height: 1024
```

Convención de imágenes del blog:

- Guardar imágenes editoriales en `public/images/blog/<slug-del-post>/`.
- Usar nombres descriptivos en minúsculas y con guiones.
- Referenciar desde frontmatter con ruta pública absoluta: `/images/blog/<slug-del-post>/<archivo>`.
- Incluir siempre `alt`; añadir `width` y `height` cuando se conozcan para evitar saltos de layout.
- No dejar imágenes definitivas de posts en `src/images` si se van a servir directamente desde Markdown/layout.

Para un post de serie:

```yaml
series:
  slug: nombre-de-la-serie
  order: 1
  image:
    src: /images/blog/nombre-de-la-serie/portada-social.png
    alt: Descripción accesible de la imagen de la serie.
    width: 1536
    height: 1024
```

Reglas para series:

- Usar el mismo `series.slug` en todos los posts relacionados.
- Definir `series.order` con números consecutivos para ordenar el listado lateral.
- Antes de crear o publicar artículos de una serie nueva, añadir sus metadatos compartidos en `src/data/blog-series.ts`. La clave debe coincidir exactamente con `series.slug` e incluir, como mínimo, `title` y, cuando exista, `description`.
- El nombre y la descripción de la serie se leen desde `src/data/blog-series.ts`; no duplicarlos en el frontmatter de cada post.
- `series.image` es opcional y se usa como imagen Open Graph y Twitter al compartir cualquiera de los enlaces de la serie; tiene prioridad sobre la imagen individual del post, pero no se muestra dentro del artículo.
- Si se define `series.image`, repetir exactamente el mismo objeto en todos los posts de esa serie para que el resultado al compartir sea consistente.
- Guardar la imagen de serie en `public/images/blog/<slug-de-la-serie>/` y usar una ruta pública absoluta en `src`.
- Si un post tiene `series` e `image`, se renderiza con `SeriesPost.astro` y también muestra la imagen destacada.
- No crear enlaces manuales de "posts relacionados" dentro del cuerpo salvo que aporten contexto adicional; el layout ya lista la serie.

Ejemplo de registro centralizado:

```ts
// src/data/blog-series.ts
export const blogSeries = {
  "testing-vue": {
    title: "Testing en Vue",
    description:
      "Una guía práctica para construir una suite de tests rápida y mantenible.",
  },
};
```

### Prompt sugerido

```text
Actúa como el agente "Astro Content Writer" definido en .github/agents/astro-content-writer.agent.md.
Tarea: [describe tema, público, intención y tipo de entrega].
Repositorio: respeta esquema de Content Collections y estilo editorial existente.
```

## Visual Asset Prompt Designer

- Nombre: `Visual Asset Prompt Designer`
- Archivo fuente: `.github/agents/visual-asset-prompt-designer.agent.md`
- Descripción: agente especializado en diseño de prompts para portadas, miniaturas sociales, ilustraciones técnicas y recursos visuales de artículos.
- Herramientas declaradas: `read`, `search`.
- Idioma por defecto: español de España.

### Cuándo usarlo

Usar este agente cuando la tarea sea:

- Generar prompts para portadas de posts.
- Crear variantes por canal (blog, LinkedIn, X) y formato (16:9, 1:1, 4:5).
- Diseñar prompts para recursos conceptuales o diagramas visuales.
- Definir prompts negativos para evitar artefactos y resultados genéricos.
- Obtener alt text sugerido para accesibilidad.

Regla obligatoria para portadas:

- Antes de generar, editar o sustituir la portada de un post, cargar el contenido completo de `.github/agents/visual-asset-prompt-designer.agent.md` y usar su dirección de arte para definir el prompt, el prompt negativo y el texto alternativo. Esta regla también se aplica cuando la petición del usuario solo diga «genera una portada» o «crea una imagen para el post».

### Cómo consumirlo desde Codex u otros LLM

1. Cargar el contenido completo de `.github/agents/visual-asset-prompt-designer.agent.md` como instrucción de sistema o rol especializado.
2. Proporcionar siempre contexto mínimo: tema, audiencia, canal, estilo, formato y objetivo visual.
3. Solicitar salida estructurada con prompt principal, prompt negativo, variantes y alt text.

### Prompt sugerido

```text
Actúa como el agente "Visual Asset Prompt Designer" definido en .github/agents/visual-asset-prompt-designer.agent.md.
Tarea: genera 5 prompts para la portada de un artículo sobre [tema], para [canal], en formato [16:9/1:1/4:5], estilo [editorial/técnico/conceptual].
Entrega: prompt principal, prompt negativo, 3 variantes y alt text.
```

## Notas

- Este registro documenta la existencia del agente para herramientas que no descubren automáticamente archivos `.agent.md`.
- Si se actualiza el agente, actualizar también este archivo para mantener compatibilidad entre asistentes.
- Las GitHub Issues son la fuente de verdad del estado editorial. Cuando se cree un post a partir de una issue, verificarla y añadir su número en
  `issue` del frontmatter. Registrar **Borrador** o **Programado** según preparación
  y fecha, con ruta y siguiente acción. El workflow actualiza un bloque por artículo
  en la issue original al publicar; conserva su contenido/estado global y no la
  cierra automáticamente porque puede representar una serie.
