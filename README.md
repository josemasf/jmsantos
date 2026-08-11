# Pagina de José María Santos

Basada en Astro Starter Kit: Portfolio

```
npm init astro -- --template portfolio
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

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

El workflow `Publicar posts programados` se ejecuta cada lunes a las 08:00 en
`Europe/Madrid`. Mueve a `src/content/posts/` los artículos con fecha igual o
anterior a ese lunes, valida el proyecto y publica el commit en `master`, desde
donde Netlify despliega automáticamente. Después crea y cierra una issue con
los enlaces de los artículos publicados.

Para probar la selección sin mover archivos:

```bash
pnpm publish:scheduled -- --dry-run
```

Activa las notificaciones de Issues del repositorio para recibir el aviso de
cada lote publicado.

## Tipografías locales

Inter y Montserrat Alternates se sirven desde `public/fonts/` en formato WOFF2. No se cargan desde Google Fonts ni desde otro proveedor externo.

## Agent Registry

This repository documents custom agents for AI assistants in [AGENTS.md](AGENTS.md).

- Main agent for editorial workflows: [Astro Content Writer](.github/agents/astro-content-writer.agent.md)
- Usage and interoperability notes for Codex/other LLMs: [AGENTS.md](AGENTS.md)
