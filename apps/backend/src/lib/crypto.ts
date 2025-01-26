import { customAlphabet } from "nanoid";

import { env } from "~/env";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
export const nanoid = customAlphabet(ALPHABET, 16);

export function createClientHash(string: string) {
  return new Bun.CryptoHasher("sha256", `${env.SECRET}:client`)
    .update(string)
    .digest("hex");
}

export function createServerHash(string: string) {
  return new Bun.CryptoHasher("sha256", `${env.SECRET}:server`)
    .update(string)
    .digest("hex");
}
