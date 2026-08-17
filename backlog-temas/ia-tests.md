Sí, y además **el 4 y el 5 se complementan muy bien**, pero atacan dos problemas diferentes.

### 4. «La IA escribe código muy rápido. Por eso ahora necesito más tests que antes»

Este lo escribiría primero. Tiene una tesis que parece contradictoria y eso ayuda mucho:

> Cuanto más código puedo generar con IA, menos puedo permitirme depender exclusivamente de mi capacidad para revisarlo.

El artículo no debería ser un tutorial de Vitest/MSW/Testing Library. El foco sería **cómo cambia el papel del testing cuando introduces agentes en el ciclo de desarrollo**.

Yo desarrollaría ideas como:

- Antes los tests protegían principalmente frente a errores humanos y regresiones.
- Ahora también funcionan como **contrato entre tú y el agente**.
- Un agente puede implementar una tarea, pero necesita mecanismos objetivos para comprobar si realmente funciona.
- Los criterios de aceptación pueden terminar convertidos en tests.
- Vitest y Testing Library validan comportamiento.
- MSW permite controlar las fronteras con APIs.
- Playwright comprueba que el resultado funciona de verdad desde el punto de vista del usuario.
- TypeScript, lint y CI forman otra capa de protección.

Y metería una reflexión importante:

> **La IA abarata generar código, pero no abarata asumir las consecuencias de código incorrecto.**

De hecho, incluso puede aumentar el problema: si antes escribías 300 líneas cuidadosamente y ahora puedes producir 2.000 en el mismo tiempo, tu capacidad humana de revisión no se ha multiplicado por siete.

Ahí aparece el testing como **multiplicador de confianza**, no como freno a la productividad.

### 5. «No quiero que la IA me dé la razón»

Este me gusta incluso más como artículo personal porque **dice bastante de cómo trabajas**, no solamente de las herramientas que utilizas.

La tesis podría ser:

> La peor IA con la que puedo trabajar no es la que se equivoca. Es la que consigue convencerme de que mi primera idea era buena.

Aquí evitaría casi completamente el código.

Puedes contar cómo utilizas ChatGPT como interlocutor antes de pasar a implementación: explorar una arquitectura, cuestionar una decisión, encontrar problemas que no habías contemplado, comparar alternativas o convertir una idea todavía difusa en algo implementable.

Pero hay una trampa.

Si preguntas:

> «Creo que deberíamos utilizar X porque A, B y C. ¿Qué opinas?»

es bastante fácil acabar en una conversación que refuerza tu planteamiento.

En cambio, puedes buscar deliberadamente fricción:

> «Quiero utilizar X. Busca argumentos para no hacerlo.»

> «Actúa como el Tech Lead que tiene que mantener esto dentro de tres años.»

> «¿Qué decisión estoy tomando aquí que probablemente lamentaré?»

> «Propón una solución completamente diferente.»

> «¿Qué supuestos estoy dando por ciertos sin haberlos demostrado?»

Y aquí tienes una idea central que creo que podría convertirse incluso en **la frase del artículo**:

> **No utilizo la IA para tener más respuestas. La utilizo para hacerme mejores preguntas.**

El cierre podría conectar directamente con liderazgo técnico. Un buen Tech Lead no debería ser la persona que siempre tiene razón. Debería crear mecanismos para detectar **cuándo no la tiene**.

La IA puede convertirse en uno de esos mecanismos, siempre que no la utilices como un sofisticado «sí, jefe».

### Los publicaría juntos

Los veo casi como dos caras de tu forma de trabajar:

**«No quiero que la IA me dé la razón»**
→ cómo utilizas IA **antes de tomar una decisión**.

**«La IA escribe código muy rápido. Por eso necesito más tests que antes»**
→ cómo verificas **después de tomarla**.

Uno habla de **pensamiento crítico** y el otro de **confianza mediante automatización**.

Y entre ambos aparece una filosofía bastante interesante para tu blog:

**cuestionar → decidir → implementar → verificar.**

Eso puede convertirse en el hilo conductor de varios artículos sobre tu manera de trabajar con IA, en lugar de que el blog acabe siendo una colección de posts sobre herramientas.
