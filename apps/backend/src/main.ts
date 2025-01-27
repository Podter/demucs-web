import fs from "node:fs";
import path from "node:path";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";

import { env } from "./env";
import { api } from "./routes/api";
import { file } from "./routes/file";

const app = new Elysia();

app.use(
  logixlysia({
    config: {
      showStartupMessage: false,
      customLogFormat: "{now} {level} {duration} {method} {pathname} {status}",
    },
  }),
);

app.use(api);
app.use(file);

if (fs.existsSync(env.STATIC_PATH)) {
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
