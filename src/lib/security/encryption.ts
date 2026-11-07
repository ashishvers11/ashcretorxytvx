import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM

/**
 * Derives a secure 32-byte AES key from the environment variable.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.YOUTUBE_TOKEN_ENCRYPTION_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "ash-creator-studio-secure-token-key-32b";
  // Always hash to get exactly 32 bytes (256 bits)
  return crypto.createHash("sha256").update(secret).digest();
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Never store plaintext refresh tokens.
 */
export function encryptToken(plaintext: string): EncryptedData {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload.
 * Verifies the authentication tag to guarantee ciphertext integrity.
 */
export function decryptToken(encryptedData: EncryptedData): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(encryptedData.iv, "hex");
  const authTag = Buffer.from(encryptedData.authTag, "hex");
  const encryptedBuffer = Buffer.from(encryptedData.encrypted, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
