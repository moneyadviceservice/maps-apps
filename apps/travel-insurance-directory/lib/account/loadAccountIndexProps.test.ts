jest.mock('lib/account/resolveAccountMainFirm', () => ({
  resolveAccountMainFirm: jest.fn(),
}));

jest.mock('lib/account/tradingFirm', () => ({
  fetchTradingDocsByMainFirmId: jest.fn(),
}));

jest.mock('lib/fca/fetchTradingNamesForFirm', () => ({
  fetchTradingNamesForFirmFcaNumber: jest.fn(),
}));

jest.mock('lib/register/syncRegistrationSessionFromFirm', () => ({
  syncRegistrationSessionFromFirm: jest.fn(),
}));

import { resolveAccountMainFirm } from 'lib/account/resolveAccountMainFirm';
import { fetchTradingDocsByMainFirmId } from 'lib/account/tradingFirm';
import { fetchTradingNamesForFirmFcaNumber } from 'lib/fca/fetchTradingNamesForFirm';
import { syncRegistrationSessionFromFirm } from 'lib/register/syncRegistrationSessionFromFirm';

import { loadAccountIndexProps } from './loadAccountIndexProps';

import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

const mockedResolveAccountMainFirm = resolveAccountMainFirm as jest.Mock;
const mockedFetchTradingDocsByMainFirmId =
  fetchTradingDocsByMainFirmId as jest.Mock;
const mockedFetchTradingNamesForFirmFcaNumber =
  fetchTradingNamesForFirmFcaNumber as jest.Mock;
const mockedSyncRegistrationSessionFromFirm =
  syncRegistrationSessionFromFirm as jest.Mock;

function asFirm(partial: Partial<MainTravelInsuranceFirmDocument>) {
  return {
    type: 'main',
    id: 'firm-abc',
    fca_number: 123456,
    registered_name: 'Example Ltd',
    ...partial,
  } as MainTravelInsuranceFirmDocument;
}

describe('loadAccountIndexProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchTradingDocsByMainFirmId.mockResolvedValue({ response: [] });
    mockedFetchTradingNamesForFirmFcaNumber.mockResolvedValue({
      ok: true,
      names: [],
    });
    mockedSyncRegistrationSessionFromFirm.mockReturnValue(false);
  });

  it('returns firmNotFound when resolveAccountMainFirm finds no firm', async () => {
    mockedResolveAccountMainFirm.mockResolvedValue({ firm: null });

    const result = await loadAccountIndexProps({
      session: {
        accountEmail: 'user@example.com',
        save: jest.fn(),
      },
      lang: 'en',
    });

    expect(result).toEqual({ firmNotFound: true, lang: 'en' });
  });

  it('returns firm dashboard props when firm is resolved', async () => {
    const firm = asFirm({});
    mockedResolveAccountMainFirm.mockResolvedValue({ firm });

    const result = await loadAccountIndexProps({
      session: {
        accountEmail: 'user@example.com',
        save: jest.fn(),
      },
      lang: 'en',
    });

    expect(result).toMatchObject({
      lang: 'en',
      firm,
      tradingFirms: [],
      availableTradingNames: [],
    });
    expect('firmNotFound' in result && result.firmNotFound).toBeFalsy();
  });
});
