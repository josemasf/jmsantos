---
title: "Diagnóstico y plan de acción: cuando tu suite de tests tarda 15 minutos"
description: "Caso real de diagnóstico de una suite de vitest que tardaba 15 minutos, con identificación de 7 causas raíz y un plan de acción en 3 fases para reducirla a menos de 5 minutos."
date: 2025-11-14
tags: [testing, vitest, performance, diagnóstico, CI/CD, frontend]
category: Testing
image:
  src: /images/blog/07-diagnostico-lentitud-suite-tests/diagnostico-lentitud-suite-tests.png
  alt: Ilustración de un cronómetro pesado cuya carga se reduce en estaciones de reparación.
  width: 1536
  height: 1024
---

Una suite de tests que tarda 15 minutos en ejecutarse no es solo un problema de rendimiento — es un problema de productividad. Los desarrolladores dejan de ejecutar tests localmente, los pipelines de CI se convierten en cuellos de botella, y la confianza en el sistema de tests se erosiona.

Este artículo documenta un caso real de diagnóstico técnico, desde la evidencia hasta el plan de acción.

## La evidencia

```
Comando: pnpm vitest run --max-workers=1 --reporter=verbose --passWithNoTests
Resultado: 917.97s (~15m 18s)
Test Files: 7 failed | 49 passed (56)
Tests: 13 failed | 199 passed (212)

Breakdown:
  transform:   20.50s
  setup:       105.82s
  import:      103.54s
  tests:       638.74s
  environment:  47.29s
```

Más de **3 minutos y medio** se consumen antes de ejecutar un solo test (setup + import). Los 13 tests fallidos son por timeout, no por lógica incorrecta.

## Las 7 causas raíz

### Causa 1: Paralelismo deshabilitado en CI

El script de CI usaba `--max-workers=1`, forzando ejecución secuencial en runners multi-core.

**Solución**: cambiar a `--max-workers=50%` y reservar `--max-workers=1` solo para un job de cuarentena de tests flaky.

### Causa 2: Setup pesado para todos los tests

`vitest.config.ts` cargaba plugins pesados (Vue + Vuetify + AutoImport + Components) para **todos** los tests, incluyendo los puramente unitarios que no renderizan UI.

**Solución**: separar la configuración en proyectos (`test.projects`):
- `unit` — configuración mínima, sin render UI
- `integration-ui` — configuración completa con Vuetify

### Causa 3: Timeout global inadecuado

El timeout global era de 7 segundos (`testTimeout: 7000`), insuficiente para tests de UI complejos. Algunos tests ya sobreescribían localmente a 20-25 segundos.

**Solución**: definir una política de timeout por tipo:
- Unitarios: 5-7s
- Integración UI: 12-15s

### Causa 4: Esperas artificiales en composables

Un composable (`useActionWithMinDelay`) aplicaba un `minDelay=200ms` por acción para mejorar la UX. En tests con muchas acciones, la latencia se acumulaba significativamente.

**Solución**: hacer el delay configurable y desactivarlo en entorno de test.

### Causa 5: Selectores frágiles

Tests que dependían de selectores CSS específicos de la librería de componentes, generando fallos intermitentes cuando la librería se actualizaba.

**Solución**: migrar a `data-testid` y usar la API de testing de Vue (`findComponent`, `getByRole`).

### Causa 6: Falta de aislamiento entre tests

Tests que compartían estado global (stores de Pinia, mocks de HTTP) sin limpieza adecuada entre ejecuciones.

**Solución**: usar `beforeEach` para resetear stores y mocks, asegurando aislamiento total.

### Causa 7: Tests de integración disfrazados de unitarios

Tests que montaban componentes completos con todas sus dependencias reales, cuando solo necesitaban validar lógica de un composable.

**Solución**: separar tests de composables (sin render) de tests de componentes (con render).

## El plan de acción en 3 fases

### Fase 1: Quick wins (1-2 días)

- [ ] Cambiar `--max-workers=1` → `--max-workers=50%`
- [ ] Subir timeout global a 12s para tests UI
- [ ] Desactivar `minDelay` en entorno de test

**Objetivo**: bajar de 15 min a ~8 min.

### Fase 2: Refactor de configuración (1 semana)

- [ ] Separar `vitest.config.ts` en proyectos (unit/integration)
- [ ] Migrar selectores a `data-testid`
- [ ] Aislar stores y mocks entre tests

**Objetivo**: bajar de 8 min a ~5 min.

### Fase 3: Mejora continua (ongoing)

- [ ] Reclasificar tests de composables como unitarios
- [ ] Añadir métricas de duración por suite al CI
- [ ] Establecer presupuesto de tiempo por test (<2s unitario, <10s integración)

**Objetivo**: mantener por debajo de 5 min.

## Métricas de seguimiento

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Duración total | 15:18 | < 5:00 |
| Tests fallidos por timeout | 13 | 0 |
| Tiempo de setup+import | 209s | < 60s |

## Conclusiones

1. **Mide antes de optimizar**: el breakdown de vitest (`transform`, `setup`, `import`, `tests`, `environment`) te dice dónde está el problema real.
2. **El paralelismo es gratis**: un solo flag puede cortar el tiempo a la mitad.
3. **Separa unit de integration**: cargar Vuetify para testear una función pura es un desperdicio.
4. **Los delays de UX matan los tests**: cualquier `setTimeout` o `minDelay` debe ser configurable.
5. **Establece presupuestos de tiempo**: sin un límite explícito, los tests siempre se ralentizan.
