import { IronSessionData } from 'iron-session';

import { isUserAuthenticated } from './isUserAuthenticated';

describe('isUserAuthenticated', () => {
  it('returns true when session is authenticated and account includes a homeAccountId', () => {
    const mockSession = {
      isAuthenticated: true,
      account: { homeAccountId: 'test-home-account-id' },
    };

    const isAuthenticated = isUserAuthenticated(mockSession as IronSessionData);

    expect(isAuthenticated).toEqual(true);
  });

  it('returns false when session roles does not include sfs_admin', () => {
    const mockSession = {
      isAuthenticated: false,
    };

    const isAuthenticated = isUserAuthenticated(mockSession as IronSessionData);

    expect(isAuthenticated).toEqual(false);
  });
});
