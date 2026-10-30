---
name: prepublish-check
description: "Revisar la preparación de un artículo Astro: esquema, series, enlaces, assets, rigor, privacidad y calendario. Usar antes de programar, publicar o aprobar una actualización."
---

# Revisar antes de publicar

Leer `docs/editorial-workflow.md`, la issue de origen, el artículo y sus fuentes.
Consultar `src/data/post-schema.ts` y `src/data/blog-series.ts`; no copiar un
frontmatter de memoria. **Todos los borradores deben tener `issue: N`** en
frontmatter. Abrir la issue real en `josemasf/jmsantos` y verificar que es la
ficha de origen del artículo o de la serie. Si no existe, crear una ficha editorial
apropiada antes de programar; no deducir el número del archivo ni vincular una
issue solo por similitud de título. Los posts históricos ya publicados son la
única excepción de compatibilidad.

1. Revisar tesis, pruebas de ejemplos, referencias primarias, límites y separación
   de hechos/opinión/experiencia. Marcar evidencia pendiente.
2. Revisar voz en español de España: prosa conectada, decisiones concretas y
   razones. Eliminar vivencias inventadas, marketing vacío y ritmo de red social.
3. Revisar privacidad y anonimización; excluir informes y detalles identificativos.
4. Ejecutar desde la raíz:
   ```bash
   pnpm test:content
   pnpm content:check
   pnpm lint
   pnpm astro check
   pnpm build
   pnpm content:check -- --built
   pnpm publish:scheduled -- --dry-run
   ```
5. Comprobar la previsualización del artículo y portada. El build de producción
   excluye drafts; usar `pnpm dev` para revisarlos. Examinar enlaces de drafts a
   capítulos pendientes: no presentarlos como publicados. Revalidarlos al mover el lote.
6. Confirmar fechas aprobadas, orden y dependencias de la serie. No publicar
   borradores vencidos ni cambiar fechas durante una revisión.
7. Tratar la falta de `issue` o una relación incorrecta como **bloqueante**:
   `pnpm content:check` y el dry-run deben detectarla antes del workflow.

## Referencias visibles para lectores

- La issue editorial es **solo contexto interno** y metadato `issue: N`. No enlazarla ni mencionarla en el cuerpo del artículo o en piezas de difusión.
- Bloquear enlaces a `github.com/josemasf/jmsantos/issues/<número>` y referencias narrativas a `issue #N` como origen o fundamento del texto. Revisar también expresiones como «la propuesta de la issue» aunque no lleven número.
- Verificar que los enlaces de lectura apunten a contenido realmente publicado (blog, documentación, fuentes primarias), no a drafts ni a fichas del backlog. Si no hay una referencia útil y pública, no añadir enlace.
- Ejecutar `pnpm content:check` y revisar el diff de Markdown para localizar filtraciones que no capture un patrón automático.

Para integrar una imagen real, leer primero el agente Visual Asset Prompt Designer,
usar un generador disponible y optimizar con `pnpm images:optimize -- entrada.png
public/images/blog/<slug>/portada.webp`. Comprobar alt, dimensiones reales y recorte.
No declarar entregada una portada si solo se ha preparado su prompt.

Entregar **listo** o **requiere cambios**, bloqueantes, mejoras, evidencia de los
comandos y verificaciones pendientes. No afirmar validación visual si no se hizo.
No enviar publicaciones ni activar workflows como parte de esta comprobación.
