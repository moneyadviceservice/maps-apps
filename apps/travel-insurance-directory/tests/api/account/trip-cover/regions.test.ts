import {
  mockResolvedEmptyTripCoverFirm,
  testAgeLimitsPagePath,
  TRIP_COVER_TEST_COVER_AREA,
  TRIP_COVER_TEST_FIRM_ID,
} from 'lib/account/testing/tripCoverAccountTestHelpers';
import {
  createTripCoverApiHandlerTestContext,
  describeTripCoverApiHandlerBasics,
} from 'lib/account/testing/tripCoverApiHandlerTestHelpers';

import handler from 'pages/api/account/trip-cover/regions';

import 'lib/account/testing/tripCoverApiHandlerMocks';

const apiContext = createTripCoverApiHandlerTestContext();
const { getMockReq, getMockRes, mocks } = apiContext;

describe('Account Trip Cover Regions API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describeTripCoverApiHandlerBasics(handler, apiContext, {
    cover_area: TRIP_COVER_TEST_COVER_AREA,
  });

  it('calls respond with 404 when the firm cannot be resolved', async () => {
    const req = getMockReq('POST', {
      firmId: 'unknown-firm',
      cover_area: 'uk_and_europe',
    });
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
    expect(mocks.updateFirm).not.toHaveBeenCalled();
  });

  it('halts and calls respond() if no regions are selected', async () => {
    const req = getMockReq('POST', { firmId: TRIP_COVER_TEST_FIRM_ID });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEmptyTripCoverFirm(),
    );

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        redirect: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}`,
      }),
    );
    expect(mocks.updateFirm).not.toHaveBeenCalled();
  });

  it('stages trip_covers in self_serve_edit_draft and redirects to confirm when confirmed and isChangeAnswer is set', async () => {
    const req = getMockReq('POST', {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      cover_area: ['uk_and_europe'],
      isChangeAnswer: 'true',
    });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEmptyTripCoverFirm({
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
          service_details: expect.any(Object),
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

  it('returns 500 when updateFirm fails', async () => {
    const req = getMockReq('POST', {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      cover_area: ['uk_and_europe'],
    });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEmptyTripCoverFirm(),
    );
    mocks.updateFirm.mockResolvedValueOnce({ success: false, response: {} });

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: `/account/trip-cover/regions/${TRIP_COVER_TEST_FIRM_ID}`,
      }),
    );
  });

  it('drops invalid region values before saving', async () => {
    const req = getMockReq('POST', {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      cover_area: ['uk_and_europe', 'not-a-region'],
    });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEmptyTripCoverFirm(),
    );
    mocks.updateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    const updatePayload = mocks.updateFirm.mock.calls[0][1] as {
      trip_covers: Array<{ cover_area: string }>;
    };

    expect(
      updatePayload.trip_covers.every(
        (cover) => cover.cover_area === 'uk_and_europe',
      ),
    ).toBe(true);
  });

  it('calls updateFirm on success', async () => {
    const req = getMockReq('POST', {
      firmId: TRIP_COVER_TEST_FIRM_ID,
      cover_area: ['uk_and_europe'],
    });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedEmptyTripCoverFirm(),
    );
    mocks.updateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    expect(mocks.updateFirm).toHaveBeenCalledWith(
      TRIP_COVER_TEST_FIRM_ID,
      expect.objectContaining({
        trip_covers: expect.any(Array),
      }),
    );
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: testAgeLimitsPagePath(
          TRIP_COVER_TEST_COVER_AREA,
          'single_trip',
        ),
      }),
    );
  });
});
