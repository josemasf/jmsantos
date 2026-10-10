# Pagina de José María Santos

Basada en Astro Starter Kit: Portfolio

```
npm init astro -- --template portfolio
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `pnpm install`      | Installs dependencies                            |
| `pnpm dev`          | Starts local dev server at `localhost:3000`      |
| `pnpm build`        | Build your production site to `./dist/`          |
| `pnpm preview`      | Preview your build locally, before deploying     |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help` | Get help using the Astro CLI                     |

## Imágenes y Cloudinary

Las imágenes rasterizadas de la portada, las tarjetas de proyectos y las
cabeceras de los posts se sirven desde Cloudinary cuando están disponibles. Las URLs incorporan `f_auto`,
`q_auto`, `dpr_auto` y dimensiones adaptadas al espacio en el que se muestran;
las tarjetas además incluyen `srcset` para no descargar una imagen mayor de la
necesaria. Los SVG continúan sirviéndose como archivos locales.

La utilidad `src/utils/cloudinary.ts` centraliza la generación de las URLs. Si
un asset todavía no está en las carpetas `jmsantos/assets` o
`jmsantos/images/blog` de Cloudinary, el
navegador vuelve automáticamente a la copia local en `public/assets/`, por lo
que no se rompe ninguna imagen mientras se completa la migración.

Para subir los assets locales, crea un archivo `.env` (no se versiona) con las
credenciales de Cloudinary:

```dotenv
CLOUD_NAME=tu_cloud_name
API_KEY=tu_api_key
API_SECRET=tu_api_secret
```

Después ejecuta:

```bash
pnpm images:upload
```

El comando usa `script/upload.mts`, recorre también las subcarpetas y sincroniza
los archivos de `public/assets/` y `public/images/blog/` bajo sus carpetas
equivalentes en Cloudinary, con identificadores predecibles. Sobrescribe el recurso remoto si ha cambiado. Cuando se haya
subido un recurso, confirma que su URL de Cloudinary devuelve `200` antes de
eliminar o cambiar su copia local.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Privacidad y analítica

El sitio no incorpora analítica por defecto. Para activar Cloudflare Web Analytics sin cookies:

1. Añade el dominio en el panel de [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/).
2. Copia el token que proporciona Cloudflare.
3. En Netlify, crea la variable de entorno de construcción `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` con ese valor y vuelve a desplegar.

Si la variable no existe, el script de analítica no se genera. Tras el despliegue, comprueba en las herramientas de desarrollo del navegador que no se crean cookies de analítica y que solo aparece la solicitud a Cloudflare cuando se ha configurado el token.

## Publicación programada del blog

Los artículos preparados para una fecha futura se guardan en
`src/content/drafts/posts/`, con la misma estructura, frontmatter y convención
de imágenes que los posts publicados. Las imágenes editoriales deben vivir en
`public/images/blog/<slug>/` y el campo `date` debe usar el formato
`YYYY-MM-DD`.

El workflow `Publicar posts programados` se ejecuta cada día a las 08:00 en
`Europe/Madrid`. Mueve a `src/content/posts/` los artículos con fecha igual o
anterior a la fecha actual de Madrid, valida el proyecto y publica el commit en `master`, desde
donde Netlify despliega automáticamente. Después actualiza la issue original indicada en el campo opcional `issue` de cada
post (sin cerrarla) y conserva el aviso de lote con los enlaces publicados.
La actualización registra publicación en master; no demuestra que Netlify haya
terminado el despliegue.

Para probar la selección sin mover archivos:

```bash
pnpm publish:scheduled -- --dry-run
```

Activa las notificaciones de Issues del repositorio para recibir el aviso de
cada lote publicado.

## Tipografías locales

Inter y Montserrat Alternates se sirven desde `public/fonts/` en formato WOFF2. No se cargan desde Google Fonts ni desde otro proveedor externo.

## Gestión editorial con agentes

El [registro de agentes y skills](AGENTS.md) asigna cada tarea a un responsable.
El [flujo editorial](docs/editorial-workflow.md) explica fichas, evidencias,
privacidad, calendario, series, generación de assets y preparación social.

- Editorial Planner: temas, backlog y duplicados.
- Technical Researcher: fuentes primarias y ejemplos.
- Astro Content Writer: redacción y actualizaciones.
- Editorial Reviewer: rigor, estilo y preparación.
- Visual Asset Prompt Designer: dirección de arte de portadas.

Las skills reutilizables están en `.agents/skills/`: `editorial-dedup`,
`research-sources`, `prepublish-check`, `social-distribution`, `content-refresh`
y `seo`. La skill existente `astro-ui-layout-architect` cubre cambios de interfaz.

```bash
pnpm content:check
pnpm test:content
pnpm astro check
pnpm build
pnpm content:check -- --built
pnpm images:optimize -- entrada.png public/images/blog/mi-post/portada.webp
```

La CI `Calidad de contenido` valida PRs y master. El esquema compartido,
series, slugs, assets y enlaces internos se comprueban automáticamente; el rigor,
la privacidad y la voz del autor requieren revisión editorial. Los borradores se
previsualizan con `pnpm dev` y se excluyen del build de producción.
