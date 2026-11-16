import { decryptSessionId, encryptSessionId } from './sessionToken';

const encryptionKey = Buffer.alloc(32, 1).toString('base64');

describe('sessionToken', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, SESSION_ENCRYPTION_KEY: encryptionKey };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('decrypts an encrypted session id', () => {
    const token = encryptSessionId('123e4567e89b12d3a456426614174000');

    expect(token).not.toContain('123e4567e89b12d3a456426614174000');
    expect(decryptSessionId(token)).toBe('123e4567e89b12d3a456426614174000');
  });

  it('rejects a tampered token', () => {
    const token = encryptSessionId('123e4567e89b12d3a456426614174000');
    const tampered = `${token.slice(0, -2)}${token.endsWith('a') ? 'b' : 'a'}`;

    expect(() => decryptSessionId(tampered)).toThrow(
      'Session token is invalid',
    );
  });

  it('rejects a token that is too short', () => {
    expect(() => decryptSessionId('abc')).toThrow('Session token is invalid');
  });

  it('rejects a missing encryption key', () => {
    delete process.env.SESSION_ENCRYPTION_KEY;

    expect(() => encryptSessionId('session')).toThrow(
      'SESSION_ENCRYPTION_KEY environment variable is missing',
    );
  });

  it('rejects an encryption key that is not 32 bytes', () => {
    process.env.SESSION_ENCRYPTION_KEY =
      Buffer.from('short').toString('base64');

    expect(() => encryptSessionId('session')).toThrow(
      'SESSION_ENCRYPTION_KEY must be 32 bytes encoded as base64',
    );
  });
});
