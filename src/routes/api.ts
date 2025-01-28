import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "~/db/client";
import { Separation } from "~/db/schema";
import { env } from "~/env";
import { createClientHash, createServerHash, nanoid } from "~/lib/crypto";
import { getFilePath } from "~/lib/file";

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
    "/separate",
    async ({ body, error }) => {
      if (body.file.type.split("/")[0] !== "audio") {
        return error(400);
      }

      const id = nanoid();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      const extension = body.file.name.split(".").pop();
      const filename = `original.${extension}`;
      await Bun.write(getFilePath(id, filename), body.file);

      await db.insert(Separation).values({
        id,
        name: body.file.name.split(".").shift() ?? "",
        status: "processing",
        twoStems: body.twoStems,
        expiresAt,
      });

      fetch(`${env.DEMUCS_API}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          filename,
          two_stems: body.twoStems,
          hash: createServerHash(id),
        }),
      })
        .then(() => {})
        .catch(console.error);

      return {
        id,
        hash: createClientHash(id),
        expiresAt,
      };
    },
    {
      body: t.Object({
        twoStems: t.BooleanString(),
        file: t.File(),
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
