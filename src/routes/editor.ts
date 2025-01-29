import Elysia from "elysia";

import Editor from "~/html/pages/editor/page";
import { renderReact } from "~/html/server";
import { getClientAsset } from "~/lib/manifest";

export const editor = new Elysia({ prefix: "/editor" }).get("/", async () => {
  return renderReact(
    Editor,
    {},
    {
      title: "Editor",
      description: "The editor",
      clientScript: await getClientAsset("src/html/pages/editor/client.ts"),
    },
  );
});
