import { type Page } from '@playwright/test';

import { SelfServePage } from '../pages/SelfServePage';

/**
 * Query `mode` values for `/ci/self-serve/initialise-e2e-firm-state`.
 * Keep in sync with `REREGISTRATION_SEED_QUERY` in the TID app seed module.
 */
export const REREGISTRATION_SEED_QUERY = {
  thirtyDayWindow: 'reregistration-30-day-window',
  pastAnniversary: 'reregistration-past-anniversary',
} as const;

export type ReregistrationSeedQuery =
  (typeof REREGISTRATION_SEED_QUERY)[keyof typeof REREGISTRATION_SEED_QUERY];

export async function seedReregistrationAndReturnToAccount(
  page: Page,
  mode: ReregistrationSeedQuery,
): Promise<SelfServePage> {
  const selfServePage = new SelfServePage(page);
  await Promise.all([
    page.waitForURL(/\/account\/?$/),
    page.goto(`/ci/self-serve/initialise-e2e-firm-state?mode=${mode}`, {
      waitUntil: 'commit',
    }),
  ]);
  return selfServePage;
}
