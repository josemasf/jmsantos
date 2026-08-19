---
title: "Cómo desplegar Storybook en producción para proyectos Vue 3 + Vuetify"
description: "Guía paso a paso para configurar, construir y desplegar Storybook en una Azure Static Web App, integrado con tu pipeline de CI/CD."
date: 2026-02-20
tags: [Storybook, Vue, Vuetify, CI/CD, Azure, DevOps]
category: DevOps
image:
  src: /images/blog/14-storybook-produccion-vue-vuetify/storybook-produccion-vue-vuetify.png
  alt: Ilustración de un libro de componentes que recorre una tubería hasta su publicación.
  width: 1536
  height: 1024
---

Storybook es una herramienta excelente para documentar componentes, pero su verdadero valor aparece cuando el equipo completo puede acceder a él en una URL pública. Diseñadores, POs y otros desarrolladores pueden consultar los componentes disponibles sin clonar el repo.

Esta guía cubre la configuración completa: desde el setup inicial hasta el despliegue automático en una Azure Static Web App.

## Paso 1: Revisar `vite.config.ts`

Si tu proyecto usa `topLevelAwait` como plugin de Vite, elimínalo — causa problemas con el build de Storybook:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Configuración limpia sin topLevelAwait
  },
});
```

## Paso 2: Configurar `preview.ts` para Vuetify

Storybook necesita cargar la misma configuración de Vuetify que tu aplicación:

```typescript
// .storybook/preview.ts
import { setup } from "@storybook/vue3";
import { createVuetify } from "vuetify";
import "vuetify/styles";

const vuetify = createVuetify({
  // Tu configuración de Vuetify
});

setup((app) => {
  app.use(vuetify);
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
};
```

## Paso 3: Crear el pipeline de CI/CD

### Pipeline YAML para Azure DevOps

```yaml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - src/components/**
      - .storybook/**

pool:
  vmImage: "ubuntu-latest"

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"

  - script: pnpm install --frozen-lockfile
    displayName: "Install dependencies"

  - script: pnpm test:ci
    displayName: "Run tests"

  - script: pnpm build-storybook
    displayName: "Build Storybook"

  - task: AzureStaticWebApp@0
    inputs:
      app_location: "storybook-static"
      skip_app_build: true
```

> **Nota**: el pipeline espera que exista un script `test:ci` en tu `package.json`. Si no tienes tests, registra uno vacío:
>
> ```json
> "test:ci": "echo \"No test needed\""
> ```

## Paso 4: Registrar la pipeline

1. En Azure DevOps, crea una nueva pipeline apuntando a tu YAML
2. La primera ejecución requerirá conceder permisos manualmente
3. Opcionalmente, configura un trigger para que el Storybook se despliegue **después** del build principal de tu producto

## Paso 5: Configurar la release

1. Crea una nueva release en Azure DevOps
2. Selecciona "Empty job" como template
3. Configura el pool de agentes
4. Añade la tarea "Deploy Azure Static Web App"
5. Configura el `Working Directory` apuntando a los archivos estáticos generados por Storybook

## Paso 6: Obtener la URL

Una vez ejecutada la release, la URL de tu Storybook aparecerá en el log del job de Static Web App. Compártela con el equipo.

## Mejoras adicionales

### Trigger automático

Configura el Storybook para que se despliegue automáticamente cuando se actualice el build principal:

```yaml
resources:
  pipelines:
    - pipeline: main-build
      source: "mi-proyecto-build"
      trigger:
        branches:
          include:
            - main
```

### Protección con autenticación

Si necesitas que el Storybook no sea público, Azure Static Web Apps soporta autenticación con Azure AD.

## Conclusión

Un Storybook desplegado en producción transforma la comunicación entre desarrollo, diseño y producto. La inversión de configuración es mínima (un YAML y una release) y el retorno en alineamiento del equipo es inmediato.
