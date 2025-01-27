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
    ({ params, query, error, headers }) => {
      const hashString = query.hash ?? headers.authorization?.split(" ")[1];
      if (!hashString) {
        return error(403);
      }

      const hashType = getHashType(hashString);
      const hash =
        hashType === "server"
          ? createServerHash(params.id)
          : hashType === "client"
            ? createClientHash(params.id)
            : "";

      if (hash !== hashString) {
        return error(403);
      }

      const file = s3.file(`${params.id}/${params.filename}`);

      const resHeaders = new Headers();
      resHeaders.set("Content-Type", file.type);
      resHeaders.set("Content-Length", file.size.toString());
      resHeaders.set(
        "Content-Disposition",
        `attachment; filename="${params.filename}"`,
      );

      return new Response(file.stream(), { headers: resHeaders });
    },
    {
      query: t.Optional(
        t.Partial(
          t.Object({
            hash: t.String(),
          }),
        ),
      ),
      headers: t.Optional(
        t.Partial(
          t.Object({
            authorization: t.String(),
          }),
        ),
      ),
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

      await s3.file(`${params.id}/${params.filename}`).write(body.file, {
        type: body.file.type,
      });

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
