// @ts-check

import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: "standalone",
  }),
  output: "server",
  session: {
    driver: "redis",
    options: {
      url: process.env.REDIS_URL,
    },
    cookie: {
      name: "app-session",
    },
    ttl: 60 * 60 * 24, // 1 day
  },
  env: {
    schema: {
      REDIS_URL: envField.string({
        context: "server",
        access: "secret",
        url: true,
      }),
    },
  },
});
