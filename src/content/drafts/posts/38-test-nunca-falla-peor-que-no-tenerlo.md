---
title: "Un test que nunca falla puede ser peor que no tener test"
description: "Por qué los tests que no detectan regresiones generan una confianza peligrosa y cómo recuperar una señal útil en una suite frontend."
date: 2026-11-03
tags: [testing, calidad, Vitest, Testing Library, mantenimiento, frontend]
category: Testing
image:
  src: /images/blog/38-test-nunca-falla-peor-que-no-tenerlo/test-sin-senal-regresiones.png
  alt: Un semáforo de pruebas con todas las luces verdes se alza sobre una plataforma agrietada que una persona examina con una lupa.
  width: 1536
  height: 1024
series:
  slug: mantenibilidad-frontend-coste-de-entender
  order: 2
---

Un test verde se interpreta con facilidad como evidencia de calidad. Sin embargo, una prueba que no falla ante una regresión relevante no protege el producto: solo consume tiempo de ejecución y añade una sensación de seguridad difícil de cuestionar. La ausencia de tests puede ser visible; una suite con señal débil suele ocultar el riesgo hasta que llega un incidente.

El problema no es que una prueba sea estable. Es que sea indiferente al comportamiento que dice cubrir. Un snapshot enorme que se actualiza sin leerlo, una aserción sobre que el componente se monta o un mock que devuelve siempre el camino feliz pueden permanecer verdes mientras la interfaz deja de hacer lo que una persona usuaria necesita.

## Cómo reconocer una prueba sin señal

La pregunta más útil al revisar un test es sencilla: «¿qué cambio de producto debería hacerlo fallar?». Si no hay respuesta concreta, probablemente la prueba está acoplada a detalles internos o comprobando algo irrelevante. Por ejemplo, verificar que un método se llamó confirma una implementación; verificar que tras guardar aparece una confirmación o un error comprueba un contrato observable.

```ts
// Débil: el detalle interno puede mantenerse aunque el flujo deje de funcionar.
expect(saveProfile).toHaveBeenCalled();

// Útil: expresa el resultado del flujo para quien usa la interfaz.
expect(await screen.findByRole("status")).toHaveTextContent(/perfil guardado/i);
```

La segunda prueba no prohíbe cambiar la implementación. Permite extraer un composable, sustituir un cliente HTTP o reorganizar el componente mientras se conserve el resultado. Esa es la clase de confianza que hace más seguro refactorizar.

## La cobertura no responde por sí sola

La cobertura informa de qué líneas se ejecutaron, no de si se verificó una decisión importante. Una función puede recorrerse por completo y seguir sin probar el caso de permiso denegado, la lista vacía o el error del servidor. Perseguir un porcentaje sin revisar escenarios puede llevar a tests añadidos únicamente para marcar líneas.

Conviene empezar por los estados que cambian la experiencia: carga, vacío, error, permisos y datos válidos. Si cada uno tiene una interfaz o una decisión distinta, cada uno necesita evidencia. MSW resulta especialmente útil para mantener los escenarios HTTP cerca del comportamiento real sin convertir cada componente en una colección de mocks de módulos.

## Diseña fallos que merezca investigar

Un test útil debe fallar por un motivo legible. Los selectores basados en rol y nombre accesible, como `getByRole("button", { name: /guardar/i })`, describen mejor la intención que una clase CSS o una estructura de DOM. También ayudan a detectar una regresión de accesibilidad que un selector técnico no vería.

La legibilidad incluye los datos. Un factory llamado `createBlockedUser()` comunica un escenario de negocio; un objeto anónimo con quince propiedades obliga a descifrar qué importa. La prueba debería permitir a otra persona responder rápidamente qué se esperaba y qué ha cambiado.

## Estabilidad no significa aislamiento extremo

Para evitar flakiness, algunas suites sustituyen todas las dependencias. El resultado puede ser una prueba muy rápida, pero tan alejada de la aplicación que deja de detectar errores de integración. La alternativa no es montar siempre el sistema entero. Es elegir la frontera adecuada: funciones puras para reglas pequeñas, composables para estado propio, componentes con la red interceptada para flujos visibles y unos pocos E2E para recorridos críticos.

Restaurar estado, handlers y temporizadores después de cada prueba es parte de esa confianza. Un test que depende del orden de ejecución no es determinista aunque hoy pase en local.

## Conclusión

Un test que nunca falla puede ser más caro que no tenerlo porque invita a confiar en una protección que no existe y hace más difícil distinguir señal de ruido. La solución no es aumentar el número de pruebas, sino exigir a cada una un comportamiento valioso que pueda romperse. Una suite pequeña, legible y capaz de detectar cambios relevantes da más margen para evolucionar el código que una cobertura amplia sin criterio.

Para profundizar en este enfoque, puedes revisar [Testing Library en Vue y tests resistentes a refactors](/blog/testing-library-vue-tests-refactors/) y la guía de [errores comunes al testear con Vitest](/blog/errores-testing-vue-vitest/).
