import type { ElysiaCookie } from "elysia/cookies";
import { jwt as elysiaJWT } from "@elysiajs/jwt";
import { t } from "elysia";

import { env } from "~/env";

export const DEFAULT_COOKIE_OPTS: ElysiaCookie = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  path: "/",
};

export const jwt = elysiaJWT({
  secret: env.SECRET,
  schema: t.Object({
    separations: t.Array(t.String()),
  }),
});
