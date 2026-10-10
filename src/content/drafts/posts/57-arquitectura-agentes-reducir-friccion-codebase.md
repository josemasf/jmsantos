---
title: "Arquitectura para agentes: reduce la fricción antes de delegar más"
description: "Por qué los agentes heredan los costes de una codebase difícil de navegar y cómo mejorar seams, interfaces y locality antes de aumentar su autonomía."
date: 2026-11-17
tags: [IA, agentes, arquitectura, mantenibilidad, codebase, desarrollo de software]
category: Arquitectura
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 6
image:
  src: /images/blog/57-arquitectura-agentes-reducir-friccion-codebase/arquitectura-friccion-agentes.png
  alt: Una ingeniera simplifica un mapa de módulos y conexiones, dejando una ruta clara entre una interfaz pequeña, una implementación profunda y sus pruebas.
  width: 1536
  height: 1024
---

Un agente puede leer una codebase más deprisa que una persona en algunas tareas, pero eso no vuelve comprensible un sistema con dependencias ocultas, nombres inconsistentes y reglas repartidas por muchas capas. Cuando no hay una frontera clara, cada cambio exige buscar más archivos, inferir qué convención prevalece y validar efectos que no están cerca del código editado.

La skill [`codebase-design`](https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design) usa el concepto de módulos profundos: una interfaz pequeña detrás de la que se concentra bastante comportamiento. A esa estructura añade seams explícitos, adapters intercambiables y locality, de modo que el conocimiento y la verificación de un cambio permanezcan cerca del lugar donde se modifica.

## La arquitectura determina cuánto contexto hay que cargar

Una función, paquete o capa puede ser un módulo siempre que tenga una interfaz y una implementación. Una interfaz no son solo los tipos que aparecen en la firma; incluye invariantes, orden de operaciones, errores, configuración y características de rendimiento que el caller debe conocer. Si cada consumidor necesita comprender todos los detalles internos, la abstracción ofrece poca leverage.

Para una persona, la falta de estructura aumenta el esfuerzo de navegación. Para un agente, además, vuelve menos precisa la selección del contexto: una búsqueda por nombre puede encontrar varios conceptos parecidos, las reglas se repiten con pequeñas diferencias y un cambio local puede tener efectos a distancia. Esta conclusión es una inferencia práctica sobre cómo se trabaja con repositorios: cuanto más visible y localizada está una decisión, menos supuestos necesita completar el modelo.

Una frontera de calidad no consiste en añadir capas por sistema. Si una interfaz nueva solo reenvía llamadas y obliga a mantener más archivos, quizá sea un módulo superficial. La pregunta es si concentra complejidad y ofrece una capacidad clara a quienes lo usan.

## Busca seams que permitan observar el comportamiento

Un seam es el lugar en el que una interfaz permite variar o inspeccionar el comportamiento sin alterar cada caller. Puede ser una función de dominio, el límite HTTP de una aplicación, la entrada de un componente o un adaptador de almacenamiento. El seam debe coincidir con una variación real del sistema y ser útil para las pruebas.

Si una prueba necesita sustituir seis clases propias y comprobar una llamada privada, puede que el cambio atraviese demasiados módulos superficiales. Una interfaz más profunda puede ocultar esas colaboraciones y permitir que el test observe un resultado desde un solo punto. Menos seams no siempre es mejor; pero cada uno debería pagar su coste con aislamiento, claridad o una alternativa que realmente varía.

La localidad importa para corregir y evolucionar. Si la regla de descuento, sus pruebas y su documentación viven en lugares distantes, cada cambio obliga a reunir contexto disperso. Si el módulo concentra la regla y la expone mediante un contrato estable, quienes lo usan y quienes lo prueban necesitan conocer menos detalles.

## Mejora la codebase desde fricciones observadas

La skill [`improve-codebase-architecture`](https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture) recorre un repositorio y presenta oportunidades de profundización para que el equipo elija cuál explorar. Su función es identificar candidatos y guiar una decisión; no ejecuta automáticamente una reescritura amplia ni promete resolver una codebase antigua de una vez.

Una mejora útil empieza con una fricción concreta: un cambio que requiere editar la misma regla en varios sitios, un test que atraviesa demasiados detalles o una abstracción que obliga a conocer varias capas. A partir de ahí, se evalúa si una interfaz más pequeña ocultaría complejidad y si el cambio se puede hacer de forma incremental. La señal puede ser facilidad para añadir una capacidad, reducir duplicación de decisiones o hacer más fiable una prueba.

## Deuda técnica y autonomía están conectadas

No toda deuda afecta igual al trabajo delegado. Una estructura puede ser molesta pero conocida para un maintainer que lleva años en el sistema; para un agente de contexto limitado, convenciones implícitas y dependencias indirectas pueden causar errores repetidos. Eso no significa que haya que reorganizar todo para la IA. Significa que las zonas de mayor fricción merecen atención cuando también ralentizan a las personas o dificultan validar cambios.

Antes de aumentar la autonomía, conviene mejorar el entorno de las tareas que se quieren delegar: límites de módulos comprensibles, nombres estables, pruebas en interfaces públicas, scripts repetibles y documentación cercana a las decisiones. Una architecture improvement debe producir una frontera que alguien pueda explicar y comprobar, no solo un diagrama más limpio.

Los agentes amplifican las propiedades de la codebase en la que operan. Una estructura clara les permite concentrar cambios y devolver evidencia; una estructura opaca les da más oportunidades de adivinar. Por eso, reducir fricción antes de delegar más no es una tarea previa exclusiva de la IA: es inversión en mantener software con menos contexto tribal.
