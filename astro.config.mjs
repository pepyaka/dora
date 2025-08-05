// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";
import {
  defListHastHandlers,
  remarkDefinitionList,
} from "remark-definition-list";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "DORA",
      logo: {
        src: "./src/assets/dora-logo.svg",
      },
      customCss: ["./src/styles/global.css"],
      social: [{
        icon: "github",
        label: "GitHub",
        href: "https://github.com/pepyaka/dora",
      }],
      sidebar: [
        {
          label: "Lifecycle",
          link: "lifecycle",
        },
        {
          label: "Templates",
          autogenerate: { directory: "templates" },
        },
        {
          label: "Regulations",
          autogenerate: { directory: "regulations" },
        },
      ],
      pagination: false,
      components: {
        MarkdownContent: "./src/components/regulations/MarkdownContent.astro",
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkDefinitionList],
    remarkRehype: { handlers: defListHastHandlers },
  },
});
