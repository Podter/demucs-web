import fs from "node:fs/promises";
import path from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

const app = new Elysia().get("/hello", () => "Hello Elysia");

const STATIC_PATH = path.join(import.meta.dirname, "static");
if (await fs.exists(STATIC_PATH)) {
  app.use(
    staticPlugin({
      assets: STATIC_PATH,
      prefix: "/",
    }),
  );
}

app.listen(3000, (server) => {
  console.log(`demucs-web backend running at ${server.url.toString()}`);
});
