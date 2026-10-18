---
title: "Cómo evolucionar una arquitectura sin reescribir el sistema"
description: "Un método para mejorar un sistema en producción mediante fronteras claras, cambios reversibles y migraciones guiadas por el coste real de cambiarlo."
date: 2026-10-27
tags: [arquitectura, refactorización, mantenibilidad, deuda técnica, frontend]
category: Arquitectura
image:
  src: /images/blog/43-evolucionar-arquitectura-sin-reescribir-sistema/evolucionar-arquitectura-gradualmente.png
  alt: Una ingeniera sustituye un bloque de un puente que evoluciona de piedra gris a módulos azules, sin interrumpir el paso.
  width: 1536
  height: 1024
---

Una arquitectura rara vez llega a un punto incómodo porque una decisión aislada haya sido mala. Suele ser el resultado de muchas decisiones razonables tomadas bajo plazos, con necesidades que cambiaron y partes del sistema que crecieron más de lo previsto. Cuando cada modificación atraviesa componentes, peticiones HTTP, reglas de negocio y estados compartidos, la respuesta intuitiva es proponer una reescritura. Sin embargo, sustituir todo el sistema de una vez crea un periodo largo sin valor visible, duplica trabajo y obliga a mantener dos realidades hasta que la migración termine.

Evolucionar no significa conservar cualquier diseño. Significa mejorar las fronteras que más encarecen el cambio sin perder la capacidad de entregar. El objetivo es que cada paso reduzca un acoplamiento concreto, conserve el comportamiento observable y deje una base algo mejor para la siguiente decisión.

## Empieza por el coste de cambiar, no por el diagrama ideal

Antes de crear carpetas o adoptar un patrón, conviene observar qué cambios son caros hoy. Una pantalla que concentra carga de datos, permisos, transformaciones y renderizado puede ser una candidata. También lo es un flujo donde una modificación pequeña obliga a editar varias capas que no deberían conocerse entre sí, o una regla de negocio duplicada en dos vistas.

No todos los problemas requieren la misma prioridad. Una parte antigua pero estable puede esperar; un módulo que recibe cambios cada semana y causa regresiones merece atención antes. Esta pregunta suele ser más útil que «¿qué código es más feo?»: **¿dónde nos cuesta más entender el impacto de una modificación?**

Para responderla, reúne señales concretas: incidencias repetidas, tiempo de revisión, pruebas difíciles de preparar, dependencias circulares, cambios que siempre se hacen en bloque y zonas donde el equipo evita tocar código. No hace falta una auditoría perfecta. Basta con elegir un problema que tenga impacto y un límite razonablemente local.

## Define una frontera que nombre una responsabilidad

Una mejora arquitectónica útil no empieza por extraer archivos, sino por decidir qué responsabilidad debe poder entenderse y cambiarse por separado. Por ejemplo, una vista puede delegar la decisión de si una persona puede aprobar un pedido en una política de dominio; la vista conserva la interacción y la política recibe datos explícitos.

```ts
type Order = { status: "draft" | "submitted"; total: number };
type User = { role: "viewer" | "manager" };

export function canApproveOrder(order: Order, user: User) {
  return (
    user.role === "manager" && order.status === "submitted" && order.total > 0
  );
}
```

Este cambio no exige reconstruir la pantalla. Hace visible una regla, permite probarla sin montar la interfaz y reduce el riesgo de que otra vista invente una versión ligeramente distinta. Si la nueva frontera solo se llama `helpers` o `utils`, probablemente todavía no expresa una responsabilidad suficiente.

En un backend ocurre algo parecido. Un controlador puede encargarse de traducir HTTP a una llamada de caso de uso; el caso de uso coordina la operación; un repositorio conoce la persistencia. No es necesario imponer cuatro capas a una operación trivial. La separación empieza a compensar cuando permite variar una de esas decisiones sin arrastrar las demás.

## Migra por estrangulamiento, no por duplicación indefinida

Una forma segura de cambiar un módulo vivo es dejar el recorrido actual funcionando y dirigir una parte concreta al nuevo límite. En vez de reescribir todos los pedidos, se puede mover primero la validación de aprobación. En vez de sustituir toda la capa de datos, se puede crear un adaptador nuevo para una consulta problemática y mantener el cliente anterior en el resto.

La convivencia temporal es normal, pero debe tener una dirección clara. Cada adaptación debería contestar tres preguntas:

- ¿Qué comportamiento conserva esta pieza?
- ¿Qué consumidor empieza a usar la nueva frontera?
- ¿Qué condición permitirá retirar el camino antiguo?

Sin la tercera pregunta, la capa de compatibilidad se convierte en otra dependencia permanente. Anota el destino aunque no puedas eliminarlo en el mismo cambio: migrar todos los consumidores, estabilizar un contrato o retirar una versión de una API son condiciones verificables.

## Haz que cada paso sea reversible

La reversibilidad no significa preparar un interruptor para cualquier línea de código. Significa que el cambio es lo bastante pequeño como para entender sus consecuencias y corregirlo sin una operación traumática. Mantener la misma interfaz pública mientras se cambia una implementación, añadir una ruta nueva antes de retirar la anterior o migrar un tipo de escenario en una pantalla son ejemplos de pasos reversibles.

Las pruebas ayudan a definir ese límite. Antes de mover una regla, protege los casos que no deben variar. Si no existen pruebas automatizadas, empieza por documentar ejemplos de entrada y salida o por añadir pruebas alrededor del comportamiento más sensible. El propósito no es alcanzar una cobertura determinada antes de refactorizar, sino contar con evidencia de que la migración conserva lo que importa.

```ts
it("no permite aprobar un pedido en borrador", () => {
  expect(
    canApproveOrder({ status: "draft", total: 100 }, { role: "manager" }),
  ).toBe(false);
});
```

El test no prueba la arquitectura completa. Protege una decisión cuya ubicación estamos cambiando. Ese es un buen tamaño para una migración: comportamiento reconocible, alcance limitado y verificación rápida.

## Evita que la arquitectura nueva sea solo otra convención

Crear una carpeta `domain` o `services` no mejora nada si los módulos siguen importando cualquier cosa de cualquier lugar. Las fronteras necesitan unas reglas pequeñas y comprobables: qué capa puede depender de cuál, dónde se ubican los contratos y qué tipo de código no debe conocer HTTP, Vue o Prisma.

No es necesario automatizar todas las reglas desde el primer día. Una guía corta en el repositorio y revisiones que preguntan por las dependencias nuevas suelen ser un inicio suficiente. Con el tiempo, algunas restricciones pueden convertirse en reglas de lint, tests de arquitectura o límites entre paquetes. La automatización tiene más valor cuando refuerza un acuerdo que el equipo ya entiende.

También conviene revisar el lenguaje. Si dos personas usan «servicio» para una llamada HTTP, una regla de dominio y un composable, la estructura dejará de comunicar. Nombres que describen intención —`approveOrder`, `OrderRepository`, `useOrderApproval`— hacen más por la legibilidad que una taxonomía extensa de carpetas.

## Mide si el cambio ha reducido el coste

Una evolución arquitectónica termina cuando hace más fácil un cambio real, no cuando el diagrama parece más limpio. Después de la migración, observa si una modificación equivalente toca menos lugares, si los tests expresan mejor el comportamiento o si una persona nueva puede localizar la regla sin recorrer la aplicación completa.

Puede haber pasos que no compense generalizar. Extraer una abstracción para un único caso estable añade una interfaz que habrá que mantener. La meta no es una arquitectura máxima, sino una arquitectura proporcionada al producto y a su ritmo de cambio.

Reescribir puede ser apropiado cuando la tecnología deja de ser viable, el sistema no permite introducir cambios seguros o el coste de compatibilidad supera claramente el de sustituirlo. Incluso entonces, la transición suele ser más manejable si se divide por capacidades y conserva puntos de integración controlados. En la mayoría de los sistemas vivos, el progreso sostenido llega antes: una frontera mejor hoy, un camino antiguo menos mañana y más confianza para cambiar lo siguiente.
