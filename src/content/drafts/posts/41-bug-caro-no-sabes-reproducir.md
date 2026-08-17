---
title: "El bug más caro es el que no sabes reproducir"
description: "Cómo diseñar observabilidad frontend para convertir errores ambiguos en incidentes investigables sin recoger datos innecesarios."
date: 2026-11-17
tags: [observabilidad, debugging, Sentry, frontend, errores, calidad]
category: Frontend
series:
  slug: mantenibilidad-frontend-coste-de-entender
  order: 5
---

Corregir un error conocido suele ser un trabajo técnico delimitado. Corregir uno que llega como «a veces no funciona» puede convertirse en una investigación cara: hay que reconstruir versión, navegador, ruta, permisos, estado de red, respuesta del servidor y acciones previas. El coste no procede únicamente del bug; procede de la información que el sistema no dejó disponible.

La observabilidad frontend consiste en diseñar esas pistas. No es instalar un SDK y esperar a que agrupe excepciones. Una excepción sin contexto, o registrada como `<unknown>`, puede confirmar que algo falló sin permitir saber qué decisión tomó la aplicación ni qué experiencia recibió la persona usuaria.

## Registra contexto que ayude a decidir

Un evento útil debería permitir responder: qué versión estaba desplegada, en qué ruta ocurrió, qué operación se intentaba completar, qué resultado devolvió la dependencia y qué identificador seguro permite correlacionar con backend. Los breadcrumbs —cambios de ruta, acciones de dominio, peticiones relevantes— ayudan a construir una secuencia sin tener que registrar cada clic.

El contexto debe respetar privacidad y seguridad. No se trata de enviar formularios completos, tokens ni datos personales para “tenerlo todo”. Define campos permitidos, anonimiza o elimina identificadores sensibles y conserva solo lo necesario para diagnosticar. La utilidad de una plataforma de errores cae si el equipo no puede confiar en cómo se tratan los datos.

## Diferencia fallo técnico e impacto de producto

Una petición con 403, un error de validación y una excepción inesperada no tienen el mismo significado. Agruparlos todos como errores puede ocultar una regresión de permisos o inundar el panel con respuestas que forman parte de un flujo esperado. Clasificar las señales según su impacto permite alertar por aquello que exige acción y usar métricas o eventos de producto para el resto.

También conviene capturar los errores asíncronos y normalizar valores que no son instancias de `Error`. Una promesa rechazada con una cadena o un objeto sin serialización útil no debería terminar como una etiqueta opaca. Convertir ese caso en un mensaje, un nombre de operación y contexto controlado mejora la investigación posterior.

## Conecta la observabilidad con la respuesta

Los datos solo valen si alguien puede utilizarlos. Un panel debería enlazar con el runbook, dashboard o propietario apropiado; una alerta debería indicar el umbral y el impacto esperado; y una incidencia debería conservar el enlace a la traza o grupo de errores que motivó la intervención. Esta conexión reduce el salto entre detectar, entender y actuar.

Después de resolver un incidente, pregunta qué evidencia faltó. Puede ser un identificador de solicitud, una versión de feature flag o una forma de saber si el problema afectaba a una integración externa. Cada mejora pequeña reduce el coste del siguiente error desconocido.

## Conclusión

El bug más caro no siempre es el más complejo de arreglar. A menudo es el que obliga a adivinar qué ocurrió. Diseñar contexto, correlación y señales accionables convierte la observabilidad en una decisión de arquitectura: hace que el sistema sea más fácil de entender cuando se comporta peor.

Para una guía práctica de investigación en producción, consulta [debugging con VS Code y Sentry](/blog/debugging-produccion-vscode-sentry-mcp/).
