import { Elysia, t } from "elysia";

import { createClientHash, createServerHash, getHashType } from "~/lib/crypto";
import { getFilePath } from "~/lib/file";

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

      return Bun.file(getFilePath(params.id, params.filename));
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

      await Bun.write(getFilePath(params.id, params.filename), body.file);

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
