# US — Mejora de navegación y visualización de series de posts

## Contexto

Actualmente, los artículos que pertenecen a una serie muestran en la cabecera un componente lateral con el título `EN ESTA SERIE`, una breve descripción y el listado completo de artículos publicados dentro de dicha serie.

Este enfoque funciona correctamente cuando la serie contiene pocos artículos, pero presenta problemas de escalabilidad y jerarquía visual a medida que aumenta el número de publicaciones.

Se han detectado principalmente los siguientes problemas:

- El componente de serie no queda correctamente alineado con la parte superior del contenido editorial de la cabecera.
- El listado completo crece verticalmente con cada nuevo artículo.
- A partir de aproximadamente 5 artículos, el componente empieza a competir visualmente con el título y la información principal del post.
- Mostrar todos los artículos convierte progresivamente un componente de navegación contextual en un índice completo.
- El componente superior y el bloque de artículos relacionados situado al final del post deben mantener responsabilidades diferentes:

  - la serie representa una navegación secuencial;
  - los artículos relacionados representan descubrimiento temático.

La solución debe permitir que una serie pueda crecer a 10, 20 o más artículos sin que el diseño del post tenga que modificarse.

---

## Historia de usuario

**Como lector de un artículo perteneciente a una serie**,
quiero identificar rápidamente que estoy dentro de una serie, conocer mi posición dentro de ella y poder navegar al artículo anterior o siguiente,
para continuar la lectura de forma natural sin que un listado extenso interfiera con el contenido principal.

---

## Objetivo

Transformar el componente actual de series desde un **listado completo de artículos** hacia un componente de **navegación contextual de serie**.

El componente deberá responder principalmente a estas preguntas:

1. ¿A qué serie pertenece este artículo?
2. ¿Qué posición ocupa dentro de la serie?
3. ¿Cuál es el artículo anterior?
4. ¿Cuál es el siguiente?
5. ¿Cómo puedo acceder al índice completo de la serie?

---

# Diseño funcional

## Cabecera del componente

Sustituir el actual:

```text
EN ESTA SERIE

Una guía práctica para construir una suite
de tests rápida, realista y mantenible en Vue 3.
```

por una cabecera con mayor identidad editorial.

Ejemplo:

```text
SERIE · TESTING EN VUE

Artículo 6 de 8

Una guía práctica para construir una suite
de tests rápida, realista y mantenible.
```

### Requisitos

El componente deberá poder mostrar:

- nombre de la serie;
- posición del artículo actual;
- número total de artículos de la serie;
- descripción breve de la serie, cuando exista.

Ejemplo:

```text
SERIE · TESTING EN VUE
6 de 8
```

El nombre de la serie deberá ser independiente de la categoría del artículo.

---

# Navegación

## Eliminar el listado completo de artículos

No se deberá mostrar en la cabecera del post el listado completo de artículos de la serie.

El componente deberá mostrar exclusivamente navegación contextual.

### Artículo intermedio

```text
SERIE · TESTING EN VUE
6 de 8

← ANTERIOR
10 errores comunes al testear aplicaciones Vue

SIGUIENTE →
Arquitectura de una suite de testing

Ver la serie completa →
```

No es necesario repetir el título del artículo actual dentro del componente, ya que el `h1` principal de la página ya proporciona esa información.

Esto reduce duplicidad visual y da prioridad a las acciones de navegación.

---

## Primer artículo de la serie

Cuando el usuario se encuentre en el primer artículo no deberá reservarse espacio para un artículo anterior inexistente.

Ejemplo:

```text
SERIE · TESTING EN VUE
1 de 8

SIGUIENTE →
MSW en Vue 3: mocks de API fiables

Ver la serie completa →
```

---

## Último artículo de la serie

Cuando el usuario se encuentre en el último artículo no deberá mostrarse navegación siguiente.

Ejemplo:

```text
SERIE · TESTING EN VUE
8 de 8

← ANTERIOR
Principios FIRST aplicados a testing

Ver la serie completa →
```

---

## Serie con un único artículo

Si una serie contiene temporalmente un único artículo:

```text
SERIE · TESTING EN VUE
1 de 1

Ver la serie completa →
```

No deberán renderizarse controles vacíos de anterior o siguiente.

---

# Página de la serie

El listado completo de artículos debe trasladarse a una página específica de la serie.

Ejemplo de URL:

```text
/blog/series/testing-vue/
```

La página deberá actuar como índice y punto de entrada a toda la serie.

## Contenido mínimo

```text
Testing en Vue

Una guía práctica para construir una suite de tests
rápida, realista y mantenible.

1. Tests rápidos con Vitest
2. MSW en Vue 3
3. Testing Library en Vue
4. Fixtures, factories y handlers de MSW
5. 10 errores comunes al testear aplicaciones Vue
6. Tus tests pasan, pero ¿son buenos? Principios FIRST
7. ...
8. ...
```

Los artículos deberán aparecer en su orden editorial y no por fecha de publicación.

---

# Posicionamiento del componente

## Desktop

Actualmente el componente aparece demasiado desplazado verticalmente respecto al inicio de la cabecera.

Debe alinearse con la parte superior del bloque editorial principal.

La referencia visual será aproximadamente la etiqueta:

```text
TESTING Y CALIDAD
```

El comienzo de la tarjeta de serie deberá quedar alineado con esta zona o ligeramente por encima.

No debe alinearse con la mitad del `h1`.

Conceptualmente:

```text
                         ┌─────────────────────┐
TESTING Y CALIDAD        │ SERIE · TESTING... │
                         │ 6 de 8              │
Título del artículo      │                     │
                         │ ← ANTERIOR          │
Descripción              │ ...                 │
                         │                     │
Autor / fecha            │ SIGUIENTE →         │
Tags                     │ ...                 │
                         │                     │
                         │ Ver serie →         │
                         └─────────────────────┘
```

---

# Responsive

## Desktop

Mantener el componente como sidebar dentro de la cabecera del artículo.

Deberá tener una altura determinada por su contenido y no por la altura del bloque principal.

No debe utilizar una altura fija diseñada para contener un determinado número de artículos.

---

## Tablet

Si el espacio horizontal no permite mantener correctamente la composición de dos columnas, el componente deberá pasar debajo de la información principal del artículo.

---

## Mobile

En móvil deberá priorizarse una versión compacta.

Ejemplo:

```text
SERIE · TESTING EN VUE
6 de 8

← Anterior          Siguiente →

Ver serie completa
```

Los títulos de anterior y siguiente podrán mostrarse si existe espacio suficiente, pero deberá evitarse generar un bloque excesivamente alto.

Se priorizará:

1. posición dentro de la serie;
2. navegación;
3. acceso a la serie completa.

---

# Comportamiento de los enlaces

Los enlaces deberán ser enlaces HTML reales y rastreables.

Utilizar:

```html
<a href="..."></a>
```

y evitar implementar la navegación únicamente mediante eventos JavaScript.

Los textos de enlace deberán ser descriptivos.

Preferir:

```text
10 errores comunes al testear aplicaciones Vue
```

frente a enlaces genéricos como:

```text
Anterior
```

La etiqueta `Anterior` o `Siguiente` puede actuar como elemento visual, pero el título del artículo deberá formar parte del enlace.

---

# Modelo de datos

La implementación debe permitir conocer el orden de los artículos dentro de cada serie.

Una posible estructura sería:

```yaml
series:
  slug: testing-vue
  title: Testing en Vue
  description: Una guía práctica para construir una suite de tests rápida, realista y mantenible.
  order: 6
```

Ejemplo de frontmatter:

```yaml
---
title: "Tus tests pasan, pero ¿son buenos? Cómo aplicar los principios FIRST"
series:
  slug: testing-vue
  order: 6
---
```

La información general de la serie puede centralizarse para evitar duplicarla en todos los artículos.

Por ejemplo:

```ts
{
  slug: 'testing-vue',
  title: 'Testing en Vue',
  description:
    'Una guía práctica para construir una suite de tests rápida, realista y mantenible.'
}
```

---

# Orden de los artículos

El orden de una serie debe depender explícitamente de `series.order`.

No debe inferirse mediante:

- fecha de publicación;
- nombre del fichero;
- orden alfabético;
- posición devuelta por la colección de Astro.

Ejemplo:

```text
order: 1
order: 2
order: 3
...
```

El componente deberá ordenar los artículos por este valor antes de calcular anterior y siguiente.

---

# Cálculo de navegación

A partir de los artículos pertenecientes a una serie:

```ts
const posts = seriesPosts.sort(
  (a, b) => a.data.series.order - b.data.series.order,
);
```

obtener:

```ts
const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;

const nextPost =
  currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined;
```

La posición mostrada al usuario será:

```ts
currentIndex + 1;
```

y el total:

```ts
posts.length;
```

---

# Accesibilidad

El componente debe implementarse como navegación semántica.

Ejemplo:

```html
<nav aria-label="Navegación de la serie Testing en Vue"></nav>
```

Los enlaces anterior y siguiente deberán ser utilizables mediante teclado.

El estado actual no debe depender exclusivamente del color.

Debe mantenerse contraste suficiente para:

- texto;
- labels;
- enlaces;
- estados `hover`;
- estados `focus-visible`.

El indicador:

```text
6 de 8
```

debe mantenerse como texto visible y no únicamente como recurso gráfico.

---

# SEO

La navegación debe reforzar la relación semántica entre los artículos de una misma serie.

Cada artículo deberá enlazar como mínimo a:

- artículo anterior, cuando exista;
- artículo siguiente, cuando exista;
- página principal de la serie.

La página de serie deberá enlazar a todos los artículos que la componen.

La estructura resultante será:

```text
                   Página de serie
                         │
       ┌─────────┬───────┼───────┬─────────┐
       ↓         ↓       ↓       ↓         ↓
     Post 1 → Post 2 → Post 3 → Post 4 → Post 5
```

La página de serie actuará como hub temático mientras que los enlaces anterior/siguiente reforzarán el recorrido secuencial.

---

# Separación respecto a artículos relacionados

Debe mantenerse el componente existente situado al final de los artículos:

```text
Más artículos sobre Testing y calidad
```

No debe sustituirse por la navegación de serie.

Ambos componentes tienen objetivos diferentes.

### Serie

Relaciona artículos mediante un orden editorial:

```text
Anterior → Actual → Siguiente
```

### Artículos relacionados

Relaciona contenidos por afinidad temática:

```text
Artículo
 ├─ relacionado A
 ├─ relacionado B
 └─ relacionado C
```

No deben mezclarse ambos conceptos.

---

# Criterios de aceptación

- [ ] El componente de serie deja de mostrar el listado completo de artículos.
- [ ] Se muestra el nombre de la serie.
- [ ] Se muestra la posición del artículo actual.
- [ ] Se muestra el número total de artículos.
- [ ] Se muestra el artículo anterior cuando existe.
- [ ] Se muestra el artículo siguiente cuando existe.
- [ ] No se muestran espacios o controles vacíos cuando anterior o siguiente no existen.
- [ ] El título del artículo actual no se repite innecesariamente dentro del componente.
- [ ] Existe un enlace para acceder al índice completo de la serie.
- [ ] Los artículos se ordenan mediante un campo explícito `series.order`.
- [ ] El componente queda alineado en desktop con la parte superior de la cabecera editorial.
- [ ] El componente no aumenta significativamente de tamaño aunque la serie tenga muchos artículos.
- [ ] Existe una presentación adaptada para tablet y móvil.
- [ ] Los enlaces utilizan elementos `<a>` reales.
- [ ] La navegación es accesible mediante teclado.
- [ ] El componente dispone de un `aria-label` descriptivo.
- [ ] El estado visual no depende exclusivamente del color.
- [ ] Se mantiene el bloque de artículos relacionados del final del post.
- [ ] La navegación de serie y los artículos relacionados mantienen responsabilidades independientes.

---

# Casos de prueba

## Serie de 8 artículos — artículo 4

Debe mostrarse:

```text
4 de 8

Anterior → artículo 3
Siguiente → artículo 5
Ver serie completa
```

---

## Primer artículo

Debe mostrarse:

```text
1 de 8

Siguiente → artículo 2
Ver serie completa
```

No debe existir navegación anterior.

---

## Último artículo

Debe mostrarse:

```text
8 de 8

Anterior → artículo 7
Ver serie completa
```

No debe existir navegación siguiente.

---

## Serie de un artículo

Debe mostrarse:

```text
1 de 1

Ver serie completa
```

No deben aparecer anterior ni siguiente.

---

## Serie de 20 artículos

El componente deberá mantener prácticamente la misma altura que para una serie de 5 artículos.

Este caso es especialmente importante para validar que la solución realmente escala.

---

# Fuera de alcance

Esta US no contempla:

- modificar el contenido editorial de los artículos existentes;
- eliminar o rediseñar el componente de artículos relacionados;
- crear recomendaciones automáticas basadas en tags;
- modificar categorías del blog;
- introducir paginación general del blog;
- cambiar las URLs actuales de los artículos;
- modificar el diseño general del hero del artículo más allá de la alineación necesaria para integrar correctamente el componente.

---

# Resultado esperado

El componente debe dejar de funcionar como un índice completo incrustado en cada post y convertirse en una navegación editorial ligera y escalable.

La experiencia final debe dejar claro:

```text
Estoy leyendo un artículo de una serie.
Estoy en el 6 de 8.
Puedo continuar con el siguiente.
Puedo volver al anterior.
Y puedo consultar la serie completa cuando quiera.
```

Esto permite que las series crezcan sin degradar la cabecera de los artículos y mantiene claramente separadas la **navegación secuencial** y la **recomendación temática**.
