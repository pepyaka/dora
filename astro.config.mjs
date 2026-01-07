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
          label: "Regulations",
          items: [
            {
              label: "Digital Operational Resilience Act",
              badge: "Regulation (EU) 2022/2554",
              autogenerate: {
                directory: "regulations/Digital Operational Resilience Act",
              },
            },
            {
              label: "DORA Amendments Directive",
              badge: "Directive (EU) 2022/2556",
              collapsed: true,
              autogenerate: {
                directory: "regulations/DORA Amendments Directive",
              },
            },
            {
              label: "ICT Risk Framework RTS",
              badge: "Commission Delegated Regulation (EU) 2024/1774",
              collapsed: true,
              autogenerate: {
                directory: "regulations/ICT Risk Framework RTS",
              },
            },
            {
              label: "ICT Incidents Classification",
              badge: "Commission Delegated Regulation (EU) 2024/1772",
              collapsed: true,
              autogenerate: {
                directory: "regulations/ICT Incidents Classification",
              },
            },
          ],
        },
        {
          label: "Templates",
          autogenerate: { directory: "templates", collapsed: true },
        },
        {
          label: "Contributing",
          link: "contributing",
        },
      ],
      pagination: false,
      editLink: {
        baseUrl: "https://github.com/pepyaka/dora/edit/main/",
      },
      lastUpdated: true,
      components: {
        Sidebar: "./src/components/Sidebar.astro",
        TableOfContents: "./src/components/TableOfContents.astro",
        MobileTableOfContents: "./src/components/MobileTableOfContents.astro",
        MarkdownContent: "./src/components/MarkdownContent.astro",
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
