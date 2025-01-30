import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "~/db/client";
import { Result } from "~/db/schema";
import { env } from "~/env";
import Index from "~/html/pages/index/page";
import { renderReact } from "~/html/server";
import { createHash, nanoid } from "~/lib/crypto";
import { getFilePath } from "~/lib/file";
import { DEFAULT_COOKIE_OPTS, jwt } from "~/lib/jwt";

export const index = new Elysia({ prefix: "/" })
  .use(jwt)
  .get("/", async ({ cookie, jwt }) => {
    const jwtData = await jwt.verify(cookie.auth.value);
    const results = jwtData ? jwtData.results : [];

    const data = await Promise.all(
      results.map(async (id) => {
        const results = await db.select().from(Result).where(eq(Result.id, id));
        return results[0];
      }),
    );

    return renderReact(
      Index,
      { results: data },
      {
        title: "Hello, world!",
        description: "Elysia",
        clientScript: "src/html/pages/index/client.ts",
      },
    );
  })
  .post(
    "/",
    async ({ body, error, jwt, cookie, redirect }) => {
      if (body.file.type.split("/")[0] !== "audio") {
        return error(400);
      }

      const twoStems = body.two_stems === "on";

      const id = nanoid();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      const extension = body.file.name.split(".").pop();
      const filename = `original.${extension}`;
      await Bun.write(getFilePath(id, filename), body.file);

      await db.insert(Result).values({
        id,
        name: body.file.name.split(".").shift() ?? "",
        status: "processing",
        twoStems,
        expiresAt,
      });

      const data = JSON.stringify({
        id,
        filename,
        two_stems: twoStems,
        hash: createHash(id),
      });

      const apiUrl = new URL(`${env.DEMUCS_API}/predict`);
      const http =
        apiUrl.protocol === "https:"
          ? await import("node:https")
          : await import("node:http");

      const req = http.request(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      });

      req.on("error", async (e) => {
        console.error(e);
        await db
          .update(Result)
          .set({ status: "error" })
          .where(eq(Result.id, id));
      });
      req.write(data);
      req.end();

      const jwtData = await jwt.verify(cookie.auth.value);
      cookie.auth.set({
        value: await jwt.sign({
          results: jwtData ? [...jwtData.results, id] : [id],
        }),
        ...DEFAULT_COOKIE_OPTS,
      });

      return redirect(`/result/${id}`, 303);
    },
    {
      body: t.Object({
        two_stems: t.Union([t.Literal("on"), t.Literal("off")], {
          default: "off",
        }),
        file: t.File(),
      }),
    },
  );
