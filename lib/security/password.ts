import crypto from "crypto";

const ITERATIONS = 216_000;
const KEY_LEN = 32;
const DIGEST = "sha256";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64");
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("base64");
  return `pbkdf2_${DIGEST}$${ITERATIONS}$${salt}$${key}`;
}

export function verifyPassword(password: string, hashedPassword: string) {
  try {
    if (hashedPassword.startsWith("pbkdf2_")) {
      const [algo, iterations, salt, key] = hashedPassword.split("$");
      const [_, digest] = algo.split("_"); // eslint-disable-line @typescript-eslint/no-unused-vars

      return crypto.timingSafeEqual(
        Buffer.from(key, "base64"),
        crypto.pbkdf2Sync(password, salt, Number(iterations), KEY_LEN, digest),
      );
    }
  } catch {}

  return false;
}
