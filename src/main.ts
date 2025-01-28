import { Elysia } from "elysia";
import logixlysia from "logixlysia";

import { env } from "./env";
import { cleanup } from "./lib/cleanup";
import { api } from "./routes/api";
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
  .use(cleanup)
  .use(api)
  .use(file)
  .listen(env.PORT, (server) => {
    console.log(`demucs-web running at ${server.url.toString()}`);
  });
