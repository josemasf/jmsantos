import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://josemariasantos.com/",
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("@cloudinary")) {
                return "cloudinary";
              }
              return "vendor";
            }
          },
        },
      },
    },
  },
  integrations: [
    robotsTxt(),
    sitemap({
      lastmod: new Date(),
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
