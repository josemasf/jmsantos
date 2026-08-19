export const responsibilities = [
  {
    title: "Arquitectura y dirección técnica",
    description:
      "Doy dirección a decisiones que deben seguir funcionando cuando el producto y el equipo crecen.",
    items: [
      "Estrategia frontend compartida",
      "Arquitecturas mantenibles",
      "Criterios técnicos explícitos",
      "Menos deuda y complejidad accidental",
    ],
  },
  {
    title: "Equipos y acompañamiento",
    description:
      "Creo contexto para que las personas puedan decidir con autonomía y alineación.",
    items: [
      "Revisiones de arquitectura y código",
      "Mentoring técnico",
      "Documentación y sesiones prácticas",
      "Detección temprana de bloqueos",
    ],
  },
  {
    title: "Calidad y entrega",
    description:
      "Convierto la calidad en una práctica útil para entregar con confianza, no en una ceremonia.",
    items: [
      "Estándares de desarrollo",
      "Testing sostenible",
      "Rendimiento y accesibilidad",
      "Automatización de entrega",
    ],
  },
  {
    title: "Producto e impacto",
    description:
      "Conecto las decisiones técnicas con las necesidades de negocio y el uso real del producto.",
    items: [
      "Trabajo transversal",
      "Soluciones proporcionadas",
      "Analítica de adopción",
      "Aprendizaje basado en evidencia",
    ],
  },
] as const;

export const principles = [
  [
    "Pragmatismo",
    "Busco soluciones simples, sostenibles y proporcionadas al problema real.",
  ],
  [
    "Calidad con propósito",
    "Reducir riesgos y facilitar la evolución es más valioso que añadir complejidad.",
  ],
  [
    "Datos y evidencia",
    "Las preferencias importan; las métricas, pruebas y contexto terminan de decidir.",
  ],
  [
    "Colaboración",
    "Ingeniería, diseño y producto obtienen mejores resultados cuando comparten el problema.",
  ],
  [
    "Mejora continua",
    "Siempre hay procesos, herramientas y decisiones que se pueden simplificar.",
  ],
  [
    "Responsabilidad",
    "Hago visibles los riesgos y comunico los compromisos con claridad.",
  ],
] as const;

export const collaborators = {
  internal: [
    "Frontend",
    "Backend",
    "QA",
    "Diseño UX/UI",
    "Producto",
    "DevOps",
    "Datos y analítica",
    "Liderazgo técnico",
  ],
  external: [
    "Clientes",
    "Usuarios",
    "Proveedores tecnológicos",
    "Partners",
    "Comunidad técnica",
    "Stakeholders de negocio",
  ],
} as const;

export const experience = [
  {
    company: "AIDA",
    role: "Frontend Tech Lead",
    period: "2023 — actualidad",
    summary:
      "Liderazgo técnico frontend y del equipo transversal que define arquitectura, estándares y herramientas compartidas para SIMA Suite.",
    impact: [
      "Evolución de aplicaciones Vue.js y Blazor",
      "Activos reutilizables y herramientas internas",
      "Lighthouse Performance de 38 a 96",
      "Guild de Front, revisiones y documentación",
    ],
    stack: "Vue.js, TypeScript, Blazor, .NET, Vuetify y Playwright",
  },
  {
    company: "Innovation Strategies",
    role: "Tech Lead y equipo de arquitectura",
    period: "2018 — 2023",
    summary:
      "Consultoría de transformación digital para productos B2B, integraciones y evolución de arquitecturas frontend.",
    impact: [
      "Arquitectura y plataforma de microfrontends",
      "Componentes transversales",
      "Soporte técnico a equipos de desarrollo",
      "Aplicaciones de reserva y canales B2B",
    ],
    stack: "Vue, Vuex, TypeScript, Jest, Sonar y SCSS",
  },
  {
    company: "OFG",
    role: "Desarrollo web",
    period: "2017 — 2018",
    summary:
      "Mantenimiento y mejora de aplicaciones de negocio para producción audiovisual y telecomunicaciones.",
    impact: [
      "Evolución de CRM",
      "Optimización de una aplicación de mediciones",
      "Soporte a documentación para organismos oficiales",
    ],
    stack: "Aplicaciones web de negocio",
  },
  {
    company: "Vistalegre Solutions",
    role: "Desarrollo web e IT",
    period: "2007 — 2017",
    summary:
      "Construcción de la base tecnológica de herramientas comerciales, ecommerce y automatización interna.",
    impact: [
      "Tiendas B2C y B2B",
      "Integraciones con proveedores",
      "Movilidad para el área comercial",
      "Mejora continua y SEO",
    ],
    stack: "Web, ecommerce e integraciones de servicios",
  },
] as const;

export const technologies = [
  [
    "Frontend",
    [
      "Vue",
      "TypeScript",
      "Pinia",
      "PrimeVue",
      "Vuetify",
      "Tailwind CSS",
      "Vite",
    ],
  ],
  [
    "Testing y calidad",
    ["Vitest", "Testing Library", "MSW", "Playwright", "Sentry"],
  ],
  [
    "Arquitectura y plataforma",
    [
      "Microfrontends",
      "Node.js",
      "Blazor",
      "Docker",
      "Kubernetes",
      "Azure",
      "GitHub Actions",
    ],
  ],
  [
    "Datos y producto",
    [
      "PostHog",
      "GA4",
      "Looker Studio",
      "Analítica de uso",
      "Métricas de adopción",
    ],
  ],
] as const;

export const publicWork = [
  {
    title: "De escribir código a construir producto",
    year: "2026",
    href: "/presentations/construir-producto/",
  },
  {
    title: "Mocking and testing",
    year: "2022",
    href: "/presentations/mocking-and-testing/",
  },
  {
    title: "Atomic container for C# devs",
    year: "2023",
    href: "/presentations/atomic-container-for-csharp/",
  },
  {
    title: "Arquitecturas de microfrontends",
    year: "2020",
    href: "/presentations/microfront/",
  },
  { title: "Serverless", year: "2020", href: "/presentations/serverless/" },
] as const;

export const projects = [
  {
    title: "Qué Veo Ahora",
    text: "Recomendador de cine y series que combina experiencia de usuario, producto y una arquitectura moderna.",
    stack: "Vue 3 · Supabase · Tailwind CSS · PrimeVue",
    href: "/porfolio/que-veo-ahora-app/",
  },
  {
    title: "Enchanted Map",
    text: "Una experiencia web interactiva para descubrir la historia y las leyendas de Córdoba.",
    stack: "Vue 3 · Vuetify · Clerk",
    href: "/porfolio/enchanted-map/",
  },
] as const;
