import Elysia from "elysia";

import Editor from "~/html/pages/editor/page";
import { renderReact } from "~/html/server";

export const editor = new Elysia({ prefix: "/editor" }).get("/", async () => {
  return renderReact(
    Editor,
    {},
    {
      title: "Editor",
      description: "The editor",
      clientScript: "src/html/pages/editor/client.ts",
    },
  );
});
