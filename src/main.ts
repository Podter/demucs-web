import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";

import { env } from "./env";
import { cleanup } from "./lib/cleanup";
import { index } from "./routes";
import { api } from "./routes/api";
import { editor } from "./routes/editor";
import { file } from "./routes/file";

new Elysia()
  .use(
    logixlysia({
      config: {
        showStartupMessage: false,
        customLogFormat:
          "{now} {level} {duration} {method} {pathname} {status}",
      },
    }),
  )
  .use(
    staticPlugin({
      assets: env.STATIC_DIR,
      prefix: "/",
      alwaysStatic: env.NODE_ENV === "production",
    }),
  )
  .use(cleanup)
  .use(index)
  .use(editor)
  .use(api)
  .use(file)
  .listen(env.PORT, (server) => {
    console.log(`demucs-web running at ${server.url.toString()}`);
  });
