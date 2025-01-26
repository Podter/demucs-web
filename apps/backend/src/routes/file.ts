import { Elysia, t } from "elysia";

import { createClientHash, createServerHash, getHashType } from "~/lib/crypto";
import { s3 } from "~/lib/s3";

export const file = new Elysia({ prefix: "/file" })
  .guard({
    params: t.Object({
      id: t.String(),
      filename: t.String(),
    }),
  })
  .get(
    "/:id/:filename",
    ({ params, query, error }) => {
      const hashType = getHashType(query.hash);
      const hash =
        hashType === "server"
          ? createServerHash(params.id)
          : hashType === "client"
            ? createClientHash(params.id)
            : "";

      if (hash !== query.hash) {
        return error(403);
      }

      return s3.file(`${params.id}/${params.filename}`);
    },
    {
      query: t.Object({
        hash: t.String(),
      }),
    },
  )
  .post(
    "/:id/:filename",
    async ({ params, headers, body, error }) => {
      const hash = createServerHash(params.id);
      const serverHash = headers.authorization.split(" ")[1];
      if (hash !== serverHash) {
        return error(403);
      }

      await s3.file(`${params.id}/${params.filename}`).write(body.file);

      return new Response(null, { status: 204 });
    },
    {
      body: t.Object({
        file: t.File(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  );
