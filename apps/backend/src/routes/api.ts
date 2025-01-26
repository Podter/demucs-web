import { Elysia, t } from "elysia";
import mime from "mime/lite";

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

      await s3
        .file(`${id}/original.${mime.getExtension(body.file.type)}`)
        .write(body.file);

      // TODO: add separate logic

      return {
        id,
        hash: createClientHash(id),
      };
    },
    {
      body: t.Object({
        twoStems: t.Boolean(),
        file: t.File({ type: "audio/*" }),
      }),
    },
  );
