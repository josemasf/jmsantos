---
title: "Jobs durables con Trigger.dev: infraestructura y reglas de negocio"
description: "Cómo separar el trabajo pesado del ciclo HTTP con Trigger.dev y proteger el dominio con estados persistidos, idempotencia, recuperación y observabilidad."
date: 2026-08-25
tags: [Trigger.dev, Node.js, colas, observabilidad, arquitectura]
category: DevOps
image:
  src: /images/blog/trigger-dev-jobs-durables-reglas-negocio/jobs-durables-reglas-negocio.png
  alt: Ilustración de una solicitud persistida que atraviesa una cola de trabajo y termina como un documento validado, mientras una petición duplicada queda bloqueada.
  width: 1536
  height: 1024
---

Hay operaciones que encajan mal en el ciclo de una petición HTTP: generar un documento, procesar muchos datos, enviar una comunicación o limpiar información que ya no debe mantenerse disponible. Hacerlas antes de responder al cliente alarga la espera y vincula la experiencia de usuario a recursos que pueden fallar temporalmente. Lanzarlas como una promesa sin supervisión mejora poco el problema: sigue faltando una política de reintentos, límites de concurrencia y una forma clara de saber qué ha ocurrido.

En el ecosistema Node.js, [Trigger.dev](https://trigger.dev/) resulta útil para gestionar este tipo de trabajo fuera del proceso web sin tener que construir una infraestructura de workers desde cero. Aporta tareas durables, colas, planificación y visibilidad de cada ejecución, integrándose con el código y las dependencias que ya forman parte de la aplicación. Sin embargo, su adopción no debería convertir el sistema de jobs en la fuente de verdad del producto. La aplicación debe seguir teniendo autoridad sobre sus estados, permisos, duplicados y reglas de recuperación.

La idea central es sencilla: **la plataforma ejecuta el trabajo; el dominio decide qué significa completarlo**.

## Un job empieza con una solicitud persistida

Un patrón que funciona bien para la generación de documentos es no crear el fichero en la petición que lo solicita. La API registra primero una solicitud en la base de datos y encola una tarea con su identificador. El worker recupera los datos, produce el documento, lo almacena y actualiza el estado de la solicitud.

```text
HTTP -> solicitud persistida -> job -> generación -> almacenamiento -> estado completado
```

Este flujo permite responder rápido y, al mismo tiempo, ofrecer una experiencia comprensible. La interfaz no tiene que inferir el resultado a partir de una petición larga: puede mostrar estados como pendiente, en proceso, completado o fallido. Si el producto lo permite, también puede presentar una acción de reintento con los permisos adecuados.

Persistir la solicitud aporta otra ventaja: separa el resultado de negocio de una ejecución concreta. Un job puede reintentarse, detenerse o terminar tarde; la solicitud sigue siendo el punto de referencia para quien espera el documento y para quien debe investigar una incidencia.

## El payload debería describir el trabajo, no transportar el dominio

Cuando una tarea necesita generar un documento, es fácil incluir en el payload los filtros, los datos ya calculados y cualquier contexto disponible en la petición original. Es una decisión cómoda a corto plazo, pero crea una copia de información que quizá sea sensible, que puede quedar desactualizada y que hace más difícil entender qué datos autorizados debe usar realmente el worker.

En muchos casos basta con validar una entrada mínima:

```ts
{
  documentId: z.uuid();
}
```

La tarea vuelve a consultar el estado y los datos necesarios desde el servidor. Así, el payload es pequeño, fácil de registrar y estable ante reintentos. El acceso a los datos sigue pasando por la capa que aplica las reglas del producto, en lugar de depender de un objeto serializado cuando se lanzó el job.

Este enfoque no sustituye las medidas de seguridad propias de la aplicación. La tarea debe seguir validar que el trabajo existe, que está en un estado procesable y que puede acceder a los recursos que necesita. La diferencia es que esa validación se realiza contra la fuente de verdad, no contra una copia de la petición original.

## La concurrencia es una política, no un detalle de implementación

Procesar varios documentos o integraciones externas a la vez puede tensionar recursos distintos: CPU, memoria, base de datos, almacenamiento o la cuota de una API. Por eso una tarea cara debería pertenecer a una cola con un límite de concurrencia explícito.

```ts
queue({
  name: "document-generation",
  concurrencyLimit: 2,
});
```

El número exacto no es universal. Debe ajustarse a la capacidad y a las métricas de cada entorno. Lo importante es hacer visible la decisión: cuántos procesos simultáneos acepta el sistema antes de perjudicar al resto de la aplicación. Una cola no elimina la necesidad de medir, pero evita confiar en que las promesas concurrentes se regularán por sí solas.

La misma idea se aplica a las tareas periódicas. Una ejecución programada debería evitar solaparse con otra equivalente si ambas modifican el mismo recurso o consumen una cuota limitada. Un estado de `skipped` puede ser más correcto que iniciar un segundo proceso que no aportará valor y complicará el diagnóstico.

## La ejecución durable no hace que una acción sea única

Los reintentos son una de las razones para usar jobs durables, pero también obligan a diseñar para ejecuciones repetidas. Además, una persona usuaria puede repetir una petición por un doble clic, una recarga o un corte de red. La cola no puede decidir qué solicitudes deben considerarse la misma operación desde el punto de vista del producto.

La respuesta es una clave de idempotencia persistida en el dominio. De forma simplificada, una tabla puede imponer que una misma clave solo cree una solicitud por ámbito de negocio:

```text
@@unique([scope, idempotencyKey])
```

Si dos peticiones compiten, el índice único de la base de datos decide cuál crea el registro y la otra recupera la solicitud ya existente. El resultado no depende de que la red entregue una única vez la acción ni de que el job se ejecute una sola vez. Depende de que el modelo pueda reconocer una repetición y conservar un único resultado válido.

## Protege el cierre frente a workers que llegan tarde

Hay una carrera menos evidente. Un worker puede reclamar un trabajo, quedarse bloqueado y ser considerado atascado. Un proceso de recuperación lo devuelve a pendiente y otro worker lo reclama. Si el primero se reanuda después, no debería poder sobrescribir el resultado que produjo el segundo.

Un _fencing token_ resuelve este problema. Cada vez que un worker reclama la solicitud, el dominio guarda un token nuevo. Las operaciones de completar o fallar solo actualizan el estado si ese token todavía coincide. El worker antiguo puede terminar su ejecución, pero ha perdido autoridad para cerrar el trabajo.

```text
worker A reclama -> token A
trabajo recuperado -> pendiente
worker B reclama -> token B
worker A termina tarde -> actualización rechazada
```

Este patrón no depende de Trigger.dev; es una protección del dominio ante procesos que se solapan o se retrasan. Es especialmente importante cuando el resultado modifica datos, publica un documento o desencadena efectos que no deberían revertirse por una ejecución antigua.

## Recuperar y limpiar son parte del comportamiento del producto

Ningún sistema distribuido puede asumir que todos los jobs terminarán de forma limpia. Puede haber una dependencia lenta, un reinicio o un error sin una señal final concluyente. Por eso conviene definir un umbral para los trabajos que llevan demasiado tiempo en proceso y devolverlos a una situación recuperable, normalmente pendiente o fallida según el caso.

La recuperación automática no pretende ocultar los fallos. Evita que un estado temporal se convierta en una espera indefinida y deja una política explícita para soporte y operación. El equipo puede después investigar la causa con la trazabilidad de la ejecución, pero la persona usuaria no queda bloqueada sin una acción posible.

La limpieza de documentos y metadatos responde al mismo criterio. Si primero se marca un registro como eliminado y después falla el borrado del objeto, el sistema puede perder la referencia a un contenido que todavía existe. Es más seguro confirmar el borrado externo antes de cerrar el estado de negocio, y dejar el registro en una situación reintentable cuando el almacenamiento no responde.

## La observabilidad debe responder preguntas operativas

El identificador de ejecución de Trigger.dev es útil para seguir un job concreto. Aun así, la interfaz de un proveedor no siempre responde a las preguntas que necesita quien opera el producto: cuántas solicitudes esperan, si hay trabajos atascados, si los fallos se concentran en una integración o si el tiempo de proceso está aumentando.

Una capa de observabilidad propia puede traducir las ejecuciones técnicas a estados y métricas de negocio. Por ejemplo, solicitudes pendientes, completadas y fallidas; reintentos; tiempos de cola y proceso; o alertas cuando se supera un umbral de error. No se trata de duplicar el panel de jobs, sino de hacer visible la información que permite tomar decisiones dentro del producto.

También conviene distinguir un fallo de una condición esperada. Una tarea desactivada por configuración o que evita un solapamiento puede terminar como omitida. Registrar esa decisión reduce ruido y evita investigar como incidente aquello que en realidad es un comportamiento deliberado.

## Qué aporta la plataforma y qué sigue siendo responsabilidad de la aplicación

Trigger.dev simplifica la ejecución fuera de HTTP, los reintentos con _backoff_, las colas, los límites de concurrencia, las tareas programadas y la trazabilidad de cada run. Son piezas costosas de operar de manera fiable cuando se implementan desde cero.

La aplicación debe seguir definiendo la parte que no puede generalizarse: la persistencia de estados, los permisos, la idempotencia, las transiciones atómicas, la protección frente a procesos tardíos, la retención de datos y las métricas que importan al negocio. Un proveedor puede ejecutar una tarea de forma robusta; no puede decidir por sí solo qué duplicados son aceptables ni cuándo un documento deja de ser accesible.

## Conclusión

Mover trabajo costoso a Trigger.dev mejora la capacidad de respuesta de una API y reduce la complejidad operativa de mantener workers y cron propios. Su valor real aparece cuando esa infraestructura se combina con un dominio diseñado para reintentos, duplicados y fallos parciales.

Una buena frontera es dejar que la plataforma programe, ejecute y trace los jobs, mientras la aplicación conserva el control de los datos, los permisos y los estados que entienden las personas usuarias. Con esa separación, una cola deja de ser una solución puntual de rendimiento y se convierte en una pieza fiable de arquitectura.
