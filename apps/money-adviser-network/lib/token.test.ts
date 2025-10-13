import { jest } from '@jest/globals';
import { JWTVerifyResult, KeyLike, ResolvedKey } from 'jose';

import { decrypt, encrypt, extractUserId } from './token';

jest.mock('jose', () => {
  const mockDecrypted: JWTVerifyResult<Record<string, unknown>> &
    ResolvedKey<KeyLike> = {
    payload: { token_id: 'user-123', sub: 'fhjfnjsnfihbafhjbsdhfj' },
    protectedHeader: { alg: 'HS256' },
    key: {} as KeyLike,
  };

  const mockJwtVerify = jest
    .fn()
    .mockImplementation((): Promise<any> => Promise.resolve(mockDecrypted));

  const mockSignJWT = jest.fn(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    sign: jest
      .fn<() => Promise<string>>()
      .mockResolvedValue('mocked.jwt.token'),
  }));

  const mockCreateRemoteJWKSet = jest.fn().mockReturnThis();

  return {
    jwtVerify: mockJwtVerify,
    SignJWT: mockSignJWT,
    createRemoteJWKSet: mockCreateRemoteJWKSet,
  };
});

describe('JWT Utility Functions', () => {
  const mockPayload = { sub: '123456' };
  const mockToken = 'mocked.jwt.token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('encrypt should return a valid JWT token', async () => {
    const token = await encrypt(mockPayload);
    expect(token).toBe(mockToken);
  });

  it('decrypt should return payload and header from a valid token', async () => {
    const result = await decrypt(mockToken);
    expect(result).toEqual({
      payload: { token_id: 'user-123', sub: 'fhjfnjsnfihbafhjbsdhfj' },
      protectedHeader: { alg: 'HS256' },
    });
  });

  it('extractUserId should return user ID from a valid ID token', async () => {
    const result = await extractUserId(mockToken);
    expect(result).toEqual('fhjfnjsnfihbafhjbsdhfj');
  });
});
