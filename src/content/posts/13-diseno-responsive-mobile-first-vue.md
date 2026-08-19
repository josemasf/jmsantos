---
title: "Diseño responsive con enfoque Mobile First en Vue 3 + TypeScript"
description: "Guía práctica para crear componentes responsive con enfoque Mobile First usando Vue 3, TypeScript y Composition API, con referencias a herramientas de desarrollo."
date: 2026-02-06
tags: [responsive, mobile first, Vue, TypeScript, CSS, frontend]
category: Frontend
image:
  src: /images/blog/13-diseno-responsive-mobile-first-vue/diseno-responsive-mobile-first-vue.png
  alt: Ilustración de un componente que crece ordenadamente desde un móvil hacia pantallas mayores.
  width: 1536
  height: 1024
---

El enfoque Mobile First no es solo una técnica de CSS — es una filosofía de diseño que te obliga a priorizar lo esencial. Cuando diseñas primero para la pantalla más pequeña, eliminas lo superfluo y construyes experiencias más limpias.

## ¿Qué es Mobile First?

En lugar de diseñar para escritorio y luego "adaptar" para móvil, haces lo contrario:

1. **Diseñas para móvil** — la experiencia base
2. **Amplías para tablet** — añades lo que tiene sentido
3. **Amplías para escritorio** — aprovechas el espacio extra

En CSS, esto se traduce en escribir los estilos base para móvil y usar `min-width` en los media queries:

```css
/* Base: móvil */
.card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    flex-direction: row;
    padding: 1.5rem;
  }
}

/* Escritorio */
@media (min-width: 1024px) {
  .card {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Ejemplo práctico: Tarjeta de producto

Vamos a crear una tarjeta de producto responsive con Vue 3 + TypeScript + Composition API.

### El componente

```vue
<script setup lang="ts">
interface Product {
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
}

defineProps<{
  product: Product;
}>();
</script>

<template>
  <article class="product-card" role="article">
    <img
      :src="product.image"
      :alt="product.name"
      class="product-card__image"
      loading="lazy"
    />
    <div class="product-card__content">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <p class="product-card__description">{{ product.description }}</p>
      <div class="product-card__footer">
        <span class="product-card__price">
          {{
            new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)
          }}
        </span>
        <button class="product-card__cta">Añadir al carrito</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.product-card__content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* Tablet */
@media (min-width: 768px) {
  .product-card {
    flex-direction: row;
  }

  .product-card__image {
    width: 40%;
    aspect-ratio: 1;
  }

  .product-card__content {
    padding: 1.5rem;
  }
}
</style>
```

### Puntos clave de accesibilidad

- `role="article"` en el contenedor
- `alt` descriptivo en la imagen
- `loading="lazy"` para rendimiento
- Contraste suficiente en textos y botones
- Estados `:hover` y `:focus` visibles

## Herramientas útiles

| Herramienta                                   | Uso                                               |
| --------------------------------------------- | ------------------------------------------------- |
| [Responsively App](https://responsively.app/) | Ver tu app en múltiples viewports simultáneamente |
| [Figma](https://figma.com/)                   | Inspeccionar diseños y obtener tokens             |
| Chrome DevTools                               | Device toolbar para simular dispositivos          |
| [Prettier](https://prettier.io/)              | Formateo automático del código                    |

## Buenas prácticas

1. **Escribe CSS mobile-first** — usa `min-width`, nunca `max-width`
2. **Usa unidades relativas** — `rem`, `em`, `%`, `vw/vh` en lugar de `px`
3. **Prefiere Flexbox y Grid** — evita floats y posicionamiento absoluto
4. **Usa `aspect-ratio`** — mantiene las proporciones sin JS
5. **Testea en dispositivos reales** — los emuladores no capturan todo
6. **Limita el ancho máximo** — textos de más de 80 caracteres por línea son difíciles de leer

## Conclusión

Mobile First te obliga a pensar en la experiencia mínima viable antes de añadir complejidad. Con Vue 3 y TypeScript, puedes crear componentes responsive tipados, accesibles y mantenibles desde el primer día.
