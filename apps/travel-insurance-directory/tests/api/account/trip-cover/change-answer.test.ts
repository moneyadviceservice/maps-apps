import { expectAccountApiRequiresFields } from 'lib/account/testing/accountApiHandlerTestHelpers';
import { TRIP_COVER_TEST_FIRM_ID } from 'lib/account/testing/tripCoverAccountTestHelpers';
import {
  createTripCoverApiHandlerTestContext,
  expectTripCoverApiFirmNotFound,
  expectTripCoverApiRedirect,
} from 'lib/account/testing/tripCoverApiHandlerTestHelpers';

import handler from 'pages/api/account/trip-cover/change-answer';

import 'lib/account/testing/tripCoverApiHandlerMocks';

const apiContext = createTripCoverApiHandlerTestContext();

describe('Account Trip Cover Change Answer API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 if method is not POST', async () => {
    const { getMockReq, getMockRes } = apiContext;
    const res = getMockRes();
    await handler(getMockReq('GET', {}), res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('redirects to target path with change=true', async () => {
    await expectTripCoverApiRedirect(handler, apiContext, {
      body: {
        firmId: TRIP_COVER_TEST_FIRM_ID,
        targetPath: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}`,
      },
      expectedRedirect: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}?change=true`,
    });
  });

  it('appends change=true to service details query path', async () => {
    await expectTripCoverApiRedirect(handler, apiContext, {
      body: {
        firmId: TRIP_COVER_TEST_FIRM_ID,
        targetPath: `/account/trip-cover/service-details/${TRIP_COVER_TEST_FIRM_ID}`,
      },
      expectedRedirect: `/account/trip-cover/service-details/${TRIP_COVER_TEST_FIRM_ID}?change=true`,
    });
  });

  it('calls respond with 404 when the firm cannot be resolved', async () => {
    await expectTripCoverApiFirmNotFound(handler, apiContext, {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      targetPath: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}`,
    });
  });

  it('redirects to confirm when target path is not allowed', async () => {
    await expectTripCoverApiRedirect(handler, apiContext, {
      body: {
        firmId: TRIP_COVER_TEST_FIRM_ID,
        targetPath: '/account/customer-details',
      },
      expectedRedirect: `/account/trip-cover/confirm/${TRIP_COVER_TEST_FIRM_ID}`,
      status: 400,
    });
  });

  it('returns 400 when required fields are missing', async () => {
    await expectAccountApiRequiresFields(
      handler,
      apiContext,
      { firmId: TRIP_COVER_TEST_FIRM_ID },
      'firmId and targetPath are required',
    );
  });
});
