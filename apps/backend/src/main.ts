import fs from "node:fs/promises";
import path from "node:path";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

import { api } from "./routes/api";

const app = new Elysia();

app.use(cors());
app.use(api);

const STATIC_PATH = path.join(import.meta.dirname, "static");
if (await fs.exists(STATIC_PATH)) {
  app.use(
    staticPlugin({
      assets: STATIC_PATH,
      prefix: "/",
    }),
  );
}

app.listen(3000, (server) => {
  console.log(`demucs-web backend running at ${server.url.toString()}`);
});
