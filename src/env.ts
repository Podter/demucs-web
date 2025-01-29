import path from "node:path";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),

    SECRET: z.string(),
    DEMUCS_API: z.string(),

    PORT: z.string().transform(Number).default("3000"),
    DATA_DIR: z.string().default("data"),
    STATIC_DIR: z.string().default(path.join(process.cwd(), "dist", "static")),
  },
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
});
