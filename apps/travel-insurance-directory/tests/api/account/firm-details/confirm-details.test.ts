import type { NextApiRequest, NextApiResponse } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import {
  persistFirmOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import handler from 'pages/api/account/firm-details/confirm-details';
import { respond } from 'utils/api/respond/respond';

jest.mock('lib/account/tripCover/shared/api');
jest.mock('utils/api/respond/respond');

jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (handlerFn: unknown) => handlerFn,
}));

const mockContainer = {};
const mockDatabase = {
  container: jest.fn().mockReturnValue(mockContainer),
};
const mockClient = {
  database: jest.fn().mockReturnValue(mockDatabase),
};

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => mockClient),
}));

jest.mock('data/pages/account/firm-details/confirm-details', () => ({
  confirmDetailsPage: {
    nextStep: '/next-step',
    currentRoute: '/current-route',
  },
}));

const mockRequireFirmIdFromBody = jest.mocked(requireFirmIdFromBody);
const mockResolveFirmOrRespond404 = jest.mocked(resolveFirmOrRespond404);
const mockPersistFirmOrRespond = jest.mocked(persistFirmOrRespond);
const mockRespond = jest.mocked(respond);

describe('handler', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    end: jest.fn(),
  } as unknown as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPersistFirmOrRespond.mockResolvedValue(true);
  });

  it('returns 405 for non-POST requests', async () => {
    const req = {
      method: 'GET',
    } as NextApiRequest;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalled();
  });

  it('responds with success when firm is resolved and contact is complete', async () => {
    const req = {
      method: 'POST',
      session: {},
    } as NextApiRequest & { session: Record<string, never> };

    const firm = createMockFirm({ id: 'firm-123' });

    mockRequireFirmIdFromBody.mockReturnValue('firm-123');
    mockResolveFirmOrRespond404.mockResolvedValue({
      firm,
      isTrading: false,
    });

    await handler(req, res);

    expect(mockPersistFirmOrRespond).toHaveBeenCalledWith(
      req,
      res,
      'firm-123',
      expect.objectContaining({
        customer_contact_confirmed_at: expect.any(String),
        self_serve_edit_draft: null,
      }),
      '/current-route/firm-123',
    );
    expect(mockRespond).toHaveBeenCalledWith(req, res, {
      data: {
        success: true,
        nextPath: '/next-step',
      },
      redirect: '/next-step',
    });
  });

  it('promotes office draft to live and keeps unrelated cover draft', async () => {
    const req = {
      method: 'POST',
      session: {},
    } as NextApiRequest & { session: Record<string, never> };

    const liveFirm = createMockFirm({ id: 'firm-123' });
    const draftOffice = {
      ...liveFirm.office!,
      contact: {
        ...liveFirm.office!.contact,
        email_address: 'draft@example.com',
      },
    };
    const coverDraftTripCovers = liveFirm.trip_covers;

    mockRequireFirmIdFromBody.mockReturnValue('firm-123');
    mockResolveFirmOrRespond404.mockResolvedValue({
      firm: createMockFirm({
        id: 'firm-123',
        self_serve_edit_draft: {
          office: draftOffice,
          trip_covers: coverDraftTripCovers,
        },
      }),
      isTrading: false,
    });

    await handler(req, res);

    expect(mockPersistFirmOrRespond).toHaveBeenCalledWith(
      req,
      res,
      'firm-123',
      expect.objectContaining({
        customer_contact_confirmed_at: expect.any(String),
        office: draftOffice,
        self_serve_edit_draft: { trip_covers: coverDraftTripCovers },
      }),
      '/current-route/firm-123',
    );
  });

  it('returns 500 response when an error is thrown', async () => {
    const req = {
      method: 'POST',
      session: {},
    } as NextApiRequest & { session: Record<string, never> };

    mockRequireFirmIdFromBody.mockImplementation(() => {
      throw new Error('boom');
    });

    await handler(req, res);

    expect(mockRespond).toHaveBeenCalledWith(req, res, {
      status: 500,
      data: { error: 'Internal Server Error' },
      redirect: '/current-route',
    });
  });
});
