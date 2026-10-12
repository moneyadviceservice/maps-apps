import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import { updateFirm } from 'lib/firms/updateFirm';
import { respond } from 'utils/api/respond/respond';

import { createAccountApiHandlerTestContext } from './accountApiHandlerTestHelpers';

export const MEDICAL_SPECIALISM_TEST_FIRM_ID = 'firm-123';

export const MEDICAL_SPECIALISM_COSMOS_PATCH = {
  'medical_specialisms/specialised_medical_conditions_covers_all': true,
  'medical_specialisms/specialised_medical_conditions_cover': null,
} as const;

export function buildMedicalSpecialismApiBody(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    updatePath: 'medical_specialisms',
    specialised_medical_conditions_covers_all: 'yes',
    ...overrides,
  };
}

export function createMedicalSpecialismApiHandlerTestContext() {
  const apiContext = createAccountApiHandlerTestContext({
    db_id: 'db-123',
    fcaData: { frnNumber: '123456' },
  });

  return {
    ...apiContext,
    mocks: {
      resolveAccountFirmById: resolveAccountFirmById as jest.MockedFunction<
        typeof resolveAccountFirmById
      >,
      updateFirm: updateFirm as jest.MockedFunction<typeof updateFirm>,
      respond: respond as jest.MockedFunction<typeof respond>,
    },
  };
}

export function mockResolvedMedicalSpecialismFirm(
  overrides: Parameters<typeof createMockFirm>[0] = {},
) {
  return {
    firm: createMockFirm({
      id: MEDICAL_SPECIALISM_TEST_FIRM_ID,
      ...overrides,
    }),
    isTrading: false,
  };
}
