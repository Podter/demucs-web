import { Elysia, t } from "elysia";

import Editor from "~/html/pages/editor/page";
import { renderReact } from "~/html/server";
import { jwt } from "~/lib/jwt";

export const editor = new Elysia({ prefix: "/" }).use(jwt).get(
  "/:id",
  async ({ cookie, jwt, params, error }) => {
    const jwtData = await jwt.verify(cookie.auth.value);
    if (!jwtData || !jwtData.separations.includes(params.id)) {
      return error(404);
    }

    return renderReact(
      Editor,
      {},
      {
        title: "Editor",
        description: "The editor",
        clientScript: "src/html/pages/editor/client.ts",
      },
    );
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  },
);
