import './tripCoverApiHandlerMocks';

import type { NextApiHandler } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import { updateFirm } from 'lib/firms/updateFirm';
import { respond } from 'utils/api/respond/respond';

import {
  createAccountApiHandlerTestContext,
  expectAccountApiFirmNotFound,
  expectAccountApiRejectsGetMethod,
  expectAccountApiRequiresFirmId,
  expectAccountApiUpdateFirmFailure,
  type AccountApiRequestBody,
} from './accountApiHandlerTestHelpers';
import {
  mockResolvedEuropeTripCoverFirm,
  TRIP_COVER_TEST_FIRM_ID,
} from './tripCoverAccountTestHelpers';

export type TripCoverApiHandlerTestContext = ReturnType<
  typeof createTripCoverApiHandlerTestContext
>;

export function createTripCoverApiHandlerTestContext() {
  const apiContext = createAccountApiHandlerTestContext();

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

export function describeTripCoverApiHandlerBasics(
  handler: NextApiHandler,
  apiContext: TripCoverApiHandlerTestContext,
  bodyWithoutFirmId: AccountApiRequestBody,
) {
  it('returns 405 if method is not POST', async () => {
    await expectAccountApiRejectsGetMethod(handler, apiContext);
  });

  it('returns 400 if firmId is missing', async () => {
    await expectAccountApiRequiresFirmId(
      handler,
      apiContext,
      bodyWithoutFirmId,
    );
  });
}

export function mockTripCoverApiUpdateSuccess(
  mocks: TripCoverApiHandlerTestContext['mocks'],
) {
  mocks.resolveAccountFirmById.mockResolvedValueOnce(
    mockResolvedEuropeTripCoverFirm(),
  );
  mocks.updateFirm.mockResolvedValueOnce({ success: true, response: {} });
}

export function mockResolvedTripCoverFirm(
  overrides: Parameters<typeof createMockFirm>[0] = {},
) {
  return {
    firm: createMockFirm({
      id: TRIP_COVER_TEST_FIRM_ID,
      ...overrides,
    }),
    isTrading: false,
  };
}

export async function expectTripCoverApiFirmNotFound(
  handler: NextApiHandler,
  apiContext: TripCoverApiHandlerTestContext,
  body: AccountApiRequestBody,
) {
  const { getMockReq, getMockRes, mocks } = apiContext;
  mocks.resolveAccountFirmById.mockResolvedValueOnce(null);

  await expectAccountApiFirmNotFound(
    handler,
    { getMockReq, getMockRes },
    body,
    mocks.respond,
  );
}

export async function expectTripCoverApiUpdateFirmFailure(
  handler: NextApiHandler,
  apiContext: TripCoverApiHandlerTestContext,
  body: AccountApiRequestBody,
  currentRoute: string,
) {
  const { getMockReq, getMockRes, mocks } = apiContext;
  mocks.resolveAccountFirmById.mockResolvedValueOnce(
    mockResolvedTripCoverFirm(),
  );
  mocks.updateFirm.mockResolvedValueOnce({ success: false, response: {} });

  await expectAccountApiUpdateFirmFailure(
    handler,
    { getMockReq, getMockRes },
    body,
    mocks.respond,
    currentRoute,
  );
}

export async function expectTripCoverApiRedirect(
  handler: NextApiHandler,
  apiContext: TripCoverApiHandlerTestContext,
  {
    body,
    expectedRedirect,
    status,
    firmOverrides,
  }: {
    body: AccountApiRequestBody;
    expectedRedirect: string;
    status?: number;
    firmOverrides?: Parameters<typeof createMockFirm>[0] | null;
  },
) {
  const { getMockReq, getMockRes, mocks } = apiContext;

  if (firmOverrides !== null) {
    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedTripCoverFirm(firmOverrides ?? {}),
    );
  }

  const req = getMockReq('POST', body);
  const res = getMockRes();

  await handler(req, res);

  expect(mocks.respond).toHaveBeenCalledWith(
    req,
    res,
    expect.objectContaining({
      redirect: expectedRedirect,
      ...(status === undefined ? {} : { status }),
    }),
  );
}
