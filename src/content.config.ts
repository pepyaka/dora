import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      regulation: z.optional(z.object({
        pageArticleStart: z.optional(z.number()),
      })),
    }),
  }),
});

const regulations = defineCollection({
  loader: glob({
    pattern: ["*/*.mdx"],
    base: "./src/content/docs/regulations",
  }),
  schema: docsSchema({
    extend: z.object({
      tableOfContents: z
        .union([
          z.object({
            minHeadingLevel: z.number().int().min(2).max(4),
          }),
          z.boolean().transform(Boolean),
        ]),
    }),
  }),
});

export const collections = {
  docs,
  regulations,
};
