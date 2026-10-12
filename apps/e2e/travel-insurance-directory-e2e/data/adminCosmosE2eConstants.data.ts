/**
 * Stable ids / names for Cosmos-backed admin firm-detail Playwright tests.
 * Keep in sync with `adminE2eFirmConstants` /
 * `ADMIN_E2E_FIRM_REGISTRY` in
 * `apps/travel-insurance-directory/lib/ci/adminE2eFirmConstants.ts`.
 *
 * These firms are NOT in the admin CI dashboard fixture — detail pages
 * load them from Cosmos under `CI=true`.
 */
export const adminCosmosE2eConstants = {
  firmA: {
    key: 'A' as const,
    id: 'tid-e2e-cosmos-admin-firm-a',
    registeredName: 'E2E Cosmos Admin Firm A',
  },
  firmB: {
    key: 'B' as const,
    id: 'tid-e2e-cosmos-admin-firm-b',
    registeredName: 'E2E Cosmos Admin Firm B',
  },
  /** Registration incomplete — no Add/Hide/Re-register. */
  firmC: {
    key: 'C' as const,
    id: 'tid-e2e-cosmos-admin-firm-c',
    registeredName: 'E2E Cosmos Admin Firm C',
  },
} as const;
