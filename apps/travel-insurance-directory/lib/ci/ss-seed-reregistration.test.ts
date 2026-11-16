import { addMonths, subMonths } from 'date-fns';
import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared';
import { getFirmById } from 'lib/firms/fetchFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import type { IronSessionObject } from 'types/iron-session';

import {
  parseReregistrationSeedMode,
  REREGISTRATION_SEED_QUERY,
  seedReregistrationForSS,
} from './ss-seed-reregistration';

jest.mock('lib/account/tripCover/shared');
jest.mock('lib/firms/fetchFirm');
jest.mock('lib/firms/updateFirm');

const mockGetIronSession = jest.fn();

jest.mock('iron-session', () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn().mockReturnValue({
      container: jest.fn().mockReturnValue({}),
    }),
  })),
}));

describe('parseReregistrationSeedMode', () => {
  it('parses 30-day-window and past-anniversary modes', () => {
    expect(
      parseReregistrationSeedMode(REREGISTRATION_SEED_QUERY.thirtyDayWindow),
    ).toBe('thirtyDayWindow');
    expect(
      parseReregistrationSeedMode(REREGISTRATION_SEED_QUERY.pastAnniversary),
    ).toBe('pastAnniversary');
    expect(parseReregistrationSeedMode('other')).toBeNull();
  });
});

describe('seedReregistrationForSS', () => {
  const mockSession = {
    db_id: 'firm_123',
    save: jest.fn().mockResolvedValue(undefined),
    firmData: undefined,
  } as unknown as IronSessionObject;

  const originalEnv = process.env.CI;
  const now = new Date('2026-07-15T12:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CI = 'true';
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({
      firm: createMockFirm({ id: 'firm_123' }),
      isTrading: false,
    });
    (updateFirm as jest.Mock).mockResolvedValue({ success: true });
  });

  afterAll(() => {
    process.env.CI = originalEnv;
  });

  it('returns unauthorized when CI is not set', async () => {
    delete process.env.CI;

    const result = await seedReregistrationForSS(
      mockSession,
      'thirtyDayWindow',
      now,
    );

    expect(result).toEqual({ error: 'Unauthorized', success: false });
    expect(updateFirm).not.toHaveBeenCalled();
  });

  it('seeds 30-day-window dating and hydrates session.firmData', async () => {
    const approvedAt = subMonths(now, 11);
    approvedAt.setDate(approvedAt.getDate() - 15);
    const seededFirm = createMockFirm({
      id: 'firm_123',
      approved_at: approvedAt.toISOString(),
      reregistered_at: null,
      reregister_approved_at: null,
      renewal_draft: null,
    });
    (getFirmById as jest.Mock).mockResolvedValue({
      success: true,
      response: seededFirm,
    });

    const result = await seedReregistrationForSS(
      mockSession,
      'thirtyDayWindow',
      now,
    );

    expect(result).toEqual({ success: true, firm: seededFirm });
    expect(updateFirm).toHaveBeenCalledWith(
      'firm_123',
      expect.objectContaining({
        approved_at: approvedAt.toISOString(),
        reregistered_at: null,
        reregister_approved_at: null,
        renewal_draft: null,
        renewal_resume_href: null,
      }),
    );
    expect(mockSession.save).not.toHaveBeenCalled();
  });

  it('seeds past-anniversary pending trigger without shifting period base', async () => {
    const approvedAt = subMonths(now, 13);
    const pendingTriggerAt = addMonths(approvedAt, 12);
    const seededFirm = createMockFirm({
      id: 'firm_123',
      approved_at: approvedAt.toISOString(),
      reregistered_at: pendingTriggerAt.toISOString(),
      reregister_approved_at: null,
    });
    (getFirmById as jest.Mock).mockResolvedValue({
      success: true,
      response: seededFirm,
    });

    const result = await seedReregistrationForSS(
      mockSession,
      'pastAnniversary',
      now,
    );

    expect(result).toEqual({ success: true, firm: seededFirm });
    expect(updateFirm).toHaveBeenCalledWith(
      'firm_123',
      expect.objectContaining({
        approved_at: approvedAt.toISOString(),
        reregistered_at: pendingTriggerAt.toISOString(),
        reregister_approved_at: null,
      }),
    );
  });

  it('returns error when firm cannot be resolved', async () => {
    (resolveAccountFirmById as jest.Mock).mockResolvedValue(null);

    const result = await seedReregistrationForSS(
      mockSession,
      'thirtyDayWindow',
      now,
    );

    expect(result).toEqual({
      error: 'Could not resolve session with firm ID',
      success: false,
    });
  });

  it('returns error when updateFirm fails', async () => {
    (updateFirm as jest.Mock).mockResolvedValue({ success: false });

    const result = await seedReregistrationForSS(
      mockSession,
      'thirtyDayWindow',
      now,
    );

    expect(result).toEqual({
      error: 'A problem occurred seeding reregistration state',
      success: false,
    });
  });
});
