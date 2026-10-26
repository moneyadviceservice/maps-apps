import { createMockFirm } from 'components/FirmSummary/mockFirm';
import {
  createTripCoverApiHandlerTestContext,
  describeTripCoverApiHandlerBasics,
} from 'lib/account/testing/tripCoverApiHandlerTestHelpers';
import { emptyServiceDetails } from 'lib/firms/firmDefaults';
import { resyncPublicListingIfApproved } from 'lib/firms/resyncPublicListingIfApproved';
import {
  tripCoverWithAgeLimits,
  tripCoverWithSavedAgeLimits,
} from 'lib/firms/testing/tripCoverFixtures';

import handler from 'pages/api/account/trip-cover/confirm';

import 'lib/account/testing/tripCoverApiHandlerMocks';

jest.mock('lib/firms/resyncPublicListingIfApproved');

const mockResyncPublicListingIfApproved = jest.mocked(
  resyncPublicListingIfApproved,
);

const apiContext = createTripCoverApiHandlerTestContext();
const { getMockReq, getMockRes, mocks } = apiContext;

function completeCoverServiceFirm() {
  return createMockFirm({
    id: 'firm-123',
    trip_covers: [
      tripCoverWithSavedAgeLimits({
        cover_area: 'uk_and_europe',
        trip_type: 'single_trip',
      }),
    ],
    service_details: {
      ...emptyServiceDetails(),
      offers_telephone_quote: true,
      will_cover_specialist_equipment: true,
      medical_screening_company: 'verisk',
      how_far_in_advance_trip_cover: 'up_to_18_month',
    },
  });
}

async function postConfirmWithPersist(success: boolean) {
  const req = getMockReq('POST', { firmId: 'firm-123' });
  const res = getMockRes();
  mocks.resolveAccountFirmById.mockResolvedValueOnce({
    firm: completeCoverServiceFirm(),
    isTrading: false,
  });
  mocks.updateFirm.mockResolvedValueOnce({ success, response: {} });
  await handler(req, res);
  return { req, res };
}

describe('Account Trip Cover Confirm API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describeTripCoverApiHandlerBasics(handler, apiContext, {});

  it('calls respond with 404 when the firm cannot be resolved', async () => {
    const req = getMockReq('POST', { firmId: 'firm-123' });
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

  it('redirects back to confirm when sections are incomplete', async () => {
    const req = getMockReq('POST', { firmId: 'firm-123' });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce({
      firm: createMockFirm({
        id: 'firm-123',
        trip_covers: [],
      }),
      isTrading: false,
    });

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        redirect: '/account/trip-cover/confirm/firm-123',
      }),
    );
  });

  it('uses handleTripCoverApiError when an unexpected error is thrown', async () => {
    const req = getMockReq('POST', { firmId: 'firm-123' });
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockRejectedValueOnce(
      new Error('Cosmos unavailable'),
    );

    await handler(req, res);

    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: '/account/trip-cover/confirm/firm-123',
      }),
    );
  });

  it('persists confirmation and redirects to account when sections are complete', async () => {
    const { req, res } = await postConfirmWithPersist(true);

    expect(mocks.updateFirm).toHaveBeenCalledWith(
      'firm-123',
      expect.objectContaining({
        cover_service_confirmed_at: expect.any(String),
        self_serve_edit_draft: null,
      }),
    );
    expect(mockResyncPublicListingIfApproved).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'firm-123', status: 'active' }),
    );
    expect(mocks.respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: '/account',
      }),
    );
  });

  it('promotes cover/service draft slices to live and keeps unrelated office draft', async () => {
    const req = getMockReq('POST', { firmId: 'firm-123' });
    const res = getMockRes();

    const liveFirm = completeCoverServiceFirm();
    const liveTripCover = liveFirm.trip_covers[0];
    const draftTripCover = tripCoverWithAgeLimits(
      {
        ...liveTripCover.age_limits,
        up_to_30_days: { land: 65, cruise: 65 },
      },
      {
        cover_area: 'uk_and_europe',
        trip_type: 'single_trip',
      },
    );
    const draftServiceDetails = {
      ...liveFirm.service_details,
      medical_screening_company: 'other',
    };
    const officeDraft = createMockFirm().office;

    mocks.resolveAccountFirmById.mockResolvedValueOnce({
      firm: {
        ...liveFirm,
        self_serve_edit_draft: {
          trip_covers: [draftTripCover],
          service_details: draftServiceDetails,
          office: officeDraft,
        },
      },
      isTrading: false,
    });
    mocks.updateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    expect(mocks.updateFirm).toHaveBeenCalledWith(
      'firm-123',
      expect.objectContaining({
        cover_service_confirmed_at: expect.any(String),
        trip_covers: [draftTripCover],
        service_details: draftServiceDetails,
        self_serve_edit_draft: { office: officeDraft },
      }),
    );
  });

  it('does not treat a failed persist as a listing resync', async () => {
    await postConfirmWithPersist(false);

    expect(mockResyncPublicListingIfApproved).not.toHaveBeenCalled();
  });
});
