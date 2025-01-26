import { Elysia, t } from "elysia";
import mime from "mime/lite";

import { db } from "~/db/client";
import { Separation } from "~/db/schema";
import { createClientHash, nanoid } from "~/lib/crypto";
import { s3 } from "~/lib/s3";

export const api = new Elysia({ prefix: "/api" })
  .get(
    "/hello",
    ({ query }) => {
      return {
        message: `Hello, ${query.name}!`,
      };
    },
    {
      query: t.Object({
        name: t.String(),
      }),
    },
  )
  .post(
    "/separate",
    async ({ body }) => {
      const id = nanoid();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      await s3
        .file(`${id}/original.${mime.getExtension(body.file.type)}`)
        .write(body.file);

      // TODO: add separate logic
      await db.insert(Separation).values({
        id,
        name: body.file.name,
        status: "processing",
        twoStems: body.twoStems,
        expiresAt,
      });

      return {
        id,
        hash: createClientHash(id),
        expiresAt,
      };
    },
    {
      body: t.Object({
        twoStems: t.Boolean(),
        file: t.File({ type: "audio/*" }),
      }),
    },
  );
