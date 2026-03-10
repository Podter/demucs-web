import { REDIS_URL } from "astro:env/server";
import { RedisClient } from "bun";

import type { SeparationData } from "./schema";
import { SeparationDataSchema } from "./schema";

export const redis = new RedisClient(REDIS_URL);

export async function saveSeparationData(
  id: string,
  data: SeparationData,
  publish = false,
) {
  const key = `separation:${id}`;
  await redis.set(key, JSON.stringify(data));
  await redis.expire(key, 60 * 60 * 24); // Expire after 24 hours
  if (publish) {
    await redis.publish(key, JSON.stringify(data));
  }
}

export async function getSeparationData(
  id: string,
): Promise<SeparationData | null> {
  const data = await redis.get(`separation:${id}`);
  if (data) {
    return SeparationDataSchema.parse(JSON.parse(data));
  }
  return null;
}

export async function subscribeSeparation(
  id: string,
  callback: (data: SeparationData) => void,
) {
  const subscriber = await redis.duplicate();
  const key = `separation:${id}`;
  await subscriber.subscribe(key, (message) => {
    const data = SeparationDataSchema.parse(JSON.parse(message));
    callback(data);
  });
  return async () => {
    await subscriber.unsubscribe(key);
    subscriber.close();
  };
}

export async function saveSeparationFile(
  id: string,
  filename: string,
  mimeType: string,
  fileData: Uint8Array<ArrayBuffer>,
) {
  const data = await getSeparationData(id);
  if (data) {
    data.files[filename] = mimeType;
    await saveSeparationData(id, data);
    const fileKey = `file:${id}:${filename}`;
    await redis.set(fileKey, fileData);
    await redis.expire(fileKey, 60 * 60 * 24); // Expire after 24 hours
  }
}

export async function getSeparationFile(
  id: string,
  filename: string,
): Promise<{ mimeType: string; fileData: Uint8Array<ArrayBuffer> } | null> {
  const data = await getSeparationData(id);
  if (data?.files[filename]) {
    const fileData = await redis.getBuffer(`file:${id}:${filename}`);
    if (fileData) {
      return { mimeType: data.files[filename], fileData };
    }
  }
  return null;
}
