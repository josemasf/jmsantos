# Por qué Cloudinary es útil para optimizar imágenes sin complicar el frontend

> **Estado: escrito (borrador)** — desarrollado como `src/content/drafts/posts/30-cloudinary-optimizar-imagenes-frontend.md`, programado para el 1 de septiembre de 2026.

## Idea central

Cloudinary permite tratar las imágenes como recursos que se adaptan a cada
contexto de entrega, en lugar de servir siempre el archivo original desde el
repositorio. El frontend indica qué necesita y Cloudinary responde con el
formato, tamaño y calidad adecuados para cada dispositivo.

## Contexto real del portfolio

La home combinaba imágenes locales de varios megabytes con tarjetas que se
mostraban en tamaños muy diferentes según el viewport. Por ejemplo, una
ilustración de perfil de alrededor de 2 MB podía descargarse completa aunque
en móvil se mostrara a una fracción de ese tamaño.

La integración actual genera URLs de Cloudinary para el fondo principal, la
ilustración de "Sobre mí" y las tarjetas de proyectos. Se aplican estas
transformaciones:

- `f_auto`: entrega el formato más adecuado para el navegador.
- `q_auto`: ajusta la compresión buscando un equilibrio entre calidad y peso.
- `dpr_auto`: adapta la resolución a la densidad de píxeles del dispositivo.
- `w_`, `h_`, `c_fill` y `g_auto`: solicita el tamaño y el recorte necesarios
  sin transferir píxeles que el diseño no va a mostrar.
- `srcset` y `sizes`: permiten que el navegador elija una variante más pequeña
  en móvil y una mayor en pantallas amplias.

## Ventajas que merece la pena explicar

### Menos bytes y mejor percepción de velocidad

Reducir el peso transferido acelera la carga, especialmente en redes móviles.
No se trata solo de mejorar una métrica: las imágenes de cabecera y de
proyectos aparecen antes y la página se siente más ágil.

### Un original, muchas variantes

No hay que exportar manualmente una imagen a 480, 720 y 960 píxeles, ni guardar
las tres versiones en Git. Se conserva un recurso de origen y se generan las
variantes por URL, con caché en CDN.

### Mejor soporte entre navegadores

El mismo enlace puede entregar AVIF o WebP a navegadores modernos y una
alternativa compatible cuando sea necesario. El equipo evita decidir un único
formato de compromiso para toda la audiencia.

### Recortes coherentes con el diseño

Las tarjetas tienen una proporción fija. Con `c_fill` y `g_auto`, Cloudinary
puede entregar justo ese encuadre y priorizar automáticamente la zona relevante
de la imagen. El resultado evita descargas sobredimensionadas y mantiene una
composición homogénea.

### Desacoplar contenido y entrega

Los assets siguen siendo parte del proyecto, pero la optimización y la entrega
se delegan en un servicio especializado. Esto deja el código de interfaz más
simple y hace posible cambiar tamaños o calidad sin regenerar archivos de
imagen.

## Matices importantes

- Cloudinary no corrige una imagen de origen deficiente: el archivo inicial debe
  tener una calidad y un encuadre razonables.
- Los SVG suelen ser ya ligeros y escalables; en este proyecto se mantienen como
  recursos locales.
- La migración debe ser gradual. Mientras un asset no esté subido, el fallback
  local evita imágenes rotas.
- Hay que vigilar límites, coste y políticas de caché del plan contratado.
- Para que las URLs sean predecibles, los uploads deben conservar IDs estables;
  el comando `pnpm images:upload` los publica bajo `jmsantos/assets`.

## Posible estructura del artículo

1. El problema de enviar una imagen de 2 MB para una tarjeta móvil.
2. La diferencia entre almacenar imágenes y entregarlas de forma adaptativa.
3. Cómo interpretar `f_auto`, `q_auto`, `dpr_auto`, tamaños y recorte.
4. El papel de `srcset` para no forzar una única resolución.
5. Errores habituales: no conservar el original, aplicar recortes a ciegas,
   depender de URLs sin fallback o ignorar el coste.
6. Conclusión: usar un CDN de imágenes no es solo una optimización estética;
   reduce transferencia, simplifica el mantenimiento y mejora la experiencia.
