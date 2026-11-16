import type { NextApiHandler } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import { updateFirm } from 'lib/firms/updateFirm';
import { respond } from 'utils/api/respond/respond';

import {
  createAccountApiHandlerTestContext,
  expectAccountApiFirmNotFound,
  expectAccountApiUpdateFirmFailure,
} from './accountApiHandlerTestHelpers';

export const SERVICE_DETAILS_TEST_FIRM_ID = 'firm-123';

export const SERVICE_DETAILS_COSMOS_PATCH = {
  'service_details/offers_telephone_quote': true,
  'service_details/will_cover_specialist_equipment': true,
  'service_details/medical_screening_company': 'verisk',
  'service_details/how_far_in_advance_trip_cover': 'up_to_18_month',
} as const;

export function buildServiceDetailsApiBody(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    updatePath: 'service_details',
    offers_telephone_quote: 'yes',
    will_cover_specialist_equipment: 'yes',
    medical_screening_company: 'verisk',
    how_far_in_advance_trip_cover: 'up-to-18-months',
    ...overrides,
  };
}

export function createServiceDetailsApiHandlerTestContext() {
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

export function mockResolvedServiceDetailsFirm(
  overrides: Parameters<typeof createMockFirm>[0] = {},
) {
  return {
    firm: createMockFirm({
      id: SERVICE_DETAILS_TEST_FIRM_ID,
      ...overrides,
    }),
    isTrading: false,
  };
}

export async function expectServiceDetailsApiFirmNotFound(
  handler: NextApiHandler,
  apiContext: ReturnType<typeof createServiceDetailsApiHandlerTestContext>,
  bodyOverrides: Record<string, string> = {},
) {
  const { getMockReq, getMockRes, mocks } = apiContext;
  mocks.resolveAccountFirmById.mockResolvedValueOnce(null);

  await expectAccountApiFirmNotFound(
    handler,
    { getMockReq, getMockRes },
    buildServiceDetailsApiBody({
      firmId: SERVICE_DETAILS_TEST_FIRM_ID,
      ...bodyOverrides,
    }),
    mocks.respond,
  );
}

export async function expectServiceDetailsApiUpdateFirmFailure(
  handler: NextApiHandler,
  apiContext: ReturnType<typeof createServiceDetailsApiHandlerTestContext>,
  currentRoute: string,
  bodyOverrides: Record<string, string> = {},
) {
  const { getMockReq, getMockRes, mocks } = apiContext;
  mocks.resolveAccountFirmById.mockResolvedValueOnce(
    mockResolvedServiceDetailsFirm(),
  );
  mocks.updateFirm.mockResolvedValueOnce({ success: false, response: {} });

  await expectAccountApiUpdateFirmFailure(
    handler,
    { getMockReq, getMockRes },
    buildServiceDetailsApiBody({
      firmId: SERVICE_DETAILS_TEST_FIRM_ID,
      ...bodyOverrides,
    }),
    mocks.respond,
    currentRoute,
  );
}

export async function expectServiceDetailsApiRedirect(
  handler: NextApiHandler,
  apiContext: ReturnType<typeof createServiceDetailsApiHandlerTestContext>,
  {
    bodyOverrides = {},
    expectedRedirect,
    mockFirm = true,
    mockUpdateSuccess = true,
  }: {
    bodyOverrides?: Record<string, string>;
    expectedRedirect: string;
    mockFirm?: boolean;
    mockUpdateSuccess?: boolean;
  },
) {
  const { getMockReq, getMockRes, mocks } = apiContext;
  const body = buildServiceDetailsApiBody({
    firmId: SERVICE_DETAILS_TEST_FIRM_ID,
    ...bodyOverrides,
  });

  if (mockFirm) {
    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedServiceDetailsFirm(),
    );
  }

  if (mockUpdateSuccess) {
    mocks.updateFirm.mockResolvedValueOnce({ success: true, response: {} });
  }

  const req = getMockReq('POST', body);
  const res = getMockRes();

  await handler(req, res);

  expect(mocks.respond).toHaveBeenCalledWith(
    req,
    res,
    expect.objectContaining({
      redirect: expectedRedirect,
    }),
  );
}
