# Calendario de borradores

Esta carpeta contiene artículos ya redactados y pendientes de publicación. Su propósito es mantener una cadencia editorial semanal sin confundir un borrador programado con un post ya público.

## Fuente de verdad

- `src/content/posts/` contiene los posts publicados.
- `src/content/drafts/posts/` contiene los borradores pendientes.
- El campo `date` del frontmatter determina la fecha programada; el prefijo numérico del archivo no determina el orden de publicación.
- La zona horaria de referencia es `Europe/Madrid`.

## Revisión obligatoria antes de crear un borrador

Antes de asignar fecha o prefijo a un nuevo borrador, sigue esta secuencia:

1. Ejecuta la comprobación de publicaciones vencidas:

   ```bash
   pnpm publish:scheduled -- --dry-run
   ```

   Si `pnpm` no está disponible en el entorno, usa el ejecutable local:

   ```bash
   node script/publish-scheduled-posts.mjs --dry-run
   ```

2. Revisa el resultado junto con `src/content/posts/`. Los posts cuya fecha ya ha llegado y estén en la colección pública ya no deben considerarse borradores ni ocupar huecos del calendario.
3. Si existen borradores vencidos que siguen en `src/content/drafts/posts/`, publícalos antes de planificar el siguiente, salvo que la petición indique expresamente conservarlos como borradores:

   ```bash
   pnpm publish:scheduled
   ```

4. Lee las fechas de **todos** los archivos Markdown de `src/content/posts/` y `src/content/drafts/posts/`, incluidos subdirectorios. Detecta fechas ausentes, inválidas o duplicadas antes de continuar.
5. Ordena el calendario por `date`, identifica huecos de siete días y decide si un borrador existente debe ocupar uno antes de añadir otro al final.
6. Solo entonces calcula el prefijo numérico siguiente y la fecha del nuevo borrador.

## Criterio de programación

Un borrador nuevo se programa semanalmente a partir de la fecha más reciente ya planificada. Si hay huecos previos, pueden reutilizarse cuando el tema encaje y se mantenga la cadencia editorial. No se cambian fechas de otros borradores sin una decisión explícita.

Después de crear, mover o publicar un borrador, vuelve a comprobar el calendario por fecha y ejecuta las validaciones de contenido habituales.

## Publicación programada

`script/publish-scheduled-posts.mjs` mueve a `src/content/posts/` todos los borradores con fecha igual o anterior a la fecha actual de Madrid. La opción `--dry-run` solo informa de qué archivos se publicarían. El script evita sobrescribir un post público con la misma ruta.
