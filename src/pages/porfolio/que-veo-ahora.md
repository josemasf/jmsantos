---
layout: ../../layouts/project.astro
title: Qué Veo Ahora - Blog & IA
urlSite: https://blog.queveoahora.com/
img: "/assets/que-veo-ahora-blog.png"
description: "Un blog de cine con 'cerebro' propio: reseñas y noticias generadas automáticamente mediante IA y Astro."
publishDate: 2026-01-20
tags:
  - Astro
  - OpenAI
  - TypeScript
  - Automation
  - Monorepo
---

## 🎬 Qué Veo Ahora

**Qué Veo Ahora** es un proyecto personal que explora la intersección entre el cine y la inteligencia artificial. Se trata de un **monorepo** que gestiona tanto un blog de críticas cinematográficas de alto rendimiento como un motor de generación de contenido inteligente.

## 🤖 ¿Cómo funciona?

A diferencia de un blog tradicional, "Qué Veo Ahora" cuenta con un "cerebro" (el Generator) que realiza el trabajo pesado:

1.  **Detección de Tendencias:** El sistema identifica automáticamente qué películas y series están en boca de todos gracias a la API de **TMDB**.
2.  **Redacción con IA:** Utilizando modelos de **OpenAI (GPT-4o)**, el generador analiza la información técnica (reparto, sinopsis, género) y redacta críticas y noticias con un tono periodístico y personal.
3.  **Automatización Total:** He configurado flujos de trabajo en **GitHub Actions** que se ejecutan cada madrugada. El sistema "despierta", busca novedades, genera el contenido y crea un Pull Request automáticamente. ¡El blog se mantiene vivo mientras duermo!
4.  **Velocidad Extrema:** La parte pública (el blog) está construida con **Astro**, lo que garantiza una carga instantánea y un SEO impecable, ya que todo el contenido generado por IA se convierte en páginas estáticas.

## 🛠️ Tecnologías clave

-   **Frontend:** [Astro](https://astro.build/) para un blog ligero y rápido.
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) en todo el monorepo para un código robusto y escalable.
-   **IA:** Integración con la API de OpenAI para la generación de lenguaje natural.
-   **Datos:** API de The Movie Database (TMDB) para la obtención de metadatos cinematográficos.
-   **Infraestructura:** Monorepo gestionado con **PNPM Workspaces** y despliegue automático en **Netlify**.

## 📁 Estructura del Ecosistema

El proyecto se divide en tres piezas fundamentales:
-   `apps/blog`: El sitio web que visitan los usuarios.
-   `packages/generator`: El motor de scrapping e IA que redacta el contenido.
-   `packages/cli`: Una herramienta propia de línea de comandos para gestionar prompts y generar noticias temáticas bajo demanda.

Este proyecto es una prueba de concepto real sobre cómo la automatización y la inteligencia artificial pueden potenciar la creación de contenido de calidad sin perder el control sobre la tecnología.
