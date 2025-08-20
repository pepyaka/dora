// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import {
  defListHastHandlers,
  remarkDefinitionList,
} from "remark-definition-list";
import starlightScrollToTop from "starlight-scroll-to-top";
import { remarkHeadingId } from "remark-custom-heading-id";

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
      }, {
        icon: "email",
        label: "E-Mail",
        href: "mailto:info@digital-operational-resilience.org",
      }],
      tableOfContents: {
        maxHeadingLevel: 4,
      },
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
      editLink: {
        baseUrl: "https://github.com/pepyaka/dora/edit/main/",
      },
      lastUpdated: true,
      components: {
        Sidebar: "./src/components/Sidebar.astro",
        TableOfContents: "./src/components/conditional/TableOfContents.astro",
        MarkdownContent: "./src/components/conditional/MarkdownContent.astro",
      },
      plugins: [starlightScrollToTop()],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkDefinitionList, remarkHeadingId],
    remarkRehype: {
      handlers: defListHastHandlers,
      footnoteLabelTagName: "div", // TODO: Replace tag with height
    },
  },
});
