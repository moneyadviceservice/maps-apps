import 'lib/account/testing/tripCoverApiHandlerMocks';

jest.mock('data/pages/account/tripCover/service-details', () => ({
  radioFieldSpec: { key: 'will_cover_specialist_equipment', type: 'radio' },
  radioFieldTel: { key: 'offers_telephone_quote', type: 'radio' },
  selectFieldAdvance: {
    key: 'how_far_in_advance_trip_cover',
    type: 'select',
  },
  selectFieldMed: { key: 'medical_screening_company', type: 'select' },
}));

import { expectAccountApiRejectsGetMethod } from 'lib/account/testing/accountApiHandlerTestHelpers';
import {
  buildServiceDetailsApiBody,
  createServiceDetailsApiHandlerTestContext,
  expectServiceDetailsApiFirmNotFound,
  expectServiceDetailsApiUpdateFirmFailure,
  mockResolvedServiceDetailsFirm,
  SERVICE_DETAILS_COSMOS_PATCH,
  SERVICE_DETAILS_TEST_FIRM_ID,
} from 'lib/account/testing/serviceDetailsTestHelpers';
import { updateFirm } from 'lib/firms/updateFirm';
import { respond } from 'utils/api/respond/respond';

import handler from 'pages/api/account/trip-cover/service-details';

const apiContext = createServiceDetailsApiHandlerTestContext();
const { mockJson, getMockRes, getMockReq, mocks } = apiContext;
const mockedUpdateFirm = updateFirm as jest.MockedFunction<typeof updateFirm>;
const mockedRespond = respond as jest.MockedFunction<typeof respond>;

describe('Trip Cover Service Details API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 if method is not POST', async () => {
    await expectAccountApiRejectsGetMethod(handler, apiContext);
  });

  it('returns validation errors when required fields are missing', async () => {
    const req = getMockReq('POST', {
      firmId: SERVICE_DETAILS_TEST_FIRM_ID,
      updatePath: 'service_details',
    });
    const res = getMockRes();

    await handler(req, res);

    expect(mockedRespond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        data: {
          ok: false,
          error: true,
          fields: {
            offers_telephone_quote: { error: 'required' },
            will_cover_specialist_equipment: { error: 'required' },
            medical_screening_company: { error: 'required' },
            how_far_in_advance_trip_cover: { error: 'required' },
          },
        },
        redirect: `/account/trip-cover/service-details/${SERVICE_DETAILS_TEST_FIRM_ID}`,
      }),
    );
  });

  it('returns 400 if updatePath is missing from the body', async () => {
    const req = getMockReq('POST', {
      firmId: SERVICE_DETAILS_TEST_FIRM_ID,
      will_cover_specialist_equipment: 'yes',
    });
    const res = getMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ error: 'updatePath is required' });
  });

  it('calls updateFirm with Cosmos-shaped values on success', async () => {
    const req = getMockReq(
      'POST',
      buildServiceDetailsApiBody({ firmId: SERVICE_DETAILS_TEST_FIRM_ID }),
    );
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedServiceDetailsFirm(),
    );
    mockedUpdateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      SERVICE_DETAILS_TEST_FIRM_ID,
      SERVICE_DETAILS_COSMOS_PATCH,
    );
  });

  it('calls respond with 404 when firmId cannot be resolved', async () => {
    await expectServiceDetailsApiFirmNotFound(handler, apiContext, {
      firmId: 'unknown-firm',
    });
  });

  it('returns 500 when updateFirm fails for firmId path', async () => {
    await expectServiceDetailsApiUpdateFirmFailure(
      handler,
      apiContext,
      `/account/trip-cover/service-details/${SERVICE_DETAILS_TEST_FIRM_ID}`,
    );
  });

  it('redirects to confirm when firmId is present', async () => {
    const req = getMockReq(
      'POST',
      buildServiceDetailsApiBody({ firmId: SERVICE_DETAILS_TEST_FIRM_ID }),
    );
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedServiceDetailsFirm(),
    );
    mockedUpdateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      SERVICE_DETAILS_TEST_FIRM_ID,
      SERVICE_DETAILS_COSMOS_PATCH,
    );
    expect(mockedRespond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: `/account/trip-cover/confirm/${SERVICE_DETAILS_TEST_FIRM_ID}`,
      }),
    );
  });

  it('stages service_details in self_serve_edit_draft and redirects to confirm when confirmed and isChangeAnswer is set', async () => {
    const req = getMockReq(
      'POST',
      buildServiceDetailsApiBody({
        firmId: SERVICE_DETAILS_TEST_FIRM_ID,
        isChangeAnswer: 'true',
      }),
    );
    const res = getMockRes();

    mocks.resolveAccountFirmById.mockResolvedValueOnce(
      mockResolvedServiceDetailsFirm({
        cover_service_confirmed_at: '2026-07-21T12:00:00.000Z',
      }),
    );
    mockedUpdateFirm.mockResolvedValueOnce({ success: true, response: {} });

    await handler(req, res);

    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      SERVICE_DETAILS_TEST_FIRM_ID,
      expect.objectContaining({
        self_serve_edit_draft: expect.objectContaining({
          service_details: expect.any(Object),
          trip_covers: expect.any(Array),
        }),
      }),
    );
    expect(mockedUpdateFirm.mock.calls[0][1]).not.toHaveProperty(
      'service_details/offers_telephone_quote',
    );
    expect(mockedRespond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: `/account/trip-cover/confirm/${SERVICE_DETAILS_TEST_FIRM_ID}`,
      }),
    );
  });
});
