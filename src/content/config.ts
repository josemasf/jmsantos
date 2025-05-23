import { defineCollection, z } from "astro:content";

const jobsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    from: z.string(),
    to: z.string().optional(),
    company: z.string(),
    location: z.string(),
    description: z.string(),
  }),
});

const presentationsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    description: z.string(),
    img: z.string().optional(),
    video: z.string().optional(),
    url: z.string().optional(),
    slideUrl: z.string().optional(),
  }),
});

export const collections = {
  jobs: jobsCollection,
  presentations: presentationsCollection,
};
