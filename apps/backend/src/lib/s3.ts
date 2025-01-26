import { env } from "~/env";

export const s3 = new Bun.S3Client({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  bucket: env.S3_BUCKET,
});
