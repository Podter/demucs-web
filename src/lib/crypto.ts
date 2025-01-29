import { customAlphabet } from "nanoid";

import { env } from "~/env";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
export const nanoid = customAlphabet(ALPHABET, 16);

export function createHash(string: string) {
  const hash = new Bun.CryptoHasher("sha256", env.SECRET)
    .update(string)
    .digest("hex");
  return hash;
}
