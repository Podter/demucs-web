import fs from "node:fs/promises";
import path from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

import { env } from "./env";
import { api } from "./routes/api";

const app = new Elysia();

app.use(api);

if (await fs.exists(env.STATIC_PATH)) {
  app
    .onError((ctx) => {
      if (ctx.code === "NOT_FOUND") {
        ctx.set.status = "OK";
        return Bun.file(path.join(env.STATIC_PATH, "index.html"));
      }
    })
    .use(
      staticPlugin({
        assets: env.STATIC_PATH,
        prefix: "/",
        alwaysStatic: true,
      }),
    );
}

app.listen(env.PORT, (server) => {
  console.log(`demucs-web running at ${server.url.toString()}`);
});
