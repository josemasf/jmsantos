---
title: "Push notifications en una PWA: arquitectura antes que claves"
description: "Cómo diseñar notificaciones push en una PWA con responsabilidades claras: permisos, suscripciones, envío, estados, seguridad y diagnóstico."
date: 2026-11-10
tags: [PWA, push notifications, frontend, arquitectura, seguridad]
category: Frontend
image:
  src: /images/blog/44-push-notifications-pwa-arquitectura/push-notifications-pwa-arquitectura.png
  alt: Un faro azul envía señales a un móvil, un portátil y una campana mientras una persona consulta el estado de una aplicación.
  width: 1536
  height: 1024
---

Las notificaciones push suelen llegar a un producto como una petición aparentemente pequeña: «avisa a la persona cuando termine el proceso». La complejidad aparece cuando se intenta resolverla pegando una clave VAPID, un registro de _service worker_ y una llamada a una librería. Una notificación fiable es un sistema distribuido: el navegador concede permiso, registra una suscripción que puede cambiar, el backend decide cuándo enviar y un _service worker_ recibe y presenta el aviso aunque la aplicación no esté abierta.

> **VAPID** significa _Voluntary Application Server Identification_. Es un mecanismo mediante el que el servidor de tu aplicación se identifica ante el servicio de notificaciones push y acredita que está autorizado a enviar mensajes a suscripciones creadas por ella. La clave pública se usa en el navegador al crear la suscripción; la clave privada se conserva en el backend para firmar los envíos.

Pensar en esas piezas desde el principio evita dos problemas frecuentes: tratar la suscripción como un dato permanente y usar las notificaciones como sustituto de un estado que debería existir dentro del producto.

## Una notificación es una señal, no la fuente de verdad

El mensaje puede llegar tarde, duplicarse, ser descartado por la persona usuaria o no entregarse porque el dispositivo está desconectado. Por eso, «tu informe está listo» debe dirigir a una pantalla capaz de consultar el estado real del informe. La notificación mejora el tiempo de descubrimiento; no confirma por sí misma que una operación se haya completado.

El servidor necesita un evento de dominio claro —por ejemplo, `report.completed`— y una política que decida si merece avisar. La política puede considerar preferencias, canal, horario, permisos o si la persona ya ha visto el resultado. Separarla de la generación del informe permite cambiar el comportamiento de avisos sin contaminar la operación principal.

```text
Proceso de negocio termina
        ↓
Se registra un evento de dominio
        ↓
La política decide destinatarios y canal
        ↓
Se envía a suscripciones activas
        ↓
El service worker muestra el aviso
        ↓
La aplicación consulta el estado real al abrirse
```

Esta secuencia también permite registrar fallos y reintentos sin afirmar que la operación de negocio ha fallado solo porque el aviso no se pudo entregar.

## Pide permiso cuando hay una razón comprensible

El permiso del navegador forma parte de la experiencia de producto. Solicitarlo al cargar la página deja a la persona sin contexto y aumenta la probabilidad de un rechazo definitivo. Es preferible explicarlo junto al valor: cuando activa avisos de tareas, cuando sigue un pedido o cuando programa un recordatorio.

La interfaz debe distinguir los tres estados que expone el navegador: permiso pendiente de decisión, concedido y denegado. En el último caso, insistir con un botón no resolverá nada; conviene explicar de forma breve que el permiso se gestiona desde la configuración del navegador. Si la persona lo concede, entonces tiene sentido registrar el _service worker_ y crear la suscripción.

```ts
const permission = await Notification.requestPermission();

if (permission !== "granted") {
  return;
}

const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: publicVapidKey,
});
```

La clave pública puede vivir en el cliente; la privada debe permanecer exclusivamente en el servicio que firma y envía las notificaciones. No uses las claves ni la suscripción como una autorización para acceder a datos de producto. La suscripción identifica un destino de entrega, no sustituye una sesión ni un control de permisos.

## Guarda suscripciones como recursos que caducan

Una suscripción contiene un endpoint y claves asociadas a un navegador y dispositivo. Puede dejar de ser válida si la persona borra datos, cambia de dispositivo, revoca permiso o el proveedor la invalida. En vez de modelarla como un campo fijo del usuario, trátala como una colección de recursos con metadatos mínimos: persona propietaria, endpoint, claves, fecha de alta, última entrega conocida y estado.

El endpoint y las claves permiten enviar contenido a un destino, por lo que deben protegerse como información sensible. No los vuelques en logs ni los introduzcas en URLs. Al recibir una respuesta que indique que la suscripción ya no existe, márcala o elimínala; insistir en cada envío solo añade errores y coste operativo.

También conviene separar suscripciones por dispositivo. Una persona puede querer recibir avisos en su portátil y teléfono, o retirar uno de ellos sin desactivar el resto. Esta decisión hace que las preferencias sean más comprensibles y reduce comportamientos inesperados.

## Mantén el payload pequeño y no transportes secretos

El _payload_ de una push atraviesa proveedores que no controlamos y puede mostrarse en la pantalla bloqueada. Incluye solo lo necesario para presentar un aviso y abrir una ruta: un tipo de evento, un identificador opaco o un texto que no revele datos sensibles. La aplicación recupera el detalle autorizado cuando la persona abre el aviso.

```json
{
  "type": "report-ready",
  "reportId": "rpt_123",
  "url": "/reports/rpt_123"
}
```

El _service worker_ interpreta ese contrato y muestra una notificación con una acción clara. En el evento de clic, enfoca una ventana existente o abre la ruta correspondiente. No asumas que hay una pestaña de la aplicación disponible ni que el estado en memoria sigue siendo válido.

## Diseña entrega, reintentos y diagnóstico por separado

Enviar una notificación en la misma petición que completa una operación acopla el tiempo de respuesta del producto a un proveedor externo. Normalmente es mejor guardar el evento y procesar el envío mediante un trabajo asíncrono. Así se pueden aplicar reintentos limitados a fallos transitorios, respetar una política de frecuencia y registrar el resultado por suscripción.

Las métricas útiles no se limitan al número de envíos. Observa cuántas personas activan permisos, qué proporción de suscripciones se invalida, cuántos envíos fallan por causa y cuántas notificaciones terminan en apertura de la ruta. Es importante interpretar la última métrica con prudencia: una baja apertura puede indicar poco interés, mal momento o que el aviso no se está mostrando como esperábamos.

Cuando investigues un fallo, conserva identificadores de correlación y códigos de resultado, no el payload completo ni datos de contenido. Un registro como «evento `report-ready`, suscripción inactiva, proveedor respondió 410» permite actuar sin convertir la observabilidad en una copia de datos personales.

## Comprueba los casos que el camino feliz oculta

La prueba más visible es conceder permiso, generar una suscripción y recibir una notificación. También hay que validar qué ocurre si el permiso se deniega, el _service worker_ aún no está listo, la suscripción expira, se pulsa el aviso con la aplicación cerrada o el recurso ya no está disponible al abrir la ruta.

Las pruebas unitarias pueden cubrir la política de decisión y la construcción de payloads. Las integraciones deben comprobar que una suscripción invalidada se retira y que un evento genera el trabajo de envío correcto. En un navegador real, un escenario manual o E2E puede verificar el registro del _service worker_ y la navegación, sabiendo que los proveedores de push no siempre ofrecen un entorno de automatización idéntico a producción.

Una PWA con push bien diseñada no depende de que todas las notificaciones lleguen. Mantiene un estado de producto consultable, trata las suscripciones como recursos temporales, protege los datos que circulan y usa los avisos para acercar a la persona al momento relevante. Esa arquitectura exige más que unas pocas líneas de configuración, pero evita que una funcionalidad sensible se convierta en magia difícil de operar.
