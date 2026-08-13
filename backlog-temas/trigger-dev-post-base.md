# Base para post: lo util que ha sido Trigger.dev en Student Tracking System

> **Estado: escrito (borrador)** — desarrollado como `src/content/drafts/posts/29-trigger-dev-jobs-durables-reglas-negocio.md`, programado para el 25 de agosto de 2026. No proponer de nuevo este tema ni sus subtemas de jobs, estados recuperables, privacidad de payloads u observabilidad como artículos pendientes salvo que se planteen con un enfoque claramente distinto.

## Tesis posible

Trigger.dev ha sido util en este proyecto porque permitio mover trabajo pesado, periodico y recuperable fuera del ciclo HTTP sin perder control de negocio. La ganancia no esta solo en "tener jobs", sino en poder combinar colas, cron, reintentos, logs y run IDs con una capa propia de persistencia, permisos, idempotencia y observabilidad.

Una frase central para el post:

> Trigger.dev me dio la infraestructura de ejecucion; el proyecto conservo la autoridad del dominio en PostgreSQL y en sus servicios.

## Contexto del proyecto

Student Tracking System es un sistema multi-tenant para seguimiento de alumnos, centros, asistencia, incidencias, reportes y operaciones internas. El backend esta en Node.js con Hono, Prisma y PostgreSQL.

Antes de Trigger.dev, las partes candidatas a segundo plano eran precisamente las que peor encajan en una peticion HTTP normal:

- Generacion de PDFs oficiales con PDFKit.
- Subida de documentos a almacenamiento privado R2.
- Reintentos tras fallos temporales de almacenamiento o generacion.
- Recuperacion de trabajos que quedan a medias.
- Limpieza periodica de documentos expirados.
- Dispatch automatico de notificaciones push.

## Donde se usa Trigger.dev en el repo

La configuracion vive en `backend/trigger.config.ts`.

Puntos relevantes:

- Proyecto configurable por entorno con `TRIGGER_PROJECT_REF`.
- Runtime Node.
- Duracion maxima global de 3600 segundos.
- Reintentos globales en desarrollo y produccion con backoff.
- Bundle ajustado para PDFKit mediante `build.external: ["pdfkit"]`.
- Directorio de tareas limitado a `backend/src/trigger`.

Tareas actuales:

| Tarea | Tipo | Frecuencia / entrada | Responsabilidad |
| --- | --- | --- | --- |
| `generate-pdf-report` | Cola | `{ reportId }` | Generar un PDF oficial, guardarlo en R2 y cerrar el estado persistido. |
| `recover-stalled-pdf-reports` | Cron | `*/15 * * * *` | Volver a `pending` informes que quedaron demasiado tiempo en `processing`. |
| `cleanup-expired-pdf-reports` | Cron | `17 * * * *` | Borrar objetos expirados y purgar metadatos antiguos. |
| `push-dispatch-subscribed-clients` | Cron | `*/15 * * * *` | Enviar notificaciones push a clientes con suscripciones activas. |

## Caso 1: PDFs oficiales sin bloquear HTTP

El flujo de informes PDF es el ejemplo mas fuerte para el post:

```text
HTTP -> registro pdf_reports -> Trigger.dev -> PDFKit -> R2 -> estado completed -> URL firmada
```

La peticion HTTP no genera el documento directamente. Crea un registro `PdfReport` y, si el modo es `queued`, encola `generate-pdf-report` con solo el `reportId`.

Esto resolvio varios problemas a la vez:

- La API responde rapido con una solicitud trazable.
- El trabajo pesado no consume el worker HTTP.
- El frontend puede mostrar estados: `pending`, `processing`, `completed`, `failed` o `expired`.
- El usuario puede reintentar informes fallidos o expirados.
- Los informes grandes se tratan igual que los pequenos desde la experiencia de producto.

Detalle importante: algunos tipos se fuerzan siempre a cola aunque el cliente pida modo sincronico:

- `incidents`
- `practice-period-operational`
- `practice-period-closure`
- `practice-period-student-final`

La razon es que su volumen puede crecer o su valor operativo exige un pipeline robusto.

## Caso 2: payload minimo y privacidad

`generate-pdf-report` usa `schemaTask` con Zod y acepta solo:

```ts
{ reportId: z.uuid() }
```

Eso es una decision de arquitectura, no solo de implementacion.

El payload no copia parametros del informe, datos personales, filtros completos ni datasets voluminosos. El worker vuelve a cargar todo desde PostgreSQL usando el limite autorizado del servidor.

Angulo para el post:

> Trigger.dev ejecuta el trabajo, pero no se convierte en el lugar donde vive la informacion sensible del negocio.

Esto encaja especialmente bien en un sistema educativo, donde los PDFs pueden contener datos personales, incidencias, asistencia, actividad interna y contexto academico.

## Caso 3: cola con concurrencia controlada

La tarea `generate-pdf-report` define una cola compartida:

```ts
queue({
  name: "pdf-report-generation",
  concurrencyLimit: PDF_REPORT_CONCURRENCY || 2,
})
```

Esto evita que una tanda de informes sature PDFKit, PostgreSQL o R2. La concurrencia es configurable por entorno mediante `PDF_REPORT_CONCURRENCY`.

Punto para desarrollar:

- En una app pequena, "lanzar promesas" parece suficiente.
- En produccion, necesitas limitar presion sobre CPU, base de datos y almacenamiento.
- Trigger.dev aporta esa regulacion sin montar una infraestructura propia de workers.

## Caso 4: idempotencia y carreras concurrentes

La robustez no depende solo de Trigger.dev. El proyecto usa una clave unica en `pdf_reports`:

```text
@@unique([client, idempotencyKey])
```

`PdfReportsService.create()` primero busca una solicitud existente. Si dos peticiones simultaneas chocan, el indice unico de PostgreSQL decide el ganador y el servicio reutiliza el informe concurrente.

Esto permite que el usuario no cree N informes identicos por doble click, recarga o retry de red.

Idea para el post:

> La cola resuelve ejecucion; la idempotencia sigue siendo una responsabilidad de producto.

## Caso 5: fencing tokens para que un worker viejo no gane

`PdfReportProcessingService` genera un `processingToken` al reclamar un informe. Completar o fallar un informe exige que el token coincida.

Esto protege un caso real:

1. Un worker reclama un informe.
2. Queda bloqueado o tarda demasiado.
3. La tarea de recuperacion lo devuelve a `pending`.
4. Otro worker lo reclama con un token nuevo.
5. El primer worker despierta tarde.

Sin fencing token, el worker viejo podria sobrescribir el resultado nuevo. Con fencing token, la base de datos rechaza el cierre antiguo.

Este es uno de los aprendizajes mas valiosos: Trigger.dev da reintentos y ejecucion durable, pero el dominio tambien debe ser seguro ante reentradas, duplicados y ejecuciones tardias.

## Caso 6: recuperacion de trabajos atascados

La tarea `recover-stalled-pdf-reports` corre cada 15 minutos. Usa `PDF_REPORT_STALE_AFTER_MINUTES` y llama a `recoverStalled()`, que devuelve informes en `processing` a `pending` si llevan demasiado tiempo activos.

Esto convierte un fallo ambiguo en un estado recuperable:

- Antes: un informe podia quedar aparentemente "procesando" sin final claro.
- Ahora: hay una politica explicita de recuperacion.

Punto narrativo:

> Lo importante no es que nada falle; lo importante es que el sistema sepa volver a una posicion operativa.

## Caso 7: limpieza y retencion sin scripts manuales

`cleanup-expired-pdf-reports` corre cada hora en el minuto 17.

Hace dos fases:

1. Borra el objeto en R2 si existe.
2. Marca el registro como `expired` y purga metadatos antiguos segun `PDF_REPORT_RECORD_RETENTION_DAYS`.

La implementacion evita una trampa comun: si R2 falla, el registro sigue en estado limpiable y el siguiente ciclo lo reintentara. No se marca como expirado antes de confirmar el borrado.

Esto es util para hablar de operaciones:

- Menos tareas manuales.
- Menos riesgo de dejar datos privados disponibles mas tiempo del necesario.
- Mejor alineacion entre producto, privacidad y mantenimiento.

## Caso 8: notificaciones push programadas

`push-dispatch-subscribed-clients` ejecuta cada 15 minutos el dispatch de alertas push.

El servicio `pushDispatchScheduler.service.ts` persiste diagnostico local:

- Si el dispatch esta habilitado.
- Si VAPID esta configurado.
- Si hay un tick en curso.
- Ultimo `runId`.
- Ultimo estado: `idle`, `running`, `completed`, `failed` o `skipped`.
- Resultado agregado: enviados, fallidos, suscriptores y alertas.

La tarea no falla por configuracion esperada:

- Si `PUSH_DISPATCH_ENABLED=false`, termina como `skipped`.
- Si faltan claves VAPID, termina como `skipped`.
- Si ya hay un dispatch en curso, evita solapamiento y termina como `skipped`.

Esto da un buen punto para el post: Trigger.dev no reemplaza los estados operativos propios, pero facilita tener una cadencia confiable y visible.

## Observabilidad que quedo en el producto

El proyecto expone `GET /api/admin/pdf-reports/observability`.

El snapshot incluye:

- Informes solicitados, completados, fallidos, pendientes y en proceso.
- Reintentos.
- Tiempo medio en cola.
- Duracion media de generacion.
- Tamano medio.
- Alertas por informes atascados.
- Alertas por tasa de fallo alta.
- Alertas por fallos de almacenamiento.

Esto permite una lectura interesante:

> Trigger.dev da visibilidad de ejecucion; el producto traduce esa ejecucion a metricas que entiende operaciones.

No todo el mundo que opera el sistema necesita entrar al panel de Trigger.dev. Algunos diagnosticos deben aparecer en la interfaz o API interna del propio producto.

## Lo que Trigger.dev hizo mas sencillo

- Separar respuesta HTTP de trabajo pesado.
- Tener tareas programadas declarativas sin cron propio del servidor.
- Reintentar operaciones con backoff.
- Limitar concurrencia de procesos caros.
- Obtener `runId` para trazabilidad.
- Ejecutar tareas locales con `pnpm dev:trigger`.
- Desplegar tareas con `pnpm deploy:trigger`.
- Mantener un modelo sencillo de "tareas exportadas desde `src/trigger`".

## Lo que siguio siendo responsabilidad del proyecto

- Persistir el estado de negocio en PostgreSQL.
- Modelar idempotencia por cliente.
- Evitar exponer datos sensibles en payloads.
- Reclamar trabajos de forma atomica.
- Usar fencing tokens para proteger carreras.
- Validar permisos al crear, listar, descargar, reintentar o eliminar informes.
- Construir observabilidad entendible para usuarios internos.
- Documentar runbooks y variables por entorno.

## Aprendizajes para desarrollar en el post

1. Una cola no sustituye al modelo de dominio.
2. Un job durable puede ejecutarse mas de una vez; el codigo debe tolerarlo.
3. Los payloads pequenos son mas faciles de proteger, reintentar y auditar.
4. Las tareas periodicas son producto, no solo infraestructura.
5. La observabilidad tecnica gana valor cuando se conecta con estados de negocio.
6. La recuperacion automatica reduce soporte y evita estados muertos.
7. La configuracion por entorno importa: concurrencia, retencion, cron, credenciales y proyecto Trigger.dev.

## Posible estructura del post

### 1. El problema

"Necesitaba generar informes, limpiar archivos, recuperar trabajos bloqueados y enviar notificaciones sin convertir mi API en un proceso lento y fragil."

### 2. La decision

"En vez de montar mi propio worker, scheduler y cola, use Trigger.dev y mantuve PostgreSQL como fuente de verdad."

### 3. El primer caso real: PDFs

Explicar el flujo `HTTP -> pdf_reports -> generate-pdf-report -> R2 -> completed`.

### 4. La parte que no se ve

Hablar de idempotencia, payload minimo, concurrencia y fencing tokens.

### 5. Operacion diaria

Explicar recovery, cleanup, retencion, push dispatch y endpoints de diagnostico.

### 6. Balance

"Trigger.dev me ahorro infraestructura, pero no me obligo a renunciar a buenas reglas de dominio."

## Frases reutilizables

- "Lo que mas valore no fue solo ejecutar jobs, sino convertir procesos largos en estados claros para el usuario."
- "La API dejo de cargar con tareas que no pertenecen al ciclo request-response."
- "El worker recibe un identificador, no un paquete de datos sensibles."
- "PostgreSQL decide que solicitud existe; Trigger.dev se encarga de ejecutarla."
- "Los reintentos son utiles solo si el codigo esta preparado para ser llamado mas de una vez."
- "La tarea periodica de limpieza es una parte de la politica de privacidad, no una tarea secundaria."
- "El `runId` de Trigger.dev se convirtio en una pieza de trazabilidad dentro del dominio."

## Riesgos o matices honestos para incluir

- Trigger.dev simplifica la ejecucion, pero no elimina la necesidad de disenar bien estados, locks logicos e idempotencia.
- Si el payload contiene demasiados datos, se pierde parte del beneficio operativo y de privacidad.
- Las tareas deben probarse como parte del backend, aunque el runtime externo se sustituya por mocks en Vitest.
- Hay que cuidar el despliegue de tareas por entorno; el codigo contempla `PENDING_VERSION` para detectar que no hay una version ejecutable tras un periodo de gracia.
- Las dependencias de runtime importan: en este proyecto hubo que externalizar `pdfkit` para que sus recursos funcionen correctamente en Trigger.dev.

## Referencias internas revisadas

- `backend/trigger.config.ts`
- `backend/src/trigger/generatePdfReport.ts`
- `backend/src/trigger/pdfReportRecovery.ts`
- `backend/src/trigger/pdfReportCleanup.ts`
- `backend/src/trigger/pushDispatch.ts`
- `backend/src/services/pdfReports.service.ts`
- `backend/src/services/pdfReportQueue.service.ts`
- `backend/src/services/pdfReportGeneration.service.ts`
- `backend/src/services/pdfReportProcessing.service.ts`
- `backend/src/services/pdfReportCleanup.service.ts`
- `backend/src/services/pdfReportObservability.service.ts`
- `backend/src/services/internal/pushDispatchScheduler.service.ts`
- `backend/src/repositories/pdfReports.repository.ts`
- `backend/prisma/schema.prisma`
- `backend/src/tests/pdfReports.service.test.ts`
- `backend/src/tests/pdfReportProcessing.service.test.ts`
- `backend/src/tests/pushDispatchScheduler.service.test.ts`
- `backend/README.md`
- `backend/docs/pdf-reports-architecture.md`
- `docs/src/content/docs/desarrollo/informes-pdf.md`
- `docs/src/content/docs/desarrollo/notificaciones-push-e2e.md`
- `docs/src/content/docs/operacion/reportes.md`
