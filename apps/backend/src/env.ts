import path from "node:path";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.string().transform(Number).default("3000"),
    STATIC_PATH: z.string().default(path.join(import.meta.dirname, "static")),
  },
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
});
