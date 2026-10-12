jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: jest.fn(),
}));

jest.mock('lib/account/tripCover/shared/resolveAccountFirmById', () => ({
  resolveAccountFirmById: jest.fn(),
}));

jest.mock('utils/api/respond/respond');

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import { respond } from 'utils/api/respond/respond';

import { resolveAccountFirmById } from './resolveAccountFirmById';
import {
  handleTripCoverApiError,
  persistFirmOrRespond,
  persistTripCoversOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from './tripCoverApiHandler';

const mockedUpdateFirm = updateFirm as jest.MockedFunction<typeof updateFirm>;
const mockedRespond = respond as jest.MockedFunction<typeof respond>;
const mockedResolveAccountFirmById =
  resolveAccountFirmById as jest.MockedFunction<typeof resolveAccountFirmById>;

describe('tripCoverApiHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requireFirmIdFromBody returns firmId when present', () => {
    const req = { body: { firmId: ' firm-123 ' } } as never;
    const status = jest.fn();
    const json = jest.fn();
    const res = { status, json } as never;

    expect(requireFirmIdFromBody(req, res)).toBe('firm-123');
    expect(status).not.toHaveBeenCalled();
  });

  it('requireFirmIdFromBody responds with 400 when firmId is missing', () => {
    const req = { body: {} } as never;
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json } as never;

    expect(requireFirmIdFromBody(req, res)).toBeNull();
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'firmId is required' });
  });

  it('resolveFirmOrRespond404 returns resolved firm when found', async () => {
    const resolved = {
      firm: createMockFirm({ id: 'firm-123' }),
      isTrading: false,
    };
    mockedResolveAccountFirmById.mockResolvedValueOnce(resolved);

    const req = {} as never;
    const res = {} as never;
    const session = { accountEmail: 'a@b.com' } as never;

    await expect(
      resolveFirmOrRespond404(req, res, session, 'firm-123'),
    ).resolves.toEqual(resolved);
  });

  it('resolveFirmOrRespond404 responds with 404 when firm is not found', async () => {
    mockedResolveAccountFirmById.mockResolvedValueOnce(null);

    const req = {} as never;
    const res = {} as never;
    const session = { accountEmail: 'a@b.com' } as never;

    await expect(
      resolveFirmOrRespond404(req, res, session, 'missing'),
    ).resolves.toBeNull();

    expect(mockedRespond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 404,
        redirect: '/account',
      }),
    );
  });

  it('persistFirmOrRespond returns true when update succeeds', async () => {
    mockedUpdateFirm.mockResolvedValueOnce({ success: true, response: {} });

    const req = {} as never;
    const res = {} as never;

    await expect(
      persistFirmOrRespond(req, res, 'firm-123', { trip_covers: [] }, '/route'),
    ).resolves.toBe(true);
  });

  it('persistTripCoversOrRespond persists trip_covers patch', async () => {
    mockedUpdateFirm.mockResolvedValueOnce({ success: true, response: {} });

    const req = {} as never;
    const res = {} as never;
    const tripCovers = [] as never;

    await expect(
      persistTripCoversOrRespond(req, res, 'firm-123', tripCovers, '/route'),
    ).resolves.toBe(true);

    expect(mockedUpdateFirm).toHaveBeenCalledWith('firm-123', {
      trip_covers: tripCovers,
    });
  });

  it('handleTripCoverApiError responds with 500 and fallback route', () => {
    const req = {} as never;
    const res = {} as never;

    handleTripCoverApiError(req, res, new Error('boom'), '/fallback');

    expect(mockedRespond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: '/fallback',
      }),
    );
  });
});
