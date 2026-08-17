---
title: "Un componente de 700 líneas no es necesariamente el problema"
description: "Por qué el número de líneas es una señal, no un diagnóstico, y cómo evaluar cohesión, acoplamiento y razones de cambio en un componente frontend."
date: 2026-11-24
tags: [arquitectura, componentes, Vue, mantenibilidad, refactorización, frontend]
category: Frontend
series:
  slug: mantenibilidad-frontend-coste-de-entender
  order: 6
---

Las reglas de tamaño son atractivas porque son objetivas. Un componente de setecientas líneas parece claramente peor que uno de ciento cincuenta. Sin embargo, reducir el diagnóstico a esa cifra produce refactors mecánicos: extraemos trozos por tamaño, aumentamos archivos y seguimos sin saber dónde vive una decisión de negocio. Las líneas son una señal para investigar, no una sentencia arquitectónica.

Un componente grande puede seguir siendo razonable si representa una pantalla cohesionada, mantiene sus decisiones cerca y ofrece una estructura legible. Uno pequeño puede ser difícil de cambiar si depende de cinco composables ambiguos, una store global y props que transportan detalles de una capa a otra. La pregunta no es solo cuánto ocupa; es cuántas razones distintas tiene para cambiar.

## Busca fronteras de responsabilidad

Al leer un componente, identifica qué responsabilidades conviven: obtener datos, adaptar respuestas, aplicar reglas de negocio, mantener estado de interacción, navegar y renderizar. Si una modificación de permisos exige tocar la capa visual y una modificación de diseño exige entender el cliente HTTP, probablemente faltan fronteras claras.

Extraer un composable tiene sentido cuando encapsula una regla o un ciclo de estado con nombre propio. Extraer un componente hijo tiene sentido cuando la interfaz que recibe y emite es comprensible. Mover código solo para bajar el contador de líneas puede crear una cadena de saltos que empeora el modelo mental.

```ts
// Una frontera útil expresa una decisión de dominio, no solo un trozo de plantilla.
const { canEditOrder, reason } = useOrderPermissions(order, currentUser);
```

El ejemplo permite localizar la política de permisos y probarla con escenarios claros. En cambio, un `useOrderHelpers` que mezcla formato, peticiones y permisos solo desplaza la complejidad.

## Evalúa el coste de cambio

Hay señales más útiles que el tamaño: props que cambian juntas sin relación clara, efectos secundarios repartidos, condiciones duplicadas, tests que exigen montar demasiada infraestructura o revisiones que terminan preguntando siempre por el mismo flujo. Cuando una persona necesita reconstruir el componente completo para cambiar una etiqueta, el problema suele ser cohesión y acoplamiento, no longitud.

Antes de refactorizar, elige un cambio real como guía. Puede ser añadir un estado de error, admitir un permiso o variar una acción. Observa qué piezas intervienen y cuál sería la frontera que haría el recorrido más directo. Esa decisión mantiene el refactor enfocado en mejorar la modificación siguiente, no en satisfacer una métrica abstracta.

## Mantén la lectura local cuando aporte claridad

No todo debe convertirse en una abstracción reutilizable. Una transformación corta usada una vez puede ser más fácil de entender junto al lugar que la necesita. La reutilización prematura introduce contratos y nombres que también hay que mantener. Extrae cuando la operación tenga una identidad estable o cuando separar la dependencia permita probar, cambiar o razonar mejor.

En Vue, Composition API facilita este trabajo porque un composable puede expresar una unidad de estado o de dominio. Pero el mecanismo no garantiza el diseño: una colección de composables sin límites claros puede ocultar aún más las dependencias. El nombre, la entrada, la salida y los efectos deben decir qué responsabilidad contienen.

## Conclusión

Un componente de setecientas líneas merece atención porque puede concentrar demasiadas decisiones, no porque haya incumplido un número mágico. Mide la complejidad por el coste de cambiarlo: cuántos conceptos hay que entender, cuántos lugares se modifican y cuán fácil es demostrar que el comportamiento sigue siendo correcto. Esa evaluación lleva a extracciones más pequeñas, justificadas y duraderas.
