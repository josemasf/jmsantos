import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const jobsCollection = defineCollection({
  loader: glob({ base: "./src/content/jobs", pattern: "**/*.md" }),
  schema: z.object({
    from: z.string(),
    to: z.string().optional(),
    company: z.string(),
    summary: z.string(),
  }),
});

const presentationsCollection = defineCollection({
  loader: glob({ base: "./src/content/presentations", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    description: z.string(),
    img: z.string().optional(),
    video: z.string().optional(),
    url: z.string().optional(),
    slideUrl: z.string().optional(),
  }),
});

const postsCollection = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.md",
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/^\d+-/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    category: z.string(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
      .optional(),
    series: z
      .object({
        title: z.string(),
        slug: z.string(),
        order: z.number(),
        description: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  jobs: jobsCollection,
  presentations: presentationsCollection,
  posts: postsCollection,
};
