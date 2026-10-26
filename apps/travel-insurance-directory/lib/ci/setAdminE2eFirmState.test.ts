import { adminE2eFirmConstants } from './adminE2eFirmConstants';
import {
  setAdminE2eFirmState,
  setAdminE2eFirmsState,
} from './setAdminE2eFirmState';

const mockUpsert = jest.fn();

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: {
        items: {
          upsert: (...args: unknown[]) => mockUpsert(...args),
        },
      },
    }),
}));

describe('setAdminE2eFirmState', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.CI = originalCi;
  });

  it('returns unauthorized when CI is not true', async () => {
    delete process.env.CI;

    const result = await setAdminE2eFirmState('A');

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('upserts Firm A seed when CI is true', async () => {
    process.env.CI = 'true';
    mockUpsert.mockResolvedValue({});

    const result = await setAdminE2eFirmState('A');

    expect(result).toEqual({
      success: true,
      firmId: adminE2eFirmConstants.firmA.id,
    });
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: adminE2eFirmConstants.firmA.id,
        status: 'hidden',
      }),
    );
  });

  it('upserts Firm B seed when CI is true', async () => {
    process.env.CI = 'true';
    mockUpsert.mockResolvedValue({});

    const result = await setAdminE2eFirmState('B');

    expect(result).toEqual({
      success: true,
      firmId: adminE2eFirmConstants.firmB.id,
    });
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: adminE2eFirmConstants.firmB.id,
        status: 'active',
      }),
    );
  });

  it('returns error when upsert fails', async () => {
    process.env.CI = 'true';
    mockUpsert.mockRejectedValue(new Error('cosmos down'));

    const result = await setAdminE2eFirmState('A');

    expect(result).toEqual({
      success: false,
      error: 'Failed to seed admin e2e firm',
    });
  });

  it('setAdminE2eFirmsState upserts all firms for all', async () => {
    process.env.CI = 'true';
    mockUpsert.mockResolvedValue({});

    const result = await setAdminE2eFirmsState('all');

    expect(result.success).toBe(true);
    expect(mockUpsert).toHaveBeenCalledTimes(3);
    expect(result.firmId).toBe(adminE2eFirmConstants.firmC.id);
  });

  it('upserts Firm C seed when CI is true', async () => {
    process.env.CI = 'true';
    mockUpsert.mockResolvedValue({});

    const result = await setAdminE2eFirmState('C');

    expect(result).toEqual({
      success: true,
      firmId: adminE2eFirmConstants.firmC.id,
    });
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: adminE2eFirmConstants.firmC.id,
        approved_at: null,
        reregister_approved_at: null,
        cover_service_confirmed_at: null,
        customer_contact_confirmed_at: null,
      }),
    );
  });
});
