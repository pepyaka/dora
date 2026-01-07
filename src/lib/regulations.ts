import { z } from "astro:content";
import { glob, type Loader, type LoaderContext } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export function regulationsLoader(): Loader {
  return {
    name: "regulations-loader",
    async load(context: LoaderContext): Promise<void> {
      const globLoader = glob({
        base: "./src/content/regulations",
        pattern: "**/*.mdx",
      });
      await globLoader.load(context);

      const { renderMarkdown, store } = context;

      const entries = store.entries();

      store.clear();

      for (const [_id, dataEntry] of entries) {
        const body = dataEntry.body!.replace(listMarkerRe, replacer);
        const { id, data } = dataEntry;
        store.set({
          id,
          body,
          data,
          rendered: await renderMarkdown(body),
        });
      }
    },
  };
}

export function loaderWrapper(loader: Loader): Loader {
  return {
    name: loader.name + "-wrapper",
    async load(context: LoaderContext) {
      await loader.load(context);

      const { renderMarkdown, store, watcher } = context;

      const entries = store.entries();

      for (const [_id, dataEntry] of entries) {
        const { id, data } = dataEntry;
        if (id.startsWith("regulations")) {
          const body = dataEntry.body!.replace(listMarkerRe, replacer);
          const rendered = await renderMarkdown(body);
          store.delete(id);
          store.set({
            id,
            body,
            data,
            rendered,
          });
        }
      }

      watcher?.on("change", async (filePath) => {
        for (const [_id, dataEntry] of entries) {
          if (filePath.endsWith(dataEntry.filePath || "")) {
            const { id, data } = dataEntry;
            // console.log("CHANGE", dataEntry)
            if (id.startsWith("regulations")) {
              const body = dataEntry.body!.replace(listMarkerRe, replacer);
              const rendered = await renderMarkdown(body);
              store.delete(id);
              store.set({
                id,
                body,
                data,
                rendered,
              });
            }
          }
        }
      });
    },
  };
}

// function updateMarkdownContent(store: DataStore, renderMarkdown: )
const listMarkerRe = new RegExp(
  "^(" +
    // latin in parentheses
    "((?<latinIndent> {0,5})(?<latinMarker>\\([a-z]\\) ?))" +
    "|" +
    // romain in parentheses
    "((?<romanIndent> {4,9})(?<romanMarker>\\(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\\) ?))" +
    "|" +
    // number in parentheness
    "((?<numberIndent>( {8,16}))(?<numberMarker>\\([0-9]+\\) ?))" +
    ")",
  "gmi",
);

function replacer(match: string, ...args: any[]): string {
  const {
    latinIndent,
    latinMarker,
    romanIndent,
    romanMarker,
    numberIndent,
    numberMarker,
  } = args[args.length - 1];

  let replacement = match;
  if (latinMarker) {
    replacement = latinIndent + "- ";
  }
  if (romanMarker) {
    replacement = romanIndent + "- ";
  }
  if (numberMarker) {
    replacement = numberIndent + "- ";
  }
  return replacement;
}

export function regulationsSchema() {
  return docsSchema({
    extend: z.object({
      sidebar: z.object({
        order: z.number().int(),
      }),
      tableOfContents: z
        .union([
          z.object({
            minHeadingLevel: z.number().int().min(2).max(4),
          }),
          z.boolean().transform(Boolean),
        ]),
      regulation: z.optional(z.object({
        pageArticleStart: z.optional(z.number()),
      })),
    }),
  });
}

export function slugToLabel(slug: string): string {
  if (slug.length !== 0) {
    const parts = slug.split("-");
    let [label, num] = parts;
    if (parts.length > 2 || !label || !num) {
      console.error(`MALFORMED SLUG: ${slug}`)
      return slug;
    }
    label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    num = num.toUpperCase();
    return label + " " + num;
  }
  return "EMPTY";
}
