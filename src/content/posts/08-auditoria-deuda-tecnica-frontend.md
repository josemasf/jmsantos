---
title: "Auditoría de deuda técnica en un proyecto frontend Vue: caso real con Sentry, knip y eslint"
description: "Cómo realizar una auditoría completa de deuda técnica en un proyecto frontend con Vue, analizando errores de producción (Sentry), tipado débil, código muerto y dependencias desactualizadas."
date: 2025-11-28
tags: [deuda técnica, auditoría, Sentry, TypeScript, Vue, frontend, calidad]
category: Calidad de código
image:
  src: /images/blog/08-auditoria-deuda-tecnica-frontend/auditoria-deuda-tecnica-frontend.png
  alt: Ilustración de una lupa sobre componentes con grietas, alertas y piezas obsoletas.
  width: 1536
  height: 1024
---

La deuda técnica es como la deuda financiera: no es mala en sí misma, pero si no la gestionas, los intereses te devoran. Este artículo documenta una auditoría real de un proyecto Vue en producción, con herramientas concretas y hallazgos clasificados por prioridad.

## Metodología de auditoría

Analizamos el proyecto desde cuatro ángulos:

1. **Errores en producción** → Sentry
2. **Tipado y calidad estática** → TypeScript + ESLint
3. **Código muerto** → knip
4. **Dependencias desactualizadas** → npm audit + revisión manual

## 1. Errores en producción (Sentry)

### Vista general

- **24 incidencias sin resolver** en los últimos 90 días
- Filtro usado: `is:unresolved lastSeen:-90d` ordenado por frecuencia

### Clasificación por prioridad

#### P0 — Impacto alto / repetitivas

| Issue            | Eventos     | Descripción                                                         |
| ---------------- | ----------- | ------------------------------------------------------------------- |
| Error en detalle | 16 eventos  | `AxiosError 500` en flujo de detalle — afecta estabilidad funcional |
| Error en tabla   | 10 eventos  | `focusedHeader` undefined en AG Grid al interactuar con filtros     |
| Error de assets  | 226 eventos | `Unable to preload CSS` — problema de bundle/deploy                 |

#### P1 — Fallos funcionales

| Issue          | Eventos   | Descripción                                                         |
| -------------- | --------- | ------------------------------------------------------------------- |
| Reset password | 7 eventos | `.validate is not a function` — método inexistente en el componente |
| Búsquedas      | Varios    | Errores `null` sobre operaciones de strings/columnas                |
| Reportes       | Varios    | `postMessage` sobre `null`, variable no inicializada                |

#### P2 — Resiliencia de red

- Fallos de `fetch` contra servicios de terceros (Product Fruits, módulos dinámicos)
- Fallos de preload de CSS en despliegues

### Lección clave

> Los errores de Sentry son la **voz del usuario** que no se queja. Muchas veces asumimos que "funciona" porque nadie reporta bugs, pero Sentry demuestra lo contrario.

## 2. Tipado y calidad estática

### Hallazgos

- Presencia de `@ts-ignore` en componentes críticos
- Uso de `eslint-disable` en tests y bootstrap
- Uso abundante de `any` en:
  - Plugins (axios interceptors)
  - Utilidades (i18n helpers)
  - Componentes de tabla
  - Tests utilities

### Impacto real

```typescript
// ❌ Esto compila y parece funcionar, pero:
const data: any = await fetchData();
data.nonExistentProperty.map(...); // 💥 Runtime error
```

El tipado débil genera:

- Errores silenciosos que solo se detectan en producción
- Peor autocompletado y contratos difusos
- Mayor riesgo de regresiones en refactors

### Solución propuesta

1. Activar `strict: true` en `tsconfig.json` progresivamente
2. Reemplazar `any` por tipos específicos empezando por las capas de datos
3. Eliminar `@ts-ignore` reemplazándolos por tipos correctos
4. Configurar reglas de ESLint para bloquear nuevos `any`

## 3. Código muerto (knip)

[knip](https://knip.dev/) analiza tu proyecto y detecta:

- Archivos no importados
- Exports no utilizados
- Dependencias instaladas pero no usadas
- Scripts de package.json sin uso

### Hallazgos

Se encontraron múltiples archivos, exports y dependencias sin uso que incrementan la complejidad y el tiempo de mantenimiento.

### Acción

```bash
npx knip --reporter compact
```

Ejecutar knip periódicamente (idealmente en CI) para evitar acumulación.

## 4. Dependencias desactualizadas

| Dependencia | Versión actual | Última versión | Riesgo                     |
| ----------- | -------------- | -------------- | -------------------------- |
| Vite        | Anterior       | Major upgrade  | Breaking changes en config |
| Vitest      | Anterior       | Major upgrade  | Breaking changes en config |
| Sentry      | Anterior       | Major upgrade  | API changes                |
| AG Grid     | Anterior       | Major upgrade  | Breaking changes si migras |
| Vuetify     | Anterior       | Minor/Patch    | Generalmente seguro        |
| Vue Router  | Anterior       | Major upgrade  | API changes                |

## Plan de acción priorizado

### Fase 1: Estabilización (1-2 semanas)

- Resolver issues P0 de Sentry
- Eliminar `@ts-ignore` en componentes críticos
- Actualizar dependencias con patches disponibles

### Fase 2: Limpieza (2-3 semanas)

- Ejecutar knip y eliminar código muerto
- Reemplazar `any` en capas de datos y plugins
- Resolver issues P1 de Sentry

### Fase 3: Modernización (1-2 meses)

- Actualizar dependencias mayores (Vite, Vitest, Sentry)
- Activar strict mode en TypeScript
- Configurar CI para bloquear regresiones

### Fase 4: Prevención (ongoing)

- knip en CI para código muerto
- Regla ESLint para `any` → error
- Dashboard de Sentry con alertas
- Revisión trimestral de dependencias

## Conclusiones

1. **La deuda técnica se mide, no se estima**: herramientas como Sentry, knip y eslint dan datos objetivos.
2. **Los errores de producción son la prioridad #1**: 226 eventos de un mismo error es inaceptable.
3. **`any` es deuda técnica silenciosa**: cada `any` es un test que no escribiste.
4. **El código muerto tiene coste**: confunde a los nuevos miembros, aumenta el bundle y dificulta refactors.
5. **Las actualizaciones son más baratas hoy que mañana**: cuanto más esperes, más breaking changes acumulas.
