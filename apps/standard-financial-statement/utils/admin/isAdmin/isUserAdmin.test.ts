import { IronSessionData } from 'iron-session';

import { isUserAdmin } from './isUserAdmin';

describe('isUserAdmin', () => {
  it('returns true when session roles includes sfs_admin', () => {
    const mockSession = {
      account: { idTokenClaims: { roles: ['sfs_admin'] } },
    };

    const isAdmin = isUserAdmin(mockSession as IronSessionData);

    expect(isAdmin).toEqual(true);
  });

  it('returns false when session roles does not include sfs_admin', () => {
    const mockSession = {
      account: {},
    };

    const isAdmin = isUserAdmin(mockSession as IronSessionData);

    expect(isAdmin).toEqual(false);
  });
});
