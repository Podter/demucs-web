import { customAlphabet } from "nanoid";

import { env } from "~/env";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
export const nanoid = customAlphabet(ALPHABET, 16);

export function createClientHash(string: string) {
  const hash = new Bun.CryptoHasher("sha256", `${env.SECRET}:client`)
    .update(string)
    .digest("hex");
  return `${hash}:client`;
}

export function createServerHash(string: string) {
  const hash = new Bun.CryptoHasher("sha256", `${env.SECRET}:server`)
    .update(string)
    .digest("hex");
  return `${hash}:server`;
}

type HashType = "client" | "server";
export function getHashType(hash: string): HashType {
  return hash.split(":")[1] as HashType;
}
