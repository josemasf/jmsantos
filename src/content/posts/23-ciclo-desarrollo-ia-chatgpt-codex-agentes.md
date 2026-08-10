---
title: "Mi ciclo de desarrollo con IA: de una idea al producto con ChatGPT, Linear, Codex y agentes"
description: "Así utilizo ChatGPT, Linear, Codex y agentes especializados para convertir ideas de mis side projects en funcionalidades planificadas, implementadas, probadas y revisadas visualmente."
date: 2026-06-26
tags: [IA, ChatGPT, Codex, Linear, Frontend, Vue, Astro, testing, productividad]
category: Desarrollo profesional
image:
  src: /images/blog/ciclo-desarrollo-ia-chatgpt-codex-agentes/mi-ciclo-desarrollo-ia.png
  alt: Esquema visual del ciclo de desarrollo con IA, desde la idea inicial hasta la revisión visual, pasando por ChatGPT, Linear, VS Code con Codex, agentes especializados, testing y mejora continua.
  width: 1536
  height: 1024
---

Hace apenas un par de años utilizaba ChatGPT para resolver dudas puntuales. Hoy la IA forma parte de prácticamente todo el ciclo de desarrollo de mis _side projects_.

No porque deje que un modelo decida qué construir o porque genere una aplicación completa a partir de un prompt. Mi flujo es bastante más deliberado: utilizo distintas herramientas y agentes en momentos concretos, y cada uno tiene una responsabilidad diferente.

El ciclo, simplificado, es este:

**Idea → definición con ChatGPT → issue en Linear → planificación de producto → implementación con agentes → revisión técnica y tests → revisión visual.**

La parte que intento evitar es convertir la IA en una caja negra a la que entrego una idea y de la que espero recibir una funcionalidad terminada. Prefiero utilizarla como una cadena de especialistas que me ayudan a pensar, organizar, construir y revisar.

## 1. Todo empieza con una idea, no con una issue

Normalmente el proceso empieza de una forma bastante poco sofisticada: se me ocurre una funcionalidad que podría tener sentido para uno de mis proyectos.

En ese momento todavía no quiero crear una tarea en Linear ni empezar a tocar código. La idea puede ser buena, innecesaria, demasiado grande o estar mal planteada.

Mi primera conversación es con ChatGPT.

No suelo llegar con una especificación cerrada. Empiezo explicando la necesidad, el problema que intento resolver o simplemente la funcionalidad que tengo en mente, y a partir de ahí iteramos.

En esta fase utilizo ChatGPT para:

- Explorar qué debería hacer realmente la funcionalidad.
- Detectar casos que no había considerado.
- Separar lo imprescindible de lo accesorio.
- Evaluar alternativas de experiencia de usuario.
- Identificar dependencias con funcionalidades existentes.
- Convertir una intuición en algo que pueda explicarse y desarrollarse.

La conversación puede dar varias vueltas. Para mí esa iteración es precisamente la parte importante.

No quiero que ChatGPT me entregue rápidamente una historia de usuario bonita. Quiero usar la conversación para saber si la funcionalidad merece existir y, si merece existir, tener claro qué significa terminarla.

## 2. Cuando la idea está clara, entonces entra en Linear

Linear no es el lugar donde pienso por primera vez una funcionalidad. Es el lugar donde registro una funcionalidad que ya he pensado.

Cuando la conversación ha madurado lo suficiente, le pido a ChatGPT que convierta lo acordado en una issue de Linear.

Esa issue debería contener suficiente contexto para que unas semanas después pueda volver a ella sin tener que reconstruir mentalmente toda la conversación original.

Normalmente me interesa que incluya:

- Problema o necesidad que resuelve.
- Alcance funcional.
- Comportamiento esperado.
- Casos importantes y estados límite.
- Criterios de aceptación.
- Consideraciones técnicas si ya son conocidas.
- Aspectos que explícitamente quedan fuera del alcance.

Este paso tiene un efecto bastante útil: obliga a cerrar la fase de exploración.

Mientras estoy hablando con ChatGPT una idea puede seguir siendo líquida. Cuando la convierto en una issue, pasa a ser una pieza concreta del producto.

## 3. Linear alimenta la visión de producto

Crear una issue no significa que vaya a implementarla inmediatamente.

Este es un punto importante de mi flujo.

Después vuelvo a VS Code, donde tengo agentes con acceso al contexto del proyecto y a Linear. Uno de ellos actúa como **Product Owner**.

Su función no es escribir código. Su trabajo es revisar la nueva issue dentro del contexto del resto del producto y ayudarme a mantener actualizado el roadmap.

Puede analizar, por ejemplo:

- En qué bloque funcional encaja.
- Qué otras funcionalidades están relacionadas.
- Si existen dependencias previas.
- Qué debería ocurrir antes o después.
- Si el alcance se solapa con otra iniciativa.
- Cómo afecta a las prioridades que ya tenía definidas.

Con esto mantengo una foto de producto que va más allá de una lista de tickets pendientes.

Para mis _side projects_ esto es especialmente útil. No tengo un equipo de producto completo, pero sigo necesitando responder a preguntas de producto: qué construir primero, qué depende de qué y hacia dónde está evolucionando la aplicación.

El agente Product Owner me ayuda a mantener esa visión sin mezclarla con la implementación técnica.

## 4. Una funcionalidad planificada puede esperar

No todas las ideas tienen que convertirse inmediatamente en código.

Una vez registrada y situada en el roadmap, una funcionalidad puede quedarse ahí durante días, semanas o meses.

Esto cambia bastante mi relación con las ideas nuevas.

Antes era fácil que una idea interesante acabara provocando una interrupción inmediata: abrir el editor, empezar a tocar componentes y descubrir varias horas después que había desplazado algo más importante.

Ahora puedo capturarla, desarrollarla conceptualmente, colocarla en el roadmap y seguir con lo que estaba haciendo.

La IA no solo me ayuda a desarrollar más rápido. También me ayuda a **no desarrollar todavía** cuando no corresponde.

## 5. Cuando decido implementarla, cambio de agentes

Cuando una funcionalidad pasa realmente a desarrollo, el Product Owner deja de ser el protagonista.

A partir de ahí utilizo agentes más especializados según el tipo de trabajo que tenga delante.

No necesito que un único agente haga absolutamente todo. Prefiero repartir responsabilidades.

Dependiendo de la funcionalidad puedo apoyarme en perfiles como:

- Arquitectura frontend.
- Arquitectura backend.
- Desarrollo frontend.
- Testing.
- Seguridad.
- Revisión de código.

La issue de Linear se convierte entonces en el contrato de entrada: explica qué queremos conseguir. El repositorio aporta el otro contexto imprescindible: cómo está construido actualmente el producto.

La implementación tiene que respetar ambas cosas.

Un agente puede proponer una solución técnicamente correcta y seguir siendo una mala solución para el proyecto si ignora patrones existentes, duplica abstracciones o introduce una complejidad que no necesitamos.

Por eso intento que los agentes trabajen sobre el código real y no sobre una descripción aislada del sistema.

## 6. Implementar no es solamente generar código

Durante la implementación utilizo Codex desde VS Code para trabajar directamente sobre el repositorio.

El objetivo no es escribir la mayor cantidad de código posible con IA. Es reducir la fricción entre una tarea bien definida y una implementación verificable.

Suelo trabajar en iteraciones relativamente acotadas:

- Analizar primero la issue y el código relacionado.
- Proponer un plan de implementación.
- Modificar únicamente las partes necesarias.
- Ejecutar los tests afectados.
- Revisar errores de tipos, lint o consola.
- Comprobar que no se hayan introducido cambios colaterales.

Si la funcionalidad tiene suficiente tamaño, diferentes agentes pueden intervenir sobre el mismo cambio desde perspectivas distintas.

El agente que implementa no debería ser necesariamente quien dé por buena su propia implementación.

Esa separación me parece importante.

## 7. Testing y revisión forman parte de la funcionalidad

Para mí una funcionalidad no está terminada porque se vea en pantalla o porque compile.

El ciclo incluye explícitamente revisión y testing.

En frontend trabajo habitualmente con:

- **Vitest** para la suite de tests.
- **Testing Library** para validar comportamiento observable.
- **MSW** para controlar interacciones con APIs.
- **Playwright** para flujos completos y escenarios críticos.

Los agentes especializados en testing me ayudan a revisar qué escenarios faltan, detectar pruebas demasiado acopladas a la implementación y comprobar que estados como carga, error, vacío o permisos no se hayan olvidado.

Después puedo utilizar otro agente como revisor del código producido.

Me interesa especialmente que busque problemas concretos:

- Bugs potenciales.
- Complejidad innecesaria.
- Código duplicado.
- Problemas de accesibilidad.
- Mal uso de componentes existentes.
- Contratos o tipos inconsistentes.
- Efectos secundarios no previstos.
- Tests que parecen correctos pero realmente no prueban el comportamiento esperado.

La IA acelera mucho esta revisión, pero el criterio final sigue siendo mío.

## 8. El último paso es deliberadamente humano: mirar la funcionalidad

Hay una fase que no quiero delegar completamente: la revisión visual.

Cuando la implementación y los tests están razonablemente cerrados, abro la aplicación y utilizo la funcionalidad.

Quiero verla en su contexto real.

Compruebo cosas que no siempre aparecen en una issue ni detecta una suite de tests:

- Si visualmente encaja con el resto de la aplicación.
- Si la jerarquía de información tiene sentido.
- Si hay demasiado espacio o demasiado ruido.
- Si los textos funcionan en contexto.
- Si una interacción resulta torpe aunque técnicamente sea correcta.
- Si el responsive se comporta como esperaba.
- Si los estados de carga, error o vacío son coherentes.
- Si realmente usaría la funcionalidad de la manera que había imaginado.

Esta revisión muchas veces provoca una nueva iteración.

Y eso está bien.

Una funcionalidad puede cumplir todos los criterios de aceptación y seguir necesitando ajustes cuando finalmente la ves funcionando dentro del producto.

## 9. El resultado vuelve a alimentar el ciclo

Cuando termino una funcionalidad, el producto ha cambiado y por tanto también cambia el contexto para las siguientes.

Nuevas decisiones arquitectónicas pueden convertirse en patrones reutilizables. Una dificultad durante la implementación puede revelar deuda técnica. Una revisión visual puede generar otra idea. Una funcionalidad terminada puede desbloquear varias issues del roadmap.

Por eso no veo este proceso como una línea recta, sino como un ciclo:

1. Tengo una idea.
2. La desarrollo conceptualmente con ChatGPT.
3. La convierto en una issue de Linear.
4. El agente Product Owner la incorpora a la visión del roadmap.
5. Decido cuándo merece ser implementada.
6. Los agentes técnicos me ayudan a construirla, probarla y revisarla.
7. Hago la revisión visual y funcional final.
8. Lo aprendido modifica el contexto del producto y condiciona las siguientes ideas.

La IA aparece en casi todas las fases, pero no siempre haciendo lo mismo.

Esa es probablemente la parte más importante de mi flujo.

## No busco un agente que lo haga todo

Cada vez aparecen más demos de agentes capaces de recibir una petición y devolver una funcionalidad aparentemente terminada.

Es interesante, pero no es el modelo que más me convence para trabajar en mis proyectos.

Prefiero una cadena de responsabilidades claras.

ChatGPT me ayuda a pensar el producto. Linear conserva la decisión. El agente Product Owner mantiene la visión global. Los agentes técnicos trabajan sobre la implementación. Los agentes de testing y revisión intentan romperla. Y al final yo evalúo el resultado dentro de la aplicación.

Eso introduce más pasos que escribir «implementa esta funcionalidad».

También introduce muchos más puntos de control.

## Conclusión

Mi ciclo de desarrollo con IA no empieza en VS Code. Empieza bastante antes, cuando una funcionalidad todavía es simplemente una idea.

ChatGPT me ayuda a darle forma. Linear la convierte en una unidad concreta de producto. Un agente Product Owner la sitúa dentro del roadmap. Codex y otros agentes especializados ayudan a implementarla, probarla y revisarla. Finalmente hago una revisión visual para comprobar que aquello que parecía correcto sobre el papel también funciona dentro del producto.

No intento eliminarme del proceso.

Intento colocar la IA en aquellos puntos donde puede aportar más contexto, velocidad o capacidad de revisión, manteniendo para mí las decisiones de producto y el criterio sobre lo que finalmente se entrega.

Para mis _side projects_, esa combinación me permite trabajar como si tuviera un pequeño equipo alrededor del producto, aunque en realidad siga siendo yo quien decide hacia dónde va.
