import path from "node:path";

import { env } from "~/env";

export function getFilesPath(id: string) {
  return path.join(env.DATA_DIR, "files", id);
}

export function getFilePath(id: string, filename: string) {
  return path.join(getFilesPath(id), filename);
}
