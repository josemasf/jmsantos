---
layout: ../../layouts/project.astro
title: FormKit Microfrontends
urlSite: https://github.com/josemasf/formkit
github: https://github.com/josemasf/formkit
img: "/assets/formkit-microfrontends.svg"
description: "Plataforma de formularios con Vue 3 y Module Federation: tres remotos independientes, un host orquestador y quality gates de extremo a extremo."
publishDate: 2026-08-06
tags:
  - Vue 3
  - Vite
  - Module Federation
  - TypeScript
  - Vitest
  - MSW
---

## Formularios distribuidos con una integración controlada

FormKit es una plataforma de formularios orientados a esquema construida como una arquitectura de microfrontends: un **host orquestador** integra tres aplicaciones remotas que se entregan de forma independiente. Cada remoto consume su propia API mock, lo que mantiene el desarrollo y las pruebas aislados.

## Decisiones de ingeniería

- **Module Federation con Vite:** el host usa un target `esnext` para soportar la salida de federación basada en _top-level await_.
- **Configuración por entorno:** las URLs de las APIs y los `remote entry` se resuelven en tiempo de ejecución, evitando endpoints locales fijados en el código.
- **Flujo de envío consistente:** los formularios construyen su payload de forma explícita y generan identificadores con `crypto.randomUUID()`.
- **Calidad automatizada:** Vitest, Testing Library y MSW cubren el comportamiento observable de los remotos; el host incorpora una prueba de humo del router.

## Entrega operativa

El repositorio concentra build, test, lint, comprobación de tipos y auditoría de dependencias en un único comando:

```sh
pnpm run verify
```

El mismo control se ejecuta en CI para las cuatro aplicaciones. La documentación de contribución y seguridad acompaña el código para que la arquitectura pueda evolucionar con reglas verificables.

Puedes consultar el [repositorio de FormKit](https://github.com/josemasf/formkit) y su [caso de estudio](https://github.com/josemasf/formkit/blob/main/CASE_STUDY_ES.md).
