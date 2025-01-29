import { Elysia, t } from "elysia";

import { createHash } from "~/lib/crypto";
import { getFilePath } from "~/lib/file";
import { jwt } from "~/lib/jwt";

export const file = new Elysia({ prefix: "/file" })
  .use(jwt)
  .guard({
    params: t.Object({
      id: t.String(),
      filename: t.String(),
    }),
  })
  .get(
    "/:id/:filename",
    async ({ params, error, headers, jwt, cookie }) => {
      const file = Bun.file(getFilePath(params.id, params.filename));

      if (await file.exists()) {
        const jwtData = await jwt.verify(cookie.auth.value);
        if (jwtData) {
          if (jwtData.separations.includes(params.id)) {
            return file;
          }
        }

        const hashInput = headers.authorization?.split(" ")[1];
        if (hashInput) {
          const hash = createHash(params.id);
          if (hash === hashInput) {
            return file;
          }
        }
      }

      return error(404);
    },
    {
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
      const hash = createHash(params.id);
      const hashInput = headers.authorization.split(" ")[1];
      if (hash !== hashInput) {
        return error(404);
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
