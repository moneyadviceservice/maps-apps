import { type Page } from '@playwright/test';

import { adminCosmosE2eConstants } from '../data/adminCosmosE2eConstants.data';

type AdminCosmosFirmKey = 'A' | 'B' | 'C' | 'all';

const firmIdByKey: Record<Exclude<AdminCosmosFirmKey, 'all'>, string> = {
  A: adminCosmosE2eConstants.firmA.id,
  B: adminCosmosE2eConstants.firmB.id,
  C: adminCosmosE2eConstants.firmC.id,
};

/**
 * Resets Cosmos admin e2e firm(s) via the CI initialise URL, then waits for redirect.
 */
export async function resetAdminCosmosFirm(
  page: Page,
  firm: AdminCosmosFirmKey,
): Promise<void> {
  const destination =
    firm === 'all'
      ? /\/admin\/dashboard\/?$/
      : new RegExp(`/admin/firms/${firmIdByKey[firm]}/?$`);

  await Promise.all([
    page.waitForURL(destination),
    page.goto(`/ci/admin/initialise-e2e-firm-state?firm=${firm}`, {
      waitUntil: 'commit',
    }),
  ]);
}
