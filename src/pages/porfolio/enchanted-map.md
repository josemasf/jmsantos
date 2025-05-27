---
layout: ../../layouts/project.astro
title: Enchanted Map
urlSite: https://enchanted-map.com/
img: "/assets/enchanted-map.png"
description: Enchanted Map es una aplicación web interactiva que da vida a la mágica historia y leyendas de Córdoba. Combinamos lugares históricos, patrimonio cultural y leyendas locales en una experiencia digital atractiva.
publishDate: 2025-05-20 00:00:00
tags:
  - Vuetify
  - Vue 3
  - Clerk
---

## Enchanted Map - Desvelando la Magia de Córdoba

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

- Sitio web: [Enchanted Map](https://enchanted-map.com/)
- Código fuente: [GitHub](https://github.com/josemasf/enchanted-map)

### :sparkles: ¿Qué es?

Enchanted Map es una aplicación web interactiva que da vida a la mágica historia y leyendas de Córdoba. Combinamos lugares históricos, patrimonio cultural y leyendas locales en una experiencia digital atractiva.

### :trophy: ¿Por qué es innovador?

- **Experiencia Inmersiva:** Permite a los usuarios explorar lugares emblemáticos como la Mezquita-Catedral, el Alcázar y el Barrio Judío a través de un mapa interactivo.
- **Enfoque Único:** Fusiona historia y cultura popular, ofreciendo una nueva forma de descubrir el patrimonio.

### :identification_card: Uso de Clerk en el proyecto

Clerk se está usando para gestionar la autenticación del proyecto. Las librerías de Clerk que se están utilizando son:

- @clerk/clerk-js: La librería base de Clerk
- @clerk/vue: La integración específica para Vue

El proyecto utiliza Clerk para:

1. Gestión de Autenticación:

- Sign In (Inicio de sesión)
- Sign Up (Registro)
- Sign Out (Cierre de sesión)

2. Componentes de UI:

- SignInButton de @clerk/vue
- SignUpButton de @clerk/vue
- Montaje personalizado de componentes de autenticación con estilos de Vuetify

3. Gestión de Estado:

Un store de Pinia que maneja:

- Estado de autenticación
- Información del usuario
- Inicialización de Clerk
- Gestión de sesión

4. Características implementadas:

- Autenticación basada en correo electrónico
- Integración con redes sociales
- Gestión de sesiones
- Redirecciones después de autenticación
- Protección de rutas
- Personalización de la UI con Vuetify

### :hammer_and_wrench: ¿Cómo funciona?

1.  **Autenticación Requerida:** Los usuarios deben autenticarse para acceder al mapa y las ubicaciones.
2.  **Mapa Interactivo:** Una vez autenticados, los usuarios navegan por un mapa de Córdoba, descubriendo ubicaciones mágicas.
3.  **Historias y Leyendas:** Al hacer clic en un lugar, se revelan sus historias y leyendas.
4.  **Tecnología:**
    - Vue 3, TypeScript, Vite
    - Pinia para la gestión del estado
    - Vue Router para la navegación
    - Vuetify para la interfaz de usuario
    - Leaflet y MapTiler para la funcionalidad del mapa
    - Clerk para la autenticación de usuarios

Para más detalle sobre la arquitectura puedes acceder al [README ](https://github.com/josemasf/enchanted-map/blob/main/README.md)del proyecto

## :camera: Capturas de pantalla

![Home View](https://github.com/user-attachments/assets/3727ca52-a3aa-40ec-bea6-5b6266fc9602)

![Mapa](https://github.com/user-attachments/assets/e673face-47a8-46fe-9f96-c75404a40e56)

![Login](https://github.com/user-attachments/assets/65a2ee64-5a9f-40a1-937a-2934fa000478)

![Versión móvil](https://github.com/user-attachments/assets/6e4b6024-7a3f-4e55-84a0-2ee28166f9d2)

## :sparkles: Authors

[José María Santos](https://josemariasantos.com/)

## :trophy: Badges

[![Netlify Status](https://api.netlify.com/api/v1/badges/b26bf20d-7cea-4dd1-a80e-9879c9a6e72e/deploy-status)](https://app.netlify.com/projects/enchanted-map/deploys)
