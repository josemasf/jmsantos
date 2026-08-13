---
title: "Estandarización de tablas de datos complejas en aplicaciones empresariales"
description: "Cómo definir criterios mínimos obligatorios para tablas de datos de alta funcionalidad, agnósticos a la tecnología, cuando tu plataforma tiene múltiples frameworks frontend."
date: 2025-09-05
tags: [UX, frontend, tablas, Material Design, arquitectura, Vue, Blazor]
category: UX/Arquitectura
image:
  src: /images/blog/02-estandarizacion-tablas-datos-complejas/estandarizacion-tablas-datos-complejas.png
  alt: Ilustración de varias tablas de datos alineadas mediante una regla y una plantilla común.
  width: 1536
  height: 1024
---

Cuando una plataforma empresarial crece y múltiples equipos trabajan con diferentes stacks tecnológicos (Vue/PrimeVue, Blazor/Radzen, etc.), la experiencia de usuario se fragmenta. Las tablas de datos — uno de los componentes más utilizados en cualquier aplicación de gestión — son especialmente susceptibles a esta inconsistencia.

Este artículo comparte cómo abordamos la estandarización de tablas definiendo **criterios mínimos obligatorios agnósticos a la tecnología**.

## El problema

- **Pluralidad tecnológica**: equipos usando Vue, Blazor y diferentes librerías de componentes con resultados visuales y funcionales dispares.
- **Requisitos de producto**: filas expandibles/colapsables para mostrar detalles anidados.
- **Objetivo de diseño**: consistencia estética (Material Design) y paridad funcional entre todos los módulos.

## Los criterios mínimos obligatorios

Dividimos los criterios en cinco categorías:

### A. Visualización y UX

| Criterio | Requisito |
|----------|-----------|
| **Filas expandibles** | La tabla debe permitir expandir una fila para ver información detallada anidada |
| **Estilo consistente** | Diseño basado en Material Design. Priorizar librerías que ya sigan este estándar |
| **Scroll dinámico** | La tabla debe ocupar el máximo alto vertical disponible con scroll limitado al cuerpo |
| **Estados visuales** | Esqueletos/spinners durante la carga, mensaje claro cuando no hay datos |

### B. Interacción y configuración

| Criterio | Requisito |
|----------|-----------|
| **Filtros por columna** | Filtrado avanzado directamente en el encabezado de cada columna |
| **Filtro global** | Campos de búsqueda general ubicados en el área de control sobre la tabla |
| **Agrupación** | Agrupamiento de filas por criterios definidos por el usuario |
| **Visibilidad de columnas** | Permitir al usuario mostrar/ocultar columnas según necesidad |
| **Copiar valor de celda** | Click para copiar el contenido de una celda individual |

### C. Productividad y persistencia

| Criterio | Requisito |
|----------|-----------|
| **Selección de filas** | Selección individual y masiva con checkboxes |
| **Reordenar columnas** | Drag & drop para reorganizar el orden visual |
| **Redimensionar columnas** | Ajuste manual del ancho de columnas |

### D. Datos y paginación

| Criterio | Requisito |
|----------|-----------|
| **Controles de paginación** | Selector de registros por página, navegación y total visible |
| **Columna de acciones fija** | Columna sticky que permanece visible al hacer scroll horizontal |
| **Virtual scrolling/Lazy loading** | Para datasets grandes, renderizado eficiente |

### E. Servicios

| Criterio | Requisito |
|----------|-----------|
| **Internacionalización (i18n)** | Soporte para textos, formatos numéricos y de fecha localizados |

## Evaluación de alternativas

Evaluamos tres librerías principales para el stack Vue:

| Característica | Vuetify DataTable | PrimeVue DataTable | AG Grid Community |
|---------------|-------------------|--------------------|--------------------|
| Filas expandibles | ✅ Nativo | ✅ Nativo | ❌ Solo Enterprise |
| Material Design | ✅ Nativo | 🟡 Custom viable | ❌ |
| Filtros por columna | ✅ Custom | ✅ Nativo | ✅ Nativo |
| Agrupación | 🟡 Custom | ✅ Nativo | ❌ Enterprise |
| Redimensionar columnas | 🔴 No nativo | ✅ Nativo | ✅ Nativo |
| Virtual scrolling | ✅ Desde v3.5 | ✅ Nativo | ✅ Nativo |
| Licencia | MIT | MIT | MIT (Community) |

### La decisión

Se optó por **PrimeVue DataTable** como alternativa a AG Grid para los equipos Vue, por cumplir nativamente con la mayoría de los criterios sin necesidad de customizaciones pesadas.

## Lecciones aprendidas

1. **Definir los criterios antes de elegir la librería**: si el equipo parte de un checklist funcional claro, la evaluación de alternativas es objetiva.
2. **Separar "lo que necesitamos" de "lo que la librería ofrece"**: no todas las features de una librería son relevantes, y no todas las necesidades están cubiertas out-of-the-box.
3. **Material Design como lingua franca**: cuando hay equipos Blazor y Vue, adoptar Material Design como estándar visual reduce las discusiones sobre estética.
4. **El checklist es un contrato vivo**: nuevos módulos deben cumplirlo, pero los criterios se pueden revisar periódicamente.

## Conclusión

La estandarización de tablas no es solo un ejercicio visual — es una decisión arquitectónica que impacta la productividad de los usuarios, la mantenibilidad del código y la coherencia de la plataforma. Definir criterios agnósticos a la tecnología permite que cada equipo elija la mejor herramienta sin sacrificar la experiencia.
