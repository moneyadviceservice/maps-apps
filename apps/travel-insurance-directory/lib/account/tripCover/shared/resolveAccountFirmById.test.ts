const mockedResolveAccountMainFirm = jest.fn();
const mockedFetchFirm = jest.fn();

jest.mock('lib/account/resolveAccountMainFirm', () => ({
  resolveAccountMainFirm: (...args: unknown[]) =>
    mockedResolveAccountMainFirm(...args),
}));

jest.mock('lib/firms/fetchFirm', () => ({
  getFirmById: (...args: unknown[]) => mockedFetchFirm(...args),
}));

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import type { IronSessionObject } from 'types/iron-session';
import type { TradingTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { resolveAccountFirmById } from './resolveAccountFirmById';

const session = {
  accountEmail: 'principal@example.com',
  isAccountAuthenticated: true,
} as IronSessionObject;

describe('resolveAccountFirmById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when the principal firm cannot be resolved', async () => {
    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: null });

    await expect(
      resolveAccountFirmById(session, 'any-firm-id'),
    ).resolves.toBeNull();

    expect(mockedResolveAccountMainFirm).toHaveBeenCalledWith(session);
    expect(mockedFetchFirm).not.toHaveBeenCalled();
  });

  it('returns null when the principal firm has no id', async () => {
    mockedResolveAccountMainFirm.mockResolvedValueOnce({
      firm: createMockFirm({ id: undefined as never }),
    });

    await expect(
      resolveAccountFirmById(session, 'any-firm-id'),
    ).resolves.toBeNull();
  });

  it('returns the principal firm when firmId matches', async () => {
    const principalFirm = createMockFirm({ id: 'main-firm-1' });
    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: principalFirm });

    await expect(
      resolveAccountFirmById(session, 'main-firm-1'),
    ).resolves.toEqual({
      firm: principalFirm,
      isTrading: false,
    });

    expect(mockedFetchFirm).not.toHaveBeenCalled();
  });

  it('returns null when the target firm cannot be fetched', async () => {
    const principalFirm = createMockFirm({ id: 'main-firm-1' });
    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: principalFirm });
    mockedFetchFirm.mockResolvedValueOnce({
      success: false,
      response: undefined,
    });

    await expect(
      resolveAccountFirmById(session, 'trading-firm-1'),
    ).resolves.toBeNull();
  });

  it('returns a trading firm owned by the principal', async () => {
    const principalFirm = createMockFirm({ id: 'main-firm-1', fca_number: 99 });
    const tradingFirm = {
      id: 'trading-firm-1',
      type: 'trading',
      main_firm_id: 'main-firm-1',
      fca_number: 99,
    } as TradingTravelInsuranceFirmDocument;

    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: principalFirm });
    mockedFetchFirm.mockResolvedValueOnce({
      success: true,
      response: tradingFirm,
    });

    await expect(
      resolveAccountFirmById(session, 'trading-firm-1'),
    ).resolves.toEqual({
      firm: tradingFirm,
      isTrading: true,
    });
  });

  it('returns null when the target trading firm is not owned by the principal', async () => {
    const principalFirm = createMockFirm({ id: 'main-firm-1', fca_number: 99 });
    const tradingFirm = {
      id: 'trading-firm-1',
      type: 'trading',
      main_firm_id: 'other-main',
      fca_number: 99,
    } as TradingTravelInsuranceFirmDocument;

    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: principalFirm });
    mockedFetchFirm.mockResolvedValueOnce({
      success: true,
      response: tradingFirm,
    });

    await expect(
      resolveAccountFirmById(session, 'trading-firm-1'),
    ).resolves.toBeNull();
  });

  it('returns null when the target firm is a different main firm', async () => {
    const principalFirm = createMockFirm({ id: 'main-firm-1' });
    const otherMainFirm = createMockFirm({ id: 'other-main-firm' });

    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: principalFirm });
    mockedFetchFirm.mockResolvedValueOnce({
      success: true,
      response: otherMainFirm,
    });

    await expect(
      resolveAccountFirmById(session, 'other-main-firm'),
    ).resolves.toBeNull();
  });

  it('delegates firm resolution to resolveAccountMainFirm', async () => {
    const sessionWithoutEmail = {
      isAccountAuthenticated: true,
      db_id: 'main-firm-1',
    } as IronSessionObject;

    mockedResolveAccountMainFirm.mockResolvedValueOnce({ firm: null });

    await resolveAccountFirmById(sessionWithoutEmail, 'main-firm-1');

    expect(mockedResolveAccountMainFirm).toHaveBeenCalledWith(
      sessionWithoutEmail,
    );
  });
});
