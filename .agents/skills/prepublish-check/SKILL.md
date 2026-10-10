---
name: prepublish-check
description: "Revisar la preparación de un artículo Astro: esquema, series, enlaces, assets, rigor, privacidad y calendario. Usar antes de programar, publicar o aprobar una actualización."
---

# Revisar antes de publicar

Leer `docs/editorial-workflow.md`, la issue de origen, el artículo y sus fuentes.
Consultar `src/data/post-schema.ts` y `src/data/blog-series.ts`; no copiar un
frontmatter de memoria. Comprobar `issue` contra el repositorio si existe.

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

Para integrar una imagen real, leer primero el agente Visual Asset Prompt Designer,
usar un generador disponible y optimizar con `pnpm images:optimize -- entrada.png
public/images/blog/<slug>/portada.webp`. Comprobar alt, dimensiones reales y recorte.
No declarar entregada una portada si solo se ha preparado su prompt.

Entregar **listo** o **requiere cambios**, bloqueantes, mejoras, evidencia de los
comandos y verificaciones pendientes. No afirmar validación visual si no se hizo.
No enviar publicaciones ni activar workflows como parte de esta comprobación.
