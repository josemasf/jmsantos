export interface BlogSeries {
  title: string;
  description?: string;
}

export const blogSeries = {
  "mantenibilidad-frontend-coste-de-entender": {
    title: "Mantener software: el coste de entenderlo",
    description:
      "Seis perspectivas para priorizar deuda técnica, pruebas, CI, observabilidad y arquitectura a partir del coste real de cambiar un frontend.",
  },
  "testing-moderno-vue-confianza-sin-fragilidad": {
    title: "Testing moderno en Vue: confianza sin fragilidad",
    description:
      "Una guía práctica para construir una suite de tests rápida, realista y mantenible en Vue 3.",
  },
} satisfies Record<string, BlogSeries>;

export function getBlogSeries(slug: string): BlogSeries | undefined {
  return blogSeries[slug as keyof typeof blogSeries];
}
