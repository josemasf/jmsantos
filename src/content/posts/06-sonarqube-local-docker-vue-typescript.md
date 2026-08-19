---
title: "Cómo montar SonarQube local con Docker para proyectos Vue/TypeScript"
description: "Guía paso a paso para levantar SonarQube con Docker, configurar proyectos Vue con TypeScript, integrar cobertura de tests con vitest+lcov, y complementar con Dependency-Track."
date: 2025-10-31
tags: [SonarQube, Docker, Vue, TypeScript, calidad, DevOps, CI/CD]
category: DevOps
image:
  src: /images/blog/06-sonarqube-local-docker-vue-typescript/sonarqube-local-docker-vue-typescript.png
  alt: Ilustración de un contenedor técnico analizando componentes y comprobaciones de calidad.
  width: 1536
  height: 1024
---

Cuando necesitas visibilizar la calidad del código de tus proyectos frontend pero la instancia corporativa de SonarQube está desactualizada (o directamente no soporta versiones modernas de TypeScript), montar una instancia local con Docker es la solución más rápida.

Esta guía documenta el proceso completo, incluyendo los problemas reales que encontré y cómo los resolví.

## Requisitos previos

- Docker instalado
- OpenJDK 17+ (SonarQube lo necesita para empaquetar el análisis)
- Un proyecto Vue con TypeScript
- vitest configurado para tests

## Paso 1: Levantar SonarQube con Docker

```bash
docker run -d \
  --name sonarqube \
  -p 9001:9000 \
  sonarqube:latest
```

> **Nota**: uso el puerto 9001 porque el 9000 suele estar ocupado por otros servicios del stack de desarrollo.

Accede a `http://localhost:9001` con las credenciales por defecto (`admin` / `admin`). El sistema te pedirá cambiar la contraseña.

## Paso 2: Conectar con tu repositorio

SonarQube permite conectarse directamente a Azure DevOps, GitHub o GitLab. Sigue el asistente de configuración para vincular tu repositorio.

## Paso 3: Configurar el proyecto

Al seleccionar un proyecto, SonarQube te proporcionará los datos para tu archivo de configuración. Para la estrategia de detección de código nuevo, selecciona **"Number of days"** si trabajas con un flujo de main branch.

### Crear `sonar-project.properties`

En la raíz de tu proyecto web (si tu web está dentro de un monorepo con API, ubícalo en la carpeta `client-app`):

```properties
sonar.projectKey=mi-proyecto-front
sonar.projectName=Mi Proyecto Front
sonar.sources=src
sonar.tests=tests
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.host.url=http://localhost:9001
sonar.token=TU_TOKEN_AQUÍ
```

### Generar un token

En SonarQube, ve a **My Account > Security > Generate Tokens** y crea un token para tu proyecto.

## Paso 4: Configurar vitest para cobertura lcov

SonarQube necesita el formato `lcov` para procesar la cobertura de tests. Actualiza tu `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "./coverage",
    },
  },
});
```

Y añade un script combinado en `package.json`:

```json
{
  "scripts": {
    "test:sonar": "vitest run --coverage && npx sonar-scanner"
  }
}
```

## Paso 5: Instalar Java (si no lo tienes)

SonarQube Scanner necesita Java para empaquetar el análisis. Descarga [OpenJDK 17 JRE desde Adoptium](https://adoptium.net/).

> ⚠️ **Advertencia**: durante mi primera instalación, la configuración de variables de entorno de Java rompió completamente otras herramientas de desarrollo. Me costó un día entero restaurar el entorno. Recomiendo usar un gestor de versiones de Java o Docker para el scanner.

## Paso 6: Actualizar `.gitignore`

Añade los archivos generados por SonarQube:

```gitignore
.scannerwork/
coverage/
```

## Qué mide SonarQube

SonarQube clasifica los problemas en tres tipos:

| Tipo              | Descripción                                              |
| ----------------- | -------------------------------------------------------- |
| **Bug**           | Punto de fallo real o potencial                          |
| **Vulnerability** | Agujero de seguridad explotable                          |
| **Code Smell**    | Problema de mantenibilidad que dificulta cambios futuros |

## Complemento: Dependency-Track

Además de SonarQube, evaluamos [Dependency-Track](https://dependencytrack.org/) como complemento para el análisis de vulnerabilidades en dependencias. Mientras SonarQube se centra en el **código que escribes**, Dependency-Track analiza las **dependencias que consumes**.

| Herramienta      | Enfoque                                             |
| ---------------- | --------------------------------------------------- |
| SonarQube        | Calidad y seguridad del código propio               |
| Dependency-Track | Vulnerabilidades en dependencias (npm, NuGet, etc.) |

La combinación de ambas herramientas ofrece una visión completa de la postura de seguridad del proyecto.

## Conclusiones

1. **Docker es la forma más rápida** de tener SonarQube funcionando localmente.
2. **La integración con vitest+lcov** es directa y no requiere configuración compleja.
3. **Cuidado con la instalación de Java** — usa un gestor de versiones o Docker para el scanner.
4. **SonarQube local es un buen primer paso** antes de solicitar una instancia corporativa actualizada.
5. **Complementa con Dependency-Track** para cubrir también las vulnerabilidades de terceros.

## Recursos

- [SonarQube Docker](https://hub.docker.com/_/sonarqube)
- [Adoptium OpenJDK](https://adoptium.net/)
- [Dependency-Track](https://dependencytrack.org/)
- [vitest Coverage](https://vitest.dev/guide/coverage.html)
