import { createFirm } from 'lib/firms/createFirm';
import { fetchFirmByPrincipalEmail } from 'lib/firms/fetchFirmByPrincipalEmail';
import { syncRegistrationSessionFromFirm } from 'lib/register/syncRegistrationSessionFromFirm';
import type { IronSessionData } from 'iron-session';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { ensureSelfServeE2eFirm } from './ensureSelfServeE2eFirm';
import { selfServeE2eConstants } from './selfServeE2eConstants';

jest.mock('lib/firms/createFirm');
jest.mock('lib/firms/fetchFirmByPrincipalEmail');
jest.mock('lib/register/syncRegistrationSessionFromFirm');

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn().mockReturnValue({
      container: jest.fn().mockReturnValue({}),
    }),
  })),
}));

const mockedFetch = fetchFirmByPrincipalEmail as jest.MockedFunction<
  typeof fetchFirmByPrincipalEmail
>;
const mockedCreate = createFirm as jest.MockedFunction<typeof createFirm>;
const mockedSync = syncRegistrationSessionFromFirm as jest.MockedFunction<
  typeof syncRegistrationSessionFromFirm
>;

describe('ensureSelfServeE2eFirm', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedSync.mockReturnValue(true);
  });

  afterAll(() => {
    process.env.CI = originalCi;
  });

  it('returns unauthorized when CI is not true', async () => {
    delete process.env.CI;
    const session = { accountEmail: 'a@test.com' } as IronSessionData;

    const result = await ensureSelfServeE2eFirm(session);

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(mockedFetch).not.toHaveBeenCalled();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('returns error when account email is missing', async () => {
    process.env.CI = 'true';
    const session = {} as IronSessionData;

    const result = await ensureSelfServeE2eFirm(session);

    expect(result).toEqual({ success: false, error: 'Missing account email' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('syncs session when a main firm already exists for the email', async () => {
    process.env.CI = 'true';
    const session = { accountEmail: 'run@test.com' } as IronSessionData;
    const firm = {
      id: 'firm-1',
      type: 'main',
      fca_number: 123456,
      registered_name: 'e2e main firm',
    } as MainTravelInsuranceFirmDocument;
    mockedFetch.mockResolvedValue({ success: true, response: firm });

    const result = await ensureSelfServeE2eFirm(session);

    expect(result).toEqual({ success: true });
    expect(mockedFetch).toHaveBeenCalledWith('run@test.com');
    expect(mockedSync).toHaveBeenCalledWith(session, firm);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('creates a firm when none exists for the email', async () => {
    process.env.CI = 'true';
    const session = { accountEmail: 'new@test.com' } as IronSessionData;
    const firm = {
      id: 'firm-new',
      type: 'main',
      fca_number: 123456,
      registered_name: selfServeE2eConstants.registeredName,
    } as MainTravelInsuranceFirmDocument;
    mockedFetch.mockResolvedValue({ success: false, error: 'Firm not found' });
    mockedCreate.mockResolvedValue({ success: true, response: firm });

    const result = await ensureSelfServeE2eFirm(session);

    expect(result).toEqual({ success: true });
    expect(mockedCreate).toHaveBeenCalledWith({
      frnNumber: selfServeE2eConstants.fcaNumberString,
      firmName: selfServeE2eConstants.registeredName,
      principal: {
        first_name: 'E2E',
        last_name: 'User',
        email_address: 'new@test.com',
        individual_reference_number: 'E2E000',
      },
    });
    expect(mockedSync).toHaveBeenCalledWith(session, firm);
  });

  it('returns error when createFirm fails', async () => {
    process.env.CI = 'true';
    const session = { accountEmail: 'fail@test.com' } as IronSessionData;
    mockedFetch.mockResolvedValue({ success: false, error: 'Firm not found' });
    mockedCreate.mockResolvedValue({
      success: false,
      error: 'Failed to create organisation',
    });

    const result = await ensureSelfServeE2eFirm(session);

    expect(result).toEqual({
      success: false,
      error: 'Failed to create organisation',
    });
    expect(mockedSync).not.toHaveBeenCalled();
  });

  it('returns fallback error when createFirm succeeds without a firm response', async () => {
    process.env.CI = 'true';
    const session = { accountEmail: 'bad@test.com' } as IronSessionData;
    mockedFetch.mockResolvedValue({ success: false, error: 'Firm not found' });
    mockedCreate.mockResolvedValue({ success: true });

    const result = await ensureSelfServeE2eFirm(session);

    expect(result).toEqual({
      success: false,
      error: 'Failed to create e2e firm',
    });
    expect(mockedSync).not.toHaveBeenCalled();
  });
});
