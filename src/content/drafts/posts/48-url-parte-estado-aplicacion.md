---
title: "La URL es parte del estado de tu aplicación"
description: "Qué estado de una interfaz conviene representar en la URL y cómo sincronizar filtros, búsquedas, paginación y pestañas con Vue Router sin duplicar fuentes de verdad."
date: 2027-01-26
tags: [Vue, Vue Router, URL, estado, navegación, UX, arquitectura]
category: Arquitectura
image:
  src: /images/blog/48-url-parte-estado-aplicacion/url-estado-aplicacion.png
  alt: Ilustración de una ruta plegada que conecta búsqueda, filtro, ordenación, paginación y pestañas con la misma vista de una aplicación.
  width: 1536
  height: 1024
---

Una lista de pedidos muestra solo los pendientes, ordenados por fecha y en la tercera página. Una persona copia la dirección, recarga el navegador o comparte el enlace con soporte. Si al abrirlo la aplicación vuelve a mostrar la primera página con todos los pedidos, la interfaz no ha conservado una vista que era relevante para completar una tarea. Ha guardado su estado en el lugar equivocado.

La URL no es un sustituto de toda la gestión de estado. Hay datos que pertenecen a un componente, a una store o a la sesión actual. Sin embargo, cuando un valor define una vista que una persona debe poder recuperar, recorrer con atrás y adelante, marcar como favorita o compartir, la URL forma parte natural de su contrato. Filtros, ordenación, paginación, pestañas, búsquedas y, en algunos casos, una selección concreta suelen encajar en esa categoría.

Tratarlo así mejora más que los enlaces. Obliga a decidir qué significa una pantalla, evita que Pinia y el router discrepen sobre la vista activa y ofrece un punto de partida estable para soporte, analítica y pruebas. La pregunta útil no es «¿puedo serializar este valor?», sino «¿cambiar este valor cambia una vista navegable del producto?».

## Una vista reproducible es una propiedad de producto

Imagina una bandeja de incidencias con filtros por equipo y severidad, una búsqueda, una ordenación y paginación. El resultado no es solo la ruta `/incidencias`: es la combinación de esos criterios. Si esa combinación importa a quien usa la aplicación, una dirección como esta describe una vista concreta sin depender de que siga viva una instancia de Vue o de que exista una store previamente hidratada:

```text
/incidencias?equipo=pagos&severidad=alta&orden=recientes&pagina=3&q=duplicado
```

Esto aporta cuatro comportamientos que las personas ya esperan del navegador:

- **Deep links:** abrir un enlace lleva directamente a la vista relevante.
- **Recuperación:** una recarga, una pestaña nueva o una restauración de sesión no borran el contexto de trabajo.
- **Historial:** atrás y adelante recorren cambios de vista que merecen ser recorridos.
- **Compartir:** producto, soporte y desarrollo pueden hablar de la misma pantalla sin reconstruirla manualmente.

No todos los cambios deben crear una entrada de historial. Escribir cada letra en una búsqueda no suele justificar que el botón Atrás atraviese todas las pulsaciones. En cambio, aplicar un filtro, abrir una pestaña que cambia el contenido principal o ir a la página siguiente sí suelen representar una navegación. La semántica del gesto determina si se usa `router.push` o `router.replace`, no la comodidad de una implementación concreta. Vue Router conserva una entrada nueva con `push` y sustituye la actual con `replace`.[^vue-router-navigation]

## Distingue estado de vista, estado de interfaz y estado de dominio

La URL tiene costes: está expuesta, debe ser compacta, llega como texto y puede modificarse a mano. Por eso conviene clasificar el estado antes de añadir parámetros.

| Tipo de estado             | Ejemplos                                                     | Ubicación habitual               |
| -------------------------- | ------------------------------------------------------------ | -------------------------------- |
| Estado de vista navegable  | filtros, orden, página, búsqueda aplicada, pestaña principal | ruta, parámetros y `query`       |
| Estado efímero de interfaz | menú desplegado, foco, animación, texto sin confirmar        | componente o composable          |
| Estado de dominio o sesión | permisos, token, carrito en edición, datos cargados          | servidor, store o caché de datos |

La frontera no depende solo del nombre del control. Una pestaña que alterna entre «Resumen» y «Actividad» dentro de un detalle puede merecer un parámetro porque cambia el contenido que se está consultando. Un selector abierto para elegir una etiqueta no: es un detalle temporal de la interacción. Del mismo modo, una fila seleccionada puede ir en la URL si abre un panel lateral que alguien puede enlazar, por ejemplo `?incidencia=INC-482`; la selección momentánea para ejecutar una acción masiva normalmente no.

Esta clasificación evita dos extremos. El primero es esconder en Pinia toda decisión de interfaz por defecto y perder la posibilidad de reconstruir una vista. El segundo es convertir la URL en un volcado de la memoria de la aplicación, con flags internos, objetos JSON y datos que no deberían salir del proceso.

## Diseña un contrato pequeño y legible

Una URL es una interfaz pública, aunque solo se use dentro de una intranet. Nombra los parámetros de forma estable, conserva valores por defecto fuera de la dirección y define qué entradas son válidas. Por ejemplo, una pantalla de catálogo puede declarar este contrato:

| Parámetro | Valores válidos       | Ausencia en la URL |
| --------- | --------------------- | ------------------ |
| `q`       | texto de búsqueda     | sin búsqueda       |
| `estado`  | `activo`, `archivado` | todos              |
| `orden`   | `recientes`, `nombre` | `recientes`        |
| `pagina`  | entero positivo       | `1`                |
| `vista`   | `tabla`, `tarjetas`   | `tabla`            |

No hace falta representar los valores por defecto. `/catalogo` es más fácil de leer, compartir y mantener que `/catalogo?orden=recientes&pagina=1&vista=tabla`. El código debe interpretar su ausencia como el valor acordado y eliminar un parámetro cuando la persona vuelve a ese valor.

También importa que la URL no sea la autoridad para datos sensibles ni para reglas de negocio. Un parámetro como `cliente=42` puede seleccionar una vista, pero el servidor debe volver a comprobar que la persona autenticada puede ver ese cliente. Un permiso, un precio negociado, una dirección o un token no son candidatos para `query`: además de aparecer en el historial, pueden acabar en marcadores, registros, cabeceras de referencia o capturas de pantalla.

## Parsear primero evita que el componente trate texto como estado válido

En Vue Router, `route.query` describe valores procedentes de la URL. Un campo puede ser una cadena, una lista o estar ausente, de modo que no conviene usarlo como si fuera directamente el modelo de la vista.[^vue-router-route] Centralizar la conversión permite que el resto del componente trabaje con tipos y valores por defecto previsibles.

```ts
// catalog-query.ts
import type { LocationQuery, LocationQueryRaw } from "vue-router";

export type CatalogViewState = {
  query: string;
  status: "active" | "archived" | undefined;
  sort: "recent" | "name";
  page: number;
  view: "table" | "cards";
};

function firstValue(
  value: string | string[] | null | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseCatalogQuery(query: LocationQuery): CatalogViewState {
  const status = firstValue(query.estado);
  const sort = firstValue(query.orden);
  const view = firstValue(query.vista);

  return {
    query: firstValue(query.q) ?? "",
    status: status === "active" || status === "archived" ? status : undefined,
    sort: sort === "name" ? "name" : "recent",
    page: positiveInteger(firstValue(query.pagina), 1),
    view: view === "cards" ? "cards" : "table",
  };
}

export function serializeCatalogQuery(
  state: CatalogViewState,
): LocationQueryRaw {
  return {
    q: state.query || undefined,
    estado: state.status,
    orden: state.sort === "recent" ? undefined : state.sort,
    pagina: state.page === 1 ? undefined : String(state.page),
    vista: state.view === "table" ? undefined : state.view,
  };
}
```

Este módulo no debe conocer cómo se renderiza la lista ni qué petición HTTP la carga. Su única responsabilidad es traducir entre el contrato público y un estado de vista fiable. Por eso es fácil de probar con entradas ausentes, repetidas o malformadas, y también es el lugar adecuado para decidir si un valor inválido se normaliza silenciosamente o provoca una redirección canónica.

## Una sola fuente de verdad, no dos estados sincronizados

Un error común es mantener `selectedStatus`, `currentPage` y `search` en `ref`, repetirlos en una store y tratar de sincronizarlos después con `route.query`. La aplicación acaba con varias autoridades que pueden actualizarse en distinto orden. Una navegación con Atrás cambia la ruta, pero quizá no la store; una restauración de Pinia recupera una búsqueda que la URL ya no representa.

Para una vista de catálogo, la ruta puede ser la fuente de verdad y el estado tipado puede derivarse de ella. La vista pide datos a partir de ese valor derivado y los controles navegan actualizando la URL.

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  parseCatalogQuery,
  serializeCatalogQuery,
} from "@/features/catalog/catalog-query";

const route = useRoute();
const router = useRouter();

const viewState = computed(() => parseCatalogQuery(route.query));

async function changePage(page: number) {
  await router.push({
    query: serializeCatalogQuery({ ...viewState.value, page }),
  });
}

async function applyFilters(status: "active" | "archived" | undefined) {
  await router.push({
    query: serializeCatalogQuery({ ...viewState.value, status, page: 1 }),
  });
}
</script>
```

Restablecer `page` al cambiar un filtro no es un detalle del router: es una regla de producto. La página 7 de «todos» puede no existir para «archivados». Tenerla junto a la transición hace que la decisión sea visible y evita resultados vacíos difíciles de explicar.

Si otra parte de la aplicación necesita conocer la vista, puede leer la ruta o consumir un composable que exponga `viewState` y acciones de navegación. Pinia sigue siendo útil para estado compartido que no representa una navegación, como preferencias locales, datos de sesión o una caché coordinada. Lo importante es que no guarde una segunda copia editable de la misma consulta.

## `push` y `replace` expresan una decisión de historial

Usar siempre `push` hace que Atrás sea ruidoso; usar siempre `replace` elimina puntos de retorno útiles. Una regla práctica es diferenciar el cambio confirmado de la edición continua.

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  parseCatalogQuery,
  serializeCatalogQuery,
} from "@/features/catalog/catalog-query";

const route = useRoute();
const router = useRouter();
const input = ref(parseCatalogQuery(route.query).query);

watch(
  () => route.query.q,
  () => {
    input.value = parseCatalogQuery(route.query).query;
  },
);

async function updateSearchWhileTyping() {
  const current = parseCatalogQuery(route.query);

  await router.replace({
    query: serializeCatalogQuery({ ...current, query: input.value, page: 1 }),
  });
}

async function submitSearch() {
  const current = parseCatalogQuery(route.query);

  await router.push({
    query: serializeCatalogQuery({ ...current, query: input.value, page: 1 }),
  });
}
</script>
```

En una interfaz real conviene aplicar _debounce_ a la actualización mientras se escribe para no navegar ni lanzar una petición por cada pulsación. Aun así, el ejemplo muestra una distinción importante: `replace` mantiene la URL al día sin convertir el historial en un registro de tecleo; `push` deja una entrada cuando la persona confirma una nueva búsqueda. El contrato puede ser distinto en otro producto, pero debería ser una decisión explícita y comprobable.

Hay un matiz: si `replace` ya ha sustituido la entrada actual antes de enviar el formulario, un `push` con exactamente la misma consulta no crea una frontera histórica nueva de forma útil. Algunas interfaces prefieren actualizar la dirección solo al enviar; otras actualizan mientras se escribe y aceptan que la búsqueda final forme parte de la entrada actual. Elige la opción que haga predecible el botón Atrás, no una regla universal.

## Qué no conviene serializar

Que un valor pueda convertirse a texto no significa que deba aparecer en una URL. Evita incluir:

- secretos, tokens, datos personales o información que no deba quedar en historial y registros;
- objetos grandes, filtros internos de implementación o estados con versiones difíciles de compatibilizar;
- datos que ya se pueden resolver por un identificador estable;
- estados efímeros como foco, `hover`, un modal abierto para una acción puntual o el progreso de una animación;
- una selección masiva cuya intención es ejecutar una operación local y no una vista enlazable.

Tampoco conviene usar la URL para transportar toda la respuesta de una API. Si una ruta necesita un pedido, debe contener un identificador como `/pedidos/123` o `?pedido=123`; la aplicación y el servidor recuperan el recurso y aplican permisos. El enlace expresa qué se está mirando, no duplica el dominio.

En ocasiones un filtro complejo necesita persistirse. Antes de codificar JSON comprimido en `query`, valora guardar una búsqueda en el servidor y compartir un identificador opaco, por ejemplo `/informes/guardados/8cf2`. La dirección sigue siendo reproducible, pero el contrato se mantiene pequeño y permite evolucionar el formato sin romper enlaces existentes.

## Prueba el comportamiento que la URL promete

La sincronización no se valida solo comprobando que una función llama a `router.push`. El contrato real incluye cargar la ruta, modificar controles, usar atrás y recargar. Una prueba de componente puede verificar que una URL inicial produce la consulta adecuada y que una interacción genera el `query` esperado. Una prueba de navegador completa debería cubrir al menos el flujo que importa para la persona usuaria:

1. abrir un enlace con filtros y página;
2. comprobar que la lista y los controles reflejan esa vista;
3. cambiar un filtro y verificar que vuelve a la primera página;
4. pulsar Atrás y recuperar la vista anterior;
5. recargar y confirmar que sigue siendo reproducible.

Estas pruebas encuentran problemas que suelen escapar a un test aislado: parámetros que se pierden al actualizar uno solo, páginas que no se reinician, valores inválidos que rompen la pantalla o una store que conserva información anterior a la ruta. Son regresiones de navegación, no meros detalles de serialización.

## La URL también aclara los límites de la arquitectura

Representar el estado navegable en la URL no elimina las stores ni simplifica mágicamente una interfaz compleja. Sí obliga a separar tres responsabilidades que a menudo se mezclan: interpretar una ruta externa, navegar hacia otra vista y mantener datos o interacción que no deben navegarse. Esa separación reduce sincronizaciones accidentales y hace que cada capa tenga una autoridad reconocible.

Una regla práctica ayuda a decidir: si alguien espera poder recargar, compartir o volver a una vista sin tener que reconstruirla, su estado merece considerarse parte de la URL. Empieza por filtros, ordenación, paginación, pestañas y búsquedas; añade selección solo cuando identifica una vista concreta. El resultado es una aplicación que no solo recuerda lo que estaba mostrando: puede explicarlo con un enlace.

[^vue-router-navigation]: [Vue Router, «Programmatic Navigation»](https://router.vuejs.org/guide/essentials/navigation.html).

[^vue-router-route]: [Vue Router, «Dynamic Route Matching with Params»](https://router.vuejs.org/guide/essentials/dynamic-matching.html).
