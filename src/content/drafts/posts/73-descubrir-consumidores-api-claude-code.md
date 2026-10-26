---
title: "¿Quién consume esta API? Descubrir dependencias con Claude Code"
description: "Un flujo para localizar consumidores visibles en varios repositorios, documentar la evidencia y contrastar las dependencias externas con telemetría."
date: 2027-02-09
issue: 96
tags: [Claude Code, IA, API, arquitectura, dependencias, observabilidad]
category: Arquitectura
image:
  src: /images/blog/descubrir-consumidores-api-claude-code/consumidores-api.webp
  alt: Una lupa sigue las conexiones verificadas entre dos aplicaciones cliente y una API; una ruta discontinua señala consumidores externos aún desconocidos.
  width: 1536
  height: 1024
---

Tener una especificación OpenAPI no responde necesariamente a una pregunta que aparece antes de cambiar una ruta: ¿quién la está usando? El documento describe el contrato que un servicio ofrece, pero no garantiza que enumere todos los clientes, que coincida con lo desplegado o que alguien lo mantenga al día. En una plataforma con varios repositorios, clientes generados, integraciones antiguas y consumidores externos, conocer las operaciones disponibles es distinto de conocer el impacto de retirarlas.

Claude Code puede ayudar a recorrer el código accesible y reunir indicios sobre productores y consumidores. El resultado útil no es un dibujo presentado como verdad, sino un inventario que permite seguir cada relación hasta su evidencia y distinguir lo que el código muestra de lo que solo la ejecución puede confirmar. La herramienta no puede descubrir un consumidor que no aparece en los repositorios ni en las fuentes de observabilidad consultadas. El artículo sobre [documentación viva con Astro y Starlight](/blog/documentacion-viva-astro-starlight-equipo/) aborda cómo mantener ese conocimiento compartido; el de [arquitectura multi-app con pnpm](/blog/arquitectura-multi-app-monorepo-pnpm-ia/) explica qué contexto se gana cuando varias aplicaciones sí conviven en un repositorio.

## Dos vistas responden preguntas distintas

La primera vista representa el sistema y sus fronteras: qué aplicaciones, servicios y terceros participan en un recorrido. Un diagrama de contexto o de contenedores de C4 ayuda a conversar sobre esas relaciones sin bajar todavía a cada ruta. La segunda vista es un catálogo por operación: método, ruta, servicio que la expone, consumidores candidatos, responsable, evidencia y estado de validación. Mermaid permite mantener ambas vistas junto al código; para un mapa pequeño, un `flowchart` evita depender de la sintaxis C4 de Mermaid, que sigue marcada como experimental. El blog muestra los bloques Mermaid como código, así que el ejemplo conserva el `.mmd` editable y también ofrece una exportación SVG para leer el diagrama en la página. [C4 Model](https://c4model.com/diagrams/system-context), [diagramas de flujo de Mermaid](https://mermaid.js.org/syntax/flowchart.html) y [sintaxis C4 de Mermaid](https://mermaid.js.org/syntax/c4.html).

OpenAPI aporta una tercera pieza: el contrato declarado. Sus `paths` y operaciones permiten contrastar qué debería exponer una API, pero no acreditan quién la consume ni si el despliegue actual coincide con el documento. Por eso conviene conservar la referencia del contrato junto a la evidencia de código y producción, en lugar de convertir el archivo OpenAPI en un inventario de dependencias por sí solo. [Especificación OpenAPI 3.2.1](https://spec.openapis.org/oas/v3.2.1.html).

## Prepara un espacio de trabajo acotado

Abre Claude Code desde uno de los repositorios que quieras analizar y añade solo las carpetas necesarias. La CLI admite directorios adicionales con `--add-dir`; estos amplían el acceso a archivos, pero no hacen que se cargue automáticamente toda la configuración local de cada repositorio. Revisa las instrucciones aplicables antes de interpretar el resultado. [Referencia de la CLI de Claude Code](https://code.claude.com/docs/en/cli-usage).

```bash
cd storefront
claude --permission-mode plan --add-dir ../orders-api ../legacy-service
```

El modo plan sirve para explorar y proponer sin editar el código fuente hasta que se aprueba el plan. Los comandos que puede ejecutar durante la exploración dependen de la configuración de permisos; comprueba el modo activo y las reglas del entorno, y no habilites el bypass de permisos para este trabajo. Si necesitas una restricción estricta, aplícala con permisos denegados o con aislamiento a nivel de sistema, no solo con una instrucción en el prompt. [Modos de permiso](https://code.claude.com/docs/en/permission-modes) y [seguridad de Claude Code](https://code.claude.com/docs/en/security).

Antes de iniciar, limita el análisis a repositorios autorizados y excluye ficheros de entorno, credenciales, volcados de producción y datos de clientes. Una sesión con acceso a varias carpetas puede leer información que no debería formar parte de un informe compartido. El prompt ayuda a acotar la tarea, pero la frontera efectiva la determinan los directorios concedidos y los permisos configurados.

## Pide evidencias que alguien pueda revisar

Una pregunta como «dibuja nuestra arquitectura» favorece un resultado convincente, aunque mezcle rutas activas con coincidencias de texto. Es más útil pedir candidatos con referencias exactas —ruta, línea o símbolo— y una explicación de qué demuestra cada fuente. El análisis puede buscar rutas en controladores, clientes HTTP, SDKs generados, configuración de hosts, contratos OpenAPI y documentación; también debe señalar las búsquedas que no pudo completar.

Una clasificación sencilla evita confundir tipos de evidencia:

- **Confirmada por código:** existe una referencia compatible entre cliente y operación del servidor en los repositorios inspeccionados. Esto no demuestra que esté desplegada ni que se use actualmente.
- **Observada en ejecución:** una fuente de telemetría registró tráfico dentro del periodo consultado y con la cobertura disponible.
- **Documentada:** una especificación, catálogo o registro afirma que existe la integración, sin que el análisis haya confirmado el recorrido en código o producción.
- **Pendiente de validar:** falta acceso, una referencia inequívoca o una fuente suficiente para resolver la relación.

Las categorías pueden coexistir para el mismo consumidor. La fila debe guardar fuente, fecha y límite de la comprobación; no hace falta forzar una única etiqueta si el código y la telemetría aportan evidencias distintas.

Este prompt convierte esos criterios en una petición reutilizable:

```text
Analiza solo los repositorios disponibles en esta sesión. No modifiques archivos,
no llames a servicios externos y no ejecutes pruebas ni comandos con efectos
secundarios. No abras ficheros .env, credenciales ni datos de clientes; si una
relación parece depender de ellos, indica que queda fuera del análisis.

Busca APIs propias y consumidores candidatos en rutas/controladores, clientes
HTTP, SDKs, configuración, contratos OpenAPI y documentación. Para cada relación,
devuelve: servicio, operación (método y ruta), consumidor, evidencia exacta
(ruta y línea o símbolo), tipo de evidencia, fecha de la fuente y qué no permite
concluir. No deduzcas que una URL aislada corresponde a un consumidor activo.

Genera en la respuesta un mapa Mermaid y un catálogo Markdown. Marca por separado
las relaciones confirmadas por código, observadas en ejecución, documentadas o
pendientes. Enumera repositorios inspeccionados, directorios excluidos y riesgos
por rutas dinámicas, configuración por entorno, feature flags, clientes generados
o llamadas indirectas. Deja la criticidad como desconocida salvo que haya una
fuente explícita sobre impacto, SLA o responsable.
```

El prompt pide que los resultados aparezcan en la conversación y no en archivos del proyecto. Aun así, revisa los permisos efectivos de Claude Code: las instrucciones de `CLAUDE.md` y del prompt guían el comportamiento, pero no son por sí solas un control técnico que bloquee acciones. [Cómo Claude Code carga instrucciones del proyecto](https://code.claude.com/docs/en/memory).

## Un ejemplo ficticio y reproducible

Para recorrer el análisis de principio a fin, usemos una fixture didáctica ficticia cuyos fragmentos se pueden copiar en las rutas indicadas para reproducir el razonamiento a mano. No es un proyecto ejecutable ni una ejecución observada de Claude Code: se omiten imports, dependencias y configuración que no cambian las relaciones mostradas. Tiene un frontend Vue (`storefront`), un portal de un socio (`partner-portal`), una API REST .NET (`orders-api`), un servicio legacy que consulta SQL Server y un proveedor de pagos externo. Los dos primeros consumen `GET /api/orders/{id}`. El cliente legacy y el cliente de pagos muestran otras dependencias de la API. Los nombres y el código son inventados y no describen sistemas ni resultados de una empresa.

Primero, el repositorio solo contiene un contrato y una mención en el README:

```json
{
  "openapi": "3.1.0",
  "info": { "title": "Orders API", "version": "1.0.0" },
  "paths": {
    "/api/orders/{id}": {
      "get": {
        "operationId": "getOrder",
        "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
        "responses": {
          "200": {
            "description": "Pedido encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": { "id": { "type": "integer" }, "status": { "type": "string" } }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Guarda ese contenido como `orders-api/openapi.json`.

```markdown
<!-- orders-api/README.md -->
El equipo de storefront integra la consulta de pedidos.
```

La especificación acredita que la ruta está declarada y el README documenta una integración; ninguno demuestra que siga activa. Con solo esas fuentes, el mapa inicial mantiene las relaciones como pendientes.

Al añadir los repositorios de clientes y servicio, Claude Code puede seguir estas referencias concretas:

```ts
// storefront/src/api/orders.ts
export async function getOrder(id: number) {
  return fetch(`${API_BASE}/api/orders/${id}`).then((response) => response.json());
}
```

```vue
<!-- storefront/src/views/OrderDetail.vue -->
<script setup lang="ts">
const order = await getOrder(Number(route.params.id));
</script>
<template><p>{{ order.status }}</p></template>
```

```ts
// partner-portal/src/api/orders.ts
export async function getOrder(id: number) {
  return fetch(`/api/orders/${id}`).then((response) => response.json());
}
```

```vue
<!-- partner-portal/src/views/OrderSummary.vue -->
<script setup lang="ts">
const order = await getOrder(Number(route.params.id));
</script>
<template><span>{{ order.status }}</span></template>
```

```csharp
// orders-api/Controllers/OrdersController.cs
[ApiController, Route("api/orders")]
public class OrdersController(LegacyOrdersClient legacy) : ControllerBase
{
    [HttpGet("{id:int}")]
    public Task<Order?> GetById(int id) => legacy.GetById(id);
}
```

```csharp
// orders-api/Clients/LegacyOrdersClient.cs
public Task<Order?> GetById(int id) =>
    http.GetFromJsonAsync<Order>($"legacy-service/orders/{id}");
```

```csharp
// legacy-service/Data/OrdersRepository.cs
public Task<Order?> GetById(int id) => db.Orders.FindAsync(id).AsTask();
```

```csharp
// legacy-service/Program.cs
services.AddDbContext<OrdersDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("Orders")));
```

```csharp
// orders-api/Clients/PaymentsClient.cs
public Task Authorize(Payment payment) =>
    http.PostAsJsonAsync("/v1/authorizations", payment);
```

```csharp
// orders-api/Program.cs
services.AddHttpClient<PaymentsClient>(client =>
    client.BaseAddress = new Uri("https://payments.example.test"));
```

Las referencias `ruta#símbolo` de la tabla siguiente apuntan a estos fragmentos didácticos. El primer pase debe marcar la operación y `storefront` como declarados/documentados, pero no como tráfico confirmado. El pase de código aporta evidencia de llamadas y uso del campo `status`; no convierte ninguna de ellas en tráfico observado ni demuestra que los repositorios representen una versión desplegada.

```mermaid
flowchart LR
  spec[openapi.json]
  api[orders-api]
  named[storefront · mencionado en README]
  unknown[otros consumidores]
  spec -->|declara GET /api/orders/{id}| api
  named -.->|referencia pendiente de confirmar| api
  unknown -.->|sin inventario| api
```

![Mapa inicial: el contrato declara una operación de orders-api, mientras las relaciones con storefront y otros consumidores siguen pendientes.](/images/blog/descubrir-consumidores-api-claude-code/mapa-inicial.svg)

Tras revisar los fragmentos, el mapa por operación queda así. Las flechas continuas indican relaciones que aparecen en el código ficticio; la punteada representa consumidores externos cuyo código y tráfico no se han consultado.

```mermaid
flowchart LR
  web[storefront]
  partner[partner-portal]
  api[orders-api]
  legacy[legacy-service]
  db[(SQL Server)]
  payments[proveedor de pagos]
  unknown[otros consumidores externos]

  web -->|GET /api/orders/{id} · código| api
  partner -->|GET /api/orders/{id} · código| api
  api -->|GET /orders/{id} · código| legacy
  legacy -->|consulta Orders · código| db
  api -->|POST /v1/authorizations · código| payments
  unknown -.->|pendiente · sin repositorio ni telemetría| api
```

![Mapa verificado en código: storefront y partner-portal consumen orders-api; la API consulta legacy-service y SQL Server, y llama al proveedor de pagos. Los demás consumidores externos siguen pendientes.](/images/blog/descubrir-consumidores-api-claude-code/mapa-verificado.svg)

El resultado puede versionarse con vistas y preguntas distintas, sin duplicar la misma tabla en cuatro documentos:

```text
docs/architecture/
  system-map.mmd             # contexto de sistemas y proveedores externos
  api-dependencies.mmd       # operaciones, consumidores y dependencias
  api-catalog.md              # tabla consultable por método y ruta
  unknown-dependencies.md    # incógnitas, responsables y próxima comprobación
```

`api-catalog.md` conserva la operación y las referencias concretas; `unknown-dependencies.md` registra qué falta y cómo resolverlo. Para el ejemplo, el catálogo quedaría así:

| Operación | Consumidor | Evidencia en la fixture | Tipo | Qué permite concluir |
| --- | --- | --- | --- | --- |
| `GET /api/orders/{id}` | `storefront` | `storefront/src/api/orders.ts#getOrder`; `OrderDetail.vue#order.status` | Confirmada por código | Existe una llamada y una lectura del campo en los fragmentos; no prueba despliegue o uso actual. |
| `GET /api/orders/{id}` | `partner-portal` | `partner-portal/src/api/orders.ts#getOrder`; `OrderSummary.vue#order.status` | Confirmada por código | Hay una segunda integración en la fixture; su actividad real no se ha comprobado. |
| `GET /orders/{id}` interno | `orders-api` | `OrdersController.GetById`; `LegacyOrdersClient.GetById` | Confirmada por código | La API consulta el servicio legacy durante este recorrido. |
| Persistencia de `Orders` | `legacy-service` | `OrdersRepository.GetById`; `Program.cs#UseSqlServer` | Confirmada por código | La fixture configura Entity Framework para SQL Server; no prueba dónde está desplegada la base de datos. |
| `POST /v1/authorizations` | `orders-api` | `PaymentsClient.Authorize`; `Program.cs#AddHttpClient` | Confirmada por código | El cliente se configura con una URL ficticia del proveedor; no prueba una conexión o llamada real. |
| `GET /api/orders/{id}` | Otros consumidores externos | Ningún repositorio ni registro de tráfico inspeccionado | Pendiente de validar | No se puede afirmar si existen o no con la evidencia disponible. |

Supongamos que el cambio consiste en retirar `status` de la respuesta de `GET /api/orders/{id}`. Los dos consumidores del ejemplo leen ese campo, así que el cambio rompería ambos recorridos de código mostrados; hace falta revisar el contrato, preparar una transición compatible y acordar la retirada con sus responsables. No se consultó telemetría en la fixture, por lo que ninguna fila está marcada como observada en ejecución. También se mantiene una tarea en `unknown-dependencies.md` para contrastar consumidores externos con el gateway y los responsables de las integraciones antes de afirmar que la lista está completa.

## Contrasta el código con lo que ocurre en producción

Para identificar consumidores externos, consulta las fuentes que realmente atraviesan el tráfico. API Management puede ofrecer analítica por API y operación, junto con registros de solicitudes si se habilitan los diagnósticos; Application Insights puede correlacionar peticiones con dependencias instrumentadas. OpenTelemetry define spans de cliente y servidor para describir llamadas entre servicios, pero solo donde exista instrumentación y propagación de contexto. [Monitorizar API Management](https://learn.microsoft.com/en-us/azure/api-management/monitor-api-management), [seguimiento de dependencias en Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/asp-net-dependencies) y [trazas de OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/traces/).

Registra siempre el intervalo observado, el entorno, el tipo de identidad disponible y las limitaciones de retención, muestreo e instrumentación. Una solicitud vista en el gateway demuestra que hubo tráfico por ese punto en ese periodo; no siempre identifica de forma fiable al sistema que lo originó. A la inversa, no ver una llamada no demuestra que el consumidor no exista: puede estar inactivo durante la ventana consultada, usar otra ruta, quedar fuera de la instrumentación o no aparecer por muestreo.

El catálogo final puede tener columnas como `operación`, `consumidor`, `responsable`, `evidencia`, `tipo`, `última observación` y `criticidad`. Deja la criticidad vacía o como desconocida hasta que exista una fuente aprobada para asignarla. Así se separa el hecho técnico —la ruta aparece en un cliente o en un span— de una decisión de producto sobre el impacto de retirarla.

## Mantén el mapa como documentación revisable

Un mapa se convierte en documentación fósil si nadie se hace responsable de sus cambios. Mantén los ficheros cerca de la arquitectura o del catálogo de API, revisa las relaciones nuevas junto con los cambios de contrato y pide que una persona confirme las aristas ambiguas. La generación asistida puede actualizar candidatos en una pull request, pero no debería borrar relaciones ni declarar un consumidor externo obsoleto solo porque no lo encontró en una pasada.

En repositorios distintos, la cobertura también es una decisión: registra los repositorios accesibles, los que faltan, el momento de consulta y las fuentes de producción utilizadas. Rutas construidas dinámicamente, variables por entorno, feature flags, código generado y llamadas indirectas dejan huecos incluso cuando el análisis estático es cuidadoso. Un informe útil los conserva a la vista.

El mapa no sustituye OpenAPI, la telemetría ni a los equipos responsables de las integraciones. Sirve para llegar a esas fuentes con una lista de preguntas concreta: qué sabemos por el código, qué hemos observado, qué solo está documentado y quién puede cerrar lo que falta antes de cambiar un contrato.
