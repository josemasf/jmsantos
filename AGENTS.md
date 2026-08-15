# AGENTS Registry

Este repositorio mantiene agentes personalizados para tareas específicas.

## Tabla de agentes disponibles

| Agente                       | Objetivo                                                                              | Archivo                                                |
| ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Astro Content Writer         | Planificar, redactar, revisar y optimizar artículos técnicos para el blog Astro.      | `.github/agents/astro-content-writer.agent.md`         |
| Visual Asset Prompt Designer | Diseñar prompts de alta calidad para generar recursos visuales de artículos técnicos. | `.github/agents/visual-asset-prompt-designer.agent.md` |

## Astro Content Writer

- Nombre: `Astro Content Writer`
- Archivo fuente: `.github/agents/astro-content-writer.agent.md`
- Descripción: agente especializado en planificación, redacción, revisión y optimización SEO de artículos técnicos para el blog Astro.
- Herramientas declaradas: `read`, `search`, `edit`, `execute`.
- Idioma por defecto: español de España.

### Cuándo usarlo

Usar este agente cuando la tarea sea:

- Proponer ideas editoriales para el blog.
- Crear o mejorar artículos en `src/content/posts`.
- Revisar calidad técnica/editorial de borradores.
- Optimizar SEO on-page de contenidos existentes.

### Cómo consumirlo desde Codex u otros LLM

1. Cargar el contenido completo de `.github/agents/astro-content-writer.agent.md` como instrucción de sistema o rol especializado.
2. Mantener sus restricciones editoriales y técnicas (no inventar datos, respetar frontmatter y convención del repositorio).
3. Ejecutar las tareas de escritura sobre la colección de posts de Astro, validando formato y coherencia con `src/content.config.ts`.

### Layouts de posts disponibles

La ruta `src/pages/blog/[slug].astro` selecciona automáticamente el layout de cada artículo según el frontmatter del post. Los agentes no deben importar layouts desde el Markdown ni duplicar HTML de portada dentro del cuerpo del artículo.

| Caso de uso                            | Layout generado                 | Cómo activarlo                                   |
| -------------------------------------- | ------------------------------- | ------------------------------------------------ |
| Artículo estándar sin imagen destacada | `src/layouts/Post.astro`        | Usar solo los campos obligatorios del post.      |
| Artículo con imagen destacada          | `src/layouts/PostWithImage.astro` | Añadir el objeto `image` al frontmatter.         |
| Artículo perteneciente a una serie     | `src/layouts/SeriesPost.astro`  | Añadir el objeto `series` al frontmatter.        |

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
    description: "Una guía práctica para construir una suite de tests rápida y mantenible.",
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
- Cuando se cree un post a partir de un tema de `backlog-temas/`, actualizar el archivo de backlog de origen antes de terminar la tarea: marcar el tema como **escrito** (o **escrito como borrador**), incluir la ruta al post creado y, si corresponde, su fecha programada. Esta actualización es obligatoria para que los temas ya desarrollados no vuelvan a proponerse como pendientes.
