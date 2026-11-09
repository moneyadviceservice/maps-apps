import { getSessionId } from './getSessionId';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

describe('getSessionId', () => {
  it('returns an existing session id', () => {
    expect(getSessionId('existing')).toBe('existing');
    expect(getSessionId(['existing'])).toBe('existing');
  });

  it('generates a session id without dashes when missing', () => {
    expect(getSessionId()).toBe('123e4567e89b12d3a456426614174000');
  });
});
