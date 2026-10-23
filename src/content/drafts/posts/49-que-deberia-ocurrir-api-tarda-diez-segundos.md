---
title: "¿Qué debería ocurrir cuando una API tarda diez segundos?"
description: "Cómo diseñar una interfaz para operaciones lentas: feedback inmediato, progreso honesto, cancelación y actualizaciones optimistas con límites claros."
date: 2027-01-26
tags: [frontend, UX, rendimiento, API, arquitectura]
category: Frontend
image:
  src: /images/blog/49-que-deberia-ocurrir-api-tarda-diez-segundos/api-lenta-feedback-progreso.png
  alt: Una persona espera junto a un reloj mientras un paquete cruza un puente hacia una pantalla con una marca de confirmación; una puerta abierta ofrece una salida.
  width: 1536
  height: 1024
---

Una persona pulsa «Generar informe» y la pantalla no cambia. Durante unos segundos no sabe si el clic se ha registrado, si la aplicación está trabajando o si algo se ha roto. Cuando por fin aparece una respuesta, quizá el informe ya no sea relevante o la persona haya pulsado varias veces y lanzado la misma operación más de una vez.

Una operación lenta plantea dos problemas distintos: cuánto tarda y qué puede entender y hacer la persona mientras espera. El frontend no puede acelerar por sí solo una consulta pesada o un servicio externo, pero sí puede confirmar que ha recibido la acción, representar el estado real del trabajo y ofrecer una salida segura. Ese diseño empieza por distinguir entre espera, progreso y finalización.

## Confirma la acción antes de que llegue la respuesta

El primer feedback no necesita esperar a la API. Al pulsar un botón, la interfaz puede cambiar su etiqueta a «Generando informe…», mostrar una indicación de actividad y evitar que se envíe de nuevo la misma acción. Esta respuesta rápida elimina la duda de si el clic funcionó, aunque todavía no diga cuánto falta.

El estado debe pertenecer a la operación concreta. Deshabilitar toda la página durante una petición de una sección puede bloquear tareas que no guardan relación; dejar el botón habilitado puede crear solicitudes duplicadas. Conviene limitar el bloqueo al control que inicia la acción, explicar por qué está ocupado y mantener disponibles las acciones independientes.

```ts
const isGenerating = ref(false);

async function generateReport() {
  if (isGenerating.value) return;

  isGenerating.value = true;

  try {
    report.value = await reportsApi.generate();
  } finally {
    isGenerating.value = false;
  }
}
```

En una aplicación real, el `catch` también debe traducir el fallo a un mensaje que permita decidir qué hacer. El `finally` garantiza que el control vuelva a estar disponible tanto si la operación termina correctamente como si falla; el estado de carga no debe quedarse atascado por una excepción.

## Muestra progreso solo cuando tienes una señal fiable

Una barra que avanza suele sugerir que el sistema sabe cuánto falta. Si el cliente solo está esperando una respuesta HTTP, no conoce el porcentaje real de trabajo del servidor. Hacer que una barra llegue al 90 % y se quede allí puede parecer tranquilizador al principio, pero comunica una precisión inexistente y erosiona la confianza cuando la espera se alarga.

Si no hay una estimación, usa una señal indeterminada —un spinner o una animación discreta— y acompáñala con texto que describa la actividad: «Estamos preparando el informe». Si el backend sí expone fases o unidades de trabajo, puedes mostrar progreso determinado, siempre que el dato represente trabajo real y se actualice de forma coherente. Un porcentaje que salta hacia atrás o se queda congelado también necesita tratamiento explícito.

Para una tarea larga que debe sobrevivir a una pestaña cerrada, no mantengas abierta una petición durante todo el proceso. El servidor puede aceptar el trabajo y devolver un identificador; el cliente consulta el estado o recibe actualizaciones mediante el mecanismo que use el producto. Así la interfaz distingue entre «solicitud recibida», «en curso», «completada» y «fallida», y puede recuperar el resultado más tarde.

```text
Cliente             API / trabajos
  │                       │
  ├─ solicitar informe ──>│
  │<─ trabajo: abc123 ────┤
  │                       ├─ procesando
  ├─ consultar estado ───>│
  │<─ en curso ───────────┤
  │          …            │
  ├─ consultar estado ───>│
  │<─ completado + URL ───┤
```

No hace falta introducir una cola o un canal en tiempo real para cualquier espera. Una operación que normalmente termina en unos segundos puede resolverse con una única petición y un estado de carga claro. La arquitectura asíncrona se justifica cuando el trabajo puede durar mucho, necesita reintentos, debe continuar sin el navegador o requiere consultar el resultado desde otra sesión.

## Decide qué significa cancelar

Un botón «Cancelar» promete que la acción puede detenerse. En el navegador, `AbortController` permite abortar una petición y dejar de esperar su respuesta:

```ts
const controller = new AbortController();

try {
  await fetch("/api/reports", { signal: controller.signal });
} catch (error) {
  if (error instanceof DOMException && error.name === "AbortError") {
    // La persona dejó de esperar esta petición.
  } else {
    throw error;
  }
}

// Asociar controller.abort() a una acción visible de cancelación.
```

Abortar la conexión desde el cliente no garantiza que el servidor haya detenido el trabajo. Puede haberlo recibido y continuar procesándolo, sobre todo si la operación ya inició una tarea independiente. Si el producto necesita cancelación real, el servidor debe ofrecer esa capacidad y confirmar el estado resultante. Si solo se cancela la espera, la interfaz debe comunicarlo con precisión y permitir recuperar el resultado si el trabajo continúa.

La cancelación también requiere decidir qué ocurre con los datos parciales, si se puede reintentar y si cancelar tiene efectos externos. Detener una búsqueda es distinto de interrumpir un pago o una exportación que ya se ha enviado a otro sistema. El control debe estar disponible únicamente cuando el producto pueda sostener esa promesa.

## Usa optimistic UI cuando el resultado se pueda corregir

Una actualización optimista muestra el cambio antes de recibir confirmación del servidor. Puede hacer que una acción sencilla se sienta inmediata, pero traslada la incertidumbre al manejo del error. Encaja bien cuando el cambio es reversible, el resultado probable está claro y la interfaz sabe restaurar el estado o explicar cómo resolver el conflicto.

Por ejemplo, marcar una tarea como favorita puede actualizarse inmediatamente y revertirse si el servidor rechaza la petición. En cambio, mostrar «Pago completado» antes de recibir confirmación sería engañoso: la operación tiene consecuencias y el resultado no es intercambiable con una suposición. En esos casos, comunica que el pago está siendo procesado y distingue ese estado de la confirmación final.

```text
Acción reversible y resultado predecible
→ actualizar interfaz
→ enviar cambio
→ confirmar o revertir con explicación

Operación costosa o resultado incierto
→ confirmar recepción
→ mostrar estado en curso
→ presentar resultado confirmado
```

La decisión depende del coste de equivocarse y del coste de esperar, no de una preferencia general por hacer que todo parezca instantáneo.

## Trata los errores y la espera prolongada como estados del flujo

Una pantalla de carga no puede ocultar todos los casos. La conexión puede fallar, la sesión caducar, el servidor rechazar la petición o la respuesta perderse después de que la operación se haya completado. Un mensaje útil describe lo que se sabe y ofrece el siguiente paso: reintentar, consultar el estado, volver más tarde o contactar con soporte con un identificador de operación.

También es importante evitar que un reintento duplique efectos. Para operaciones que crean recursos o generan cargos, el backend puede necesitar una clave de idempotencia o una consulta de estado antes de repetir la solicitud. El botón «Reintentar» no debería ocultar una incertidumbre que el cliente no puede resolver por sí solo.

Si la espera supera lo habitual, actualiza el texto con información cierta: «La preparación está tardando más de lo normal; puedes dejar esta página y volver después» solo es adecuado si el trabajo queda guardado y existe una forma fiable de encontrarlo. No inventes una cuenta atrás ni atribuyas el retraso a una causa que no conoces.

## Elige el patrón según la operación

Antes de añadir una animación, responde unas preguntas: ¿la persona necesita ver el resultado en esta misma pantalla?, ¿hay progreso real disponible?, ¿la operación continúa si se cierra la pestaña?, ¿se puede cancelar?, ¿qué coste tiene repetirla?, ¿es seguro mostrar una actualización optimista? Las respuestas suelen determinar la interacción mejor que la duración aislada.

Para una búsqueda que tarda dos segundos, puede bastar un indicador junto al listado y conservar los resultados anteriores mientras llega la nueva respuesta. Para una exportación que tarda minutos, tiene más sentido crear un trabajo consultable y avisar cuando termine. Para guardar una preferencia reversible, una actualización optimista puede evitar una pausa perceptible, siempre con una ruta de recuperación ante error.

La interfaz no controla todos los tiempos del sistema, pero sí controla la claridad del recorrido: confirma la acción, describe estados reales, ofrece una salida cuando exista y deja visible qué resultado se ha confirmado. Cuando una API tarda diez segundos, el objetivo no es disfrazar la espera. Es evitar que la persona tenga que adivinar qué ha ocurrido y qué puede hacer a continuación.
