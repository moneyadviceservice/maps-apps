import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { fetchTradingDocsByMainFirmId } from 'lib/account/tradingNames/tradingFirm';
import { adminCiE2eConstants } from 'lib/admin/dashboard/ciFixture/ciFixture';
import { HIDDEN_DUE_TO_FCA } from 'lib/firms/fcaVisibility';

import { findOtherListedFirm, loadFcaGroupFirms } from './fcaGroupListing';

jest.mock('lib/account/tradingNames/tradingFirm', () => ({
  fetchTradingDocsByMainFirmId: jest.fn(),
}));

const mockedFetchTradingDocs =
  fetchTradingDocsByMainFirmId as jest.MockedFunction<
    typeof fetchTradingDocsByMainFirmId
  >;

describe('findOtherListedFirm', () => {
  it('returns null when no other group member is publicly listed', () => {
    const current = createMockFirm({ id: 'main-1', status: 'hidden' });
    const trading = createMockTradingFirm({
      id: 'trading-1',
      status: 'hidden',
      main_firm_id: 'main-1',
    });

    expect(findOtherListedFirm(current.id, [current, trading])).toBeNull();
  });

  it('returns the other listed firm and ignores the current firm', () => {
    const current = createMockFirm({ id: 'main-1', status: 'hidden' });
    const listed = createMockTradingFirm({
      id: 'trading-listed',
      status: 'active',
      registered_name: 'Listed Trading',
      main_firm_id: 'main-1',
      hidden_reason: null,
    });

    expect(findOtherListedFirm(current.id, [current, listed])).toBe(listed);
    expect(findOtherListedFirm(listed.id, [current, listed])).toBeNull();
  });

  it('ignores an active firm blocked by an FCA visibility reason', () => {
    const current = createMockFirm({ id: 'main-1', status: 'hidden' });
    const blocked = createMockTradingFirm({
      id: 'trading-blocked',
      status: 'active',
      hidden_reason: HIDDEN_DUE_TO_FCA,
      main_firm_id: 'main-1',
    });

    expect(findOtherListedFirm(current.id, [current, blocked])).toBeNull();
  });
});

describe('loadFcaGroupFirms', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.CI;
  });

  afterEach(() => {
    if (originalCi === undefined) {
      delete process.env.CI;
    } else {
      process.env.CI = originalCi;
    }
  });

  it('returns the main firm and its trading documents', async () => {
    const main = createMockFirm({ id: 'main-1', status: 'hidden' });
    const trading = createMockTradingFirm({
      id: 'trading-1',
      main_firm_id: 'main-1',
    });
    mockedFetchTradingDocs.mockResolvedValue({
      success: true,
      response: [trading],
    });

    await expect(loadFcaGroupFirms(trading, main)).resolves.toEqual([
      main,
      trading,
    ]);
    expect(mockedFetchTradingDocs).toHaveBeenCalledWith('main-1');
  });

  it('reads the admin fixture group when CI is true', async () => {
    process.env.CI = 'true';
    const { mainAlpha, tradingAlpha } = adminCiE2eConstants;
    const trading = createMockTradingFirm({
      id: tradingAlpha.id,
      fca_number: tradingAlpha.fca,
      main_firm_id: mainAlpha.id,
    });
    const main = createMockFirm({
      id: mainAlpha.id,
      fca_number: mainAlpha.fca,
    });

    const group = await loadFcaGroupFirms(trading, main);

    expect(group.map((firm) => firm.id).sort()).toEqual(
      [mainAlpha.id, tradingAlpha.id].sort(),
    );
    expect(mockedFetchTradingDocs).not.toHaveBeenCalled();
  });

  it('loads trading documents when CI has no fixture for the main firm', async () => {
    process.env.CI = 'true';
    const main = createMockFirm({ id: 'cosmos-main', status: 'hidden' });
    const trading = createMockTradingFirm({
      id: 'cosmos-trading',
      main_firm_id: 'cosmos-main',
    });
    mockedFetchTradingDocs.mockResolvedValue({
      success: true,
      response: [trading],
    });

    await expect(loadFcaGroupFirms(main, null)).resolves.toEqual([
      main,
      trading,
    ]);
    expect(mockedFetchTradingDocs).toHaveBeenCalledWith('cosmos-main');
  });
});
