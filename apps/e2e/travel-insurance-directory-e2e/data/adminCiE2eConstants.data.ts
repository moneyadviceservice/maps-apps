/**
 * Stable ids / FCAs for admin CI fixture Playwright tests.
 * Keep in sync with `adminCiE2eConstants` in
 * `apps/travel-insurance-directory/lib/firms/adminDashboardCiFixture.ts`.
 */
export const adminCiE2eConstants = {
  /** Total firms in fixture (mains + trading). */
  firmRowCount: 16,
  mainAlpha: {
    id: 'tid-e2e-admin-main-alpha',
    fca: 610_001,
    fcaString: '610001',
    registeredName: 'Alpha Insurance Ltd',
    principalFullName: 'Amy Adams',
    principalSearchToken: 'Amy',
  },
  mainBeta: {
    id: 'tid-e2e-admin-main-beta',
    fca: 610_002,
    fcaString: '610002',
    registeredName: 'Beta Brokers Ltd',
    principalFullName: 'Bob Brown',
    principalSearchToken: 'Bob',
  },
  mainGamma: {
    id: 'tid-e2e-admin-main-gamma',
    fca: 610_003,
    principalFullName: 'Chris Cole',
    principalSearchToken: 'Chris',
  },
  tradingAlpha: {
    id: 'tid-e2e-admin-trading-alpha',
    fca: 610_001,
    registeredName: 'alphatrade.com',
  },
} as const;
