import {
  NO_AGE_RESTRICTION_VALUE,
  NOT_OFFERED_VALUE,
} from 'data/pages/account/tripCover/tripCoverConfig';
import {
  buildAgeLimitApiBody,
  mockResolvedEuropeTripCoverFirm,
  testAgeLimitsPagePath,
  TRIP_COVER_TEST_COVER_AREA,
  TRIP_COVER_TEST_FIRM_ID,
} from 'lib/account/testing/tripCoverAccountTestHelpers';
import {
  createTripCoverApiHandlerTestContext,
  describeTripCoverApiHandlerBasics,
  mockTripCoverApiUpdateSuccess,
} from 'lib/account/testing/tripCoverApiHandlerTestHelpers';
import { ageLimitsPath } from 'lib/account/tripCover/steps';

import handler from 'pages/api/account/trip-cover/age-limits';

import 'lib/account/testing/tripCoverApiHandlerMocks';

const apiContext = createTripCoverApiHandlerTestContext();
const { getMockReq, getMockRes, mocks } = apiContext;

describe('Account Trip Cover Age Limits API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocks.resolveAccountFirmById.mockReset();
    mocks.updateFirm.mockReset();
    mocks.respond.mockReset();
  });

  describeTripCoverApiHandlerBasics(handler, apiContext, {
    coverArea: TRIP_COVER_TEST_COVER_AREA,
    tripType: 'single_trip',
  });

  it('persists Cosmos-shaped age_limits with 1000, -1, and numeric values', async () => {
    const req = getMockReq('POST', {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      coverArea: TRIP_COVER_TEST_COVER_AREA,
      tripType: 'single_trip',
      up_to_30_days_land: String(NO_AGE_RESTRICTION_VALUE),
      up_to_30_days_cruise: String(NO_AGE_RESTRICTION_VALUE),
      up_to_90_days_land: String(NO_AGE_RESTRICTION_VALUE),
      up_to_90_days_cruise: String(NO_AGE_RESTRICTION_VALUE),
      over_90_days_land: String(NOT_OFFERED_VALUE),
      over_90_days_cruise: String(NO_AGE_RESTRICTION_VALUE),
    });
    const res = getMockRes();

    mockTripCoverApiUpdateSuccess(mocks);

    await handler(req, res);

    const updatePayload = mocks.updateFirm.mock.calls[0][1] as {
      trip_covers: Array<{
        trip_type: string;
        cover_area: string;
        age_limits: Record<string, { land: number; cruise: number }>;
        updated_at: string;
      }>;
    };
    const singleTripCover = updatePayload.trip_covers.find(
      (cover) =>
        cover.trip_type === 'single_trip' &&
        cover.cover_area === TRIP_COVER_TEST_COVER_AREA,
    );

    expect(singleTripCover).toMatchObject({
      trip_type: 'single_trip',
      cover_area: TRIP_COVER_TEST_COVER_AREA,
      age_limits: {
        up_to_30_days: { land: 1000, cruise: 1000 },
        up_to_90_days: { land: 1000, cruise: 1000 },
        over_90_days: { land: -1, cruise: 1000 },
      },
    });
    expect(singleTripCover?.updated_at).toEqual(expect.any(String));
  });

  it('redirects to the next age step on success', async () => {
    const req = getMockReq('POST', buildAgeLimitApiBody());
    const res = getMockRes();

    mockTripCoverApiUpdateSuccess(mocks);

    await handler(req, res);

    expect(mocks.updateFirm).toHaveBeenCalled();
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: testAgeLimitsPagePath(
          TRIP_COVER_TEST_COVER_AREA,
          'annual_multi_trip',
        ),
      }),
    );
  });

  it('stages trip_covers in self_serve_edit_draft and redirects to confirm when confirmed and isChangeAnswer is set', async () => {
    const req = getMockReq('POST', {
      ...buildAgeLimitApiBody(),
      isChangeAnswer: 'true',
    });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEuropeTripCoverFirm({
        cover_service_confirmed_at: '2026-07-21T12:00:00.000Z',
      }),
    );
    mocks.updateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    expect(mocks.updateFirm).toHaveBeenCalledWith(
      TRIP_COVER_TEST_FIRM_ID,
      expect.objectContaining({
        self_serve_edit_draft: expect.objectContaining({
          trip_covers: expect.any(Array),
        }),
      }),
    );
    expect(mocks.updateFirm.mock.calls[0][1]).not.toHaveProperty('trip_covers');
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: `/account/trip-cover/confirm/${TRIP_COVER_TEST_FIRM_ID}`,
      }),
    );
  });

  it('calls respond with 404 when the firm cannot be resolved', async () => {
    const req = getMockReq('POST', buildAgeLimitApiBody());
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(null);

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 404,
        redirect: '/account',
      }),
    );
  });

  it('responds with redirect when cover area or trip type is invalid', async () => {
    const req = getMockReq(
      'POST',
      buildAgeLimitApiBody({ coverArea: 'invalid-area' }),
    );
    const res = getMockRes();

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        redirect: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}`,
      }),
    );
  });

  it('responds with redirect when the step is not in the firm trip covers', async () => {
    const req = getMockReq(
      'POST',
      buildAgeLimitApiBody({ coverArea: 'worldwide_including_us_canada' }),
    );
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEuropeTripCoverFirm(),
    );

    await handler(req, res);

    expect(mocks.updateFirm).not.toHaveBeenCalled();
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        redirect: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}`,
      }),
    );
  });

  it('returns field validation errors via respond', async () => {
    const req = getMockReq(
      'POST',
      buildAgeLimitApiBody({ up_to_30_days_land: 'invalid' }),
    );
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEuropeTripCoverFirm(),
    );

    await handler(req, res);

    expect(mocks.updateFirm).not.toHaveBeenCalled();
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        data: expect.objectContaining({
          error: true,
          fields: expect.any(Object),
        }),
      }),
    );
  });

  it('returns 500 when updateFirm fails', async () => {
    const req = getMockReq('POST', buildAgeLimitApiBody());
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEuropeTripCoverFirm(),
    );
    mocks.updateFirm.mockResolvedValueOnce({ success: false, response: {} });

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
      }),
    );
  });

  it('uses age-limits fallback route in catch block when update throws', async () => {
    const req = getMockReq('POST', buildAgeLimitApiBody());
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEuropeTripCoverFirm(),
    );
    mocks.updateFirm.mockRejectedValueOnce(new Error('Cosmos unavailable'));

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: testAgeLimitsPagePath(
          TRIP_COVER_TEST_COVER_AREA,
          'single_trip',
        ),
      }),
    );
  });

  it('redirects to service details after the final step', async () => {
    const req = getMockReq(
      'POST',
      buildAgeLimitApiBody({ tripType: 'annual_multi_trip' }),
    );
    const res = getMockRes();

    mockTripCoverApiUpdateSuccess(mocks);

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: `/account/trip-cover/service-details/${TRIP_COVER_TEST_FIRM_ID}`,
      }),
    );
  });

  it('returns validation errors when age limit fields are empty', async () => {
    const req = getMockReq('POST', {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      coverArea: TRIP_COVER_TEST_COVER_AREA,
      tripType: 'single_trip',
      up_to_30_days_land: '',
      up_to_30_days_cruise: '',
      up_to_90_days_land: '',
      up_to_90_days_cruise: '',
      over_90_days_land: '',
      over_90_days_cruise: '',
    });
    const res = getMockRes();

    mockTripCoverApiUpdateSuccess(mocks);

    await handler(req, res);

    expect(mocks.updateFirm).not.toHaveBeenCalled();
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        data: {
          error: true,
          fields: expect.objectContaining({
            up_to_30_days_land: { error: 'required' },
            over_90_days_cruise: { error: 'required' },
          }),
        },
        redirect: ageLimitsPath(
          TRIP_COVER_TEST_FIRM_ID,
          TRIP_COVER_TEST_COVER_AREA,
          'single_trip',
        ),
      }),
    );
  });
});
