## Tarea: incorporar imagen en el hero de Ponencias

### Objetivo

Actualizar la sección **hero** de la página `/presentations/` para incorporar la imagen `jose-maria-santos-02.png` a la derecha del contenido, mejorando el equilibrio visual sin aumentar innecesariamente la altura de la cabecera.

### Requisitos funcionales

1. Localizar el componente o página que renderiza la ruta:

```text
/presentations/
```

2. Utilizar la imagen:

```text
jose-maria-santos-02.png
```

3. Mantener en la parte izquierda el contenido actual:

- Etiqueta: `COMPARTIR CONOCIMIENTO`
- Título: `Ponencias`
- Descripción actual

4. Mostrar la imagen en la parte derecha del hero en resoluciones de escritorio.

5. La imagen debe funcionar como elemento visual complementario, sin competir con el título ni desplazar el contenido principal fuera del primer viewport.

### Diseño esperado

En escritorio, el hero debe organizarse en dos columnas:

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│  COMPARTIR CONOCIMIENTO          Imagen de Josema   │
│  Ponencias                                          │
│  Charlas sobre las prácticas                        │
│  y tecnologías...                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Distribución recomendada:

- Columna de contenido: entre `55%` y `65%`.
- Columna de imagen: entre `35%` y `45%`.
- Contenido alineado verticalmente al centro.
- Imagen alineada hacia la parte inferior o derecha del hero.
- Limitar el ancho de la imagen para evitar que domine la composición.
- Mantener el fondo oscuro actual.
- No añadir una tarjeta, marco o fondo artificial alrededor de la imagen si el PNG ya tiene fondo transparente.

### Comportamiento responsive

#### Escritorio

- Usar una disposición de dos columnas.
- La imagen debe aparecer a la derecha.
- Evitar una altura excesiva del hero.
- El contenido textual debe conservar una anchura legible.

#### Tablet

- Reducir progresivamente el tamaño de la imagen.
- Mantener dos columnas mientras exista espacio suficiente.
- Evitar que el texto y la imagen se solapen.

#### Móvil

- Cambiar a una sola columna.
- Mostrar primero el contenido textual.
- Colocar la imagen debajo del texto, centrada.
- Reducir su tamaño para que no genere un scroll inicial desproporcionado.
- No ocultar la imagen salvo que exista un problema real de espacio o rendimiento.

### Implementación técnica

- Utilizar el componente de imagen recomendado por Astro si está disponible, preferiblemente `Image` de `astro:assets`.
- Importar la imagen desde la ubicación de assets del proyecto en lugar de construir rutas manuales.
- Definir `width` y `height` para evitar cambios de layout durante la carga.
- Utilizar un `alt` descriptivo, por ejemplo:

```text
José María Santos durante una ponencia sobre desarrollo frontend
```

- Aplicar `object-fit: contain` para que la imagen nunca se recorte.
- No usar posiciones absolutas como solución principal. La estructura debe resolverse con Grid o Flexbox.
- Mantener los estilos alineados con los tokens, variables y breakpoints existentes.
- Evitar introducir valores duplicados si ya existen utilidades o componentes para los heroes de otras secciones.

### Rendimiento y accesibilidad

- Optimizar la imagen durante el build si se gestiona mediante `astro:assets`.
- No aplicar lazy loading si la imagen aparece inmediatamente dentro del primer viewport.
- Mantener el contraste actual del texto.
- Verificar que la imagen no provoque desplazamiento horizontal.
- Comprobar que el diseño funciona con zoom del navegador al `200%`.

### Criterios de aceptación

- La imagen `jose-maria-santos-02.png` aparece en el hero de `/presentations/`.
- En escritorio se muestra a la derecha del contenido.
- En móvil aparece debajo del texto y mantiene proporciones correctas.
- La imagen no está recortada, deformada ni pixelada.
- No existe scroll horizontal en ningún breakpoint.
- El hero no deja grandes zonas vacías injustificadas.
- El título y la descripción mantienen su jerarquía visual.
- No se producen saltos de layout durante la carga.
- La navegación superior no se ve afectada.
- La implementación reutiliza los patrones visuales existentes en el proyecto.
- Se comprueba visualmente al menos en anchuras de `375px`, `768px`, `1024px` y `1440px`.

### Instrucción lista para el agente

```text
Actualiza la sección hero de la ruta `/presentations/` para incorporar la
imagen `jose-maria-santos-02.png`.

Mantén el contenido textual actual en la parte izquierda y muestra la imagen
en la parte derecha mediante una composición responsive de dos columnas.

En escritorio, el texto debe ocupar aproximadamente un 60% del espacio y la
imagen un 40%. Alinea ambos elementos verticalmente al centro y limita el
tamaño de la imagen para que no domine el hero ni aumente excesivamente su
altura.

En móvil, convierte el layout en una sola columna: primero el texto y después
la imagen centrada. La imagen debe mantener su proporción, no recortarse y no
provocar scroll horizontal.

Usa preferiblemente `Image` de `astro:assets`, define dimensiones para evitar
layout shift y utiliza un alt descriptivo. No resuelvas el layout mediante
posicionamiento absoluto salvo para pequeños detalles decorativos.

Conserva el fondo, tipografía, colores, espaciados y breakpoints existentes.
Reutiliza los patrones de otros heroes del proyecto cuando sea posible.

Valida el resultado en 375px, 768px, 1024px y 1440px, comprobando que no haya
solapamientos, recortes, saltos de layout ni espacio vertical desperdiciado.
```
