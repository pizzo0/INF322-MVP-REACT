import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },

    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
  },

  nitro: false,

  vite: {
    base: "/INF322-MVP-REACT/",

    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
});
