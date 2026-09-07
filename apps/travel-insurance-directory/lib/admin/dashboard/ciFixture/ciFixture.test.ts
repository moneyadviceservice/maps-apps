import { getPrincipal } from 'lib/firms/firmDocument';

import {
  adminCiE2eConstants,
  getAdminCiFixtureFirmById,
  getAdminDashboardCiFixtureResult,
} from './ciFixture';

describe('ciFixture', () => {
  it('returns expected firm count with no search', () => {
    const result = getAdminDashboardCiFixtureResult({}, 1, 50);
    expect(result.firms).toHaveLength(adminCiE2eConstants.firmRowCount);
  });

  it('orders default dashboard rows by created_at desc like Cosmos', () => {
    const result = getAdminDashboardCiFixtureResult({}, 1, 50);
    const times = result.firms.map((f) => new Date(f.created_at).getTime());
    const sortedDesc = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sortedDesc);
    expect(result.firms[0]?.id).toBe(adminCiE2eConstants.mainAlpha.id);
  });

  it('includes principal email and phone on fixture main firms', () => {
    const firm = getAdminCiFixtureFirmById(adminCiE2eConstants.mainAlpha.id);
    expect(firm?.type).toBe('main');
    if (!firm) {
      throw new Error('Expected mainAlpha fixture firm');
    }
    const principal = getPrincipal(firm);
    expect(principal?.email_address).toBe('amy.adams@e2e-fixture.maps.test');
    expect(principal?.telephone_number).toBe('01634 100 001');
  });

  it('filters by FCA substring like Cosmos CONTAINS', () => {
    const result = getAdminDashboardCiFixtureResult(
      { fcaNumber: adminCiE2eConstants.mainAlpha.fcaString },
      1,
      50,
    );
    expect(result.firms.length).toBe(2);
    expect(
      result.firms.map((f) => f.id).sort((a, b) => a.localeCompare(b)),
    ).toEqual(
      [
        adminCiE2eConstants.mainAlpha.id,
        adminCiE2eConstants.tradingAlpha.id,
      ].sort((a, b) => a.localeCompare(b)),
    );
  });

  it('filters by principal name tokens', () => {
    const result = getAdminDashboardCiFixtureResult(
      { principalName: adminCiE2eConstants.mainBeta.principalSearchToken },
      1,
      50,
    );
    expect(result.firms.length).toBeGreaterThanOrEqual(1);
    expect(
      result.firms.some((f) => f.id === adminCiE2eConstants.mainBeta.id),
    ).toBe(true);
  });

  it('filters mainAlpha principal token to main and inherited trading row', () => {
    const result = getAdminDashboardCiFixtureResult(
      { principalName: adminCiE2eConstants.mainAlpha.principalSearchToken },
      1,
      50,
    );
    expect(result.firms).toHaveLength(2);
    expect(
      result.firms.map((f) => f.id).sort((a, b) => a.localeCompare(b)),
    ).toEqual(
      [
        adminCiE2eConstants.mainAlpha.id,
        adminCiE2eConstants.tradingAlpha.id,
      ].sort((a, b) => a.localeCompare(b)),
    );
  });

  it('paginates fixture when page limit is 15', () => {
    const result = getAdminDashboardCiFixtureResult({}, 1, 15);
    expect(result.firms).toHaveLength(15);
    expect(result.pagination.totalItems).toBe(adminCiE2eConstants.firmRowCount);
    expect(result.pagination.totalPages).toBeGreaterThan(1);
  });

  it('resolves fixture firm by id', () => {
    expect(
      getAdminCiFixtureFirmById(adminCiE2eConstants.mainAlpha.id)?.fca_number,
    ).toBe(adminCiE2eConstants.mainAlpha.fca);
  });
});
