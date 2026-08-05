# Añadir imagen al hero de la página de portfolio

## Objetivo

Incorporar la imagen `jose-maria-santos-07.png` en la sección **hero** de la página:

`http://localhost:4321/porfolio/`

La imagen debe integrarse como elemento visual principal del hero, manteniendo el diseño actual, mejorando la composición y funcionando correctamente en todos los tamaños de pantalla.

## Alcance

1. Localizar el componente o página responsable de la ruta `/porfolio/`.
2. Identificar la sección hero existente.
3. Añadir la imagen `jose-maria-santos-07.png` en la parte derecha del hero.
4. Reorganizar el hero en una composición de dos columnas:

   - Columna izquierda: título, descripción y llamadas a la acción actuales.
   - Columna derecha: nueva imagen.

5. Mantener la jerarquía visual y los estilos generales de la web.

## Requisitos de diseño

### Escritorio

- Mostrar texto e imagen en dos columnas equilibradas.
- La información principal debe seguir teniendo prioridad visual.
- La imagen debe tener un tamaño suficiente para resultar relevante, sin dominar completamente la cabecera.
- Alinear la imagen visualmente con el contenido del hero.
- Evitar espacios vacíos excesivos alrededor de la imagen.
- Limitar el ancho total del contenido mediante el contenedor utilizado por el resto de la web.

### Tablet

- Mantener las dos columnas mientras exista espacio suficiente.
- Reducir progresivamente el tamaño de la imagen y los espacios internos.
- Evitar que los textos, botones o la imagen queden comprimidos.

### Móvil

- Cambiar a una sola columna.
- Mostrar primero el contenido textual y después la imagen.
- Centrar la imagen horizontalmente.
- Evitar scroll horizontal.
- Mantener un espaciado compacto entre el contenido y la imagen.
- La imagen no debe superar el ancho disponible.

## Tratamiento de la imagen

- Usar el componente de imágenes de Astro cuando sea compatible con la ubicación actual del asset.
- Definir dimensiones explícitas para evitar desplazamientos de contenido durante la carga.
- Mantener la proporción original.
- No deformar, recortar agresivamente ni estirar la imagen.
- Utilizar `object-fit: contain` cuando sea necesario.
- Aplicar carga prioritaria al tratarse de una imagen visible en el primer viewport.
- No utilizar lazy loading para esta imagen.
- Añadir un texto alternativo descriptivo, por ejemplo:

`José María Santos, Frontend Tech Lead`

- Si la imagen tiene fondo transparente, no añadir un fondo opaco que altere su apariencia.
- No aplicar sombras, bordes o efectos que entren en conflicto con el sistema visual existente.

## Implementación técnica

- Reutilizar componentes, clases, variables CSS y breakpoints existentes.
- Evitar valores mágicos y estilos inline.
- No duplicar la estructura del hero si ya existe un componente reutilizable.
- Mantener el HTML semántico.
- No modificar el contenido textual salvo que sea necesario para mejorar la distribución.
- No afectar a otras páginas que reutilicen el mismo componente.
- Si el hero es compartido, añadir una propiedad o configuración específica para la imagen de portfolio.

## Rendimiento

- Comprobar que el formato y peso de `jose-maria-santos-07.png` son razonables.
- Generar tamaños responsivos si se utiliza el sistema de imágenes de Astro.
- Evitar cargar una imagen con una resolución muy superior a la que se muestra.
- Prevenir CLS reservando el espacio de la imagen desde el renderizado inicial.

## Accesibilidad

- La imagen debe tener un `alt` significativo.
- Comprobar que el orden de lectura sea correcto.
- Mantener visibles y accesibles los enlaces y botones del hero.
- No introducir contrastes insuficientes ni contenido superpuesto.
- Verificar navegación mediante teclado.

## Validaciones

Comprobar visualmente la página en:

- 375 px.
- 768 px.
- 1024 px.
- 1440 px.

Verificar que:

- La imagen se carga correctamente.
- No aparece scroll horizontal.
- No existe contenido solapado.
- El hero no ocupa una altura desproporcionada.
- Los botones mantienen su tamaño y posición.
- La imagen no se deforma ni se corta de forma incorrecta.
- El contenido principal permanece visible sin necesidad de hacer scroll en resoluciones habituales de escritorio.
- No se producen errores en consola.
- El build de Astro finaliza correctamente.

## Criterios de aceptación

- La página `/porfolio/` muestra `jose-maria-santos-07.png` dentro de su hero.
- En escritorio, la imagen se presenta a la derecha del contenido.
- En móvil, la imagen aparece debajo del texto.
- La composición aprovecha correctamente el espacio disponible.
- La imagen mantiene su proporción y calidad.
- No se introducen regresiones visuales ni funcionales.
- La implementación respeta los patrones y componentes existentes.
- La página es responsive y accesible.
- El proyecto supera lint, comprobaciones de tipos, tests y build disponibles.
