import Elysia from "elysia";

import Index from "~/html/pages/index/page";
import { renderReact } from "~/html/server";

export const index = new Elysia({ prefix: "/" }).get("/", () => {
  return renderReact(
    Index,
    { message: "Hello, world" },
    {
      title: "Hello, world!",
      description: "Elysia",
      clientScript: "src/html/pages/index/client.ts",
    },
  );
});
