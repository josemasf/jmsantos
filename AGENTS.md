# AGENTS Registry

Este repositorio mantiene agentes personalizados para tareas específicas.

## Flujo y selección por tarea

Leer [el flujo editorial](docs/editorial-workflow.md) antes de editar contenido o
su automatización. Ese documento define contratos de entrega, estados, privacidad,
fechas, series, imágenes y validaciones. Cargar solo el rol y las skills aplicables.

| Agente                       | Objetivo                                                       | Archivo                                                |
| ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| Editorial Orchestrator        | Coordinar el flujo completo, delegar fases y exigir revisión independiente sin publicar. | `.github/agents/editorial-orchestrator.agent.md` |
| Newsletter Curator           | Preparar la newsletter quincenal a partir de publicaciones y calendario. | `.github/agents/newsletter-curator.agent.md` |
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

Para desarrollar **un post de extremo a extremo**, seleccionar **Editorial Orchestrator**
como punto de entrada. Coordina las entregas de Editorial Planner → Technical
Researcher → Astro Content Writer → Visual Asset Prompt Designer → Editorial
Reviewer, en las fases que correspondan. Conserva el gate de revisión independiente,
respeta el calendario y **no publica**. Los demás agentes siguen disponibles por
separado para encargos puntuales. El agente visual solo diseña prompts: la
integración del asset corresponde a un asistente con generación de imágenes real.

En VS Code Local, habilitar la herramienta de subagentes `agent`. En el harness
Copilot, comprobar la disponibilidad de delegación nativa `task`; nombres de
herramientas y compatibilidad varían según el harness. Si no puede delegarse,
el orquestador debe identificar fases pendientes y no fingir que se ejecutaron.
Ver [el contrato de fases](docs/editorial-workflow.md#orquestación-de-artículos).

La newsletter sigue el circuito **Newsletter Curator → Astro Content Writer (validador redactor) → Editorial Reviewer → aprobación del autor**, documentado en `docs/newsletter.md`. El agente debe aplicar el **contrato editorial y visual**: asunto/preheader con valor, una lectura protagonista, secciones secundarias, idea aplicable y cierre conversacional; el generador automático solo produce un andamiaje pendiente de redacción. Los agents de VS Code no se ejecutan automáticamente desde GitHub Actions; ningún workflow puede aprobar o enviar campañas.

### Restricciones compartidas

- No inventar vivencias, fuentes ni resultados. Anonimizar ejemplos profesionales
  y mantener documentos privados fuera del repositorio y de issues públicas.
- No publicar drafts vencidos como efecto secundario de planificar o redactar.
- Conservar fechas aprobadas y verificar qué fechas activan autopublicación.
- No enviar difusión social como parte de preparar textos.
- Registrar solo comprobaciones realmente ejecutadas y sus límites.

**Separación obligatoria de lo interno y lo público:** las issues editoriales del repositorio sirven para coordinar agentes y alimentar `issue: N` en el frontmatter, pero no pueden aparecer como enlace o fuente en el texto visible del blog, newsletters ni redes sociales. Prohibido enlazar a `github.com/josemasf/jmsantos/issues/N` o atribuir la tesis a «la issue #N». Sustituirlo por explicación autónoma y, solo cuando aporte valor, enlaces a contenido realmente publicado y comprobado. La revisión editorial debe bloquear esas filtraciones.

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

**Trazabilidad obligatoria de borradores:** además de estos campos,
`src/content/drafts/posts/` requiere `issue: N`, donde `N` es el número
**verificado en GitHub** de la ficha editorial del artículo o de su serie.
No adivinarlo del prefijo del archivo ni enlazar por parecido de título. Si no
existe ficha, registrarla antes de programar (o bloquear el borrador si no
puede verificarse). Los artículos antiguos ya publicados mantienen la excepción
de compatibilidad. El redactor y el revisor lo comprueban y la CI bloquea drafts
que no lo tengan.

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
- Programar las publicaciones de una serie con cadencia diaria, salvo que el usuario apruebe expresamente otra cadencia. Esta es una excepción a la pauta semanal general.
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
- Las GitHub Issues son la fuente de verdad del estado editorial. Cada nuevo
  borrador debe referenciar en `issue` una ficha real del artículo o de la
  serie, comprobada por el redactor y el revisor. Registrar **Borrador** o
  **Programado** con ruta y siguiente acción. `pnpm content:check` y el dry-run
  deben rechazar cualquier borrador sin issue. El workflow actualiza un bloque
  por artículo en su issue original al publicar y no la cierra automáticamente.
  Los posts históricos publicados pueden seguir sin issue.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues for `josemasf/jmsantos`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Use the single-context layout with root `GLOSSARY.md` and `docs/adr/`. See `docs/agents/domain.md`.
