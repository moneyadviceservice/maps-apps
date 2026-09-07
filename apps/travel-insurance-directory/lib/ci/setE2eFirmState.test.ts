import {
  deleteTradingFirmDocument,
  fetchTradingDocsByMainFirmId,
} from 'lib/account/tradingFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { selfServeE2eConstants } from './selfServeE2eConstants';
import { setE2eFirmState } from './setE2eFirmState';

jest.mock('lib/account/tripCover/shared');
jest.mock('lib/account/tradingFirm');
jest.mock('lib/firms/updateFirm');

const mockGetIronSession = jest.fn();

jest.mock('iron-session', () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

const mockContainer = {};
const mockDatabase = {
  container: jest.fn().mockReturnValue(mockContainer),
};
const mockClient = {
  database: jest.fn().mockReturnValue(mockDatabase),
};

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => mockClient),
}));

describe('setE2eFirmState', () => {
  const mockSession = { db_id: 'firm_123' } as unknown as IronSessionObject;
  const originalEnv = process.env.CI;
  const updateRecord: Partial<TravelInsuranceFirmDocument> = {
    fca_number: selfServeE2eConstants.fcaNumber,
    registered_name: selfServeE2eConstants.registeredName,
    service_details: undefined,
    trip_covers: [],
    office: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchTradingDocsByMainFirmId as jest.Mock).mockResolvedValue({
      success: true,
      response: [],
    });
  });

  afterAll(() => {
    process.env.CI = originalEnv;
  });

  it('should return unauthorized error if not running in a CI environment', async () => {
    delete process.env.CI;

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({ error: 'Unauthorized', success: false });
    expect(resolveAccountFirmById).not.toHaveBeenCalled();
  });

  it('should return error if the firm cannot be resolved by ID', async () => {
    process.env.CI = 'true';
    (resolveAccountFirmById as jest.Mock).mockResolvedValue(null);

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({
      error: 'Could not resolve session with firm ID',
      success: false,
    });
    expect(resolveAccountFirmById).toHaveBeenCalledWith(
      mockSession,
      'firm_123',
    );
    expect(updateFirm).not.toHaveBeenCalled();
  });

  it('should return error if updateFirm operation fails', async () => {
    process.env.CI = 'true';
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({ id: 'firm_123' });
    (updateFirm as jest.Mock).mockResolvedValue({ success: false });

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({
      error: 'A problem occurred updating the firm record',
      success: false,
    });
  });

  it('should return success when the data is set successfully', async () => {
    process.env.CI = 'true';
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({ id: 'firm_123' });
    (updateFirm as jest.Mock).mockResolvedValue({ success: true });

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({ success: true });
    expect(updateFirm).toHaveBeenCalledWith('firm_123', updateRecord);
    expect(fetchTradingDocsByMainFirmId).toHaveBeenCalledWith('firm_123');
    expect(deleteTradingFirmDocument).not.toHaveBeenCalled();
  });

  it('should delete linked trading firm documents during data setting', async () => {
    process.env.CI = 'true';
    const tradingDoc = { id: 'trading-1', type: 'trading' };
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({ id: 'firm_123' });
    (updateFirm as jest.Mock).mockResolvedValue({ success: true });
    (fetchTradingDocsByMainFirmId as jest.Mock).mockResolvedValue({
      success: true,
      response: [tradingDoc],
    });
    (deleteTradingFirmDocument as jest.Mock).mockResolvedValue({
      success: true,
    });

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({ success: true });
    expect(deleteTradingFirmDocument).toHaveBeenCalledWith(tradingDoc);
  });

  it('should return error when trading firm deletion fails', async () => {
    process.env.CI = 'true';
    const tradingDoc = { id: 'trading-1', type: 'trading' };
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({ id: 'firm_123' });
    (updateFirm as jest.Mock).mockResolvedValue({ success: true });
    (fetchTradingDocsByMainFirmId as jest.Mock).mockResolvedValue({
      success: true,
      response: [tradingDoc],
    });
    (deleteTradingFirmDocument as jest.Mock).mockResolvedValue({
      success: false,
    });

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({
      error: 'Failed to delete trading firm documents during reset',
      success: false,
    });
  });

  it('should return error when trading firm fetch fails', async () => {
    process.env.CI = 'true';
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({ id: 'firm_123' });
    (updateFirm as jest.Mock).mockResolvedValue({ success: true });
    (fetchTradingDocsByMainFirmId as jest.Mock).mockResolvedValue({
      success: false,
    });

    const result = await setE2eFirmState(mockSession, updateRecord);

    expect(result).toEqual({
      error: 'Failed to fetch trading firm documents for reset',
      success: false,
    });
    expect(deleteTradingFirmDocument).not.toHaveBeenCalled();
  });
});
