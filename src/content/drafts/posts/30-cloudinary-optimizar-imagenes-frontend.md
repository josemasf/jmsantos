---
title: "Cómo optimizar imágenes con Cloudinary sin complicar el frontend"
description: "Cómo usar Cloudinary para servir imágenes adaptadas al dispositivo con formatos automáticos, recortes, srcset y fallbacks sin multiplicar los assets del proyecto."
date: 2026-08-25
tags: [Cloudinary, imágenes, rendimiento web, frontend, Astro, optimización]
category: Frontend
image:
  src: /images/blog/cloudinary-optimizar-imagenes-frontend/cloudinary-imagenes-responsive.png
  alt: Una imagen original se transforma mediante un servicio en la nube en tres variantes para móvil, tableta y escritorio.
  width: 1536
  height: 1024
---

Una imagen puede ser correcta desde el punto de vista visual y seguir siendo una decisión costosa para la web. Ocurre, por ejemplo, cuando una tarjeta de proyecto muestra una versión pequeña de un archivo que pesa varios megabytes, o cuando el navegador descarga la misma imagen para un móvil y para una pantalla de alta densidad. El problema no es que el repositorio guarde un original grande; el problema es entregarlo sin adaptación a todos los contextos.

En este portfolio empecé a usar Cloudinary para desacoplar ambas decisiones. Los originales siguen siendo recursos del proyecto, pero las imágenes que recibe cada navegador se construyen con una URL que expresa el tamaño, el recorte, el formato y la calidad necesarios. Así se evita exportar y versionar manualmente una variante para cada tarjeta, resolución y punto de ruptura.

La idea no es añadir una capa de abstracción sobre cada etiqueta `img`. Es conservar una interfaz sencilla y delegar la transformación y distribución de los recursos rasterizados en un servicio que está preparado para ello.

## El tamaño visible no determina lo que descarga el navegador

Una tarjeta puede medir unos cientos de píxeles de ancho y, sin embargo, estar usando como fuente una captura o ilustración mucho mayor. CSS la reduce al pintarla, pero no reduce los bytes que ya se han transferido. En una conexión móvil, ese coste se acumula rápido cuando la página contiene una cabecera, una imagen de perfil y varias tarjetas.

El primer paso es separar tres conceptos que con frecuencia se mezclan: el original que conviene conservar, la variante que necesita un componente y la resolución que debe elegir cada navegador. El original permite volver a recortar o entregar una versión de mayor calidad en el futuro. La variante define el encuadre del diseño. La resolución depende del ancho final de la imagen, del viewport y de la densidad de píxeles del dispositivo.

Cloudinary permite expresar la variante en la URL de entrega. Por ejemplo, una imagen para una tarjeta de 960 píxeles de ancho puede solicitarse con formato y calidad automáticos:

```text
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_960/<public-id>
```

La documentación de Cloudinary describe `f_auto` como una selección automática de formato según el cliente que realiza la petición y `q_auto` como una estrategia de calidad automática. [Su guía de optimización de imágenes](https://cloudinary.com/documentation/image_optimization) recoge ambas transformaciones junto con las opciones de redimensionado y entrega responsive. No sustituyen una elección de diseño, pero evitan fijar un único formato y una única compresión para todos los navegadores.

## Una función pequeña mantiene las URLs coherentes

La integración del portfolio está concentrada en dos utilidades: una genera una URL para una imagen y otra construye un `srcset` a partir de varios anchos. La primera siempre aplica las transformaciones básicas y solo añade altura, recorte y gravedad cuando el componente necesita una proporción concreta.

```ts
type CloudinaryImageOptions = {
  width: number;
  height?: number;
  crop?: "fill" | "fit";
};

export function cloudinaryAssetUrl(
  assetPath: string,
  { width, height, crop = "fit" }: CloudinaryImageOptions,
) {
  const publicId = assetPath.replace(/^\/assets\//, "jmsantos/assets/");
  const transformations = ["f_auto", "q_auto", "dpr_auto", `w_${width}`];

  if (height) {
    transformations.push(`h_${height}`, `c_${crop}`, "g_auto");
  }

  return `https://res.cloudinary.com/<cloud>/image/upload/${transformations.join(",")}/${publicId}`;
}
```

`w_` y `h_` solicitan dimensiones concretas. Cuando hay que rellenar una proporción fija, `c_fill` recorta para ajustarse a ella; `g_auto` pide a Cloudinary que determine automáticamente la zona relevante para el encuadre. La documentación de [redimensionado y recorte](https://cloudinary.com/documentation/resizing_and_cropping) explica los modos de recorte y las opciones de gravedad disponibles. En este caso, el matiz importante es que el recorte forma parte de la presentación: no debería aplicarse por defecto a cualquier imagen sin comprobar antes que conserva lo que el contenido necesita mostrar.

Tener la lógica en una utilidad no pretende ocultar Cloudinary. Hace explícita una convención: los recursos bajo `/assets/` pueden usar el CDN y todos comparten unas transformaciones de partida. Cuando cambie el criterio de calidad, una anchura estándar o la carpeta de publicación, habrá un único lugar que revisar.

## `srcset` evita enviar la variante grande por defecto

Solicitar una variante de 960 píxeles es mejor que servir el original, pero sigue siendo una elección fija. Una tarjeta en móvil suele necesitar menos ancho y una pantalla de mayor densidad puede beneficiarse de una versión distinta. Para dejar que el navegador elija, la utilidad genera varios candidatos:

```ts
export function cloudinarySrcSet(
  assetPath: string,
  widths: number[],
  options: Omit<CloudinaryImageOptions, "width"> = {},
) {
  return widths
    .map(
      (width) =>
        `${cloudinaryAssetUrl(assetPath, { ...options, width })} ${width}w`,
    )
    .join(", ");
}
```

El componente aporta los tamaños que realmente puede ocupar en la cuadrícula:

```astro
<img
  src={cloudinaryAssetUrl(image, { width: 960, height: 600, crop: "fill" })}
  srcset={cloudinarySrcSet(image, [480, 720, 960], { height: 600, crop: "fill" })}
  sizes="(min-width: 1280px) 29vw, (min-width: 768px) 44vw, 100vw"
  alt={alt}
  loading="lazy"
  decoding="async"
/>
```

`srcset` enumera los recursos disponibles y `sizes` describe el ancho de renderizado previsto en cada breakpoint. Con esa información, el navegador puede elegir antes de descargar cuál de las variantes es apropiada. La lista de anchos debe proceder del diseño, no de una colección arbitraria de valores. Si una tarjeta no se muestra a más de 480 píxeles en móvil, incluir una variante de 480 suele ser más útil que servir siempre la de 960 y confiar en que el CSS la reduzca después.

`dpr_auto` añade otra adaptación a la petición: Cloudinary puede tener en cuenta la densidad de píxeles del dispositivo cuando recibe la información necesaria. Aun así, no elimina la responsabilidad de definir `srcset` y `sizes`. La densidad y el espacio que ocupa el elemento son señales distintas; conviene proporcionar ambas cuando se busca una entrega responsive predecible.

## Un buen recorte no es un efecto automático

Las tarjetas del portfolio comparten una proporción. Eso mejora la lectura de la cuadrícula, pero obliga a decidir qué hacer con imágenes de origen muy distintas. Con `c_fill`, Cloudinary entrega exactamente el marco que pide el componente; con `g_auto`, intenta proteger la zona relevante del contenido. Es una opción útil para una colección heterogénea, sobre todo cuando el valor visual está concentrado en una persona, un objeto o una interfaz.

Sin embargo, la automatización no conoce la intención editorial de cada recurso. Una captura de producto puede necesitar una zona concreta de la interfaz, y una composición deliberadamente asimétrica puede perder el elemento que le da sentido. Antes de generalizar el recorte automático, revisaría las imágenes reales en los tamaños donde se publicarán. Si una necesita una composición específica, es preferible definirla de forma consciente que forzar el mismo comportamiento que funciona para el resto.

## Mantener un fallback hace la migración reversible

Una migración de imágenes no tiene por qué ocurrir de una vez. En las tarjetas, el componente solo usa Cloudinary con recursos rasterizados de `/assets/`; los SVG permanecen locales. Además, conserva la ruta local como fallback:

```astro
<img
  src={cloudinarySrc}
  srcset={cloudinarySrcSet}
  onerror={`this.removeAttribute('srcset'); this.src='${localSrc}'`}
/>
```

Este mecanismo no debe esconder una incidencia persistente del CDN, que merecería investigarse. Su utilidad está en que el despliegue no queda acoplado a una migración completa de assets: si un recurso aún no se ha publicado o una URL falla, la imagen local sigue disponible. También permite adoptar la optimización de forma gradual y comprobar cada zona visual antes de retirar la alternativa.

El fallback no reemplaza las medidas básicas de accesibilidad. La imagen sigue necesitando un `alt` que describa su contenido o propósito; si es decorativa, el `alt` vacío debe ser una decisión explícita. Tampoco conviene usar una imagen remota como fondo visual crítico sin valorar qué ocurrirá si tarda en cargar o no responde.

## Lo que Cloudinary simplifica y lo que sigue siendo una decisión del proyecto

Cloudinary reduce trabajo repetitivo: puede generar variantes bajo demanda, servirlas desde CDN y adaptar formato, calidad y tamaño sin almacenar cada exportación en Git. Para un portfolio con varios contextos de visualización, esto evita que la carpeta de imágenes crezca con versiones casi idénticas y permite cambiar una dimensión de tarjeta sin repetir un proceso de edición.

Pero no convierte la optimización en algo automático. El proyecto sigue decidiendo qué originales conserva, qué recursos pueden salir del repositorio, qué proporciones tiene el diseño, qué ancho necesita cada breakpoint y qué presupuesto de uso o de caché es razonable. También debe mantener identificadores de publicación estables: una URL predecible facilita depurar, invalidar y sustituir un recurso cuando sea necesario.

La mejora práctica consiste en no tratar todas las imágenes como archivos estáticos idénticos. El original sigue siendo la fuente de trabajo; la URL de entrega se convierte en un contrato entre el diseño, el navegador y el CDN. Con una utilidad pequeña, candidatos responsive y recortes revisados, se puede reducir transferencia sin trasladar complejidad innecesaria a cada componente.

Para seguir revisando el rendimiento de una interfaz, el siguiente paso no es añadir transformaciones a ciegas, sino medir qué recursos aparecen en cada página y en qué tamaño se descargan. La optimización de imágenes funciona mejor cuando responde a esas condiciones reales que cuando se limita a aplicar una receta universal.
