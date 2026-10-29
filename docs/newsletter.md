# Newsletter quincenal

## Objetivo y frecuencia

La newsletter de josemariasantos.com, **«Lo que aprendo construyendo software»**, se prepara cada 14 días, independientemente de la publicación semanal del blog. Comparte experiencias y aprendizajes sobre ingeniería de software, arquitectura, calidad, inteligencia artificial, producto y cultura de equipos. Incluye artículos publicados en los **14 días anteriores** (inicio incluido y fecha de edición excluida), hasta dos **candidatos** de próximos artículos, una reflexión útil revisada por el autor y publicidad **solo propia o aprobada expresamente**. Nada de recomendaciones publicitarias automáticas de Kit.

El calendario de preparación comienza el **lunes 2 de noviembre de 2026** y continúa cada 14 días. Es solo la **preparación de un borrador**, no una cadencia de envíos automática. Modificar el ancla junto con el workflow si se cambia el día.

## Contrato editorial y visual de cada edición

**No es un índice cronológico de entradas.** Cada correo tiene que defender una idea útil, destacar una lectura y dar valor por sí mismo, incluso si nadie hace clic. El lector debe poder escanearlo en segundos y leerlo en **3–5 minutos** (objetivo orientativo de **350–600 palabras** en el cuerpo final, sin convertirlo en un límite rígido).

### Jerarquía obligatoria del correo

1. **Asunto y preheader**: asunto breve, específico y con promesa verificable; el preheader amplía la idea y no la repite. Prohibido usar «Newsletter quincenal · FECHA» como asunto principal.
2. **Cabecera de marca**: «Lo que aprendo construyendo software», fecha discreta y una única identidad reconocible.
3. **Titular editorial + apertura**: una idea o problema concreto del periodo, no un resumen administrativo de lo publicado; 60–100 palabras orientativas. Evitar «En las últimas dos semanas he publicado…».
4. **Lectura destacada**: **un artículo** elegido por relevancia para esa tesis, no automáticamente por fecha; explicar qué problema resuelve y qué se lleva el lector. Un enlace/CTA principal descriptivo.
5. **Para profundizar**: hasta **dos** artículos complementarios, con títulos legibles y resúmenes breves que expliquen por qué leerlos. Si hay más artículos, ofrecerlos en **Lecturas rápidas** con una línea cada uno; no repetir títulos ni descripciones.
6. **Una idea para aplicar**: un consejo, comprobación, pequeña prueba o reflexión **sustentada** que pueda aplicarse sin salir del correo. No inventar aprendizajes personales del autor ni afirmar que se ha probado algo sin evidencia. Omitir si no hay valor comprobable.
7. **Cierre con conversación**: una pregunta específica relacionada con la edición y una invitación natural a responder. No crear llamadas artificiales al engagement.
8. **Firma y elementos legales**: identidad del autor, enlaces de privacidad y baja gestionados correctamente en Kit.

Los próximos artículos de `src/content/drafts/posts/` **no forman parte del correo por defecto**: se conservan como propuestas internas y solo se anticipan tras aprobación expresa. La publicidad aprobada, si la hay, se indica inequívocamente como publicidad y no desplaza la lectura principal.

**Cuando no haya publicaciones recientes**, no fabricar una lectura destacada: indicar la carencia en el borrador y proponer una edición autónoma basada en una idea contrastada, o recomendar posponer el envío. No incluir placeholders, instrucciones al agente, checklist ni notas internas en el correo final.

### Reglas de legibilidad y diseño para Kit

- **Una columna** y un ancho de contenido de referencia de **600–640 px**; márgenes interiores cómodos en móvil.
- Texto principal de **16–18 px** con interlineado aprox. **1,5–1,7**; titular de **28–32 px**, subtítulos **20–24 px** y separación visible entre bloques.
- Alineación izquierda, párrafos cortos pero completos y jerarquía clara: titular, descripción, CTA. No presentar todos los artículos como viñetas con idéntico peso visual.
- Usar una paleta reducida y coherente con el blog; contraste WCAG AA (**4,5:1** para texto normal, **3:1** para texto grande). El significado nunca depende exclusivamente del color.
- Un enlace destacado para el artículo principal y enlaces secundarios descriptivos; evitar cadenas de CTA repetidos. Añadir imágenes solo si aportan información (diagrama, ejemplo real), con texto alternativo; el correo debe entenderse con imágenes desactivadas.
- El **Markdown es el contenido editorial**, **no** la plantilla HTML del email. Aplicar estas reglas en una plantilla compatible con Kit y los clientes de correo, sin reutilizar directamente los componentes Astro/Tailwind del blog. Favorecer HTML de email simple y estilos inline compatibles; incluir versión de texto plano.
- Antes de enviar, revisar en móvil y escritorio, Gmail, Outlook y Apple Mail (incluido modo oscuro), enlaces, navegación por teclado, contraste y ausencia de desplazamiento horizontal.
- No insertar píxeles o scripts de seguimiento ajenos, imágenes remotas innecesarias ni formularios activos dentro del cuerpo.

### Checklist editorial bloqueante

- [ ] El asunto y preheader comunican valor sin clickbait.
- [ ] Existe una tesis y **una** lectura principal diferenciada de las secundarias.
- [ ] La apertura y los resúmenes explican utilidad para el lector; no son un índice de títulos.
- [ ] El correo aporta al menos una idea aprovechable sin clic o justifica expresamente su ausencia.
- [ ] La jerarquía se entiende en móvil y los enlaces describen su destino.
- [ ] Todos los artículos y afirmaciones están verificados; no hay experiencias personales inventadas.
- [ ] Ninguna nota interna, candidato no aprobado ni placeholder llega a Kit.
- [ ] Se mantiene la revisión `Newsletter Curator → Astro Content Writer → Editorial Reviewer → autor`.

## Captación con Kit

1. Crear una cuenta en Kit y un formulario **Inline Form** con **doble confirmación** activada. Desactivar recomendaciones de la red de Kit y cualquier programa promocional no aprobado.
2. En Kit, ir a **Grow → Landing Pages & Forms → formulario → Embed → JavaScript**. Copiar el atributo `src` del script generado. Puede ser una URL `https://f.convertkit.com/...js` o la URL del formulario alojado en Kit, como `https://jose-maria-santos.kit.com/5c2c8714b9/index.js`. No pegar claves privadas, API tokens ni el código entero en el repositorio.
3. Definir `PUBLIC_KIT_FORM_SCRIPT_SRC` con esa URL pública completa (sin las etiquetas `<script>`) en el entorno de build de Netlify. Para los enlaces alojados en `*.kit.com/ID/index.js`, la página extrae el identificador público y genera también el atributo `data-uid` exigido por el embed oficial. Se muestra además un enlace directo a Kit por si el JavaScript falla. El formulario aparece en `/newsletter/`; sin esa configuración, la página muestra un aviso transparente y el enlace RSS.
4. Comprobar el formulario en móvil, navegación cliente de Astro, CSP en la consola, doble confirmación, correo de bienvenida, enlace a privacidad y enlace de baja.
5. Revisar las condiciones vigentes de Kit para transferencias internacionales, acuerdo de tratamiento y branding. No guardar suscriptores en el repositorio ni ceder sus datos a anunciantes.

### Barra inferior Grove (opcional)

Además del formulario Inline de `/newsletter/`, se puede utilizar una **Sticky Bar** de Kit en las páginas `/blog/` y los artículos. La barra nunca se carga en `/newsletter/` ni en las secciones de portfolio.

1. Crear Grove como formulario **Sticky Bar**, traducir sus textos (sin promociones por defecto) y conservar la confirmación doble.
2. Kit **Settings → General**: configurar **Display form in: Bottom**, **Scroll percentage: 50 %** y una aparición como máximo cada 15 días. Ocultar a suscriptores existentes, cuando corresponda.
3. Publicar el formulario. Copiar la URL `src` del código **Embed → JavaScript**, que debe empezar por `https://f.convertkit.com/` y terminar en `.js`.
4. Añadir `PUBLIC_KIT_STICKY_FORM_SCRIPT_SRC` en las variables de entorno de **build** de Netlify, sin usar secretos. El script se incluye **solo en las rutas del blog** cuando su origen es válido; sin esta variable la barra no aparece. El embed incorpora `data-uid` y `data-astro-rerun` para la navegación mediante `ClientRouter`.
5. Probar escritorio y móvil, ancho de la barra, botones de cierre, scroll, frecuencia, accesibilidad, CSP y navegación con Astro ClientRouter.

**Diagnóstico de Grove si no se ve:** el script puede estar cargado correctamente y Kit decidir que no debe mostrarlo. En Kit, abrir Grove → Settings → General y comprobar el formato **Sticky Bar**, el disparador de **Scroll percentage** (50 %), los dispositivos **All Devices** y la frecuencia de aparición (**0 días temporalmente para probar**, volver a 15 días después). En Settings → Advanced, revisar la opción de ocultar el formulario a suscriptores existentes. Probar en ventana privada y entrar directamente en `/blog/` (no en `/newsletter/`). Si se ve por detrás del sitio, `KitStickyBar.astro` eleva el `z-index` conforme a la solución oficial de Kit. No es posible forzar desde Astro las condiciones de visibilidad controladas por Kit. La aparición depende de las preferencias y cookies gestionadas por Kit; probar en ventana de incógnito para descartar que se haya ocultado por frecuencia.

Este segundo formulario complementa al Inline de `/newsletter/`; **no reemplaza** `PUBLIC_KIT_FORM_SCRIPT_SRC`. Cada uno tiene su propia URL de embed. No se realizan envíos en esta integración.

El componente Inline usa el **embed oficial** de Kit. No hay plugin específico de Astro ni API key en el frontend. Los CTA de los artículos conducen a la página única de suscripción.

### Crear un Broadcast como borrador mediante Kit API v4

La automatización local opcional usa la API oficial, no credenciales del navegador ni Actions:

1. Comprueba que el plan de la cuenta es elegible para API y Broadcasts.
2. Crea una API key V4 en Kit y guárdala como `KIT_API_KEY` en `.env` local ignorado por Git. No usar `API_SECRET`, `PUBLIC_*` ni copiar credenciales de Cloudinary.
3. Configura `KIT_NEWSLETTER_SUBJECT`, `KIT_NEWSLETTER_PREVIEW_TEXT` y, opcionalmente, `KIT_EMAIL_TEMPLATE_ID` en `.env`. La API no permite aplicar las plantillas **Starting point**; si la plantilla habitual es de ese tipo, la creación por API no reproduce fielmente su editor y hay que usar una plantilla compatible/documentada.
4. Completa primero la revisión de `Astro Content Writer` y `Editorial Reviewer`. Después, si el autor ha pedido un Broadcast de revisión, ejecuta `pnpm newsletter:kit -- --draft newsletter-draft.md --subject "Asunto" --preview "Texto de preview" --template-id ID`. El comando lista drafts existentes para evitar un asunto duplicado y crea el Broadcast con `send_at: null` y `public: false`. No programa ni envía. La aprobación del autor sigue siendo necesaria antes de cualquier programación o envío.

El endpoint de listado cubre drafts, programados e históricos y es paginado. El cliente de este repositorio consulta drafts antes de crear, pero ese control por asunto no elimina la posibilidad de una carrera si se ejecutan dos procesos simultáneamente. La llamada de creación es externa y no reversible automáticamente; usarla solo después de la aprobación editorial y del autor. La automatización no se ejecuta desde GitHub Actions.

## Preparación automática, aprobación manual

- `pnpm newsletter:draft -- --date 2026-11-02`: muestra el borrador por consola.
- `pnpm newsletter:draft -- --date 2026-11-02 --output newsletter-draft.md`: guarda Markdown editable.
- `pnpm newsletter:kit -- --draft newsletter-draft.md --subject "Asunto" --preview "Preview" --template-id ID`: crea un Broadcast privado en estado draft desde el Markdown ya revisado; requiere `KIT_API_KEY` local, además de aprobación expresa para realizar esta escritura en Kit.
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
