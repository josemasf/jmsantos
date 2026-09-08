---
title: "Cuando Front acaba siendo el QA de Backend"
description: "Por qué la integración entre frontend y backend se convierte en el verdadero control de calidad de muchos equipos, y cómo un contrato compartido y una Definition of Done más exigente evitan ese desgaste."
date: 2027-01-19
tags:
  [
    cultura de equipo,
    Definition of Done,
    contratos API,
    OpenAPI,
    frontend,
    backend,
    testing,
  ]
category: Cultura de equipo
---

En muchos equipos existe una fase del desarrollo que nadie ha decidido formalmente, pero que se repite sprint tras sprint: backend da por terminada una historia en cuanto el endpoint responde en Swagger, y es frontend quien, al integrarlo, descubre que faltan casos, que un error no está contemplado o que la respuesta no coincide con lo acordado. No es un problema de que frontend encuentre errores de backend; eso va a ocurrir siempre y forma parte de trabajar con sistemas conectados. El problema es que frontend se convierta, de facto, en el principal mecanismo de control de calidad de una funcionalidad que backend consideraba ya cerrada.

## El flujo disfuncional se repite con distintos nombres

El patrón suele ser bastante reconocible. Backend implementa una historia, prueba el camino feliz contra Postman o Swagger UI y la marca como terminada. Frontend empieza la integración con esa base y, casi de inmediato, aparecen preguntas que nadie había resuelto: qué devuelve el endpoint cuando la lista está vacía, qué código de error corresponde a un usuario sin permisos, si un campo puede llegar como `null` o simplemente no existir, o qué ocurre cuando el backend depende de un servicio externo que falla. La historia vuelve entonces a backend, frontend queda bloqueado esperando esa corrección y el ciclo se repite con la siguiente tarea.

El coste de ese ciclo no es solo el tiempo perdido en idas y vueltas. Aparece una percepción errónea, y bastante extendida, de que frontend es quien retrasa la integración, cuando en realidad está absorbiendo una parte del trabajo de verificación que debería haberse hecho antes de declarar la historia como terminada. Esa percepción desgasta la relación entre perfiles: backend siente que recibe correcciones constantes sobre algo que ya daba por bueno, y frontend siente que no puede avanzar sin depender de encontrar primero los huecos que otra persona no cubrió.

## Que un endpoint responda 200 no significa que la funcionalidad esté terminada

La causa habitual de este patrón es una idea implícita y rara vez cuestionada: si el endpoint responde con un código 200 en Swagger, la parte de backend está hecha. Esa validación demuestra que el servidor arranca, que la ruta existe y que, en el escenario más favorable, devuelve algo con la forma esperada. No demuestra que el comportamiento sea correcto en los casos que realmente importan para construir la interfaz: listas vacías, usuarios sin datos asociados, permisos insuficientes, errores de validación, respuestas parciales o degradadas cuando una dependencia falla.

Backend puede llegar a la integración con un nivel razonable de validación propia sin necesidad de replicar el trabajo de frontend. Un test que compruebe la respuesta cuando no hay resultados, otro que verifique el código de error correcto ante una petición inválida y otro que confirme el comportamiento cuando el usuario no tiene permiso suficiente no son pruebas exóticas; son parte de entender qué hace la funcionalidad, no solo que el servidor no ha caído. La diferencia entre una historia "terminada" y una historia realmente lista para integrar suele estar precisamente en esos casos que no aparecen en la demo rápida contra Swagger.

## Un contrato compartido reduce la ambigüedad antes de escribir código

Buena parte de este desgaste desaparece cuando frontend y backend acuerdan el contrato antes de implementar, en lugar de negociarlo a posteriori a base de historias que rebotan. Un contrato en este sentido no es solo la forma del cuerpo de la respuesta en el caso favorable. Incluye también los estados vacíos, los errores esperables, los permisos que condicionan la respuesta y cualquier degradación conocida, de modo que ambas partes trabajan sobre la misma referencia y pueden detectar discrepancias antes de que el código llegue a producción.

OpenAPI, o cualquier especificación equivalente versionada, es una herramienta razonable para formalizar ese acuerdo, pero el valor no está en la herramienta en sí, sino en la disciplina de definir ejemplos representativos más allá del camino feliz. Un contrato que solo documenta el caso exitoso traslada el mismo problema a otro formato: seguirá siendo frontend quien descubra, durante la integración, todo lo que el contrato no llegó a especificar. Ya comenté en el artículo sobre [MSW y desarrollo contract-first](/blog/msw-contract-first-frontend-backend-ia/) cómo ese mismo contrato permite a frontend avanzar en paralelo sin esperar a que exista un backend real; aquí el punto es distinto, aunque complementario: el contrato no solo desbloquea el desarrollo en paralelo, también es la referencia que evita que la integración se convierta en el momento de descubrir errores básicos.

Con MSW, frontend puede desarrollar desde el primer día contra ese contrato acordado, tal y como describí en el artículo sobre [mocks de API con MSW en Vue](/blog/msw-vue-mocks-api-desarrollo-tests/), y mantener después esos mismos handlers y escenarios como parte de la estrategia de testing una vez que el backend real esté disponible. Eso no sustituye la responsabilidad de backend de validar su propio comportamiento; simplemente asegura que frontend no depende de una implementación concreta para trabajar sobre los casos que importan. Cuando el coste de las integraciones lo justifica, porque los servicios cambian con frecuencia o el equipo es grande, también tiene sentido valorar contract testing para detectar de forma automática cuándo una de las dos partes se ha desviado del acuerdo.

## La Definition of Done debe incluir la validación, no solo la implementación

Nada de esto funciona si la definición de "terminado" sigue limitándose a que el código compile y el endpoint responda. Una Definition of Done que incluya explícitamente la validación de los casos relevantes antes de entregar una historia a otro equipo cambia el incentivo de fondo: deja de ser aceptable cerrar una tarea con solo el camino feliz probado, porque esa validación pasa a formar parte de lo que significa haber terminado el trabajo, no de un paso opcional que depende de la buena voluntad de quien lo implementa.

Esto no traslada la responsabilidad de encontrar errores exclusivamente a backend ni pretende eliminar la fricción entre perfiles; algunos problemas solo se detectan al integrar, y eso seguirá ocurriendo por más contrato y por más tests que existan de antemano. La diferencia relevante es de proporción y de momento: unos pocos casos límite descubiertos durante la integración son parte normal del trabajo conjunto, mientras que una historia que llega a frontend sin haber contemplado los estados vacíos, los errores esperables o los permisos no está terminada, aunque el endpoint responda 200 en Swagger.

## Conclusión

El síntoma es fácil de identificar: si frontend descubre sistemáticamente contratos rotos, errores HTTP mal gestionados o estados que nadie había considerado, el problema no es que frontend "encuentre demasiados bugs". Es que la integración se ha convertido en el verdadero control de calidad de una funcionalidad que se declaró terminada demasiado pronto. Acordar el contrato antes de implementar, incluir los casos límite en él y exigir en la Definition of Done una validación real, más allá del camino feliz, no elimina la necesidad de trabajar juntos durante la integración, pero sí evita que ese trabajo conjunto se convierta en la única red de seguridad de todo el sistema.
