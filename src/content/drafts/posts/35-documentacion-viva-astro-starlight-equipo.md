---
title: "Documentación viva con Astro y Starlight: menos conocimiento tribal, más contexto compartido"
description: "Cómo convertir la documentación de arquitectura, operaciones y contratos en una herramienta de trabajo para el equipo, usando Astro y Starlight sin escribir por escribir."
date: 2026-10-13
tags: [documentación, Astro, Starlight, equipos, arquitectura, DX, OpenAPI]
category: Arquitectura
image:
  src: /images/blog/documentacion-viva-astro-starlight-equipo/documentacion-viva-astro-starlight-equipo.png
  alt: Tres integrantes de un equipo anotan un cuaderno de documentación abierto cuyos diagramas conectan datos, arquitectura, interfaz, alertas operativas, una lista de comprobación y una validación.
  width: 1536
  height: 1024
---

La documentación suele aparecer cuando algo ya ha costado demasiado: una incorporación lenta, una incidencia que nadie sabe reproducir, una decisión que se discute por tercera vez o una funcionalidad que no puede cambiarse con confianza porque su contexto vive en conversaciones antiguas. Entonces se abre una wiki, se crean varias páginas y, durante unas semanas, parece que el problema está resuelto. Después cambia el producto, la documentación deja de acompañarlo y vuelve a ser más rápido preguntar a quien “se lo sabe”.

No creo que la solución sea documentar todo. Creo que hay que documentar aquello que permite al equipo tomar mejores decisiones y operar el producto sin depender de memoria o de intermediarios. Una documentación viva no es la que se actualiza por obligación: es la que forma parte del recorrido normal de construir, revisar y mantener una funcionalidad.

Astro y [Starlight](https://starlight.astro.build/getting-started/) son una combinación interesante para este propósito. Starlight es una solución de documentación construida sobre Astro y organiza contenido local en una colección de documentos. Su valor no está en añadir otra web bonita al proyecto, sino en ofrecer una estructura navegable, versionable y próxima al código para el conocimiento que el equipo necesita reutilizar.

## El problema no es que falte información

En casi todos los productos hay información. Vive en tickets, hilos de chat, documentos compartidos, PRs, dashboards, código y personas. La dificultad no es producir más texto, sino transformar esa información dispersa en contexto utilizable en el momento adecuado.

Por ejemplo, una persona que va a modificar una funcionalidad puede necesitar saber qué decisión llevó a un modelo de datos, qué permisos aplica el endpoint, qué dependencia externa hay que vigilar y cómo comprobar que un despliegue ha salido bien. Ninguna de esas respuestas necesita convertirse en una enciclopedia. Pero si obliga a interrumpir siempre a la misma persona, el equipo tiene una dependencia que no aparece en el diagrama de arquitectura.

La documentación útil reduce ese coste de descubrimiento. No sustituye leer el código ni hablar con las personas que conocen un problema complejo. Da un punto de partida fiable para que esas conversaciones empiecen con contexto, no desde cero.

## Qué merece documentarse primero

No empezaría creando páginas para cada módulo o copiando la referencia de las herramientas que ya usan. La documentación oficial de un framework casi siempre será mejor que una versión interna que intenta resumirla. El esfuerzo tiene más valor cuando captura el contexto específico del producto.

Una primera estructura razonable puede tener cuatro grupos:

```text
docs/
  producto/        # conceptos, flujos y reglas relevantes
  arquitectura/    # límites, decisiones y dependencias
  operaciones/     # despliegues, incidencias y runbooks
  contribucion/    # cómo desarrollar, probar y revisar cambios
```

En `producto` encajan los flujos que ayudan a entender por qué existe una funcionalidad y qué estados debe contemplar. En `arquitectura`, los ADRs, los límites entre aplicaciones y las integraciones que condicionan decisiones. `Operaciones` debería recoger acciones que alguien necesita ejecutar o investigar de verdad: cómo responder ante una alerta, qué métricas revisar o cómo recuperar un proceso. Por último, `contribución` reduce incertidumbre sobre entornos locales, comandos, pruebas y criterios de revisión.

La prueba para decidir si una página merece existir es sencilla: ¿evita una pregunta recurrente, una decisión implícita o un error costoso? Si no tiene una respuesta clara, quizá sea una nota temporal, un comentario en una PR o conocimiento que ya cubre una fuente mejor.

## Documentar el recorrido completo, no las capas aisladas

En un producto con varias aplicaciones, una funcionalidad atraviesa más de una capa. Puede tocar datos, reglas, API, interfaz, permisos, analítica y soporte. Documentar únicamente cada pieza aislada reproduce una fragmentación parecida a la de los repositorios y los equipos separados por especialidad.

Es más útil describir los recorridos importantes. Por ejemplo, la creación de una solicitud puede incluir quién puede iniciarla, qué datos se validan, qué estado se persiste, qué integración se ejecuta, qué se muestra a la persona usuaria y cómo se detecta un fallo. Esa página no reemplaza el esquema de base de datos, el contrato API ni las pruebas; conecta sus responsabilidades para que el equipo entienda el producto completo.

Este enfoque acompaña bien a una [arquitectura multi-app en un monorepo](/blog/arquitectura-multi-app-monorepo-pnpm-ia/). Tener aplicaciones y documentación cerca no elimina sus límites, pero reduce la distancia entre una decisión y el contexto necesario para aplicarla. También facilita que un agente de IA explore el recorrido real de una funcionalidad, siempre con la documentación como apoyo y no como una fuente incuestionable frente al código.

## Starlight como soporte, no como objetivo

Starlight no obliga a inventar una arquitectura documental. Ofrece convenciones útiles para publicar contenido y navegarlo. Su guía de inicio sitúa las páginas de documentación en `src/content/docs/`, y la configuración permite organizar una barra lateral manual o generarla a partir de directorios. La [referencia de configuración](https://starlight.astro.build/reference/configuration/) también contempla colecciones y esquemas de contenido, por lo que los documentos pueden validarse como parte del proyecto.

Una configuración mínima puede expresar una estructura intencionada sin convertir la navegación en una lista interminable:

```ts
starlight({
  title: "Documentación del producto",
  sidebar: [
    { label: "Producto", items: [{ autogenerate: { directory: "producto" } }] },
    {
      label: "Arquitectura",
      items: [{ autogenerate: { directory: "arquitectura" } }],
    },
    {
      label: "Operaciones",
      items: [{ autogenerate: { directory: "operaciones" } }],
    },
    {
      label: "Contribución",
      items: [{ autogenerate: { directory: "contribucion" } }],
    },
  ],
});
```

El ejemplo no pretende ser una receta que deba copiarse sin más. Su objetivo es mostrar que la estructura tiene que responder a cómo busca información el equipo. Si una persona que investiga una incidencia necesita recorrer tres menús para encontrar un runbook, la documentación está organizada para quien la escribió, no para quien la utiliza.

## Los contratos deben tener una fuente de verdad

La documentación de una API merece un cuidado especial. Es útil disponer de una guía que explique autenticación, casos de uso, errores relevantes y ejemplos de integración. Pero mantener manualmente todos los endpoints, parámetros y respuestas suele terminar en divergencias.

Cuando existe una especificación OpenAPI, conviene tratarla como fuente de verdad para la referencia de API y reservar la documentación narrativa para lo que la especificación no explica bien: decisiones de negocio, flujos recomendados, límites operativos, migraciones y ejemplos completos. El mismo criterio sirve para esquemas, configuraciones o componentes: generar lo que se puede derivar del sistema y redactar lo que requiere contexto y juicio.

Esto reduce el trabajo repetido y evita una trampa frecuente: actualizar la implementación, olvidar la guía y dejar que quien la consulte empiece con una idea equivocada del contrato.

## Un runbook es una herramienta para recuperar capacidad de actuar

Los runbooks no son documentos de emergencia que se escriben durante una incidencia. Son procedimientos cortos para situaciones que el equipo ya sabe que pueden ocurrir: una cola que acumula trabajo, un despliegue que necesita reversión, una integración externa degradada o una tarea programada que no está ejecutándose.

Un buen runbook responde a preguntas operativas concretas: qué señal confirma el problema, qué impacto tiene, qué comprobaciones se realizan primero, qué acciones son seguras, cuándo hay que escalar y cómo se deja constancia del resultado. No necesita explicar toda la arquitectura; debe permitir actuar de forma segura cuando la atención y el tiempo escasean.

Después de una incidencia, actualizar el runbook es una de las formas más directas de convertir una experiencia en aprendizaje colectivo. Si el documento no cambia nunca, probablemente no está participando en la operación real del producto.

## Mantenerla viva requiere integrarla en el flujo

La documentación se desactualiza cuando se considera un trabajo posterior e indefinido. Para evitarlo, debe entrar en los puntos donde ya se toman decisiones:

1. Una funcionalidad nueva revisa qué guía, contrato o recorrido necesita cambiar.
2. Una decisión de arquitectura se registra cuando todavía están claras sus alternativas y motivos.
3. Una PR que modifica un flujo relevante enlaza o actualiza la documentación relacionada.
4. Una incidencia revisada produce una mejora en el runbook, las alertas o la guía de diagnóstico.
5. La incorporación de una persona nueva revela qué páginas no permiten avanzar y cuáles sobran.

No todas las PR deben incluir documentación. Convertirlo en una casilla obligatoria genera ruido. La pregunta correcta es si el cambio modifica un acuerdo que otras personas necesitarán comprender o ejecutar después. Si es así, actualizar la página correspondiente forma parte de terminar el trabajo.

También es importante que la documentación tenga propiedad compartida. Una única persona puede iniciar una estructura y cuidar su coherencia editorial, pero no debería convertirse en la intermediaria obligatoria para cualquier corrección. Enlazar las páginas desde tickets, revisiones y herramientas internas invita a que quien detecta una desactualización pueda corregirla con el mismo flujo de revisión que usa para el código.

## Medir uso, no páginas creadas

El número de documentos no mide la calidad del conocimiento compartido. Una señal más útil es observar si las preguntas recurrentes disminuyen, si una incorporación necesita menos mediación, si los incidentes recuperan capacidad de respuesta antes o si las revisiones encuentran menos supuestos implícitos.

La documentación también puede revelar deuda. Una página difícil de explicar puede señalar que un flujo es demasiado complejo, que los límites del sistema no son claros o que existe una regla de negocio que nadie ha modelado bien. En esos casos, mejorar el documento no siempre es la solución: quizá el producto o la arquitectura necesiten simplificarse.

## Conclusión

Astro y Starlight pueden dar una base ligera y mantenible para que la documentación viva junto al código. Aun así, ninguna herramienta puede hacer que el conocimiento sea compartido por decreto. La diferencia aparece cuando el equipo usa las páginas para preparar cambios, tomar decisiones, revisar contratos y actuar ante incidencias.

Documentar no es construir una biblioteca para demostrar que el equipo sabe cosas. Es reducir el coste de entender y colaborar. Cuando una guía conecta el contexto del producto con la acción que alguien debe tomar, deja de ser un artefacto olvidado y se convierte en una parte real de cómo el equipo entrega valor.
