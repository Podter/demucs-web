import fs from "node:fs/promises";
import path from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

import { api } from "./routes/api";

const app = new Elysia();

app.use(api);

const STATIC_PATH = path.join(import.meta.dirname, "static");
if (await fs.exists(STATIC_PATH)) {
  app
    .onError((ctx) => {
      if (ctx.code === "NOT_FOUND") {
        ctx.set.status = "OK";
        return Bun.file(path.join(STATIC_PATH, "index.html"));
      }
    })
    .use(
      staticPlugin({
        assets: STATIC_PATH,
        prefix: "/",
        alwaysStatic: true,
      }),
    );
}

app.listen(3000, (server) => {
  console.log(`demucs-web running at ${server.url.toString()}`);
});
