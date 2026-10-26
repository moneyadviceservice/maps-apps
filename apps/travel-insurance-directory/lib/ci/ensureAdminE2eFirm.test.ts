import { getFirmById } from 'lib/firms/fetchFirm';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { adminE2eFirmConstants } from './adminE2eFirmConstants';
import { ensureAdminE2eFirm, ensureAdminE2eFirms } from './ensureAdminE2eFirm';

const mockCreate = jest.fn();

jest.mock('lib/firms/fetchFirm');
jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: {
        items: {
          create: (...args: unknown[]) => mockCreate(...args),
        },
      },
    }),
}));

const mockedGetFirmById = getFirmById as jest.MockedFunction<
  typeof getFirmById
>;

describe('ensureAdminE2eFirm', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.CI = originalCi;
  });

  it('returns unauthorized when CI is not true', async () => {
    delete process.env.CI;

    const result = await ensureAdminE2eFirm('A');

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(mockedGetFirmById).not.toHaveBeenCalled();
  });

  it('returns existing firm without creating', async () => {
    process.env.CI = 'true';
    mockedGetFirmById.mockResolvedValue({
      success: true,
      response: {
        id: adminE2eFirmConstants.firmA.id,
        type: 'main',
      } as MainTravelInsuranceFirmDocument,
    });

    const result = await ensureAdminE2eFirm('A');

    expect(result).toEqual({
      success: true,
      firmId: adminE2eFirmConstants.firmA.id,
      created: false,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('creates the firm when missing', async () => {
    process.env.CI = 'true';
    mockedGetFirmById.mockResolvedValue({
      success: false,
      error: 'Firm not found',
    });
    mockCreate.mockResolvedValue({});

    const result = await ensureAdminE2eFirm('B');

    expect(result).toEqual({
      success: true,
      firmId: adminE2eFirmConstants.firmB.id,
      created: true,
    });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: adminE2eFirmConstants.firmB.id,
        status: 'active',
      }),
    );
  });

  it('returns error when create fails', async () => {
    process.env.CI = 'true';
    mockedGetFirmById.mockResolvedValue({
      success: false,
      error: 'Firm not found',
    });
    mockCreate.mockRejectedValue(new Error('boom'));

    const result = await ensureAdminE2eFirm('A');

    expect(result).toEqual({
      success: false,
      error: 'Failed to create admin e2e firm',
    });
  });

  it('ensureAdminE2eFirms seeds all default firms', async () => {
    process.env.CI = 'true';
    mockedGetFirmById.mockResolvedValue({
      success: true,
      response: {
        id: 'any',
        type: 'main',
      } as MainTravelInsuranceFirmDocument,
    });

    const result = await ensureAdminE2eFirms();

    expect(result).toEqual({ success: true });
    expect(mockedGetFirmById).toHaveBeenCalledTimes(3);
  });
});
