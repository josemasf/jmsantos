> Estado: escrito como borrador. Serie creada en `src/content/drafts/posts/37-ia-escribir-codigo-barato-entenderlo-caro.md` hasta `src/content/drafts/posts/42-componente-700-lineas-no-problema.md`, programada semanalmente del 20 de octubre al 24 de noviembre de 2026.

Sí. Creo que ahora mismo tienes margen para salir un poco de los temas más previsibles de “Vue + testing + arquitectura” sin salirte de tu terreno.

El tema que más te recomendaría es:

## **La deuda técnica no se paga cuando refactorizas: se paga cada vez que alguien tiene que entender el código**

La idea rompe un poco con el discurso habitual de que la deuda técnica es simplemente “código feo pendiente de arreglar”. Puedes llevarlo a algo mucho más interesante: **la deuda técnica es un impuesto sobre cada cambio futuro**.

Y encaja muchísimo con cosas que ya has vivido y analizado: componentes enormes, `any`, código muerto, tests lentos, errores poco observables, dependencias antiguas, `TODO` sin seguimiento... Todo eso no duele necesariamente el día que se escribe. Duele seis meses después cuando alguien tiene que tocarlo. Tus propios análisis muestran precisamente esa combinación de problemas de mantenibilidad, observabilidad, testing y código no utilizado.

El giro que puede hacer que el artículo destaque sería este:

> **La deuda técnica no se mide por cuántas malas prácticas tienes. Se mide por cuánto ralentizan una modificación aparentemente sencilla.**

Eso te permite hablar de casos muy reconocibles. Una historia parece de dos puntos y termina necesitando entender cinco composables, tres stores y un componente de 600 líneas. Un test tarda 20 segundos porque en realidad estás levantando media aplicación para comprobar un botón. Un error llega a Sentry como `<unknown>` y el problema deja de ser el bug: ahora tienes que investigar qué demonios ha ocurrido. Tus informes incluso muestran casos donde la suite consume minutos en setup/import antes de validar comportamiento, o donde los tests aparentemente verdes dejan errores asíncronos después del teardown.

Y puedes terminar con una idea muy de Tech Lead:

**La mejor deuda técnica que puedes eliminar no es necesariamente la más fea. Es la que aparece todos los días en el camino crítico del equipo.**

Eso te lleva directamente a priorización. No arreglar `any` porque “TypeScript dice que está mal”, sino porque está en una zona que cambia constantemente. No dividir un componente porque tenga 682 líneas, sino porque cada modificación requiere volver a construir el modelo mental completo. No perseguir cobertura por porcentaje, sino buscar qué parte del sistema hace que el equipo tenga miedo de modificarla.

### Otros temas que podrían sorprender bastante

1. **“Un test que nunca falla puede ser peor que no tener test”** — escrito como borrador: `src/content/drafts/posts/38-test-nunca-falla-peor-que-no-tenerlo.md`.
   Sobre tests superficiales, cobertura engañosa y suites que validan implementación en lugar de comportamiento. Tiene bastante conexión con lo que detectaste de cobertura alta en líneas pero baja en funciones.

2. **“El código muerto no está muerto: alguien sigue pagando por él”** — escrito como borrador: `src/content/drafts/posts/39-codigo-muerto-coste-cognitivo.md`.
   `knip`, exports sin usar, dependencias antiguas, falsas pistas en el repositorio y coste cognitivo. Muy poco tratado y con bastante potencial.

3. **“Tu CI también forma parte de la experiencia de usuario”** — escrito como borrador: `src/content/drafts/posts/40-ci-experiencia-desarrollador.md`.
   Pero el usuario es el desarrollador. Un pipeline lento cambia hábitos: menos ejecuciones, PR más grandes, menos feedback y finalmente menor calidad. Tu análisis de una suite de ~15 minutos tiene material muy bueno para esto.

4. **“El bug más caro es el que no sabes reproducir”** — escrito como borrador: `src/content/drafts/posts/41-bug-caro-no-sabes-reproducir.md`.
   Observabilidad como arquitectura frontend. Sentry, contexto, breadcrumbs, errores `<unknown>`, correlación con API... bastante distinto al típico artículo de frontend.

5. **“Un componente de 700 líneas no es necesariamente el problema”** — escrito como borrador: `src/content/drafts/posts/42-componente-700-lineas-no-problema.md`.
   Esta podría ser especialmente polémica. Las líneas son una señal, no un diagnóstico. Podrías desmontar reglas del tipo “máximo 300 líneas” y hablar de cohesión, razones de cambio, acoplamiento y capacidad de testear. En uno de tus informes aparecen componentes de 682 líneas considerados problemáticos; precisamente podrías cuestionar cuándo esa métrica sirve y cuándo engaña.

6. **“La IA está haciendo que escribir código sea barato. Entenderlo sigue siendo caro.”** — desarrollado como apertura de la serie con el titular «Escribir código ya es barato. Mantenerlo sigue siendo carísimo.»: `src/content/drafts/posts/37-ia-escribir-codigo-barato-entenderlo-caro.md`.
   Este me parece probablemente el de mayor recorrido. Si generar código cuesta cada vez menos, la ventaja competitiva deja de estar en producir líneas y pasa a estar en **mantener coherencia, arquitectura, pruebas, observabilidad y criterio para borrar código**. Une perfectamente IA + arquitectura + liderazgo técnico.

De todos ellos, **yo escribiría el 6 antes que ninguno**.

El titular incluso podría ser:

### **Escribir código ya es barato. Mantenerlo sigue siendo carísimo.**

Y la tesis:

> Durante años intentamos optimizar cuánto tardábamos en escribir software. La IA acaba de destrozar esa métrica. Ahora el cuello de botella vuelve a estar donde siempre estuvo: entender qué debemos construir, decidir cómo encaja con lo existente y comprobar que no hemos roto nada.

Ese artículo te permitiría unir prácticamente todos tus temas habituales —IA, testing, arquitectura, deuda técnica y liderazgo técnico— pero desde un ángulo bastante menos trillado.
