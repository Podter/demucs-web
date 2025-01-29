import Elysia from "elysia";

import Index from "~/html/pages/index/page";
import { renderReact } from "~/html/server";
import { getClientAsset } from "~/lib/manifest";

export const index = new Elysia({ prefix: "/" }).get("/", async () => {
  return renderReact(
    Index,
    { message: "Hello, world" },
    {
      title: "Hello, world!",
      description: "Elysia",
      clientScript: await getClientAsset("src/html/pages/index/client.ts"),
    },
  );
});
