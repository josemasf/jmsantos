---
title: "Testing proporcional al riesgo: decide qué probar antes de medir cobertura"
description: "Un marco práctico para elegir el nivel de pruebas según el impacto y la incertidumbre de cada cambio, sin aplicar la misma estrategia a todo el sistema."
date: 2026-11-24
tags: [testing, calidad, Vitest, Playwright, estrategia, riesgo]
category: Testing
image:
  src: /images/blog/45-testing-proporcional-riesgo/testing-proporcional-riesgo.png
  alt: Una balanza equilibra pruebas rápidas y un flujo crítico de navegador, con un dial que representa el riesgo.
  width: 1536
  height: 1024
---

Una estrategia de testing se vuelve costosa cuando usa la misma respuesta para cualquier cambio. Exigir E2E para una función pura ralentiza el feedback; limitarse a unitarios para un flujo de pago o permisos deja sin comprobar los puntos donde se integran decisiones importantes. La alternativa no es adivinar cuántos tests hacen falta. Es decidir qué evidencia proporciona cada tipo de prueba y proporcionarla en proporción al riesgo que estamos introduciendo o modificando.

Riesgo no significa únicamente posibilidad de fallo. Combina al menos dos factores: la probabilidad de equivocarse y el impacto de hacerlo. Un formateador de texto usado en una pantalla aislada puede tener poca repercusión; una conversión de moneda, una autorización o una migración de datos puede afectar a muchas personas aunque el cambio parezca pequeño.

## Evalúa impacto e incertidumbre antes de elegir la herramienta

No hace falta convertir cada PR en una matriz compleja. Unas preguntas cortas suelen orientar bien la decisión:

- ¿Qué consecuencia tendría que este comportamiento falle en producción?
- ¿Qué partes externas, asíncronas o con estado intervienen?
- ¿Hemos modificado una regla conocida o estamos cambiando una frontera?
- ¿Cuál es la forma más barata de demostrar el comportamiento importante?

La primera pregunta da una medida de impacto. Las demás ayudan a detectar incertidumbre. Una validación de permisos tiene impacto alto incluso si su código es breve. Una pantalla que consume una API nueva puede tener incertidumbre alta aunque el resultado visual sea sencillo. En cambio, una extracción interna que conserva entradas y salidas conocidas puede requerir pocas pruebas adicionales si las existentes ya protegen el contrato.

| Situación                      | Riesgo principal                          | Evidencia que suele aportar más valor           |
| ------------------------------ | ----------------------------------------- | ----------------------------------------------- |
| Regla de negocio pura          | Casos límite                              | Tests unitarios de entradas y salidas           |
| Composable o store con estado  | Transiciones y efectos                    | Tests de unidad con dependencias controladas    |
| Componente de formulario       | Interacción y accesibilidad               | Tests con Testing Library y escenarios de error |
| Cliente contra una API         | Contrato HTTP y tratamiento de respuestas | Integración con MSW o pruebas de contrato       |
| Flujo crítico de usuario       | Integración real entre capas              | Unos pocos E2E con Playwright                   |
| Servicio externo no controlado | Disponibilidad e infraestructura          | Contratos, dobles controlados y E2E acotados    |

La tabla no asigna un tipo de test a cada carpeta. Ayuda a identificar qué podría romperse y qué nivel puede demostrarlo con menos ruido.

## Protege las reglas donde son más fáciles de entender

Las reglas de negocio suelen ser más sencillas de probar fuera de HTTP y de la interfaz. Una función que calcula si un pedido puede cancelarse necesita escenarios claros, no un navegador para todos ellos.

```ts
export function canCancelOrder(order: { status: string; shippedAt?: Date }) {
  return order.status === "paid" && !order.shippedAt;
}

it("impide cancelar un pedido ya enviado", () => {
  expect(canCancelOrder({ status: "paid", shippedAt: new Date() })).toBe(false);
});
```

El test no demuestra que el botón se oculte correctamente; demuestra que la política se mantiene cuando cambie una vista, un endpoint o un proceso en segundo plano. Si esa misma decisión se expresa en varios sitios, centralizarla también reduce el riesgo de que cada capa adopte una excepción diferente.

## Usa integración cuando la frontera es lo que importa

Hay defectos que no aparecen en una función aislada: una respuesta 403 tratada como lista vacía, una serialización equivocada, un handler que no representa el contrato o una store que no se reinicia entre escenarios. En esas situaciones, una prueba de integración ofrece más evidencia porque participa la combinación de piezas que puede fallar.

MSW es útil para una aplicación frontend porque permite interceptar la petición HTTP sin sustituir el cliente de red del componente. El escenario sigue siendo controlado, pero el test comprueba qué muestra la interfaz ante una respuesta válida, una lista vacía o un error. [MSW en Vue 3](/blog/msw-vue-mocks-api-desarrollo-tests/) y la guía de [fixtures, factories y handlers](/blog/fixtures-factories-handlers-msw-tests/) desarrollan cómo mantener esos escenarios legibles.

El objetivo no es renderizar siempre la aplicación entera. Si para verificar un mensaje de validación hay que montar router, autenticación, varias stores y una API simulada, probablemente la prueba está cubriendo demasiadas responsabilidades. Divide el comportamiento hasta que cada escenario responda a una pregunta concreta.

## Reserva los E2E para recorridos que merecen su coste

Playwright aporta evidencia valiosa cuando importa que el navegador, la navegación, el formulario y las integraciones internas funcionen juntos. Un inicio de sesión, un pago, una creación que tenga consecuencias o un recorrido que haya causado incidencias son buenos candidatos. El coste de preparar datos, ejecutar el navegador e investigar fallos también es real, por lo que un E2E no debería ser la única prueba de todos los casos límite.

Un flujo crítico suele necesitar pocos recorridos completos y varias pruebas más cercanas a las reglas que lo sostienen. Por ejemplo, un E2E puede comprobar que una persona autorizada completa una aprobación y recibe confirmación. Las combinaciones de permisos, estados y límites se prueban con mayor velocidad en las políticas o servicios correspondientes.

Cuando dependas de sistemas externos, diferencia lo que quieres probar. Un entorno controlado o un doble de servicio puede demostrar que tu aplicación procesa una respuesta concreta. Un contrato o una prueba periódica contra un entorno de integración puede descubrir cambios reales del proveedor. Mezclarlos en cada E2E de CI suele producir fallos difíciles de atribuir.

## La cobertura es una señal secundaria

La cobertura responde qué líneas se ejecutaron, no si los comportamientos relevantes están protegidos. Puede ser útil para encontrar zonas sin ninguna prueba o para evitar que una modificación reduzca drásticamente la suite, pero no puede sustituir la conversación sobre impacto. Un porcentaje alto puede ocultar que no se ha probado el permiso denegado, la respuesta inválida o el estado de error que más afecta al usuario.

Antes de aumentar una métrica, formula un caso de regresión: «si cambia esta condición, ¿qué prueba debería fallar?». Si no existe una respuesta, añadir aserciones solo para cubrir líneas probablemente no mejorará la confianza. El artículo sobre [tests que sobreviven a los refactors](/blog/testing-library-vue-tests-refactors/) ayuda a redactar esa evidencia desde el comportamiento observable.

## Revisa el nivel de prueba cuando cambia el riesgo

Una suite no necesita quedar decidida para siempre. Un flujo puede empezar con bajo impacto y adquirir importancia cuando se integra con facturación, permisos o datos regulados. Del mismo modo, una prueba E2E que se creó para explorar una funcionalidad puede dejar de compensar si varias pruebas de integración ya ofrecen una señal más rápida y precisa.

Revisar esa proporción en cambios relevantes evita dos extremos: una pirámide rígida que ignora el producto y una colección de tests acumulados sin una razón visible. La pregunta útil al abrir un PR no es «¿cuánta cobertura añade?», sino «¿qué podría romperse y qué evidencia nos permite detectarlo pronto?». Cuando el nivel de prueba responde a esa pregunta, la calidad deja de ser una cifra y se convierte en una decisión de ingeniería explícita.
