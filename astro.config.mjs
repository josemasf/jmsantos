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
          branch: "master",
        },
        media_folder: "public/assets/blog",
        public_folder: "/assets/blog",
        previewStyles: ["/src/styles/global.css"],
        collections: [
          {
            name: "posts",
            label: "Blog Posts",
            folder: "src/pages/blog/posts",
            create: true,
            delete: true,
            fields: [
              { name: "title", widget: "string", label: "Post Title" },
              {
                name: "publishDate",
                widget: "datetime",
                format: "DD MMM YYYY",
                date_format: "DD MMM YYYY",
                time_format: false,
                label: "Publish Date",
              },
              {
                name: "description",
                widget: "string",
                label: "Description",
                required: false,
              },
              { name: "img", widget: "image", label: "Image" },
              {
                name: "layout",
                widget: "select",
                default: "../../../layouts/BlogPost.astro",
                options: [
                  {
                    label: "Blog Post",
                    value: "../../../layouts/BlogPost.astro",
                  },
                ],
              },
              { name: "body", widget: "markdown", label: "Post Body" },
            ],
          },
        ],
      },
    }),
  ],
});
