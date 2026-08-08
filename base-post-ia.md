---
title: "Mi ciclo de desarrollo con IA: cómo utilizo ChatGPT, Codex y agentes especializados cada día"
description: "Así es mi flujo de desarrollo como Frontend Tech Lead utilizando IA en todas las fases del desarrollo: análisis, arquitectura, implementación, testing, revisión y documentación."
pubDate: 2026-08-06
heroImage: "/blog/ai-development-cycle.webp"
tags:
  - IA
  - ChatGPT
  - Frontend
  - Vue
  - Astro
  - Productividad
  - Desarrollo
---

# Mi ciclo de desarrollo con IA

Hace apenas un par de años utilizaba ChatGPT para resolver dudas puntuales.

Hoy prácticamente no existe una tarea de desarrollo en la que no participe algún modelo de IA.

No significa que la IA escriba todo mi código.

Significa que actúa como un compañero técnico que acelera cada fase del desarrollo.

Este es el flujo que utilizo actualmente como Frontend Tech Lead.

---

## 1. Entender el problema

Antes de escribir una sola línea de código intento comprender realmente qué problema hay que resolver.

En esta fase utilizo ChatGPT para:

- detectar requisitos ambiguos
- descubrir casos límite
- plantear preguntas que aún no se han hecho
- identificar riesgos técnicos
- encontrar posibles simplificaciones

Muchas veces el mejor código es el que nunca llega a escribirse.

---

## 2. Diseñar la solución

Una vez entiendo el problema empiezo la fase de arquitectura.

Aquí suelo trabajar con distintos agentes especializados.

Por ejemplo:

- Frontend Architect
- Backend Architect
- Product Owner
- Security Reviewer
- Testing Engineer

Cada uno revisa la solución desde un punto de vista diferente.

No siempre estoy de acuerdo con sus propuestas, pero casi siempre detectan algo que había pasado por alto.

---

## 3. Dividir el trabajo

Nunca pido a la IA que construya una funcionalidad enorme.

Prefiero dividir el trabajo en tareas pequeñas.

Cada tarea debe ser:

- independiente
- fácil de revisar
- fácil de probar
- sencilla de revertir

Esto mejora muchísimo la calidad de las respuestas.

---

## 4. Implementación con Codex

Cuando la arquitectura está clara empieza el desarrollo.

Aquí utilizo principalmente Codex integrado en VSCode.

En lugar de escribir:

> "Haz esta pantalla"

prefiero trabajar con instrucciones muy concretas.

Por ejemplo:

- crea el composable
- implementa el componente
- añade los tests
- genera la documentación
- actualiza los tipos

Cada cambio tiene un objetivo claro.

---

## 5. Testing desde el principio

No dejo los tests para el final.

De hecho muchas veces la IA genera antes los tests que el propio código.

Trabajo principalmente con:

- Vitest
- Testing Library
- MSW
- Playwright

La IA resulta especialmente útil para:

- detectar casos que faltan
- revisar mocks
- mejorar nombres
- eliminar duplicidades
- encontrar malas prácticas

---

## 6. Revisión del código

Cuando termino una funcionalidad hago una revisión como si el código fuera de otra persona.

La IA analiza:

- principios SOLID
- legibilidad
- complejidad
- rendimiento
- accesibilidad
- posibles bugs
- deuda técnica

No acepto automáticamente todas las recomendaciones.

Las evalúo una por una.

---

## 7. Documentación

La documentación suele ser la gran olvidada.

Aquí la IA ahorra muchísimo tiempo.

Le pido que genere:

- ADRs
- documentación técnica
- changelogs
- instrucciones para el equipo
- prompts reutilizables
- historias de usuario

Después únicamente adapto el resultado al contexto del proyecto.

---

## 8. Aprender después de entregar

Una vez desplegada la funcionalidad todavía queda trabajo.

Reviso:

- métricas
- errores
- feedback de usuarios
- incidencias
- decisiones tomadas

Con esa información mejoro los prompts y los agentes que utilizaré en el siguiente desarrollo.

Mi flujo de trabajo evoluciona continuamente.

---

# Lo que la IA todavía no hace

Existe la idea de que la IA sustituirá completamente al desarrollador.

Mi experiencia es distinta.

La IA es excelente generando alternativas.

Pero sigue siendo responsabilidad del desarrollador:

- tomar decisiones
- entender el negocio
- priorizar
- decir "no"
- mantener una visión global del producto

La diferencia no está en escribir código más rápido.

Está en tomar mejores decisiones.

---

# Mi conclusión

No utilizo la IA para programar menos.

La utilizo para pensar mejor.

Dedico menos tiempo a tareas repetitivas y mucho más a arquitectura, revisión, diseño y calidad.

Quizá dentro de un año este flujo vuelva a ser completamente diferente.

Y precisamente esa es la parte más interesante.

La IA cambia tan rápido que nuestro proceso de desarrollo también debe hacerlo.
