import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import NetlifyCMS from "astro-netlify-cms";

// https://astro.build/config
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://josemariasantos.com/",
  theme: {
    container: {
      center: true,
    },
  },
  integrations: [
    tailwind(),
    robotsTxt(),
    sitemap({
      lastmod: new Date(),
    }),
    partytown(),
    NetlifyCMS({
      config: {
        backend: {
          name: "git-gateway",
          branch: "main",
        },
        collections: [
          {
            name: "posts",
            label: "Blog Posts",
            folder: "src/pages/posts",
            create: true,
            delete: true,
            fields: [
              { name: "title", widget: "string", label: "Post Title" },
              { name: "body", widget: "markdown", label: "Post Body" },
            ],
          },
        ],
      },
    }),
  ],
});
