import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { tripCoverWithSavedAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

const CONFIRMED_AT = '2023-01-15T00:00:00Z';

export function createEligibleAdminFirm(
  overrides: Parameters<typeof createMockFirm>[0] = {},
): ReturnType<typeof createMockFirm> {
  return createMockFirm({
    trip_covers: [tripCoverWithSavedAgeLimits()],
    cover_service_confirmed_at: CONFIRMED_AT,
    customer_contact_confirmed_at: CONFIRMED_AT,
    ...overrides,
  });
}
