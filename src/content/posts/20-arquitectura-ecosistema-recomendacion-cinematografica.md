---
title: "Arquitectura de un ecosistema de recomendación cinematográfica: app, contenido e IA"
description: "Cómo separar una aplicación de recomendaciones y una plataforma editorial automatizada, compartir servicios y usar IA con controles técnicos y revisión humana."
date: 2026-08-06
tags: [arquitectura, Vue, Astro, Supabase, IA, automatización, cine]
category: Arquitectura
---

Una recomendación cinematográfica parece un problema sencillo hasta que se mira el sistema completo. Una persona quiere saber qué ver hoy según sus gustos, el catálogo disponible en su país y el tiempo que tiene. Al mismo tiempo, necesita contexto: críticas, noticias o fichas que le ayuden a decidir. Resolver ambas necesidades dentro de una única aplicación suele mezclar dos ritmos de trabajo muy distintos: la interacción de producto y la publicación de contenido.

Este artículo presenta la arquitectura de **Qué Veo Ahora**, un ecosistema compuesto por dos proyectos con responsabilidades claras:

- **que-veo-hoy**, una aplicación para descubrir películas, aplicar filtros y guardar recomendaciones.
- **queveoahora-content**, una plataforma editorial que genera y publica contenido cinematográfico de forma automatizada.

No es una receta para replicar literalmente. Es un caso de estudio sobre cómo delimitar responsabilidades, compartir servicios sin crear dependencia excesiva y usar IA como parte de un flujo verificable.

## El problema: recomendar y publicar son productos diferentes

La aplicación de recomendaciones necesita responder rápido a decisiones concretas: «quiero una película de menos de dos horas», «qué hay disponible en mi plataforma» o «sorpréndeme». Sus datos son dinámicos, dependen de servicios externos y, en el caso de funcionalidades sociales, están vinculados a una identidad de usuario.

La plataforma de contenido opera de otra manera. Trabaja con lotes, planificación editorial, calidad de textos, indexación y despliegues. Su principal salida no es una pantalla transaccional, sino páginas estáticas que deben ser legibles, rastreables y fáciles de mantener.

Forzar ambos contextos en el mismo repositorio y el mismo modelo de despliegue añadiría acoplamiento accidental. Una decisión editorial podría afectar al ciclo de publicación de la aplicación; un cambio en autenticación podría complicar la generación de artículos. La separación permite optimizar cada proyecto para su objetivo sin perder una visión común del producto.

```text
                         APIs externas
              ┌───────────┼────────────┐
              │           │            │
            TMDB    disponibilidad   OpenAI
              │           │            │
              └──────┬────┴─────┬──────┘
                     │          │
          ┌──────────▼───┐  ┌───▼────────────────┐
          │ que-veo-hoy │  │ queveoahora-content │
          │ App Vue     │  │ Monorepo con Astro  │
          └──────┬──────┘  └─────────┬───────────┘
                 │                   │
                 └───────┬───────────┘
                         ▼
              Supabase y datos comunes
```

El esquema no implica que todos los datos deban compartirse. Compartir una base de datos o una API tiene sentido para entidades que representan el mismo concepto —por ejemplo, metadatos de una película o valoraciones—, no como atajo para acceder a cualquier dato desde cualquier parte.

## La aplicación: una frontera clara entre dominio, infraestructura e interfaz

`que-veo-hoy` se plantea como una aplicación Vue 3 con TypeScript y Vite. El núcleo se organiza siguiendo Clean Architecture:

```text
src/
├── domain/          # Reglas de negocio y contratos
├── infrastructure/  # Adaptadores para APIs y persistencia
└── presentation/    # Vistas, componentes y estado de Vue
```

La dirección de las dependencias importa más que los nombres de las carpetas. El dominio expresa qué necesita la aplicación: buscar películas, obtener proveedores de streaming o guardar un favorito. Infraestructura implementa esos contratos mediante TMDB, Supabase u otro proveedor. La capa de presentación coordina la interacción de la persona usuaria sin conocer detalles de HTTP, claves de API o formatos de respuestas externas.

Por ejemplo, un contrato del dominio puede ser deliberadamente pequeño:

```ts
export interface MovieService {
  getPopularMovies(page?: number): Promise<MoviePage>;
  getWatchProviders(movieId: number, country: string): Promise<WatchProvider[]>;
}
```

El adaptador de TMDB traduce ese contrato a solicitudes HTTP. Si la API devuelve campos adicionales o cambia la forma de una respuesta, el cambio queda acotado en infraestructura. A la vista le llega un modelo que entiende, no una respuesta remota sin tratar.

```ts
export class TmdbMovieService implements MovieService {
  constructor(private readonly apiKey: string) {}

  async getWatchProviders(movieId: number, country: string) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${this.apiKey}`,
    );
    const data = await response.json();

    return data.results[country]?.flatrate ?? [];
  }
}
```

El código anterior es intencionadamente incompleto como cliente de producción: faltan validación de respuesta, gestión de errores, cancelación y una estrategia para no exponer secretos en el navegador. Su objetivo es mostrar dónde debe vivir la integración, no convertir una llamada directa a una API en una abstracción mágica.

### Funcionalidades guiadas por casos de uso

Los filtros por género, plataforma y duración; la detección de país; y una acción como «Sorpréndeme» pueden modelarse como casos de uso. Cada uno combina reglas de negocio y fuentes de datos, pero no debería estar repartido entre componentes visuales.

Esta separación también prepara el terreno para funciones sociales: lista pública de películas vistas, recomendaciones entre amistades o notificaciones. Con Supabase, autenticación, PostgreSQL, almacenamiento y eventos en tiempo real pueden convivir bajo el mismo servicio, pero hay que mantener los límites de seguridad. Las políticas de _Row-Level Security_ deben decidir qué puede leer o modificar cada usuario; la interfaz no debe ser la única barrera.

## Calidad: probar las decisiones antes que los detalles internos

Una arquitectura por capas facilita las pruebas porque las dependencias externas se pueden sustituir en el borde. El dominio puede probarse con implementaciones falsas del contrato. Los componentes Vue se prueban desde el comportamiento observable: los filtros que ve la persona usuaria, el estado de carga o el mensaje cuando no hay resultados.

Vitest y Testing Library son una combinación adecuada para este nivel. Para las integraciones HTTP, MSW permite representar respuestas de catálogo, errores de red o proveedores no disponibles sin que la suite dependa de una API externa. La regla útil no es perseguir un porcentaje de cobertura aislado: es cubrir los caminos que cambiarían la decisión de producto o que pueden romper una experiencia esencial.

El control se completa en el repositorio con formateo, linting, validación de tipos y CI. Los _hooks_ y los commits convencionales ayudan a mantener una historia legible, pero no sustituyen una revisión que cuestione la decisión y el impacto en la persona usuaria.

## La plataforma editorial: monorepo orientado a automatización

El segundo proyecto tiene una naturaleza distinta. `queveoahora-content` se estructura como monorepo para aislar el sitio de publicación, la interfaz de línea de comandos y el motor de generación:

```text
queveoahora-content/
├── apps/
│   └── blog/          # Sitio Astro
├── packages/
│   ├── cli/           # Comandos de automatización
│   └── generator/     # Orquestación y generación con IA
└── features/          # Capacidades en evolución
```

Astro y Content Collections encajan bien en el blog porque el contenido se valida mediante un esquema y se publica como sitio estático. El generador no necesita modificar componentes del sitio para añadir un artículo: produce una entrada que cumple el contrato editorial. Esto reduce el riesgo de que una ejecución automática introduzca una ruta rota o metadatos incompletos.

La CLI proporciona un punto de entrada explícito para las automatizaciones. Un flujo programado puede consultar estrenos, seleccionar candidatos, generar borradores, validarlos y construir el sitio. Cada paso debe poder ejecutarse también de forma local y dejar trazabilidad suficiente para investigar un fallo.

## Generar contenido con IA sin delegar el criterio

La generación de críticas a partir de metadatos de películas no consiste solo en enviar un título a un modelo. El sistema debe conservar el origen de los datos, imponer una estructura de salida y validar lo que recibe antes de publicarlo. Un prompt puede definir secciones como sinopsis sin _spoilers_, actuaciones, dirección y valoración, pero esa estructura no convierte el resultado en fiable por sí misma.

Un flujo más seguro se parece a este:

1. Obtener la ficha de la película desde una fuente de catálogo.
2. Preparar un contexto limitado a datos verificables y una plantilla editorial.
3. Pedir al modelo un borrador con una salida estructurada.
4. Comprobar campos obligatorios, longitud, enlaces, duplicados y metadatos SEO.
5. Enviar a revisión humana los casos que no superen las reglas o que tengan señales de baja confianza.
6. Publicar solo contenido validado y reconstruir el sitemap.

La IA acelera la redacción y las tareas repetitivas; no reemplaza la supervisión editorial. Es especialmente importante evitar que rellene huecos con detalles no comprobados sobre el reparto, la trama o la disponibilidad en plataformas. Cuando faltan datos, la opción correcta es omitirlos o detener el flujo, no inventarlos con un tono convincente.

## Integración entre ambos productos: contratos, no accesos directos

Los dos proyectos pueden compartir Supabase, fuentes de catálogo y eventos relacionados con películas. Para que esa integración siga siendo sostenible, conviene definir quién es propietario de cada dato y cómo se propaga.

| Área                  | Propietario principal   | Ejemplos                                          |
| --------------------- | ----------------------- | ------------------------------------------------- |
| Catálogo              | Servicio de integración | Títulos, géneros, imágenes y proveedores.         |
| Cuenta y preferencias | Aplicación              | Perfil, plataformas elegidas y favoritos.         |
| Contenido editorial   | Plataforma de contenido | Críticas, noticias y metadatos de publicación.    |
| Eventos de producto   | Analítica               | Búsquedas, filtros usados y contenido consultado. |

La aplicación puede notificar que existe una nueva crítica para una película, pero no debería depender de una tabla editorial interna ni de que una generación programada termine correctamente. Una API pequeña, una vista de lectura o un evento con un contrato versionado son mejores límites que reutilizar el modelo de persistencia ajeno.

Para analítica, los eventos deben tener nombres estables y una finalidad clara. Registrar una búsqueda, un cambio de filtro o una película marcada como vista puede ayudar a mejorar la experiencia. Antes hay que acordar qué pregunta responde cada evento, minimizar datos personales y respetar la configuración de privacidad aplicable.

## Despliegue y operación: automatizar lo repetible

La automatización aporta valor cuando reduce pasos manuales sin ocultar decisiones relevantes. En este ecosistema, un pipeline puede construir la aplicación en cada cambio, desplegar previsualizaciones en las propuestas de cambio y publicar el blog tras una ejecución editorial validada.

Las variables de entorno, las credenciales de servicios externos y las claves de modelos deben residir en el proveedor de CI o despliegue, nunca en el repositorio ni en el cliente web. Los trabajos programados necesitan además límites de coste, reintentos controlados y alertas: generar contenido de forma periódica sin observabilidad solo desplaza el trabajo al momento en que algo falla.

## Una arquitectura que permite evolucionar

Separar aplicación y plataforma editorial no fragmenta el producto: aclara sus responsabilidades. La primera optimiza la decisión inmediata de qué ver; la segunda construye contexto y descubrimiento a largo plazo. Los servicios compartidos se apoyan en contratos, y la IA se integra como una capacidad sujeta a validación, no como una autoridad.

El siguiente paso no es añadir más tecnología. Es convertir los límites descritos en decisiones explícitas: qué datos se comparten, qué operación es asíncrona, qué requiere revisión humana y cómo se mide que una recomendación o un artículo ayuda de verdad. Esa disciplina es la que mantiene útil una arquitectura cuando el catálogo, el contenido y el producto empiezan a crecer.
