import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "~/db/client";
import { Separation } from "~/db/schema";
import { createClientHash, createServerHash } from "~/lib/crypto";

export const api = new Elysia({ prefix: "/api" })
  .get(
    "/status/:id",
    async ({ params, headers, error }) => {
      const hash = createClientHash(params.id);
      const clientHash = headers.authorization.split(" ")[1];
      if (hash !== clientHash) {
        return error(403);
      }

      const results = await db
        .select()
        .from(Separation)
        .where(eq(Separation.id, params.id));
      if (results.length <= 0) {
        return error(404);
      }

      return results[0];
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  )
  .post(
    "/complete/:id",
    async ({ params, headers, error, body }) => {
      const hash = createServerHash(params.id);
      const serverHash = headers.authorization.split(" ")[1];
      if (hash !== serverHash) {
        return error(403);
      }

      await db
        .update(Separation)
        .set({ status: body.success ? "success" : "error" })
        .where(eq(Separation.id, params.id));

      return new Response(null, { status: 204 });
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        success: t.BooleanString(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  );
