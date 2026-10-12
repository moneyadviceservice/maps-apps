import * as path from 'node:path';

export const AUTH_FILE = path.join(
  __dirname,
  '..',
  '.auth',
  'self-serve-user.json',
);

/** Persisted so globalTeardown (separate process) deletes the same firm. */
export const SELF_SERVE_EMAIL_FILE = path.join(
  __dirname,
  '..',
  '.auth',
  'self-serve-email.txt',
);
