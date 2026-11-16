import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm' as const;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

const encryptionKey = () => {
  const encoded = process.env.SESSION_ENCRYPTION_KEY;
  if (!encoded) {
    throw new Error('SESSION_ENCRYPTION_KEY environment variable is missing');
  }

  const key = Buffer.from(encoded, 'base64');
  if (key.length !== KEY_LENGTH) {
    throw new Error(
      'SESSION_ENCRYPTION_KEY must be 32 bytes encoded as base64',
    );
  }

  return key;
};

export const encryptSessionId = (sessionId: string): string => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(sessionId, 'utf8'),
    cipher.final(),
  ]);

  return Buffer.concat([iv, ciphertext, cipher.getAuthTag()]).toString(
    'base64url',
  );
};

export const decryptSessionId = (token: string): string => {
  const payload = Buffer.from(token, 'base64url');
  if (payload.length <= IV_LENGTH + TAG_LENGTH) {
    throw new Error('Session token is invalid');
  }

  const iv = payload.subarray(0, IV_LENGTH);
  const tag = payload.subarray(payload.length - TAG_LENGTH);
  const ciphertext = payload.subarray(IV_LENGTH, payload.length - TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, encryptionKey(), iv);
  decipher.setAuthTag(tag);

  try {
    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new Error('Session token is invalid');
  }
};
