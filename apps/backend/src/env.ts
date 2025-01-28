import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),

    SECRET: z.string(),
    DEMUCS_API: z.string(),

    PORT: z.string().transform(Number).default("3000"),
    DATA_DIR: z.string().default("data"),
    STATIC_PATH: z.string().default("static"),
  },
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
});
