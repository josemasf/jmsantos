---
title: "El código muerto no está muerto: alguien sigue pagando por él"
description: "El coste cognitivo del código, exports y dependencias sin uso, y una forma segura de identificar y retirar residuos de un frontend."
date: 2026-11-17
tags: [código muerto, deuda técnica, Knip, TypeScript, mantenimiento, frontend]
category: Frontend
image:
  src: /images/blog/39-codigo-muerto-coste-cognitivo/codigo-muerto-coste-cognitivo.png
  alt: Una persona retira una caja de código de una estantería con módulos antiguos mientras quedan visibles las conexiones activas.
  width: 1536
  height: 1024
series:
  slug: mantenibilidad-frontend-coste-de-entender
  order: 3
---

Un archivo que ya no se ejecuta no afecta directamente a una persona usuaria, pero sigue participando en el sistema que el equipo intenta comprender. Aparece en búsquedas, confunde durante una investigación, mantiene dependencias y ofrece APIs que parecen válidas. Por eso el código muerto no está muerto desde el punto de vista del mantenimiento: alguien continúa pagando por considerarlo una posibilidad.

El coste es cognitivo. Ante una incidencia o una nueva funcionalidad, una persona explora nombres, módulos y exports para construir un mapa del sistema. Cada pista sin consumidores alarga ese recorrido. En un repositorio grande, además, las piezas sin uso tienden a conservar convenciones antiguas y hacen más difícil saber qué patrón representa la forma actual de trabajar.

## La ausencia de imports es una hipótesis

Herramientas como Knip son valiosas porque encuentran candidatos: archivos, dependencias y exports que no detectan como consumidos. Pero no conocen automáticamente todas las convenciones del runtime. Una ruta basada en archivos, un plugin, un componente autoimportado o una carga dinámica puede no tener un import convencional y seguir siendo esencial.

Por tanto, el informe no debe traducirse en un borrado masivo. Cada resultado necesita una clasificación: utilidad interna sin referencias, contrato público de un paquete, archivo descubierto por el framework, código generado o caso todavía incierto. Ajustar primero las entradas y patrones de análisis reduce falsos positivos y evita que una exclusión global esconda problemas reales.

## Retira residuos en cambios pequeños

La limpieza más segura ordena los casos por confianza. Una dependencia sin referencias en código, scripts ni configuración suele ser fácil de comprobar. Un export interno sin consumidores puede dejar de formar parte de la API. Un archivo ligado a una convención de Astro, Vite o un framework requiere entender antes cómo se registra.

Después de cada grupo, ejecuta las validaciones normales: tipos, tests, lint y build. El análisis estático señala dónde mirar; la aplicación confirma que el comportamiento permanece. Separar estos cambios también produce revisiones más útiles: si una regresión aparece, el conjunto de candidatos es pequeño.

## La limpieza es una decisión de diseño

Eliminar no significa alcanzar un informe vacío. Puede haber fixtures, ejemplos, código generado o interfaces públicas que exijan excepciones deliberadas. La meta es que el repositorio describa mejor la aplicación real y que las excepciones tengan una razón visible. Una dependencia retirada reduce superficie de actualización y vulnerabilidades potenciales; un módulo retirado reduce rutas falsas durante una investigación.

Incluir una comprobación periódica en mantenimiento evita que el inventario vuelva a crecer hasta ser inabarcable. No hace falta bloquear CI desde la primera ejecución: primero hay que conseguir una señal fiable y resolver el histórico. Después, el equipo puede decidir qué nuevas incidencias son suficientemente claras como para impedir la integración.

## Conclusión

El código sin uso no es urgente por una cuestión de estética. Importa porque degrada la capacidad de entender el sistema y tomar decisiones con confianza. Tratar sus detecciones como hipótesis, verificarlas con contexto y eliminarlas progresivamente convierte la limpieza en una mejora real de mantenibilidad.

La guía sobre [cómo interpretar código marcado como unused por Knip](/blog/knip-unused-no-significa-codigo-muerto/) detalla este proceso y los casos de falsos positivos más habituales.
