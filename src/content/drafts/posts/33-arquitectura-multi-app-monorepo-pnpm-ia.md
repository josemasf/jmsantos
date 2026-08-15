---
title: "Arquitectura multi-app con pnpm: un monorepo que también da contexto a la IA"
description: "Cómo organizar frontend, API, backoffice y documentación en un monorepo con pnpm para compartir cambios con seguridad y dar a la IA el contexto completo de cada funcionalidad."
date: 2026-09-22
tags: [pnpm, monorepo, arquitectura, IA, frontend, backend, DX]
category: Arquitectura
image:
  src: /images/blog/arquitectura-multi-app-monorepo-pnpm-ia/arquitectura-multi-app-monorepo-pnpm-ia.png
  alt: Plano dibujado a mano que conecta una base de datos, una API, un backoffice y una aplicación de usuario alrededor de un asistente de IA, con un recorrido de validación entre las capas.
  width: 1536
  height: 1024
---

Un monorepo no convierte por sí solo un sistema en una arquitectura limpia. Si las aplicaciones comparten límites confusos, dependencias circulares o una base de datos sin reglas claras, guardar todo en el mismo repositorio solo hace que esos problemas estén más cerca. Sin embargo, cuando un producto tiene varias capas que evolucionan juntas, reunirlas puede reducir una fricción muy concreta: entender qué debe cambiar para entregar una funcionalidad completa.

En uno de mis proyectos conviven la aplicación de usuario, la API, un backoffice y la documentación. Uso un *workspace* de pnpm porque cada parte puede mantener sus responsabilidades y su ciclo de ejecución, pero también porque una funcionalidad rara vez pertenece a una sola carpeta. Puede necesitar un campo nuevo en la base de datos, una migración, una regla de negocio, un endpoint, permisos y una vista para crear, consultar y editar ese dato.

Esa cercanía resulta especialmente valiosa cuando trabajo con IA. En vez de describir de memoria cómo se conectan varios repositorios, el agente puede inspeccionar el modelo, la API y la interfaz que ya existen. No sustituye la decisión de diseño ni la revisión, pero parte de un contexto real y puede seguir el cambio de extremo a extremo.

## El problema no es tener varias aplicaciones

Separar la aplicación de usuario, el backoffice, el backend y la documentación suele ser una decisión sana. Sus audiencias, permisos, despliegues y prioridades no son exactamente los mismos. El problema aparece cuando esa separación obliga a reconstruir el sistema cada vez que llega una funcionalidad transversal.

En repositorios independientes, una tarea aparentemente pequeña puede abrir una cadena de preguntas: ¿en qué repositorio vive el modelo?, ¿qué contrato expone la API?, ¿hay un tipo compartido?, ¿el backoffice ya tiene una pantalla parecida?, ¿dónde se documenta el cambio?, ¿qué repositorios hay que probar y publicar? Nada de esto impide desarrollar, pero aumenta el coste de *discovery* y hace más fácil que una capa evolucione sin las demás.

Un monorepo no elimina las fronteras. Lo que hace es permitir que esas fronteras estén visibles en un único lugar. La estructura puede expresar, por ejemplo, que existen aplicaciones independientes y paquetes compartidos:

```text
apps/
  frontend/
  backoffice/
  api/
  docs/
packages/
  contracts/
  ui/
  config/
```

La forma exacta no es lo importante. En algunos productos no habrá componentes compartidos; en otros, la API no será una aplicación Node.js dentro del repositorio. La cuestión es que cada directorio debe tener una responsabilidad reconocible y que compartir código sea una decisión explícita, no el resultado de importar archivos internos de otra aplicación.

## pnpm aporta un espacio de trabajo, no una excusa para acoplarlo todo

pnpm encaja bien en este modelo porque los *workspaces* declaran qué paquetes forman parte del repositorio y permiten tratarlos como proyectos relacionados. La raíz puede centralizar las herramientas comunes y cada aplicación mantiene sus scripts y dependencias propias.

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

Esto simplifica acciones habituales: instalar de forma coherente, ejecutar un test solo en la aplicación afectada o lanzar una comprobación sobre varios paquetes. También hace más visible qué dependencia pertenece a qué capa. Que una librería esté disponible en el repositorio no significa que deba acabar instalada en el frontend.

La disciplina sigue importando. Conviene evitar un paquete `shared` que acumule cualquier cosa que parezca reutilizable. Un contrato de API, un sistema de diseño y una configuración de lint tienen motivos de cambio distintos; juntarlos solo crea una dependencia difícil de entender. También hay que vigilar que los paquetes compartidos no importen desde las aplicaciones, porque la dirección de la dependencia debería ir desde las aplicaciones hacia los paquetes de propósito definido, no al revés.

## Una funcionalidad es un recorrido, no una colección de tickets

Imaginemos que se añade un dato nuevo que el equipo interno debe gestionar y que después se muestra a una persona usuaria. El cambio puede recorrer varias capas:

```text
esquema y migración
        ↓
reglas de negocio y persistencia
        ↓
endpoint y contrato
        ↓
formulario y listado en backoffice
        ↓
consulta y presentación en frontend
```

Separar este trabajo en subtareas ayuda a planificarlo, pero no cambia que el resultado solo está terminado cuando el recorrido funciona completo. Tener el modelo preparado sin un endpoint, o una pantalla que presupone una respuesta distinta a la de la API, genera un estado intermedio que parece avance pero no entrega valor.

Con las capas en el mismo repositorio es más sencillo descubrir patrones existentes antes de tocar nada. Puede haber ya una entidad con validación, un servicio que delimita permisos, un formulario reutilizable, una tabla de administración y pruebas de integración que señalen la convención. Reutilizar ese recorrido suele ser más valioso que empezar por una solución técnicamente posible desde cero.

## El valor adicional: contexto real para la IA

La IA trabaja peor cuando recibe una tarea aislada del sistema. Una instrucción como «añade un CRUD para este campo» no explica cómo se llaman las entidades, dónde se aplican los permisos, qué formato usan los errores, qué cliente consume la API ni cómo se valida una migración. Cuanto más se rellena ese vacío con suposiciones, mayor es la probabilidad de que genere una implementación que compile localmente pero no encaje en el producto.

En un monorepo, un agente con acceso al código puede recorrer las capas implicadas. Para una funcionalidad de este tipo, puede localizar el esquema de base de datos, buscar una entidad comparable, comprobar cómo se exponen los casos de uso desde la API y revisar las vistas y tests que consumen ese contrato. No necesita que le copie fragmentos de cuatro repositorios ni que adivine qué versión de cada uno está relacionada con la tarea.

Eso permite pedir un trabajo de extremo a extremo de forma mucho más concreta: añadir el campo y su migración, exponerlo por el endpoint adecuado, actualizar el contrato, crear la pantalla de administración y verificar el flujo. La aportación importante no es que la IA escriba todos esos archivos sin supervisión. Es que puede detectar dependencias entre capas, proponer un plan basado en convenciones existentes y dejar el cambio en una condición más fácil de revisar.

El contexto compartido también mejora las preguntas. Un agente puede avisar de que el campo afecta a una exportación, que la API requiere una política de autorización o que el frontend consulta datos mediante un endpoint distinto al esperado. Esas señales son útiles incluso cuando la decisión final es no implementar todavía el cambio.

## La autonomía necesita límites claros

Dar a una IA acceso a más contexto no justifica pedirle cambios amplios sin acotar. Una tarea E2E debe seguir empezando por una definición funcional: qué problema resuelve, qué usuarios pueden utilizarla, cuáles son los estados relevantes y qué queda fuera del alcance. El repositorio explica cómo está construido el sistema; no puede decidir por sí solo qué producto conviene construir.

También conviene mantener verificaciones por capa. Una migración merece revisión porque modifica información persistida. Un endpoint debe comprobar autorización, validación y compatibilidad. Un formulario necesita estados de carga, error y accesibilidad. Y el flujo completo requiere pruebas que confirmen el comportamiento observable, no solo que cada paquete compila por separado.

Una secuencia razonable para trabajar con un agente es esta:

1. Pedirle que investigue el recorrido actual y enumere los paquetes afectados.
2. Revisar el plan y decidir el contrato, permisos y alcance antes de editar.
3. Implementar en cambios pequeños y coherentes, respetando las fronteras entre aplicaciones y paquetes.
4. Ejecutar las validaciones de los paquetes implicados y una prueba integrada del flujo cuando corresponda.
5. Revisar el *diff* como una propuesta: buscar supuestos, cambios laterales y reglas de negocio que no deberían haberse inferido.

La IA acelera el paso entre capas, pero la responsabilidad sobre los datos y el comportamiento sigue siendo del equipo. De hecho, cuanto más fácil es modificar varias aplicaciones de una vez, más importante resulta que el alcance esté bien definido.

## Cuándo no elegiría este modelo

Un monorepo tiene coste. Las herramientas de build, CI y control de dependencias necesitan una configuración cuidadosa. Si las aplicaciones no comparten cadencia, equipo ni cambios frecuentes, un repositorio común puede añadir coordinación sin aportar suficiente valor. Tampoco resuelve por sí mismo el versionado de paquetes públicos o la necesidad de aislar permisos entre organizaciones.

Por eso no elegiría un monorepo solo para seguir una tendencia o porque la IA pueda leer más archivos. Lo elegiría cuando las aplicaciones representan partes del mismo producto, se modifican de forma coordinada y compartir el contexto reduce errores reales de entrega.

## Conclusión

La mejor razón para usar un monorepo no es almacenar más código en una única raíz. Es hacer visibles los recorridos que ya existen entre aplicaciones, contratos y datos. pnpm ayuda a organizar ese espacio de trabajo sin fingir que frontend, API y backoffice son la misma aplicación.

Para mí, ese beneficio es aún más evidente al trabajar con IA. Tener todas las capas relevantes disponibles permite pasar de una petición vaga a una investigación verificable del cambio completo: base de datos, reglas, endpoint y vista. El agente gana contexto; el equipo gana una propuesta más conectada con el sistema real. La arquitectura sigue necesitando límites y revisión, pero deja de depender tanto de que alguien recuerde manualmente dónde vive cada pieza.
