import { NextApiRequest, NextApiResponse } from 'next';

import { updateOrganisation } from '../../lib/organisations/updateOrganisation';
import { getStatusByAction } from '../../utils/admin/getStatusByAction';
import handler from './update-licence-status';

jest.mock('../../lib/organisations/updateOrganisation');
jest.mock('../../utils/admin/getStatusByAction');

const mockUpdateOrganisation = updateOrganisation as jest.Mock;
const mockGetStatusByAction = getStatusByAction as jest.Mock;

describe('/api/update-licence-status', () => {
  let res: Partial<NextApiResponse>;

  const mockReq = (method: string, body: object = {}) =>
    ({
      method,
      body: JSON.stringify(body),
    } as Partial<NextApiRequest>);

  const runHandler = async (req: Partial<NextApiRequest>) =>
    handler(req as NextApiRequest, res as NextApiResponse);

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('returns 405 if method is not PUT', async () => {
    const req = mockReq('GET');
    await runHandler(req);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Method not allowed. Use PUT.',
    });
  });

  it('returns 400 for missing licence_number or invalid action', async () => {
    const req = mockReq('PUT', { licence_number: '', action: 123 });
    await runHandler(req);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Missing or invalid fields: licence_number and licence_status are required',
    });
  });

  it('returns 404 if updateOrganisation returns an error', async () => {
    mockGetStatusByAction.mockReturnValue('declined');
    mockUpdateOrganisation.mockResolvedValueOnce({ error: 'Not found' });

    const req = mockReq('PUT', {
      licence_number: 'ABC123',
      action: 'decline',
    });

    await runHandler(req);

    expect(mockGetStatusByAction).toHaveBeenCalledWith('decline');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });

  it('returns 200 if update is successful', async () => {
    mockGetStatusByAction.mockReturnValue('approved');
    mockUpdateOrganisation.mockResolvedValueOnce({ name: 'Updated Org' });

    const req = mockReq('PUT', {
      licence_number: 'ABC123',
      action: 'approve',
    });

    await runHandler(req);

    expect(mockUpdateOrganisation).toHaveBeenCalledWith({
      licence_number: 'ABC123',
      payload: { licence_status: 'approved' },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { name: 'Updated Org' },
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockGetStatusByAction.mockReturnValue('pending');
    mockUpdateOrganisation.mockRejectedValueOnce(new Error('DB failure'));

    const req = mockReq('PUT', {
      licence_number: 'XYZ456',
      action: 'pending',
    });

    await runHandler(req);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to update organisation',
    });
  });
});
