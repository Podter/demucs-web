import { Elysia, t } from "elysia";

import { db } from "~/db/client";
import { Separation } from "~/db/schema";
import { env } from "~/env";
import { createClientHash, createServerHash, nanoid } from "~/lib/crypto";
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
    async ({ body, error }) => {
      if (body.file.type.split("/")[0] !== "audio") {
        return error(400);
      }

      const id = nanoid();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      const extension = body.file.name.split(".").pop();
      const filename = `original.${extension}`;
      await s3.file(`${id}/${filename}`).write(body.file);

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
      }).then(() => {});

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
  );
