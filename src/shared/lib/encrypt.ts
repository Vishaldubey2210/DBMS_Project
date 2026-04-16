import crypto from "crypto";

const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32-byte hex key
const IV_LEN = 16;

export function encryptData(text: string): string {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptData(payload: string): string {
  const [ivHex, encHex] = payload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
