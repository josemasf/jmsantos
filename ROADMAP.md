# Roadmap

Este documento recoge funcionalidades e iniciativas previstas para evolucionar el sitio y su flujo editorial.

## Publicación automática de artículos en LinkedIn

**Estado:** Pendiente de implementación  
**Prioridad:** Por valorar

### Objetivo

Publicar automáticamente en el perfil personal de LinkedIn los artículos del blog que se publiquen mediante el flujo de posts programados, manteniendo el contenido de LinkedIn revisado y versionado en Git antes de su publicación.

La automatización debe ejecutarse después de que el artículo haya sido publicado correctamente en el blog. Un fallo de LinkedIn no debe bloquear ni revertir la publicación del artículo.

### Metadatos del post

Añadir al frontmatter de los artículos un bloque opcional:

```yaml
linkedin:
  publish: true
  commentary: |
    Texto previamente revisado que acompañará al artículo en LinkedIn.
```

El contenido para LinkedIn no se generará con IA durante el workflow. Se preparará y revisará junto al artículo para que quede versionado en el repositorio.

### V1 — Texto + Article Post

- Ampliar el schema de contenido de Astro para soportar `linkedin.publish` y `linkedin.commentary`.
- Crear un script independiente, por ejemplo `script/publish-linkedin-posts.mjs`.
- Consumir `publication.json`, generado por el flujo actual de posts programados, para conocer los artículos recién publicados.
- Publicar únicamente aquellos artículos que tengan `linkedin.publish: true`.
- Utilizar la LinkedIn Posts API con el permiso `w_member_social`.
- Crear un Article Post con:
  - texto definido en `linkedin.commentary`;
  - URL pública del artículo;
  - título;
  - descripción.
- Ejecutar la publicación en LinkedIn después del paso que confirma la publicación del artículo en Git.
- Configurar el token y el identificador del autor mediante GitHub Secrets/Variables.
- Registrar en el aviso de publicación del workflow si LinkedIn se publicó correctamente o falló.
- El fallo de LinkedIn debe tratarse como un fallo no bloqueante para el blog.

### V2 — Portada del artículo

Reutilizar la imagen definida en `image.src` como portada de la publicación en LinkedIn:

1. obtener la imagen del artículo;
2. subirla mediante la API de imágenes de LinkedIn;
3. obtener su URN;
4. utilizarla como `thumbnail` del Article Post.

### Flujo previsto

```text
Post programado
      │
      ▼
Publicar en el blog
      │
      ▼
Build + commit + push
      │
      ▼
publication.json
      │
      ▼
¿linkedin.publish === true?
      │
   ┌──┴──┐
   │     │
  no    sí
   │     │
  fin    ▼
       LinkedIn Posts API
            │
            ▼
       Registrar resultado
```

### Consideraciones técnicas

- Mantener separadas las responsabilidades de publicación del blog y publicación en LinkedIn.
- No incorporar lógica de LinkedIn dentro de `publish-scheduled-posts.mjs`.
- Añadir tests específicos para el script de LinkedIn.
- Evitar publicar dos veces el mismo artículo si se reejecuta un workflow.
- No almacenar tokens ni credenciales en el repositorio.
- Los access tokens de LinkedIn tienen una vida limitada, por lo que inicialmente se asumirá su renovación manual cuando sea necesario.

### Criterios de aceptación de V1

- Un artículo sin bloque `linkedin` se publica normalmente en el blog y no genera ninguna llamada a LinkedIn.
- Un artículo con `linkedin.publish: false` no se publica en LinkedIn.
- Un artículo con `linkedin.publish: true` se publica en LinkedIn después de confirmarse su publicación en el blog.
- El texto publicado coincide con el contenido versionado en `linkedin.commentary`.
- La publicación enlaza a la URL pública correcta del artículo.
- Si LinkedIn responde con error, el workflow informa del fallo pero el artículo permanece publicado.
- Una reejecución del workflow no debe generar publicaciones duplicadas en LinkedIn.
