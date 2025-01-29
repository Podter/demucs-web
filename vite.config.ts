import path from "node:path";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
  build: {
    rollupOptions: {
      input: [
        "./src/html/pages/index/client.ts",
        "./src/html/pages/editor/client.ts",
        "./src/html/styles.css",
        "node_modules/@fontsource-variable/inter/index.css",
      ],
    },
    outDir: "dist/static",
    manifest: true,
  },
  plugins: [
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
