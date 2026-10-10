---
name: seo
description: "Revisar SEO editorial y técnico de josemariasantos.com. Usar para títulos, descripciones, enlaces, canonical, sitemap, imágenes sociales y datos estructurados de artículos Astro."
---

# SEO del blog

Leer `docs/editorial-workflow.md`. Basarse en la arquitectura real:

- Esquema: `src/data/post-schema.ts` y `src/content.config.ts`.
- Head/canonical/Open Graph/Twitter: `src/components/MainHead.astro`.
- BlogPosting y BreadcrumbList: `src/data/blog-seo.ts`.
- Selección de layout: `src/pages/blog/[slug].astro`.
- Metadatos de temas/series: `src/data/blog-topics.ts` y `src/data/blog-series.ts`.
- Sitemap: `astro.config.mjs`; robots: `public/robots.txt`.

1. Definir lector e intención de búsqueda desde el problema del artículo.
2. Ajustar título claro, descripción fiel, tags/categoría coherentes y enlaces
   relacionados reales. Mantener la URL de un post publicado. El slug se obtiene
   del archivo; no añadir un campo `slug` al frontmatter.
3. Usar longitud de título/descripción como orientación editorial, sin prometer
   posiciones ni imponer límites arbitrarios. Priorizar utilidad y precisión.
4. Mantener un único H1 generado por el layout; usar H2/H3 en el cuerpo.
5. Comprobar alt, asset y dimensiones; la imagen social prioriza `series.image`,
   después `image` y finalmente `/images/social/blog-default.png`.
6. Ejecutar build y `pnpm content:check -- --built`. Inspeccionar el HTML efectivo
   de la ruta: title, description, canonical del dominio, imagen social, idioma,
   BlogPosting y breadcrumbs. Para drafts, revisar en dev sin confundirlo con
   indexación o disponibilidad pública.
7. Comprobar sitemap y robots contra las rutas generadas, sin incluir drafts.

Reutilizar MainHead y blog-seo; no duplicar meta/JSON-LD en Markdown. No añadir
schemas de productos, precios, reseñas o FAQ que no correspondan al contenido.
No cambiar infraestructura, headers o layouts en una tarea solo editorial.
Para modificar UI, usar la skill existente astro-ui-layout-architect; para calidad
integral y privacidad, usar prepublish-check. Señalar verificaciones remotas ausentes.
