---
title: "De librería de componentes propia a Vuetify directo: cómo y por qué simplificamos nuestro stack"
description: "Lecciones aprendidas al deprecar una librería de componentes wrapper sobre Vuetify en favor de usar Vuetify directamente con una configuración centralizada."
date: 2025-04-22
tags: [Vue, Vuetify, componentes, arquitectura, DX, frontend]
category: Arquitectura
---

Cuando tu plataforma crece, es tentador crear una librería de componentes interna que "envuelva" los componentes de tu framework UI. Nosotros lo hicimos con Vuetify — y después tuvimos que deshacerlo. Esta es la historia de por qué.

## El contexto

Teníamos una librería interna (llamémosla "Suite Components") que wrapeaba componentes de Vuetify. La idea original era buena:

- Unificar la estética entre aplicaciones
- Proporcionar defaults corporativos
- Incluir fuentes e iconos en un solo paquete

## Los problemas que surgieron

### 1. Restricción de props nativas

Al wrapear los componentes de Vuetify, estábamos **restringiendo el acceso a props nativas**. Un desarrollador no podía usar una prop de Vuetify a menos que nosotros la hubiéramos expuesto explícitamente en el wrapper.

```vue
<!-- El wrapper solo exponía 3 props de las 20+ disponibles -->
<SButton variant="primary" @click="save">Guardar</SButton>

<!-- Lo que el desarrollador realmente necesitaba -->
<v-btn 
  variant="tonal" 
  prepend-icon="mdi-save" 
  :loading="saving" 
  :disabled="!valid"
>
  Guardar
</v-btn>
```

### 2. CSS bloat

La librería incluía fuentes, iconos y estilos que inflaban el bundle. Cada aplicación cargaba todo aunque solo usara una fracción.

### 3. Desincronización con Vuetify

Cada vez que Vuetify sacaba una nueva versión con features interesantes, nuestro wrapper se quedaba atrás. El equipo de Cross Cutting se convertía en cuello de botella.

### 4. Tokens de diseño dispersos

Los tokens de diseño estaban definidos dentro de la librería, lo que hacía difícil reutilizarlos fuera del contexto de los componentes.

## La solución: Vuetify directo + configuración centralizada

En lugar de wrapear componentes, creamos un **paquete de configuración de Vuetify** que centraliza:

- Blueprint (Material Design 2, para alinearnos con Blazor/Radzen)
- Tema y colores por módulo
- Iconos (Material Symbols, que es lo que usa Radzen por defecto)
- Defaults de componentes

### Configuración centralizada de Vuetify

```typescript
import { createVuetify } from 'vuetify'
import { md2 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export function createAppVuetify(moduleTheme: ThemeConfig) {
  return createVuetify({
    blueprint: md2,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: moduleTheme.name,
      themes: {
        [moduleTheme.name]: {
          colors: moduleTheme.colors,
        },
      },
    },
    defaults: {
      VBtn: { variant: 'flat', rounded: 'lg' },
      VTextField: { variant: 'outlined', density: 'compact' },
      VDataTable: { density: 'compact' },
    },
  })
}
```

### Cada módulo define su tema

```typescript
const salesTheme = {
  name: 'sales',
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    // ...
  },
}

const app = createApp(App)
app.use(createAppVuetify(salesTheme))
```

## ¿Qué pasa con Storybook?

Con la librería propia, Storybook servía para documentar nuestros wrappers. Al usar Vuetify directo, **Vuetify ya tiene documentación excelente**.

Nuestro Storybook pasó a ser un sitio de **documentación de casos de uso específicos de la plataforma**: tipos de formularios, patrones de navegación, ejemplos interactivos que sirven también como referencia visual para los equipos de Blazor.

## Beneficios obtenidos

1. **Acceso completo a Vuetify**: todos los props, slots y features disponibles sin intermediarios
2. **Bundle más ligero**: solo se carga lo que se usa
3. **Actualizaciones directas**: cuando Vuetify saca una versión nueva, la adoptas sin esperar al equipo de Cross Cutting
4. **Consistencia con Blazor**: al usar Material Design 2 como blueprint, las interfaces Vue y Blazor son visualmente coherentes
5. **Mejor DX**: los desarrolladores usan la documentación oficial de Vuetify, no una interna incompleta

## Lecciones aprendidas

1. **No wrapees lo que no necesitas controlar**: si solo quieres cambiar defaults, Vuetify tiene una API para eso.
2. **Centraliza la configuración, no los componentes**: un paquete de config es más mantenible que una librería de wrappers.
3. **La consistencia visual se logra con diseño, no con código**: tokens de diseño compartidos + blueprint resuelven el 90% de los casos.
4. **Storybook debe documentar patrones, no componentes genéricos**: la documentación de Vuetify siempre será mejor que la tuya.
5. **El cuello de botella del equipo transversal es real**: cada wrapper que creas es una responsabilidad de mantenimiento.

## Conclusión

Crear una librería de componentes interna es tentador, pero en la mayoría de los casos es más eficiente usar el framework directamente con una configuración centralizada. Reserva los componentes propios para lo que realmente es específico de tu dominio.
