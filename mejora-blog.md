## Instrucción para mejorar la cabecera del blog

Rediseña la cabecera principal de la página `/blog/` para incorporar la imagen `jose-maria-santos-01.png` a la derecha y conseguir una composición más visual, equilibrada y responsive.

### Objetivo

La cabecera debe presentar claramente el blog y reforzar la identidad personal de José María Santos sin aumentar innecesariamente su altura.

Debe mantenerse el contenido actual:

```text
IDEAS Y APRENDIZAJES

Blog

Notas prácticas sobre frontend, arquitectura, calidad y las decisiones
que hacen avanzar a los equipos.
```

## Cambios requeridos

### 1. Incorporar la imagen

Utiliza el asset:

```text
jose-maria-santos-01.png
```

Antes de modificar el componente:

- Localiza la ruta real del archivo.
- Reutiliza el sistema de assets existente.
- No dupliques la imagen.
- Comprueba si el PNG tiene transparencia real.
- No añadas un fondo negro alrededor de la ilustración.
- No recortes la cabeza, el portátil, la planta ni el cuaderno.

La imagen debe situarse en la parte derecha de la cabecera.

---

### 2. Nuevo layout de escritorio

Convierte la cabecera en una composición de dos columnas:

- Columna izquierda: etiqueta, título y descripción.
- Columna derecha: ilustración.
- Proporción aproximada `48% / 52%`.
- Contenido alineado verticalmente al centro.
- Altura controlada por el contenido, no por el viewport.
- Sin grandes zonas vacías por encima o por debajo.

No utilizar:

```css
height: 100vh;
min-height: 100vh;
```

ni alturas fijas excesivas.

La cabecera debería ocupar aproximadamente entre `460px` y `620px` en escritorio, dependiendo del ancho disponible.

### Layout orientativo

```css
.blog-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);

  width: min(100% - 3rem, 1440px);
  margin-inline: auto;
  padding-block: clamp(3.5rem, 7vw, 6rem);
}

.blog-hero__content {
  max-width: 720px;
}

.blog-hero__media {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-width: 0;
}

.blog-hero__image {
  display: block;
  width: min(100%, 760px);
  height: auto;
  max-height: 520px;
  object-fit: contain;
}
```

Adapta los nombres de clases al componente y a las convenciones reales del proyecto.

---

### 3. Tratamiento de la imagen

La imagen no debe comportarse como una fotografía recortada.

Utiliza:

```css
object-fit: contain;
```

No utilices:

```css
object-fit: cover;
```

porque se perderían partes importantes de la ilustración.

La figura debe:

- Apoyarse visualmente en la parte inferior de la cabecera.
- Tener suficiente presencia sin competir con el título.
- Mantener la transparencia.
- No proyectar un rectángulo de fondo diferente al fondo del hero.
- No superar la altura visual del bloque de forma desproporcionada.

Se puede añadir un resplandor o degradado muy sutil detrás de la ilustración, reutilizando los colores de la web:

```css
.blog-hero__media {
  position: relative;
}

.blog-hero__media::before {
  position: absolute;
  inset: 15% 10% 5%;
  z-index: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(50 210 220 / 12%), transparent 68%);
  content: "";
  pointer-events: none;
}

.blog-hero__image {
  position: relative;
  z-index: 1;
}
```

Este efecto es opcional y debe eliminarse si reduce el contraste o hace que la composición parezca recargada.

---

### 4. Ajustar el contenido

Mantén una jerarquía clara:

- Etiqueta pequeña en color de acento.
- Título principal como único `<h1>`.
- Descripción con una anchura de lectura controlada.

Configuración orientativa:

```css
.blog-hero__eyebrow {
  margin-bottom: 1.25rem;
}

.blog-hero__title {
  margin: 0;
  font-size: clamp(3.5rem, 7vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.blog-hero__description {
  max-width: 700px;
  margin-top: 2rem;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  line-height: 1.55;
}
```

Evita que el título o la descripción queden excesivamente alejados entre sí.

---

## Responsive

### Tablet

Por debajo de aproximadamente `1100px`:

- Mantén las dos columnas mientras haya espacio suficiente.
- Reduce el hueco entre columnas.
- Reduce el tamaño máximo de la imagen.
- Utiliza una proporción más equilibrada.
- Evita que la descripción quede en una columna demasiado estrecha.

```css
@media (max-width: 1100px) {
  .blog-hero {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
    gap: 2rem;
  }

  .blog-hero__image {
    max-height: 430px;
  }
}
```

### Móvil

Por debajo de aproximadamente `768px`:

- Cambia a una sola columna.
- Muestra primero el texto.
- Muestra la ilustración debajo.
- Centra la imagen.
- Reduce la altura y el espacio vertical.
- Evita que la imagen obligue a realizar un desplazamiento excesivo antes de llegar a los artículos.
- No ocultes completamente la ilustración salvo que exista una razón de rendimiento documentada.

```css
@media (max-width: 768px) {
  .blog-hero {
    grid-template-columns: 1fr;
    gap: 2rem;
    width: min(100% - 2rem, 680px);
    padding-block: 3rem 2rem;
  }

  .blog-hero__content {
    max-width: none;
  }

  .blog-hero__media {
    justify-content: center;
  }

  .blog-hero__image {
    width: min(100%, 520px);
    max-height: 360px;
  }
}
```

### Móviles pequeños

Por debajo de `420px`:

- Reduce el título sin perder jerarquía.
- Limita la ilustración a una altura aproximada de `280px`.
- Mantén los elementos importantes de la ilustración visibles.
- Evita cualquier desbordamiento horizontal.

---

## Integración con el fondo actual

Mantén el fondo oscuro y el degradado actual de la cabecera, pero redistribúyelo para acompañar la nueva composición.

El degradado puede desplazarse ligeramente hacia la zona derecha, detrás de la ilustración:

```css
.blog-hero-wrapper {
  background:
    radial-gradient(circle at 82% 45%, rgb(55 48 150 / 28%), transparent 38%),
    linear-gradient(110deg, #001824 0%, #020719 55%, #181645 100%);
}
```

No introduzcas un degradado completamente nuevo si existe un token o estilo reutilizable en el proyecto.

---

## Rendimiento

Como la ilustración aparece en la primera pantalla:

- No utilizar `loading="lazy"`.
- Añadir `fetchpriority="high"` solo si la imagen forma parte del LCP.
- Incluir `width` y `height` reales.
- Utilizar `decoding="async"`.
- Generar WebP o AVIF si el proyecto ya dispone de un proceso de optimización.
- Mantener el PNG como fallback por su transparencia.
- Evitar cambios de layout durante la carga.

Ejemplo:

```html
<picture>
  <source srcset="/ruta/jose-maria-santos-01.avif" type="image/avif" />
  <source srcset="/ruta/jose-maria-santos-01.webp" type="image/webp" />
  <img
    src="/ruta/jose-maria-santos-01.png"
    alt="Ilustración de José María Santos trabajando en un portátil, rodeado de elementos sobre arquitectura y calidad de software"
    width="1536"
    height="1024"
    decoding="async"
  />
</picture>
```

Utiliza las dimensiones reales del asset, no las del ejemplo si fueran diferentes.

## Accesibilidad

- Mantener un único `<h1>`.
- Proporcionar un texto alternativo útil.
- No repetir en el `alt` el contenido completo de la cabecera.
- Marcar como decorativos los elementos adicionales generados con CSS.
- Conservar suficiente contraste.
- Respetar `prefers-reduced-motion`.
- No añadir animaciones continuas a la ilustración.

## Criterios de aceptación

La mejora se considerará terminada cuando:

- `jose-maria-santos-01.png` aparezca a la derecha del hero.
- La imagen conserve correctamente su transparencia.
- No tenga un fondo negro o un rectángulo visible.
- La cabecera aproveche mejor el ancho disponible.
- El texto y la ilustración tengan un peso visual equilibrado.
- La sección no sea innecesariamente alta.
- Los artículos comiencen a una distancia razonable del primer viewport.
- No exista desplazamiento horizontal.
- La imagen no quede recortada ni deformada.
- El diseño funcione correctamente a `1440px`, `1024px`, `768px` y `390px`.
- No aparezcan errores de consola ni regresiones visuales.
- No se añadan dependencias nuevas para resolver únicamente este layout.
