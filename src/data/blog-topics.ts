import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

export const blogTopics = [
  {
    slug: "testing-vue",
    title: "Testing moderno en Vue",
    description: "Estrategias prácticas con Vitest, Testing Library, MSW y Playwright para mantener la confianza sin fragilidad.",
    ogImage: "/images/social/testing-vue.png",
  },
  {
    slug: "arquitectura-frontend",
    title: "Arquitectura frontend",
    description: "Decisiones de arquitectura, componentes, microfrontends y plataformas que permiten evolucionar un producto.",
    ogImage: "/images/social/architecture-frontend.png",
  },
  {
    slug: "calidad-devops",
    title: "Calidad y DevOps",
    description: "Observabilidad, seguridad, automatización y prácticas para entregar software fiable de forma sostenible.",
    ogImage: "/images/social/calidad-devops.png",
  },
  {
    slug: "vue-ui",
    title: "Vue y UI",
    description: "Diseño de interfaces, componentes y patrones de producto para construir experiencias web claras y accesibles.",
    ogImage: "/images/social/vue-ui.png",
  },
  {
    slug: "ia-dx",
    title: "IA y experiencia de desarrollo",
    description: "Herramientas, agentes y flujos de trabajo para integrar IA en el desarrollo con criterio técnico.",
    ogImage: "/images/social/ia-dx.png",
  },
] as const;

export type BlogTopicSlug = (typeof blogTopics)[number]["slug"];
export type BlogTopic = (typeof blogTopics)[number];

const topicMatchers: Record<BlogTopicSlug, string[]> = {
  "testing-vue": ["testing", "vitest", "testing library", "msw", "playwright", "e2e", "mocks"],
  "arquitectura-frontend": ["arquitectura", "microfrontends", "module federation", "adr", "iframe", "blazor", "widgets"],
  "calidad-devops": ["sonarqube", "snyk", "dependency-track", "devops", "ci/cd", "sentry", "seguridad", "calidad", "deuda técnica"],
  "vue-ui": ["vue", "vuetify", "primevue", "ag grid", "ux", "responsive", "mobile first", "i18n", "internacionalización", "componentes", "tablas"],
  "ia-dx": ["ia", "mcp", "chatgpt", "codex", "copilot", "vscode", "midscene", "prompts", "dx", "productividad"],
};

export function getPostTopics(post: Post): BlogTopic[] {
  const searchable = `${post.data.title} ${post.data.category} ${post.data.tags.join(" ")}`.toLocaleLowerCase("es-ES");
  return blogTopics.filter((topic) => topicMatchers[topic.slug].some((term) => searchable.includes(term)));
}

export function getPrimaryPostTopic(post: Post): BlogTopic | undefined {
  return getPostTopics(post)[0];
}
