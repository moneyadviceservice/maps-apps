import { createMockFirm } from 'components/FirmSummary/mockFirm';
import {
  buildTradingFirmPayload,
  createTradingFirm,
} from 'lib/account/tradingFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared';
import { selfServeE2eConstants } from 'lib/ci/selfServeE2eConstants';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';
import type { IronSessionObject } from 'types/iron-session';

import { seedInvalidTradingNameForSS } from './ss-seed-invalid-trading-name';

jest.mock('lib/account/tripCover/shared');
jest.mock('lib/account/tradingFirm', () => ({
  buildTradingFirmPayload: jest.fn(),
  createTradingFirm: jest.fn(),
}));

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

describe('seedInvalidTradingNameForSS', () => {
  const mockSession = {
    db_id: 'firm_123',
  } as unknown as IronSessionObject;
  const originalEnv = process.env.CI;
  const tradingPayload = {
    type: 'trading' as const,
    main_firm_id: 'firm_123',
    registered_name: selfServeE2eConstants.tradingNames[0],
    status: 'hidden' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CI = 'true';
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({
      firm: createMockFirm({ id: 'firm_123', fca_number: 123_456 }),
      isTrading: false,
    });
    (buildTradingFirmPayload as jest.Mock).mockReturnValue(tradingPayload);
    (createTradingFirm as jest.Mock).mockResolvedValue({
      success: true,
      response: { id: 'trading-1', ...tradingPayload },
    });
  });

  afterAll(() => {
    process.env.CI = originalEnv;
  });

  it('returns unauthorized when CI is not set', async () => {
    delete process.env.CI;

    const result = await seedInvalidTradingNameForSS(
      mockSession,
      HIDDEN_DUE_TO_TRADING_NAME,
    );

    expect(result).toEqual({ error: 'Unauthorized', success: false });
    expect(createTradingFirm).not.toHaveBeenCalled();
  });

  it('creates a trading firm with the given hidden reason', async () => {
    const result = await seedInvalidTradingNameForSS(
      mockSession,
      HIDDEN_DUE_TO_TRADING_NAME,
    );

    expect(buildTradingFirmPayload).toHaveBeenCalledWith({
      name: selfServeE2eConstants.tradingNames[0],
      mainFrn: 123_456,
      mainFirmId: 'firm_123',
    });
    expect(createTradingFirm).toHaveBeenCalledWith({
      ...tradingPayload,
      hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
    });
    expect(result).toEqual({
      success: true,
      firm: { id: 'trading-1', ...tradingPayload },
    });
  });

  it('creates a trading firm hidden for Invalid_FCA when that reason is passed', async () => {
    await seedInvalidTradingNameForSS(mockSession, HIDDEN_DUE_TO_FCA);

    expect(createTradingFirm).toHaveBeenCalledWith({
      ...tradingPayload,
      hidden_reason: HIDDEN_DUE_TO_FCA,
    });
  });

  it('returns error when firm cannot be resolved', async () => {
    (resolveAccountFirmById as jest.Mock).mockResolvedValue(null);

    const result = await seedInvalidTradingNameForSS(
      mockSession,
      HIDDEN_DUE_TO_TRADING_NAME,
    );

    expect(result).toEqual({
      error: 'Could not resolve session with firm ID',
      success: false,
    });
    expect(createTradingFirm).not.toHaveBeenCalled();
  });

  it('returns error when session has no firm ID', async () => {
    const result = await seedInvalidTradingNameForSS(
      {} as unknown as IronSessionObject,
      HIDDEN_DUE_TO_TRADING_NAME,
    );

    expect(result).toEqual({
      error: 'Could not resolve session with firm ID',
      success: false,
    });
    expect(createTradingFirm).not.toHaveBeenCalled();
  });

  it('returns error when createTradingFirm fails', async () => {
    (createTradingFirm as jest.Mock).mockResolvedValue({ success: false });

    const result = await seedInvalidTradingNameForSS(
      mockSession,
      HIDDEN_DUE_TO_TRADING_NAME,
    );

    expect(result).toEqual({
      error: 'A problem occurred seeding invalid trading name state',
      success: false,
    });
  });
});
