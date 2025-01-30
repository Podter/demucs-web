import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "~/db/client";
import { Result } from "~/db/schema";
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

    const results = await db
      .select()
      .from(Result)
      .where(eq(Result.id, params.id));
    const result = results[0];

    return renderReact(
      ResultPage,
      { ...result },
      {
        title: `demucs-web - ${result.name}`,
        description: `Separation result of ${result.name} uploaded to demucs-web.`,
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
