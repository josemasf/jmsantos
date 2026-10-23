# Newsletter quincenal

## Objetivo y frecuencia

La newsletter de josemariasantos.com se prepara cada 14 días, independientemente de la publicación semanal del blog. Incluye artículos publicados en los **14 días anteriores** (inicio incluido y fecha de edición excluida), hasta dos **candidatos** de próximos artículos, una reflexión útil revisada por el autor y publicidad **solo propia o aprobada expresamente**. Nada de recomendaciones publicitarias automáticas de Kit.

El calendario de preparación comienza el **lunes 2 de noviembre de 2026** y continúa cada 14 días. Es solo la **preparación de un borrador**, no una cadencia de envíos automática. Modificar el ancla junto con el workflow si se cambia el día.

## Captación con Kit

1. Crear una cuenta en Kit y un formulario **Inline Form** con **doble confirmación** activada. Desactivar recomendaciones de la red de Kit y cualquier programa promocional no aprobado.
2. En Kit, ir a **Grow → Landing Pages & Forms → formulario → Embed → JavaScript**. Copiar el atributo `src` del script generado, normalmente alojado en `https://f.convertkit.com/...`. No pegar claves privadas, API tokens ni el código entero en el repositorio.
3. Definir `PUBLIC_KIT_FORM_SCRIPT_SRC` con esa URL pública en el entorno de build de Netlify. El formulario aparece en `/newsletter/`; sin esa configuración, la página muestra un aviso transparente y el enlace RSS.
4. Comprobar el formulario en móvil, navegación cliente de Astro, CSP en la consola, doble confirmación, correo de bienvenida, enlace a privacidad y enlace de baja.
5. Revisar las condiciones vigentes de Kit para transferencias internacionales, acuerdo de tratamiento y branding. No guardar suscriptores en el repositorio ni ceder sus datos a anunciantes.

### Barra inferior Grove (opcional)

Además del formulario Inline de `/newsletter/`, se puede utilizar una **Sticky Bar** de Kit en las páginas `/blog/` y los artículos. La barra nunca se carga en `/newsletter/` ni en las secciones de portfolio.

1. Crear Grove como formulario **Sticky Bar**, traducir sus textos (sin promociones por defecto) y conservar la confirmación doble.
2. Kit **Settings → General**: configurar **Display form in: Bottom**, **Scroll percentage: 50 %** y una aparición como máximo cada 15 días. Ocultar a suscriptores existentes, cuando corresponda.
3. Publicar el formulario. Copiar la URL `src` del código **Embed → JavaScript**, que debe empezar por `https://f.convertkit.com/` y terminar en `.js`.
4. Añadir `PUBLIC_KIT_STICKY_FORM_SCRIPT_SRC` en las variables de entorno de **build** de Netlify, sin usar secretos. El script se incluye solo cuando su origen es válido; sin esta variable la barra no aparece.
5. Probar escritorio y móvil, ancho de la barra, botones de cierre, scroll, frecuencia, accesibilidad, CSP y navegación con Astro ClientRouter. La aparición depende de las preferencias y cookies gestionadas por Kit; probar en ventana de incógnito para descartar que se haya ocultado por frecuencia.

Este segundo formulario complementa al Inline de `/newsletter/`; **no reemplaza** `PUBLIC_KIT_FORM_SCRIPT_SRC`. Cada uno tiene su propia URL de embed. No se realizan envíos en esta integración.

El componente Inline usa el **embed oficial** de Kit. No hay plugin específico de Astro ni API key en el frontend. Los CTA de los artículos conducen a la página única de suscripción.

## Preparación automática, aprobación manual

- `pnpm newsletter:draft -- --date 2026-11-02`: muestra el borrador por consola.
- `pnpm newsletter:draft -- --date 2026-11-02 --output newsletter-draft.md`: guarda Markdown editable.
- El workflow `newsletter-draft.yml` corre los lunes y **solo genera un artifact en las semanas pares respecto al ancla**, o por petición manual con `workflow_dispatch`. No usa credenciales de Kit ni envía correos. Los artifacts de un repositorio público no son un lugar adecuado para notas privadas o patrocinios confidenciales.
- La generación usa las colecciones Markdown del repositorio, no la fecha de ficheros ni issues; comprueba fechas de los drafts y omite los borradores vencidos del avance.
- Los artículos programados **no** implican compromiso de publicación. Hay que validar qué títulos se anticipan y nunca enlazar a un draft privado.

**Cadena editorial obligatoria:**

1. `Newsletter Curator`: prepara información y texto inicial a partir del script.
2. `Astro Content Writer` (**agente redactor**): corrige enfoque, voz, selección y avances, y devuelve observaciones o versión revisada.
3. `Editorial Reviewer`: revisa corrección técnica, enlaces, privacidad, actualidad y patrocinio; devuelve «listo» o «requiere cambios».
4. **Autor**: decide si autoriza y programa el envío en Kit. No se envía si falta cualquiera de las aprobaciones anteriores.

El script y GitHub Actions **no pueden ejecutar por sí solos los agentes de VS Code / Copilot**. Sus archivos definen el circuito para una sesión con agentes; no hay validación automática por un modelo. El artifact se genera siempre como «pendiente».

## Validaciones

```bash
pnpm test:newsletter
pnpm test:content
pnpm lint
pnpm astro check
pnpm build
```

Comprobar manualmente que `/newsletter/` tiene formulario después de configurar Kit, que `/rss.xml` responde correctamente, y que cada URL de los artículos publicados existe en producción. La generación del borrador no realiza estas comprobaciones de red.

## Privacidad

El formulario debe obtener consentimiento inequívoco, confirmar la dirección y permitir la baja en cada mensaje. Actualizar la información del encargado del tratamiento y sus garantías antes de activar los envíos. La publicidad editorial que el autor apruebe se identifica como tal y no supone compartir la lista de suscriptores.
