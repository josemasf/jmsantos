---
title: "Accesibilidad web (a11y): herramientas, realidad y decisiones pragmáticas"
description: "Evaluación práctica de herramientas de accesibilidad web (Axe Core, Pa11y, WAVE, Playwright+AXE) con conclusiones honestas sobre los desafíos reales de cumplir WCAG al 100%."
date: 2025-10-17
tags: [accesibilidad, a11y, WCAG, testing, Playwright, frontend]
category: Accesibilidad
---

La accesibilidad web no es opcional — es un requisito legal en muchos países y, sobre todo, una responsabilidad ética. Pero, ¿cómo integras el análisis de accesibilidad en tu flujo de desarrollo sin que se convierta en un cuello de botella?

Investigamos las principales herramientas disponibles, las probamos en proyectos reales y llegamos a conclusiones que no siempre son las que uno espera leer.

## Las herramientas evaluadas

### 1. Axe Core CLI

[Axe Core](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/cli/README.md) es el motor de análisis de accesibilidad más utilizado del ecosistema.

**Limitación descubierta**: para analizar una página que solo es accesible por VPN, la CLI no funciona directamente. Genera una instancia aislada de navegador que no comparte la configuración de red del host.

### 2. Playwright + AXE

La combinación de [Playwright con AXE](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) resuelve el problema de la CLI porque Playwright gestiona el navegador y la navegación, incluyendo autenticación y rutas protegidas.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should pass accessibility checks', async ({ page }) => {
  await page.goto('/my-page');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 3. Pa11y

[Pa11y](https://pa11y.org/) es una herramienta de línea de comandos que genera informes detallados. Es configurable en reglas y niveles de gravedad, y se integra bien en pipelines de CI.

**Ventaja sobre Axe CLI**: para consultas rápidas, Pa11y resultó más ágil.

### 4. WAVE (Web Accessibility Evaluation Tool)

Extensión de navegador que proporciona evaluación visual directa en la página. Ideal para obtener una visión rápida de problemas, aunque no automatizable.

### 5. Accessibility Insights (Microsoft)

Ofrece inspección de elementos, pruebas de tabulación y evaluaciones automatizadas. Útil para encontrar problemas de contraste, navegación por teclado y estructura del contenido.

### 6. Chrome DevTools Accessibility Panel

El panel de accesibilidad integrado permite inspeccionar el árbol de accesibilidad, simular deficiencias visuales y ejecutar auditorías.

## Las conclusiones honestas

Después de evaluar todas las herramientas en proyectos reales, estas son las conclusiones:

### 1. Alcanzar el 100% de cumplimiento es extremadamente difícil

No es una cuestión de herramientas — es una cuestión de **arquitectura, diseño y dependencias**. Cuando usas librerías de componentes de terceros (Vuetify, PrimeVue, Radzen...), muchos errores de accesibilidad están **fuera de tu control**.

### 2. Algunos errores requieren reestructurar el código

No todos los problemas de accesibilidad se resuelven añadiendo `aria-labels`. Algunos requieren cambios en la estructura del HTML, el flujo de navegación o la jerarquía de encabezados.

### 3. Las librerías de componentes pueden ser un bloqueo

Si tu librería de componentes genera HTML inaccesible, tus opciones son limitadas: reportar el bug, hacer un fork, o aceptar el problema y documentarlo.

## La decisión: Playwright + AXE

Para integrar accesibilidad de forma automatizada en el flujo de desarrollo:

> **Usar Playwright + AXE** como solución principal, ya que si ya estás usando Playwright para tests E2E, la integración con AXE es prácticamente gratuita.

Para análisis rápidos puntuales, **Pa11y** es más ágil que Axe Core CLI.

## Recomendaciones prácticas

1. **No intentes el 100% desde el día uno** — empieza por los errores críticos (contraste, navegación por teclado, alt en imágenes).
2. **Integra AXE en tus tests E2E** — cada test que ya tienes puede incluir un check de accesibilidad con dos líneas de código.
3. **Documenta los problemas de terceros** — si un error viene de la librería de componentes, repórtalo y documéntalo como deuda conocida.
4. **Usa las DevTools del navegador** para auditorías manuales rápidas.
5. **Forma al equipo** — la accesibilidad no es solo responsabilidad del frontend.

## Recursos

- [Axe Core](https://github.com/dequelabs/axe-core)
- [Playwright + AXE](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [Pa11y](https://pa11y.org/)
- [WAVE](https://wave.webaim.org/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
