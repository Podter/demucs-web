import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.string().transform(Number).default("3000"),
    STATIC_PATH: z.string().default("static"),

    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_REGION: z.string(),
    S3_ENDPOINT: z.string(),
    S3_BUCKET: z.string(),
  },
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
});
