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
    async ({ params, query, error, set, headers }) => {
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

      const file = s3.file(`${params.id}/${params.filename}`);

      set.headers["Content-Type"] = file.type;
      set.headers["Content-Disposition"] =
        `inline; filename="${params.filename}"`;

      const range = headers.Range;
      if (!range) {
        set.headers["Content-Length"] = file.size.toString();
        return await file.arrayBuffer();
      }

      const start = Number(range.replace(/\D/g, ""));
      // transfer 512KB at a time
      const end = Math.min(start + 524288, file.size - 1);

      set.headers["Content-Range"] = `bytes ${start}-${end}/${file.size}`;
      set.headers["Content-Length"] = `${end - start + 1}`;

      return await file.slice(start, end).arrayBuffer();
    },
    {
      query: t.Object({
        hash: t.String(),
      }),
      headers: t.Object({
        Range: t.Optional(t.String()),
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
