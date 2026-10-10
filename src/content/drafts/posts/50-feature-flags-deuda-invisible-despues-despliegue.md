---
title: "Feature flags: la deuda invisible después del despliegue"
description: "Cómo clasificar, probar y retirar feature flags para controlar su ciclo de vida y evitar que las ramas temporales se conviertan en complejidad permanente."
date: 2027-05-11
tags: [frontend, arquitectura, feature flags, testing, mantenibilidad]
category: Arquitectura
image:
  src: /images/blog/50-feature-flags-deuda-invisible-despues-despliegue/feature-flags-retirada-deuda.png
  alt: Una palanca azul dirige un flujo hacia una ruta validada mientras una rama antigua se retira y una lupa revisa los caminos restantes.
  width: 1536
  height: 1024
---

Una feature flag permite cambiar el comportamiento de una aplicación sin desplegar una versión nueva. Es útil para lanzar una funcionalidad por etapas, limitar el impacto de un cambio o comparar variantes. El coste aparece cuando la bandera sobrevive al motivo por el que se creó: cada condición añade una ruta posible, cada prueba debe decidir qué valor usar y cada persona que lee el código necesita averiguar si la rama sigue teniendo sentido.

Por eso, crear una flag debería incluir una decisión de retirada. Quién la controla, qué condición marca su final y cómo se eliminarán las ramas forman parte de la misma tarea que introduce el interruptor. Sin ese acuerdo, una herramienta para gestionar riesgo durante el despliegue se convierte en una fuente permanente de complejidad.

## No todas las flags tienen el mismo ciclo de vida

Antes de añadir una bandera, identifica para qué sirve. Las flags de lanzamiento habilitan una funcionalidad gradualmente y suelen poder retirarse cuando el despliegue termina. Las de experimento necesitan una fecha para cerrar la prueba y una decisión sobre la variante ganadora. Una kill switch operativa puede tener sentido durante más tiempo porque permite desactivar una integración ante un incidente, pero necesita un responsable y un procedimiento de uso. Las restricciones de acceso o permisos pertenecen al modelo de seguridad del sistema; no deberían depender de una flag de interfaz que cualquiera pueda manipular.

La clasificación importa porque determina quién decide y cuándo se limpia. Una bandera temporal puede tener una caducidad concreta; una de operación necesita una revisión recurrente; una regla de autorización debe validarse en el servidor, aunque la interfaz oculte acciones que la persona no puede usar.

| Tipo | Pregunta que responde | Condición de retirada o revisión |
| --- | --- | --- |
| Lanzamiento | ¿Quién recibe ya la funcionalidad? | Toda la audiencia objetivo la tiene activa y el despliegue está estable |
| Experimento | ¿Qué variante produce el resultado esperado? | La evaluación termina y se toma una decisión |
| Operativa | ¿Hay que desactivar temporalmente esta capacidad? | Se revisa su necesidad y se prueba el procedimiento de activación |
| Permiso | ¿Puede esta persona realizar esta acción? | Se mantiene como regla de autorización del servidor, no como flag de cliente |

Una misma herramienta puede implementar varios tipos, pero eso no los convierte en el mismo concepto. El nombre, el propietario, la evaluación y la retirada deben seguir la intención de cada flag.

## Registra el motivo y el criterio de finalización

Una bandera sin contexto obliga a reconstruir su historia desde commits y conversaciones. Al crearla, registra al menos su tipo, el comportamiento que controla, quién tomará la decisión final y qué hecho permitirá borrarla. Si el sistema de flags ofrece metadatos, guárdalos allí; si no, deja una referencia cercana al código y un ticket de seguimiento.

```ts
// Tipo: lanzamiento
// Responsable: equipo de pedidos
// Retirada: cuando todos los usuarios estén en la experiencia nueva
// Seguimiento: issue #123
if (flags.newOrderSummary) {
  return <NewOrderSummary />;
}

return <LegacyOrderSummary />;
```

El comentario es una pista, no un mecanismo de control. Una fecha de caducidad escrita en código tampoco borra nada por sí sola. Para que el acuerdo funcione, el equipo debe revisar las flags que llegan a esa fecha y convertir la decisión en una tarea verificable: borrar la rama antigua, mantener una capacidad operativa con una revisión fechada o cerrar el experimento y documentar el resultado.

Evita nombres vagos como `new-flow`, `temp-flag` o `enable-feature`. El nombre debería describir el cambio de comportamiento o el propósito estable de la bandera. Si la condición es difícil de explicar en una frase, puede que se estén mezclando varias decisiones que deberían tener ciclos de vida distintos.

## Una flag multiplica escenarios de prueba

Si una pantalla tiene tres flags binarias, existen hasta ocho combinaciones posibles. Con más banderas, el número crece rápidamente, aunque muchas combinaciones no sean alcanzables o no tengan valor para el producto. El problema no es solo escribir más tests: también cuesta saber qué variante ejecutó CI, reproducir un fallo y revisar un cambio cuando la configuración depende de un servicio externo.

No hace falta probar cada combinación teórica. Elige escenarios que cubran las transiciones y riesgos reales: experiencia antigua y nueva durante una migración, acceso progresivo a la audiencia objetivo, fallo al leer la configuración, o desactivación de emergencia. Para una flag que controla una capacidad crítica, define qué ocurre si el proveedor de configuración no responde. Un valor por defecto explícito es más seguro que un comportamiento accidental.

En componentes, pasa la decisión como una dependencia o un estado controlado cuando eso facilite pruebas legibles. Evita que cada componente consulte de forma independiente un SDK global: ese acoplamiento hace menos visible qué configuración gobierna la pantalla y complica simularla. Para pruebas de integración, utiliza configuraciones de flags con nombres claros y conserva en el resultado del test la variante que se ejecutó.

Una flag de lanzamiento también puede coexistir temporalmente con despliegues de frontend y backend en momentos distintos. El contrato debe tolerar esa transición: una versión nueva del cliente no debería asumir que la API ya está desplegada, y una API nueva no debería romper clientes antiguos. La flag coordina la exposición, pero no sustituye la compatibilidad entre versiones.

## Reduce las combinaciones en lugar de añadir más interruptores

Cuando una funcionalidad cruza varias capas, puede ser tentador crear una bandera por cada subparte: nueva pantalla, nuevo endpoint, nuevo modelo, nueva validación. Esto permite control granular, pero produce configuraciones parcialmente activadas que quizá nadie haya diseñado. Si la combinación de esas piezas siempre debe avanzar junta, una sola decisión de dominio puede ser más clara.

Si el control granular es necesario —por ejemplo, porque frontend y backend se despliegan independientemente— define qué combinaciones son válidas. La configuración puede ofrecer una sola capacidad de alto nivel y traducirla a decisiones internas en un punto concreto, en lugar de exponer varios toggles que cada consumidor combina a su manera.

También distingue la configuración de lanzamiento de la lógica de negocio. Una condición como `if (flags.newCheckout)` decide qué implementación se usa mientras dura la transición. La regla «no se puede confirmar un pedido sin dirección de entrega» seguirá siendo necesaria cuando la flag desaparezca y debe vivir en la lógica que protege esa regla.

## Despliega gradualmente sin confundir exposición con autorización

Las flags son útiles para limitar el alcance de una funcionalidad: activarla primero para el equipo, luego para un porcentaje o grupo de usuarios y finalmente para toda la audiencia. La evaluación debe ser consistente durante una sesión y el sistema debe poder explicar qué valor se aplicó. Cambiar de variante a mitad de un flujo puede causar estados difíciles de reproducir, especialmente si la operación se inicia con una implementación y se completa con otra.

En el navegador, una persona puede inspeccionar y modificar el código y las respuestas que recibe. Ocultar un botón mediante una flag de cliente no protege la operación. El servidor debe comprobar permisos y validar las condiciones de negocio en cada petición. Una flag controla qué experiencia o ruta se presenta; la autorización determina si una operación está permitida.

Para una desactivación de emergencia, acuerda quién puede cambiar la flag, qué comportamiento debe quedar disponible y cómo comprobar que el cambio surtió efecto. Una kill switch no sirve si está cacheada durante demasiado tiempo, si solo afecta a una de varias rutas o si nadie sabe encontrarla durante un incidente. La capacidad debe diseñarse y probarse como parte de la respuesta operativa.

## Retira la bandera y elimina las dos ramas

Cuando termina el motivo original, limpiar la flag significa más que borrar su entrada en el panel de configuración. Hay que decidir cuál comportamiento permanece, eliminar el código alternativo, ajustar las pruebas, retirar la configuración y revisar documentación o métricas que hayan dejado de tener sentido.

Un orden práctico ayuda a mantener el cambio revisable:

1. Confirma con el responsable qué variante queda como definitiva.
2. Busca todos los usos de la flag, incluidos tests, configuración, documentación y telemetría.
3. Conserva la rama elegida y elimina la alternativa en un cambio coherente.
4. Borra la definición de la bandera y sus reglas de segmentación.
5. Ejecuta las comprobaciones pertinentes y verifica que no quedan referencias activas.

Las herramientas de búsqueda estática pueden localizar referencias en el repositorio, pero no siempre encuentran nombres construidos dinámicamente o configuración fuera del código. Para una retirada completa, revisa también el panel del proveedor, variables de entorno, dashboards y alertas. Si la flag era operativa y debe permanecer, registra la razón y programa una revisión para confirmar que sigue protegiendo un riesgo real.

Una señal útil no es el número bruto de flags, sino cuántas están sin responsable, sin fecha o sin un criterio de retirada. Un inventario pequeño de esos campos permite priorizar la limpieza y detectar un patrón de equipo: flags sin cierre suelen indicar que se planificó el despliegue, pero no el final de la transición.

## La deuda nace cuando nadie se hace cargo del final

Una feature flag compra flexibilidad temporal a cambio de otra ruta posible en el sistema. Ese intercambio es razonable si hay un motivo claro, el alcance está limitado y la retirada forma parte del trabajo. Sin esas condiciones, cada bandera olvidada mantiene una decisión abierta y añade combinaciones que el equipo debe entender y probar.

Antes de crear una, completa la frase: «La retiraremos cuando…». Asigna a alguien la decisión, define cómo se verificará el cierre y distingue las flags temporales de las capacidades operativas que sí necesitan durar. Así el interruptor deja de ser una línea condicional aislada y se convierte en una herramienta con principio, revisión y final.
