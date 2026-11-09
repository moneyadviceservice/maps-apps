import { syncRegistrationSessionFromFirm } from './syncRegistrationSessionFromFirm';

import type { IronSessionData } from 'iron-session';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

function asFirm(partial: Partial<MainTravelInsuranceFirmDocument>) {
  return {
    type: 'main',
    id: 'firm-abc',
    fca_number: 123456,
    registered_name: 'Example Ltd',
    ...partial,
  } as MainTravelInsuranceFirmDocument;
}

describe('syncRegistrationSessionFromFirm', () => {
  it('sets db_id and fcaData when session is empty', () => {
    const session: IronSessionData = { accountEmail: 'user@example.com' };
    const firm = asFirm({});

    expect(syncRegistrationSessionFromFirm(session, firm)).toBe(true);
    expect(session.db_id).toBe('firm-abc');
    expect(session.fcaData).toEqual({
      frnNumber: '123456',
      firmName: 'Example Ltd',
    });
    expect(session.userData?.mail).toBe('user@example.com');
  });

  it('returns false when session already matches firm', () => {
    const session: IronSessionData = {
      db_id: 'firm-abc',
      fcaData: { frnNumber: '123456', firmName: 'Example Ltd' },
      userData: { mail: 'user@example.com' },
      accountEmail: 'user@example.com',
    };
    const firm = asFirm({});

    expect(syncRegistrationSessionFromFirm(session, firm)).toBe(false);
  });

  it('updates db_id when it differs from firm.id', () => {
    const session: IronSessionData = {
      db_id: 'old-id',
      fcaData: { frnNumber: '123456', firmName: 'Example Ltd' },
    };
    const firm = asFirm({ id: 'firm-abc' });

    expect(syncRegistrationSessionFromFirm(session, firm)).toBe(true);
    expect(session.db_id).toBe('firm-abc');
  });

  it('does not set userData.mail when userData already has mail', () => {
    const session: IronSessionData = {
      accountEmail: 'other@example.com',
      userData: { mail: 'existing@example.com' },
    };
    const firm = asFirm({});

    syncRegistrationSessionFromFirm(session, firm);

    expect(session.userData?.mail).toBe('existing@example.com');
  });
});
