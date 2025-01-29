import path from "node:path";
import type { Manifest } from "vite";

import { env } from "~/env";

export async function getClientAsset(src: string) {
  const module: Manifest = await import(
    path.join(env.STATIC_DIR, ".vite", "manifest.json")
  );
  return `/${module[src].file}`;
}
