import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { postSchema } from "./data/post-schema";

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
    base: "./src/content",
    pattern: import.meta.env.DEV
      ? ["posts/**/*.md", "drafts/posts/**/*.md"]
      : "posts/**/*.md",
    generateId: ({ entry }) =>
      entry
        .replace(/^(?:posts|drafts\/posts)\//, "")
        .replace(/\.md$/, "")
        .replace(/^\d+-/, ""),
  }),
  schema: postSchema,
});

const draftPostsCollection = defineCollection({
  loader: glob({
    base: "./src/content/drafts/posts",
    pattern: "**/*.md",
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/^\d+-/, ""),
  }),
  schema: postSchema,
});

export const collections = {
  jobs: jobsCollection,
  presentations: presentationsCollection,
  posts: postsCollection,
  draftPosts: draftPostsCollection,
};
