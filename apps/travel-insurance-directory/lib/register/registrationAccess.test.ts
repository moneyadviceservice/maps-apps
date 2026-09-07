import {
  getRegistrationAccessRedirect,
  type RegistrationAccessRequirement,
} from './registrationAccessRules';

import type { IronSessionData } from 'iron-session';

describe('getRegistrationAccessRedirect', () => {
  const emptySession: IronSessionData = {};
  const fcaOnly: IronSessionData = {
    fcaData: { frnNumber: '123456', firmName: 'Example Ltd' },
  };
  const withFirm: IronSessionData = {
    ...fcaOnly,
    userData: { mail: 'user@example.com' },
    db_id: 'firm-abc',
  };

  it.each<[RegistrationAccessRequirement, IronSessionData, string | null]>([
    ['fca', emptySession, '/register/fca'],
    ['fca', fcaOnly, null],
    ['firm', emptySession, '/register/fca'],
    ['firm', fcaOnly, '/register/user'],
    ['firm', withFirm, null],
    ['save', fcaOnly, '/register/user'],
    ['save', withFirm, null],
    ['result', fcaOnly, '/register'],
    ['result', withFirm, null],
  ])(
    'requirement %s with given session returns %s',
    (requirement, session, expected) => {
      expect(getRegistrationAccessRedirect(session, requirement)).toBe(
        expected,
      );
    },
  );
});
