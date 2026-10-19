---
title: "Bugs con agentes: reproducir antes de teorizar"
description: "Un proceso para depurar con agentes a partir de una reproducción determinista, hipótesis comprobables e instrumentación útil."
date: 2026-10-14
tags: [IA, agentes, debugging, testing, observabilidad, calidad]
category: Testing
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 5
image:
  src: /images/blog/56-bugs-agentes-reproducir-antes-teorizar/bug-agente-reproduccion-feedback-loop.png
  alt: Una persona y un asistente siguen una pista reproducible desde un síntoma observado hasta una prueba de regresión que confirma la corrección.
  width: 1536
  height: 1024
---

Cuando algo falla, es fácil empezar por la explicación más plausible: un estado que no se actualiza, una carrera asíncrona o un dato inesperado. Un agente puede convertir esa intuición en un cambio rápidamente, pero si la hipótesis no explica el síntoma real, el parche añade movimiento sin reducir incertidumbre. En depuración, la primera tarea no es elegir la causa: es construir una forma fiable de observar el fallo.

La skill [`diagnosing-bugs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnosing-bugs) parte de un feedback loop que se vuelve rojo ante el bug concreto. Puede ser un test, un script HTTP, una reproducción en navegador, una traza capturada o un pequeño harness. El mecanismo depende del fallo; la condición es que conduzca por la ruta real y compruebe el síntoma descrito.

## Construye primero una reproducción que pueda fallar

Un test que solo comprueba que la aplicación no se cae no sirve para diagnosticar una pantalla que muestra el saldo equivocado. El feedback loop debe afirmar el resultado erróneo que alguien observa. Si el bug consiste en que al guardar un formulario se pierde el filtro seleccionado, la reproducción debe establecer ese filtro, guardar y comprobar que se conserva.

No siempre es necesario empezar por una suite automatizada. Una petición `curl`, una fixture de CLI, un flujo de Playwright, una traza reproducible o un harness temporal pueden dar una señal más directa. Conviene elegir la herramienta más estrecha que atraviese el camino afectado y repetirla hasta que falle de forma consistente. Si el problema aparece de manera intermitente, el objetivo puede ser elevar la frecuencia de reproducción con entradas controladas o más iteraciones.

La guía aconseja no teorizar antes de tener esta señal. Verificar el error real impide que se arregle un fallo cercano pero distinto. Si no se puede construir una reproducción, esa limitación debe quedar explícita y la investigación necesita datos útiles: logs redactados, una captura de red, una traza o acceso al entorno donde ocurre.

## Reduce el caso sin perder el fallo

Una vez que la reproducción está roja, minimiza la entrada y los pasos, de uno en uno. Quita datos, configuración, llamadas y acciones innecesarias, y vuelve a ejecutar el loop después de cada cambio. El caso mínimo reduce el número de causas posibles y puede convertirse en la prueba de regresión cuando se encuentre el origen.

Por ejemplo, si un bug aparece en un flujo de facturación con una cuenta, tres líneas de producto y dos monedas, averigua qué parte es necesaria para conservarlo. Si eliminar un producto no cambia el fallo, esa línea no es esencial para la reproducción. Si usar una sola moneda hace desaparecer el problema, la conversión o su configuración pasan a ser sospechosas, aunque todavía no sean la causa confirmada.

## Formula hipótesis que puedan refutarse

Con el caso mínimo disponible, enumera varias causas posibles y qué observación predice cada una. «Puede ser un problema de estado» es demasiado vaga; «si el componente conserva una respuesta anterior, limpiar la caché antes del segundo envío debería cambiar el resultado» se puede comprobar.

La skill propone ordenar entre tres y cinco hipótesis antes de probarlas, porque la primera explicación plausible tiende a dominar la investigación. Comparte el orden con la persona usuaria para que aporte contexto —por ejemplo, un despliegue reciente—, pero no conviertas su ausencia en una razón para detener una depuración que puede avanzar con evidencia.

Instrumenta después de formular predicciones. Los logs, contadores, traces o puntos de interrupción deben distinguir hipótesis, no acumular ruido. Un resultado negativo también es útil: descarta una explicación y reduce el espacio de búsqueda. La depuración mejora cuando cada paso cambia lo que sabemos.

## Cierra con una regresión y una verificación final

Tras identificar la causa, conserva la reproducción como regresión cuando encaje en un seam estable. Aplica el cambio más pequeño que resuelva el problema, vuelve a ejecutar el loop y comprueba los escenarios colindantes que podrían verse afectados. La corrección necesita evidencia sobre el mismo síntoma que inició el trabajo.

El feedback loop puede ser parte del producto del equipo: si una clase de error cuesta mucho de reproducir, quizá sea útil guardar una fixture, mejorar la telemetría o automatizar una comprobación. La retro debería capturar esa mejora del entorno, no solo el código reparado.

El orden completo queda así: síntoma, reproducción, minimización, hipótesis, instrumentación, cambio y regresión. Los agentes son eficaces para explorar alternativas y ejecutar comprobaciones cuando la señal es clara. Sin esa señal, generan posibles explicaciones; con ella, la investigación se convierte en un proceso comprobable.
