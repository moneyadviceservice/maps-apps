jest.mock('lib/firms/fetchFirm', () => ({
  getFirmById: jest.fn(),
}));

jest.mock('lib/firms/fetchFirmByPrincipalEmail', () => ({
  fetchFirmByPrincipalEmail: jest.fn(),
}));

import { getFirmById } from 'lib/firms/fetchFirm';
import { fetchFirmByPrincipalEmail } from 'lib/firms/fetchFirmByPrincipalEmail';

import { resolveAccountMainFirm } from './resolveAccountMainFirm';

import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

const mockedFetchFirmByPrincipalEmail = fetchFirmByPrincipalEmail as jest.Mock;
const mockedGetFirmById = getFirmById as jest.Mock;

function asMainFirm(
  partial: Partial<MainTravelInsuranceFirmDocument>,
): MainTravelInsuranceFirmDocument {
  return {
    type: 'main',
    id: 'firm-abc',
    fca_number: 123456,
    registered_name: 'Example Ltd',
    ...partial,
  } as MainTravelInsuranceFirmDocument;
}

describe('resolveAccountMainFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns firm matched by principal email', async () => {
    const firm = asMainFirm({
      principal: { email_address: 'user@example.com' } as never,
    });
    mockedFetchFirmByPrincipalEmail.mockResolvedValue({ response: firm });

    const result = await resolveAccountMainFirm({
      accountEmail: 'user@example.com',
      db_id: 'other-id',
    });

    expect(result.firm).toBe(firm);
    expect(mockedGetFirmById).not.toHaveBeenCalled();
  });

  it('falls back to db_id when email lookup fails and principal email matches', async () => {
    const firm = asMainFirm({
      id: 'firm-from-session',
      principal: { email_address: 'user@example.com' } as never,
    });
    mockedFetchFirmByPrincipalEmail.mockResolvedValue({ response: undefined });
    mockedGetFirmById.mockResolvedValue({ success: true, response: firm });

    const result = await resolveAccountMainFirm({
      accountEmail: 'user@example.com',
      db_id: 'firm-from-session',
    });

    expect(result.firm).toBe(firm);
    expect(mockedGetFirmById).toHaveBeenCalled();
  });

  it('falls back to db_id when principal email is missing on firm', async () => {
    const firm = asMainFirm({
      id: 'firm-from-session',
      principal: { email_address: null } as never,
    });
    mockedFetchFirmByPrincipalEmail.mockResolvedValue({ response: undefined });
    mockedGetFirmById.mockResolvedValue({ success: true, response: firm });

    const result = await resolveAccountMainFirm({
      accountEmail: 'user@example.com',
      db_id: 'firm-from-session',
    });

    expect(result.firm).toBe(firm);
  });

  it('rejects db_id firm when principal email differs from account email', async () => {
    const firm = asMainFirm({
      id: 'firm-from-session',
      principal: { email_address: 'other@example.com' } as never,
    });
    mockedFetchFirmByPrincipalEmail.mockResolvedValue({ response: undefined });
    mockedGetFirmById.mockResolvedValue({ success: true, response: firm });

    const result = await resolveAccountMainFirm({
      accountEmail: 'user@example.com',
      db_id: 'firm-from-session',
    });

    expect(result.firm).toBeNull();
  });

  it('returns null when account email is missing', async () => {
    const result = await resolveAccountMainFirm({ db_id: 'firm-from-session' });

    expect(result.firm).toBeNull();
    expect(mockedFetchFirmByPrincipalEmail).not.toHaveBeenCalled();
  });
});
