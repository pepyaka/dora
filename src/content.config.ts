import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { loaderWrapper } from "./lib/regulations";

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      regulation: z.optional(z.object({
        pageArticleStart: z.optional(z.number()),
      })),
    }),
  })
});

// const regulations = defineCollection({
//   loader: regulationsLoader(),
//   schema: regulationsSchema(),
// });

export const collections = {
  docs,
  // regulations,
};
