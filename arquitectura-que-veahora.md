🧑🏻‍🏫Exposición
Presentación técnica de la arquitectura del ecosistema de recomendación cinematográfica

🎬 Arquitectura Qué Veo Ahora
Ecosistema de Recomendación Cinematográfica
Una presentación técnica de la arquitectura completa

layout: two-cols-header
📋 Agenda
 

🧠 Proceso de desarrollo
Desarrollo de idea con IA

Planificación y metodología

Implementación práctica

🏗️ Arquitectura General
Visión del ecosistema

Dos proyectos principales

Stack tecnológico moderno

 

🎬 Que-veo-hoy (App)
Clean Architecture + SOLID

Vue 3 + Supabase

Testing y CI/CD

📝 Queveoahora-content (CMS)
Monorepo + Astro

Generación IA de contenido

Automatización completa

layout: two-cols-header
🎭 Propósito del Sistema
 

🎬 que-veo-hoy
Aplicación de recomendaciones

Filtros personalizados

Sistema social de amigos

Notificaciones push

Gestión de favoritos

 

📝 queveoahora-content
Sistema de contenido

Generación automática de críticas

Blog de noticias cinematográficas

Sistema de gestión automatizado

Contenido SEO optimizado

🎯 Visión del Ecosistema
💾 Backend Services

🌐 APIs Externas

layout: section
🧠 Proceso de desarrollo con IA
Cómo construir con ChatGPT/Copilot
layout: two-cols-header
✍️🤖 Metodología con IA
Cita importante: La IA es como un compañero con personalidad propia que siempre nos intenta dar la razón

 

📝 Proceso iterativo
Proyecto separado en ChatGPT

Múltiples chats temáticos

Iterar hasta satisfacción

Plan de acción en Markdown

 

🎯 Mejores prácticas
No orientar hacia tu solución

Dejar que la IA proponga

Cuestionar las respuestas

Documentar decisiones

layout: two-cols-header
🚀 Workflow de Desarrollo
 

💬 Chat de VSCode (Copilot)
IA documenta cada cambio

Instrucciones en .github/

Directorio de conocimiento en repo

Conventional commits automáticos

🎯 Ventajas
Velocidad de desarrollo x3

Código más consistente

Documentación automática

Testing incluido

 

🐙 GitHub Copilot Workspace
Issues asignadas a Copilot

Genera PR completos

Revisión humana necesaria

Iteración sobre el código

⚠️ Limitaciones
Requiere supervisión

Contexto limitado

Puede alucinar

Necesita validación

layout: section
🏗️ Que-veo-hoy
Aplicación Principal - Arquitectura
image-20251113-075950.png
 

layout: two-cols-header
🛠️ Stack & Arquitectura
 

⚡ Stack Principal
Vue 3 + Composition API

TypeScript + Vite

Pinia (state management)

PrimeVue + Tailwind CSS

Supabase (BaaS completo)

🧪 Testing & Calidad
Vitest + Testing Library

MSW v2 (mock APIs)

Cobertura >70%

Husky + Commitlint

 

🏛️ Clean Architecture


src/
├── domain/          # 💼 Lógica negocio
├── infrastructure/  # 🔌 APIs
└── presentation/    # 🎨 UI (Vue)
🎯 Principios SOLID
Single Responsibility

Dependency Inversion

Testeable y mantenible

layout: two-cols-header
🎬 Funcionalidades Clave
 

🎯 Core Features
Recomendador inteligente

Filtros por género/plataforma/duración

Detección automática de país

Botón "SORPRÉNDEME"

Sistema social (roadmap)

Amigos y recomendaciones

Lista pública de visto

 

🔐 Backend (Supabase)
Auth: Google + Email

Database: PostgreSQL + RLS (Row-Level Security)

Realtime: WebSockets

Storage: Imágenes/avatares

📊 Integraciones
TMDB API (catálogo)

Streaming Availability API

OneSignal (push notifications)

layout: default
🔌 Ejemplo: Integración TMDB


// infrastructure/api/tmdbMovieService.ts
export class TMDBMovieService implements MovieService {
  private baseURL = 'https://api.themoviedb.org/3'
  async getPopularMovies(page = 1): Promise<MovieResponse> {
    const response = await fetch(
      `${this.baseURL}/movie/popular?page=${page}&api_key=${this.apiKey}`
    )
    return response.json()
  }
  async getMovieProviders(movieId: number, country = 'ES'): Promise<WatchProvider[]> {
    const response = await fetch(
      `${this.baseURL}/movie/${movieId}/watch/providers?api_key=${this.apiKey}`
    )
    const data = await response.json()
    return data.results[country]?.flatrate || []
  }
}
layout: section
📝 Queveoahora-content
Sistema de Generación de Contenido con IA
layout: two-cols-header
📦 Arquitectura Monorepo
 

🗂️ Estructura


queveoahora-content/
├── apps/
│   └── blog/          # Astro site
├── packages/
│   ├── cli/           # Comandos
│   └── generator/     # IA engine
└── features/          # Futuras features
⚡ Tecnologías
Astro 4 (SSG)

OpenAI API (GPT-4)

Content Collections

GitHub Actions

 

🤖 Generación Automatizada
Cada 6 horas:

Consulta nuevos estrenos (TMDB)

Genera críticas con GPT-4

Valida calidad del contenido

Optimiza para SEO

Publica automáticamente

Actualiza sitemap

Output: 15-20 artículos/día

layout: default
🤖 Generación de Críticas con IA


// packages/generator/src/ai/openaiService.ts
export class OpenAIService {
  async generateReview(movie: Movie): Promise<Review> {
    const prompt = `
      Escribe una crítica cinematográfica profesional de "${movie.title}".
      ESTRUCTURA:
      - Sinopsis breve (sin spoilers)
      - Análisis de actuaciones
      - Dirección y fotografía
      - Valoración final (1-10)
      TONO: Profesional pero accesible
      EXTENSIÓN: 300-400 palabras
    `
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600
    })
    return this.parseReview(response.choices[0].message.content)
  }
}
layout: two-cols-header
🔄 CI/CD y Automatización
 

🤖 GitHub Actions


name: Generar Contenido Diario
on:
  schedule:
    - cron: '0 6,12,18,0 * * *'  # 4x día
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate reviews
        run: pnpm cli generate:reviews
      - name: Generate news
        run: pnpm cli generate:news
      - name: Deploy
        run: pnpm build && netlify deploy
 

📊 Métricas Reales
Generación:

15-20 artículos/día

Tiempo: <30 min

Calidad:

SEO Score: >85

Legibilidad: >70

Originalidad: 100%

Costes:

OpenAI: ~$60/mes

Netlify: Free tier

GitHub Actions: Free

layout: two-cols-header
🔄 Flujo de Datos Completo
 

📊 Sincronización
Supabase compartido

Base de datos única

Críticas y ratings

Metadata de películas

Eventos en tiempo real

App notificada de nuevo contenido

WebSockets con Supabase

APIs comunes

TMDB (catálogo)

OpenAI (generación)

 

🚀 Deploy
que-veo-hoy: Netlify

Auto deploy desde main

Preview deploys en PRs

Variables de entorno

queveoahora-content: Netlify

Deploy tras generación

CDN global

Monitoring: PostHog

Analytics de usuario

Feature flags

A/B testing

layout: default
📈 Eventos Trackeados PostHog
Autenticación:

auth_login_attempt, auth_login_success, auth_login_error

auth_signup_success, auth_logout

Contenido:

movie_clicked, content_favorited, trailer_viewed

content_shared, content_marked_watched

Búsqueda:

search_performed, filter_changed, advanced_search_used

Configuración:

theme_changed, platform_preferences_changed

layout: two-cols-header
🔮 Roadmap Futuro
 

🎬 que-veo-hoy
Sistema de amigos ⚡

Recomendaciones sociales

Código QR para añadir

Gamificación

Badges por películas vistas

Ranking de cinéfilos

App móvil nativa

React Native

Sincronización cross-device

 

📝 queveoahora-content
Podcasts con IA

TTS de críticas

Distribución automática

Video reviews

Síntesis con IA

YouTube automation

Multi-idioma

EN, FR, PT automático

Mismo costo

layout: end
🙏 ¡Gracias!
