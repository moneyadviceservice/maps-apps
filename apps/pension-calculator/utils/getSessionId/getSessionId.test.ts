import {
  rawSessionId,
  withSessionEncryptionKey,
} from 'test-utils/sessionEncryption';
import { decryptSessionId } from 'utils/sessionToken';

import { getSessionId } from './getSessionId';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

describe('getSessionId', () => {
  withSessionEncryptionKey();

  it('returns an existing session id', () => {
    expect(getSessionId('existing')).toBe('existing');
    expect(getSessionId(['existing'])).toBe('existing');
  });

  it('encrypts a new session id when one is missing', () => {
    const sessionId = getSessionId();

    expect(sessionId).not.toBe(rawSessionId);
    expect(decryptSessionId(sessionId)).toBe(rawSessionId);
  });
});
