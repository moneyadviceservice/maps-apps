export const sessionEncryptionKey = Buffer.alloc(32, 1).toString('base64');
export const rawSessionId = '123e4567e89b12d3a456426614174000';

export const withSessionEncryptionKey = () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      SESSION_ENCRYPTION_KEY: sessionEncryptionKey,
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });
};
