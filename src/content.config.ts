import { defineCollection, z } from "astro:content";
// import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

// const regulations = defineCollection(
//   {
//     loader: glob({ pattern: "*.yaml", base: "src/content/regulations" }),
//     schema: z.object({
//       prettyName: z.string(),
//       recitals: z.array(z.object({
//         summary: z.string(),
//       })),
//     }),
//   },
// );

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // regulations,
};
