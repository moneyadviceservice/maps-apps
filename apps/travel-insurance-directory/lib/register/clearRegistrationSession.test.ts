import { clearRegistrationSession } from './clearRegistrationSession';

import type { IronSessionData } from 'iron-session';

describe('clearRegistrationSession', () => {
  it('clears registration and account login fields', () => {
    const session: IronSessionData = {
      fcaData: { frnNumber: '123456', firmName: 'Example Ltd' },
      userData: { mail: 'user@example.com' },
      db_id: 'firm-abc',
      savedProgressLink: '/register/firm/step1',
      firmData: { name: 'legacy' },
      firm: { name: 'legacy' },
      isAccountAuthenticated: true,
      accountEmail: 'user@example.com',
      accountIdToken: 'token-123',
    };

    expect(clearRegistrationSession(session)).toBe(true);
    expect(session.fcaData).toBeUndefined();
    expect(session.userData).toBeUndefined();
    expect(session.db_id).toBeUndefined();
    expect(session.savedProgressLink).toBeUndefined();
    expect(session.firmData).toBeUndefined();
    expect(session.firm).toBeUndefined();
    expect(session.isAccountAuthenticated).toBeUndefined();
    expect(session.accountEmail).toBeUndefined();
    expect(session.accountIdToken).toBeUndefined();
  });

  it('returns false when registration and auth fields are already empty', () => {
    const session: IronSessionData = {};

    expect(clearRegistrationSession(session)).toBe(false);
  });
});
