---
layout: ../../layouts/project.astro
title: Qué Veo Ahora - La App
urlSite: https://queveoahora.com/
img: "/assets/que-veo-ahora.png"
description: "Recomendador inteligente de cine y series que sabe qué ofrecerte según tu estado de ánimo y tus suscripciones."
publishDate: 2026-01-20
tags:
  - Vue 3
  - Supabase
  - Tailwind CSS
  - PrimeVue
  - Pinia
  - OneSignal
---

## 🍿 Qué Veo Ahora (La Aplicación)

Si el proyecto anterior era el "cerebro" que escribía críticas, **Qué Veo Ahora** es la cara visible: una aplicación web diseñada para resolver el eterno dilema de _"¿qué vemos hoy?"_.

Es una herramienta que no solo te dice qué películas existen, sino que te recomienda qué ver basándose en tu **humor**, el tiempo que tienes y las **plataformas de streaming** (Netflix, Prime Video, HBO Max, etc.) que pagas realmente.

## ✨ ¿Qué la hace especial?

- **🎯 Recomendador por Humor:** ¿Tienes ganas de algo ligero? ¿Un drama intenso? ¿O algo que no dure más de 90 minutos? Los filtros avanzados permiten encontrar el contenido perfecto para cada momento.
- **🎭 Disponibilidad Real:** Gracias a la integración con APIs de streaming, la app sabe si esa película que quieres ver está disponible en tu país y en tus plataformas.
- **📱 Notificaciones Inteligentes:** Sistema de alertas vía **OneSignal** que te avisa cuando hay una recomendación que encaja perfectamente contigo.
- **👥 Capa Social:** Puedes conectar con amigos, compartir recomendaciones y guardar tus favoritos en una lista personalizada.
- **🎞️ Automatización de RRSS:** El sistema incluye scripts para generar Reels automáticamente y enviarlos a un canal de **Telegram**, agilizando la promoción de contenido destacado.

## 🏗️ Bajo el capó (Lo que no se ve)

Para este proyecto he puesto especial foco en la **calidad del código** y la escalabilidad:

- **Clean Architecture:** He separado la lógica de negocio (`domain`) de los detalles técnicos (`infrastructure`), lo que me permite cambiar de base de datos o de API sin romper la aplicación.
- **Vue 3 & Composition API:** Una interfaz reactiva y ultra rápida construida con las mejores prácticas de Vue.
- **Supabase como motor:** Gestión de usuarios (Auth), base de datos PostgreSQL en tiempo real y almacenamiento.
- **Feature Flags:** Utilizo **PostHog** para activar o desactivar funciones (como el sistema de amigos o búsqueda avanzada) de forma remota sin necesidad de volver a desplegar el código.

Es un proyecto que combina mi pasión por el desarrollo frontend con una arquitectura de backend robusta y moderna.
