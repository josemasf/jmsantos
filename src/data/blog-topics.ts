import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

export const blogTopics = [
  {
    slug: "testing-vue",
    title: "Testing y calidad",
    description:
      "Pruebas, refactorización y prácticas de calidad para evolucionar software con confianza.",
    ogImage: "/images/social/testing-vue.png",
  },
  {
    slug: "arquitectura-frontend",
    title: "Arquitectura frontend",
    description:
      "Decisiones de arquitectura, integración y diseño de plataformas que permiten evolucionar un producto.",
    ogImage: "/images/social/architecture-frontend.png",
  },
  {
    slug: "calidad-devops",
    title: "DevOps, seguridad y observabilidad",
    description:
      "Automatización, entrega, seguridad y observabilidad para operar software fiable de forma sostenible.",
    ogImage: "/images/social/calidad-devops.png",
  },
  {
    slug: "vue-ui",
    title: "Frontend y UI",
    description:
      "Interfaces, componentes y patrones de producto para construir experiencias web claras y útiles.",
    ogImage: "/images/social/vue-ui.png",
  },
  {
    slug: "ia-dx",
    title: "IA y herramientas de desarrollo",
    description:
      "IA, herramientas, agentes y flujos de trabajo para mejorar el desarrollo con criterio técnico.",
    ogImage: "/images/social/ia-dx.png",
  },
  {
    slug: "accesibilidad-web",
    title: "Accesibilidad web",
    description:
      "Herramientas, criterios WCAG y prácticas para crear productos digitales utilizables por todas las personas.",
    ogImage: "/images/social/blog-default.png",
  },
  {
    slug: "internacionalizacion",
    title: "Internacionalización",
    description:
      "Localización, formatos y decisiones de producto para adaptar aplicaciones web y APIs a distintos mercados.",
    ogImage: "/images/social/blog-default.png",
  },
] as const;

export type BlogTopicSlug = (typeof blogTopics)[number]["slug"];
export type BlogTopic = (typeof blogTopics)[number];

const topicMatchers: Record<BlogTopicSlug, string[]> = {
  "testing-vue": [
    "testing",
    "vitest",
    "testing library",
    "msw",
    "playwright",
    "e2e",
    "mocks",
    "calidad de código",
    "deuda técnica",
    "auditoría",
    "refactorización",
    "clean code",
    "eslint",
    "knip",
  ],
  "arquitectura-frontend": [
    "arquitectura",
    "microfrontends",
    "module federation",
    "adr",
    "iframe",
    "blazor",
    "widgets",
  ],
  "calidad-devops": [
    "sonarqube",
    "snyk",
    "dependency-track",
    "devops",
    "ci/cd",
    "sentry",
    "seguridad",
    "devsecops",
    "observabilidad",
    "docker",
    "azure",
  ],
  "vue-ui": [
    "vue",
    "vuetify",
    "primevue",
    "ag grid",
    "ux",
    "responsive",
    "mobile first",
    "componentes",
    "tablas",
    "material design",
  ],
  "ia-dx": [
    "ia",
    "mcp",
    "chatgpt",
    "codex",
    "copilot",
    "vscode",
    "midscene",
    "prompts",
    "dx",
    "productividad",
  ],
  "accesibilidad-web": [
    "accesibilidad",
    "a11y",
    "wcag",
    "axe",
    "pa11y",
    "wave",
  ],
  internacionalizacion: [
    "i18n",
    "internacionalización",
    "localización",
    "localizacion",
  ],
};

export function getPostTopics(post: Post): BlogTopic[] {
  const searchable =
    `${post.data.title} ${post.data.category} ${post.data.tags.join(" ")}`.toLocaleLowerCase(
      "es-ES",
    );
  return blogTopics.filter((topic) =>
    topicMatchers[topic.slug].some((term) => searchable.includes(term)),
  );
}

export function getPrimaryPostTopic(post: Post): BlogTopic | undefined {
  const searchable =
    `${post.data.title} ${post.data.category} ${post.data.tags.join(" ")}`.toLocaleLowerCase(
      "es-ES",
    );

  return blogTopics
    .map((topic, index) => ({
      topic,
      index,
      matches: topicMatchers[topic.slug].filter((term) =>
        searchable.includes(term),
      ).length,
    }))
    .filter(({ matches }) => matches > 0)
    .sort((a, b) => b.matches - a.matches || a.index - b.index)[0]?.topic;
}
