import { APP_SECRET } from "astro:env/server";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 16);

function hmac(message: string): string {
  const hasher = new Bun.CryptoHasher("sha256", APP_SECRET);
  hasher.update(message);
  return hasher.digest("hex");
}

export function generateId() {
  const id = nanoid();
  const idHmac = hmac(id);
  return {
    id,
    hmac: idHmac,
    idHmacBase64: Buffer.from(`${id}:${idHmac}`).toString("base64url"),
  };
}

type ValidateIdResult = { valid: true; id: string } | { valid: false };

export function validateId(idBase64: string): ValidateIdResult {
  try {
    const decoded = Buffer.from(idBase64, "base64url").toString("utf-8");
    const [id, hmacValue] = decoded.split(":");
    if (hmac(id) === hmacValue) {
      return { valid: true, id };
    } else {
      return { valid: false };
    }
  } catch {
    return { valid: false };
  }
}
