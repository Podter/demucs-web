import staticPlugin from "@elysiajs/static";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";

import { db } from "./db/client";
import { Separation } from "./db/schema";
import { env } from "./env";
import { cleanup, removeSeparation } from "./lib/cleanup";
import { DEFAULT_COOKIE_OPTS, jwt } from "./lib/jwt";
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
  .use(jwt)
  .guard({
    beforeHandle: async ({ cookie, jwt }) => {
      if (cookie.auth.value) {
        const jwtData = await jwt.verify(cookie.auth.value);
        if (jwtData) {
          const expiration = await Promise.all(
            jwtData.separations.map(async (id) => {
              const results = await db
                .select({ expiresAt: Separation.expiresAt })
                .from(Separation)
                .where(eq(Separation.id, id));
              if (results.length <= 0) {
                return { id, expired: true };
              }

              const result = results[0];
              const expired = result.expiresAt < new Date();
              if (expired) {
                await removeSeparation(id);
              }

              return { id, expired };
            }),
          );

          const notExpired = expiration.filter((e) => !e.expired);
          if (notExpired.length !== jwtData.separations.length) {
            cookie.auth.set({
              value: await jwt.sign({
                separations: notExpired.map((e) => e.id),
              }),
              ...DEFAULT_COOKIE_OPTS,
            });
          }
        }
      }
    },
  })
  .use(index)
  .use(editor)
  .use(api)
  .use(file)
  .listen(env.PORT, (server) => {
    console.log(`demucs-web running at ${server.url.toString()}`);
  });
