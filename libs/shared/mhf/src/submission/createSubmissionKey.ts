import { createHash } from 'node:crypto';

/**
 * Creates a unique submission key by hashing the request body using SHA-256.
 * @param requestBody The request body to be hashed.
 * @returns The SHA-256 hash of the request body as a hexadecimal string.
 */
export const createSubmissionKey = (requestBody: string): string =>
  createHash('sha256').update(requestBody, 'utf8').digest('hex');
