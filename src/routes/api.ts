import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "~/db/client";
import { Result } from "~/db/schema";
import { createHash } from "~/lib/crypto";
import { jwt } from "~/lib/jwt";

export const api = new Elysia({ prefix: "/api" })
  .use(jwt)
  .guard({
    params: t.Object({
      id: t.String(),
    }),
  })
  .get("/result/:id", async ({ params, error, cookie, jwt }) => {
    const jwtData = await jwt.verify(cookie.auth.value);
    if (!jwtData || !jwtData.results.includes(params.id)) {
      return error(404);
    }

    const results = await db
      .select()
      .from(Result)
      .where(eq(Result.id, params.id));
    if (results.length <= 0) {
      return error(404);
    }

    return results[0];
  })
  .post(
    "/result/:id",
    async ({ params, headers, error, body }) => {
      const hash = createHash(params.id);
      const hashInput = headers.authorization.split(" ")[1];
      if (hash !== hashInput) {
        return error(404);
      }

      await db
        .update(Result)
        .set({ status: body.success ? "success" : "error" })
        .where(eq(Result.id, params.id));

      return new Response(null, { status: 204 });
    },
    {
      body: t.Object({
        success: t.BooleanString(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  );
