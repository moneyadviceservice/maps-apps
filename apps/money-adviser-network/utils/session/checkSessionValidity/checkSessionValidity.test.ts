import { JWTVerifyResult } from 'jose';

import { checkSessionValidity } from './checkSessionValidity';

describe('checkSessionValidity', () => {
  const validPayload = {
    referrerId: '12345678',
    correlationId: 'corr-123',
    organisationConfirmed: true,
    organisationName: 'Acme Corp',
    loggingIn: false,
  };

  test('should return true for a valid session', async () => {
    const result = await checkSessionValidity({
      payload: validPayload,
    } as unknown as JWTVerifyResult<Record<string, unknown>>);
    expect(result).toBe(true);
  });

  test.each([
    ['null session', null, false],
    ['undefined session', undefined, false],
    ['is logging in', { ...validPayload, loggingIn: true }, false],
    ['missing referrerId', { ...validPayload, referrerId: undefined }, false],
    ['referrerId too short', { ...validPayload, referrerId: '1234567' }, false],
    [
      'referrerId too long',
      { ...validPayload, referrerId: '123456789012' },
      false,
    ],
    [
      'missing correlationId',
      { ...validPayload, correlationId: undefined },
      false,
    ],
    [
      'confirmed org with empty name',
      { ...validPayload, organisationConfirmed: true, organisationName: '' },
      false,
    ],
    [
      'unconfirmed org with empty name',
      { ...validPayload, organisationConfirmed: false, organisationName: '' },
      true,
    ],
  ])('returns %p when %s', async (description, payload, expected) => {
    const session =
      payload === null || payload === undefined ? payload : { payload };

    const result = await checkSessionValidity(
      session as unknown as JWTVerifyResult<Record<string, unknown>>,
    );
    expect(result).toBe(expected);
  });
});
