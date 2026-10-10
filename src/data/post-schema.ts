import { z } from "astro/zod";

const postImage = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

// Compartido por Content Collections y el control editorial ejecutado en CI.
export const postSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).min(1),
    category: z.string().min(1),
    issue: z.number().int().positive().optional(),
    image: postImage.extend({ caption: z.string().optional() }).optional(),
    series: z
      .object({
        slug: z.string().min(1),
        order: z.number().int().positive(),
        image: postImage.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
