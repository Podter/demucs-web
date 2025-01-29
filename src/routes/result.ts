import { Elysia, t } from "elysia";

import ResultPage from "~/html/pages/result/page";
import { renderReact } from "~/html/server";
import { jwt } from "~/lib/jwt";

export const result = new Elysia({ prefix: "/result" }).use(jwt).get(
  "/:id",
  async ({ cookie, jwt, params, error }) => {
    const jwtData = await jwt.verify(cookie.auth.value);
    if (!jwtData || !jwtData.results.includes(params.id)) {
      return error(404);
    }

    return renderReact(
      ResultPage,
      {},
      {
        title: "Result",
        description: "The result",
        clientScript: "src/html/pages/result/client.ts",
      },
    );
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  },
);
