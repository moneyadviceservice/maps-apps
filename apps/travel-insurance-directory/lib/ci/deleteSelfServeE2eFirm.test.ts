import {
  deleteTradingFirmDocument,
  fetchTradingDocsByMainFirmId,
} from 'lib/account/tradingFirm';
import { fetchFirmByPrincipalEmail } from 'lib/firms/fetchFirmByPrincipalEmail';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import type { TradingTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { deleteSelfServeE2eFirm } from './deleteSelfServeE2eFirm';

const mockDelete = jest.fn();
const mockItem = jest.fn().mockReturnValue({ delete: mockDelete });

jest.mock('lib/firms/fetchFirmByPrincipalEmail');
jest.mock('lib/account/tradingFirm');
jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: {
        item: (...args: unknown[]) => mockItem(...args),
      },
    }),
}));

const mockedFetch = fetchFirmByPrincipalEmail as jest.MockedFunction<
  typeof fetchFirmByPrincipalEmail
>;
const mockedFetchTrading = fetchTradingDocsByMainFirmId as jest.MockedFunction<
  typeof fetchTradingDocsByMainFirmId
>;
const mockedDeleteTrading = deleteTradingFirmDocument as jest.MockedFunction<
  typeof deleteTradingFirmDocument
>;

describe('deleteSelfServeE2eFirm', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    jest.clearAllMocks();
    mockItem.mockReturnValue({ delete: mockDelete });
  });

  afterAll(() => {
    process.env.CI = originalCi;
  });

  it('returns unauthorized when CI is not true', async () => {
    delete process.env.CI;

    const result = await deleteSelfServeE2eFirm('e2e-user+run@test.com');

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('rejects emails that are not e2e self-serve addresses', async () => {
    process.env.CI = 'true';

    const result = await deleteSelfServeE2eFirm('real-user@example.com');

    expect(result).toEqual({
      success: false,
      error: 'Email is not an e2e self-serve address',
    });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('returns error when email is blank', async () => {
    process.env.CI = 'true';

    const result = await deleteSelfServeE2eFirm('   ');

    expect(result).toEqual({ success: false, error: 'Missing account email' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('returns success without delete when no firm exists', async () => {
    process.env.CI = 'true';
    mockedFetch.mockResolvedValue({ success: false, error: 'Firm not found' });

    const result = await deleteSelfServeE2eFirm('e2e-user+gone@test.com');

    expect(result).toEqual({ success: true, deleted: false });
    expect(mockedFetchTrading).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('returns error when main firm is missing id', async () => {
    process.env.CI = 'true';
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });

    const result = await deleteSelfServeE2eFirm('e2e-user+noid@test.com');

    expect(result).toEqual({ success: false, error: 'Firm is missing id' });
    expect(mockedFetchTrading).not.toHaveBeenCalled();
  });

  it('returns error when trading firms cannot be fetched', async () => {
    process.env.CI = 'true';
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        id: 'main-1',
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });
    mockedFetchTrading.mockResolvedValue({
      success: false,
      error: 'Cosmos unavailable',
    });

    const result = await deleteSelfServeE2eFirm('e2e-user+trade-fail@test.com');

    expect(result).toEqual({
      success: false,
      error: 'Cosmos unavailable',
    });
    expect(mockedDeleteTrading).not.toHaveBeenCalled();
  });

  it('uses fallback error when trading fetch fails without message', async () => {
    process.env.CI = 'true';
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        id: 'main-1',
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });
    mockedFetchTrading.mockResolvedValue({ success: false });

    const result = await deleteSelfServeE2eFirm(
      'e2e-user+trade-empty@test.com',
    );

    expect(result).toEqual({
      success: false,
      error: 'Failed to fetch trading firms',
    });
  });

  it('returns error when a trading firm delete fails', async () => {
    process.env.CI = 'true';
    const trading = {
      id: 'trading-1',
      type: 'trading',
      main_firm_id: 'main-1',
    } as TradingTravelInsuranceFirmDocument;
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        id: 'main-1',
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });
    mockedFetchTrading.mockResolvedValue({
      success: true,
      response: [trading],
    });
    mockedDeleteTrading.mockResolvedValue({
      success: false,
      error: 'Trading delete failed',
    });

    const result = await deleteSelfServeE2eFirm('e2e-user+del-trade@test.com');

    expect(result).toEqual({
      success: false,
      error: 'Trading delete failed',
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('uses fallback error when trading delete fails without message', async () => {
    process.env.CI = 'true';
    const trading = {
      id: 'trading-1',
      type: 'trading',
      main_firm_id: 'main-1',
    } as TradingTravelInsuranceFirmDocument;
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        id: 'main-1',
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });
    mockedFetchTrading.mockResolvedValue({
      success: true,
      response: [trading],
    });
    mockedDeleteTrading.mockResolvedValue({ success: false });

    const result = await deleteSelfServeE2eFirm(
      'e2e-user+del-trade-empty@test.com',
    );

    expect(result).toEqual({
      success: false,
      error: 'Failed to delete trading firm',
    });
  });

  it('deletes trading firms then the main firm', async () => {
    process.env.CI = 'true';
    const main = {
      id: 'main-1',
      type: 'main',
      fca_number: 123456,
    } as MainTravelInsuranceFirmDocument;
    const trading = {
      id: 'trading-1',
      type: 'trading',
      main_firm_id: 'main-1',
    } as TradingTravelInsuranceFirmDocument;

    mockedFetch.mockResolvedValue({ success: true, response: main });
    mockedFetchTrading.mockResolvedValue({
      success: true,
      response: [trading],
    });
    mockedDeleteTrading.mockResolvedValue({ success: true });
    mockDelete.mockResolvedValue(undefined);

    const result = await deleteSelfServeE2eFirm('e2e-user+abc@test.com');

    expect(result).toEqual({ success: true, deleted: true });
    expect(mockedDeleteTrading).toHaveBeenCalledWith(trading);
    expect(mockItem).toHaveBeenCalledWith('main-1', 'main-1');
    expect(mockDelete).toHaveBeenCalled();
  });

  it('deletes main firm when trading response is undefined', async () => {
    process.env.CI = 'true';
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        id: 'main-2',
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });
    mockedFetchTrading.mockResolvedValue({ success: true });
    mockDelete.mockResolvedValue(undefined);

    const result = await deleteSelfServeE2eFirm('e2e-user+no-trade@test.com');

    expect(result).toEqual({ success: true, deleted: true });
    expect(mockedDeleteTrading).not.toHaveBeenCalled();
    expect(mockItem).toHaveBeenCalledWith('main-2', 'main-2');
  });

  it('returns error when main firm delete throws', async () => {
    process.env.CI = 'true';
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockedFetch.mockResolvedValue({
      success: true,
      response: {
        id: 'main-3',
        type: 'main',
        fca_number: 123456,
      } as MainTravelInsuranceFirmDocument,
    });
    mockedFetchTrading.mockResolvedValue({ success: true, response: [] });
    mockDelete.mockRejectedValue(new Error('cosmos down'));

    const result = await deleteSelfServeE2eFirm(
      'e2e-user+delete-fail@test.com',
    );

    expect(result).toEqual({
      success: false,
      error: 'Failed to delete main firm',
    });
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
