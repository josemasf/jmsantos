---
title: "Knip marca código como unused: por qué no deberías borrarlo sin validar"
description: "Cómo interpretar los resultados de Knip en proyectos frontend, reducir falsos positivos y eliminar código muerto de forma segura."
date: 2026-08-11
tags: [Knip, deuda técnica, TypeScript, frontend, tooling, calidad]
category: Frontend
image:
  src: /images/blog/27-knip-unused-no-significa-codigo-muerto/knip-unused-codigo-muerto.png
  alt: Ilustración de código señalado como sin uso examinado con lupa antes de retirarlo con seguridad.
  width: 1536
  height: 1024
---

Ejecutar Knip por primera vez en un proyecto con años de recorrido puede producir una mezcla incómoda de entusiasmo y alarma. En una auditoría reciente aparecieron 182 archivos potencialmente no utilizados, además de dependencias, _devDependencies_, exports y tipos sin consumidores detectables. La tentación era clara: eliminar la lista y dar por resuelta una parte de la deuda técnica.

Sin embargo, ese sería un mal uso de la herramienta. Knip no afirma que un archivo carezca de utilidad; afirma que, con las entradas, convenciones y configuración que conoce, no ha encontrado una referencia que lo consuma. La diferencia es importante en cualquier aplicación TypeScript y decisiva en proyectos que dependen de convenciones del framework, autoimportaciones, rutas generadas a partir del sistema de archivos o módulos cargados dinámicamente.

La idea que conviene conservar es sencilla: **Knip genera hipótesis de limpieza, no órdenes de borrado**. Bien integrado, permite convertir una masa de código difícil de revisar en una lista priorizada de preguntas concretas. Pero para que la señal sea útil hay que configurar la herramienta, investigar los casos dudosos y aplicar cambios pequeños que podamos verificar.

## Qué detecta Knip y qué no puede deducir por sí solo

Knip analiza el grafo de dependencias del proyecto y puede informar de archivos, dependencias, exports y tipos que no encuentra referenciados. Su documentación propone instalarlo como dependencia de desarrollo y añadir un script propio al proyecto; después, `pnpm knip` ejecuta el análisis. También es posible probarlo puntualmente con `pnpm dlx knip`. [La guía oficial de inicio](https://knip.dev/overview/getting-started) enumera precisamente archivos, exports y dependencias como los tipos de incidencias que puede reportar.

Ese análisis estático es muy valioso para localizar residuos de refactors: un composable que dejó de usarse al rehacer una pantalla, una librería sustituida que sigue en `package.json` o una función pública que ya no tiene consumidores. El problema aparece cuando interpretamos la ausencia de un `import` explícito como ausencia de uso en ejecución.

Un framework puede cargar piezas de la aplicación sin que exista ese import. Una página basada en archivos puede ser una ruta válida; un plugin puede activarse por estar en una carpeta concreta; un componente puede estar disponible mediante autoimportación. En Nuxt, y más todavía cuando se trabaja con _layers_, muchas de esas relaciones las resuelve el framework. Si Knip no conoce correctamente los puntos de entrada y los archivos de cada capa, es razonable que produzca falsos positivos.

Por eso, antes de eliminar un archivo marcado como `unused`, conviene hacer una pregunta más precisa: **¿debería consumirlo otro módulo del proyecto o lo consume una convención del framework?** La respuesta determina si estamos ante un candidato a borrado, una configuración incompleta o un caso que exige más investigación.

## Empieza por configurar la señal

La primera ejecución sirve para descubrir el tamaño del problema, no para establecer una línea roja en CI. Antes de perseguir resultados individuales, hay que revisar los avisos de configuración y declarar aquello que forma parte del proyecto. Knip permite definir patrones para los puntos de entrada con `entry`, los archivos que se deben analizar con `project` y configuraciones por espacio de trabajo mediante `workspaces`. [La referencia de configuración](https://knip.dev/reference/configuration) detalla esas opciones y recomienda afinar patrones antes de recurrir a exclusiones globales.

Una configuración mínima debe reflejar la estructura real del repositorio. El siguiente ejemplo ilustra la intención, no sustituye la configuración específica de un proyecto Nuxt:

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "entry": ["app.vue", "server/**/*.ts", "scripts/**/*.ts"],
  "project": ["app/**/*.{ts,vue}", "layers/**/*.{ts,vue}", "server/**/*.ts"]
}
```

El objetivo no es escribir globs hasta que el informe quede vacío. Es conseguir que los archivos que el runtime puede ejecutar estén representados como entradas o estén cubiertos por el plugin y la configuración adecuados. Los `layers` merecen una revisión explícita: si contienen páginas, plugins, composables o componentes descubiertos automáticamente, deben formar parte del análisis de forma coherente con la arquitectura real.

Tampoco conviene silenciar el informe demasiado pronto. Knip diferencia opciones para ignorar solamente archivos, dependencias o tipos concretos. La documentación aconseja priorizar la corrección de los puntos de entrada y de los patrones `project` antes de usar `ignore`; así se evita convertir una limitación de configuración en un agujero permanente del análisis. Un `ignoreFiles` o `ignoreIssues` acotado puede tener sentido para código generado o fixtures, pero debería explicar una excepción conocida, no esconder resultados incómodos.

## Cómo validar cada tipo de resultado

Una vez que la configuración representa el proyecto, el informe se vuelve manejable si se divide por categorías. No todas tienen el mismo riesgo ni requieren la misma comprobación.

### Dependencias sin uso aparente

Las dependencias candidatas suelen ser el primer grupo rentable. Busca el nombre del paquete en código, configuración, scripts de automatización y archivos de herramientas. Una comprobación inicial puede ser:

```bash
rg "nombre-del-paquete" .
```

El resultado no basta por sí solo: una dependencia puede aparecer en un script, una configuración de Vite, un plugin de ESLint o un comando de CI. Pero sí reduce la investigación a casos concretos. Si no hay ningún consumidor y la eliminación no altera el _lockfile_ de manera inesperada, quítala en un cambio aislado, reinstala dependencias y ejecuta las validaciones habituales del repositorio.

Una dependencia eliminada reduce superficie de mantenimiento, posibles avisos de seguridad y tiempo de instalación. Aun así, su principal beneficio suele ser cognitivo: la siguiente persona que lea `package.json` tendrá una descripción más fiel de las herramientas que el proyecto utiliza de verdad.

### Exports y tipos públicos sin consumidores

Un export sin referencias puede indicar código muerto, pero también una API pública pensada para otros paquetes, consumidores externos o carga dinámica. En una aplicación cerrada, la investigación suele ser corta; en una librería o monorepo hay que verificar primero qué forma parte de la interfaz publicada.

Los tipos merecen una decisión separada. Si un tipo solamente se utiliza dentro del mismo módulo, dejar de exportarlo reduce la superficie pública y hace más fácil evolucionar su representación interna:

```ts
// Antes: se ofrece como parte de la API sin necesidad.
export interface SearchOptions {
  limit: number;
}

// Después: basta con que sea local al módulo.
interface SearchOptions {
  limit: number;
}
```

No se trata de perseguir el menor número posible de exports. Se trata de que los exports expresen una frontera deliberada. Si un tipo es parte del contrato de un paquete, documentarlo o mantenerlo explícitamente puede ser preferible a eliminarlo porque una herramienta no encuentra sus consumidores.

### Archivos no utilizados

Los archivos requieren más contexto que el resto. Una utilidad TypeScript sin referencias, después de comprobar aliases y cargas dinámicas, es un candidato razonable. Una página, middleware, plugin, componente autoimportado o archivo generado por el framework debe revisarse desde las convenciones del proyecto.

En Nuxt, una comprobación práctica consiste en clasificar cada resultado antes de tocarlo:

| Clasificación                                         | Acción                                                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Utilidad o componente con imports explícitos ausentes | Buscar referencias y eliminar en un cambio pequeño si no las hay.                        |
| Página, plugin o middleware basado en convenciones    | Verificar cómo lo descubre Nuxt y ajustar la configuración de Knip si corresponde.       |
| Código generado, fixtures o ejemplos                  | Mantenerlo fuera del tipo de incidencia concreto con una exclusión mínima y justificada. |
| Caso sin evidencia suficiente                         | Dejarlo registrado para investigar; no borrarlo por intuición.                           |

Esta clasificación evita dos extremos igual de costosos: conservar cualquier resultado por miedo a romper algo y borrar sin saber qué parte del runtime lo necesita.

## Una limpieza segura no es una operación masiva

Cuando el primer informe devuelve cientos de incidencias, resolverlas en un único PR convierte una mejora de mantenimiento en una regresión difícil de diagnosticar. Una estrategia más segura es ordenar los cambios por confianza y tamaño:

1. Dependencias claramente sin referencias ni configuración asociada.
2. Exports y tipos internos que no forman parte de una API pública.
3. Utilidades y componentes sin consumidores comprobados.
4. Archivos ligados al framework, después de ajustar entradas, plugins y _layers_.

Cada grupo debe pasar por el mismo proceso que cualquier refactor: tests, comprobación de tipos, lint y build. La secuencia exacta dependerá de los scripts del repositorio, pero el principio es estable: el análisis de Knip identifica dónde mirar; las validaciones de la aplicación confirman que el cambio conserva el comportamiento.

También conviene separar la configuración de Knip de la primera limpieza si ambas son grandes. Un PR puede mejorar el análisis para reducir ruido y otro eliminar elementos cuya inutilidad ya se ha comprobado. Así una futura regresión se atribuye con más facilidad y las revisiones son más legibles.

## Convierte Knip en una práctica de mantenimiento

El mejor momento para usar Knip no es únicamente cuando el repositorio ya parece desordenado. Ejecutarlo de forma periódica hace que cada informe sea más pequeño y que el equipo conserve el contexto de los cambios que introdujeron una dependencia, un export o un archivo nuevo.

No recomiendo bloquear una CI con todos los tipos de resultado desde el primer día. Primero hay que lograr una configuración fiable y resolver el inventario existente de forma gradual. Después se puede acordar qué categorías deben impedir la integración de cambios nuevos y cuáles deben revisarse en una tarea de mantenimiento. Esto evita que la herramienta se convierta en una fuente de ruido que el equipo termina ignorando.

La métrica útil no es «cero incidencias». Un proyecto puede tener entradas deliberadas, código generado o contratos públicos que exigen excepciones. La señal útil es otra: que una incidencia nueva de Knip sea lo bastante fiable como para que alguien pueda investigarla rápidamente y tomar una decisión con evidencia.

## Conclusión

Knip ha resultado especialmente útil no porque permita borrar archivos más deprisa, sino porque obliga a revisar qué partes del código siguen teniendo una razón para existir. En una auditoría, 182 archivos potencialmente no utilizados no son una tarea de borrado de 182 archivos: son una lista inicial de hipótesis sobre rutas, convenciones, dependencias y residuos de decisiones anteriores.

La secuencia que mejor funciona es sencilla: ejecutar el análisis, configurar los puntos de entrada reales, clasificar resultados, validar cada cambio y limpiar de forma progresiva. Con ese enfoque, Knip deja de ser una papelera automática y pasa a ser una herramienta fiable para mantener un frontend comprensible.

Si estás preparando una revisión más amplia, este análisis encaja junto a la observabilidad, el tipado y las dependencias en una [auditoría de deuda técnica de un frontend](/blog/auditoria-deuda-tecnica-frontend/). La diferencia está en no confundir una buena lista de sospechas con una decisión técnica ya tomada.
