---
title: "Tests E2E con IA: investigación práctica con Midscene.js y Playwright"
description: "Cómo exploramos el uso de inteligencia artificial para generar y ejecutar tests end-to-end, comparando enfoques YAML vs Playwright, con análisis de costes reales."
date: 2025-09-19
tags: [testing, IA, e2e, Playwright, Midscene, automatización]
category: Testing
---

Durante la migración de una plataforma empresarial a tecnologías web modernas, uno de los sacrificios asumidos fue prescindir de tests que validaran los desarrollos. Para paliar esta deuda técnica, decidimos investigar si la inteligencia artificial podía ayudarnos a generar y mantener tests end-to-end de forma más eficiente.

## Las herramientas investigadas

Evaluamos dos enfoques principales:

- **[Midscene.js](https://midscenejs.com/)** — Framework que permite escribir tests E2E usando IA, con soporte tanto para Playwright como para YAML declarativo.
- **[Magnitude](https://magnitude.run/)** — Herramienta alternativa para tests E2E impulsados por IA.

## Configuración del entorno

### Requisitos previos

Para utilizar IA en los tests, necesitamos:

1. Un token de API para el servicio de IA (OpenAI, Azure OpenAI, etc.)
2. Playwright configurado en el proyecto
3. Las variables de entorno configuradas:
   - `OPENAI_BASE_URL`
   - `OPENAI_API_KEY`

### Integración con Playwright

Seguimos la [guía oficial de Midscene.js para Playwright](https://midscenejs.com/integrate-with-playwright.html), que básicamente consiste en instalar las dependencias y configurar el archivo de Playwright.

## Dos enfoques: YAML vs Playwright

### Enfoque 1: Tests con Playwright + IA

Escribimos tests usando la API de Playwright enriquecida con las capacidades de IA de Midscene. La IA se encarga de identificar elementos, interactuar con ellos y validar resultados usando lenguaje natural.

**Ventaja**: Mayor control y flexibilidad.
**Desventaja**: Más verboso, mayor consumo de tokens.

### Enfoque 2: Tests declarativos en YAML

Midscene permite definir tests en YAML, donde describes las acciones y validaciones en lenguaje natural:

```yaml
- name: Login test
  steps:
    - action: Navigate to login page
    - action: Enter username "admin"
    - action: Enter password "secret"
    - action: Click the login button
    - assertion: Should see the dashboard
```

**Ventaja**: Extremadamente rápido de escribir, muy legible.
**Desventaja**: Menor control sobre flujos complejos.

## Análisis de costes reales

Este fue uno de los hallazgos más reveladores:

| Concepto | Playwright + IA | YAML |
|----------|----------------|------|
| **Coste de desarrollo** | 5,62 € | 0,52 € (migración desde Playwright) |
| **Coste de ejecución** | ~0,72 € por suite | Variable según complejidad |

La diferencia de coste en desarrollo fue significativa: el enfoque YAML fue **10x más barato** para crear los mismos tests.

### Creación de tests desde cero

Para medir el esfuerzo real, creamos una batería completa de tests sobre una vista de histórico de envíos partiendo de cero. En aproximadamente **1 hora** generamos una extensa batería de tests.

## Cobertura de código con tests E2E

Investigamos la posibilidad de obtener cobertura de código desde los tests E2E. Playwright ofrece una API de cobertura (`playwright.dev/docs/api/class-coverage`), pero solo analiza JavaScript y CSS. Para proyectos Blazor (C#), esta aproximación no funciona.

**Decisión**: la cobertura de tests unitarios se mide con herramientas específicas del framework (vitest para Vue, herramientas .NET para Blazor).

## El sistema de agentes de Playwright

Una evolución posterior fue el uso del [sistema de agentes de Playwright](https://playwright.dev/docs/test-agents), que introduce tres agentes especializados:

1. **🎭 Planner** — Explora la aplicación y genera un plan de tests en Markdown
2. **🎭 Generator** — Transforma el plan en archivos de test de Playwright
3. **🎭 Healer** — Ejecuta la suite y repara automáticamente los tests que fallan

Este enfoque permite un ciclo virtualmente autónomo de generación y mantenimiento de tests.

## Conclusiones

1. **La IA reduce drásticamente el tiempo de creación** de tests E2E, especialmente con el enfoque YAML.
2. **Los costes son manejables** para equipos de desarrollo (céntimos por suite).
3. **YAML es ideal para cubrir rápidamente** muchas vistas con tests básicos de humo.
4. **Playwright + IA es mejor** para flujos complejos que requieren lógica condicional.
5. **La cobertura de código E2E** tiene limitaciones técnicas y es mejor delegarla a tests unitarios.
6. **El sistema de agentes** (planner + generator + healer) es el futuro del testing automatizado.

## Recursos

- [Midscene.js](https://midscenejs.com/)
- [Magnitude](https://magnitude.run/)
- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright Coverage API](https://playwright.dev/docs/api/class-coverage)
