import handler from './update-organisation';
import { updateOrganisation } from '../../lib/organisations/updateOrganisation';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../lib/organisations/updateOrganisation');

const mockUpdateOrganisation = updateOrganisation as jest.Mock;

describe('API Route: updateOrganisation handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 405 for non-PUT methods', async () => {
    req = { method: 'GET' };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Method not allowed. Use PUT.',
    });
  });

  it('should return 400 if licence_number is missing', async () => {
    req = { method: 'PUT', body: { payload: { name: 'Test' } } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required fields: licence_number',
    });
  });

  it('should return 404 if updateOrganisation returns an error', async () => {
    req = {
      method: 'PUT',
      body: { licence_number: 'ABC123', payload: { name: 'New Name' } },
    };

    mockUpdateOrganisation.mockResolvedValue({ error: 'Not found' });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockUpdateOrganisation).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });

  it('should return 200 and data if update is successful', async () => {
    const updatedOrg = { id: 'org1', name: 'Updated' };

    req = {
      method: 'PUT',
      body: { licence_number: 'ABC123', payload: { name: 'Updated' } },
    };

    mockUpdateOrganisation.mockResolvedValue(updatedOrg);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedOrg });
  });

  it('should return 500 if an exception is thrown', async () => {
    req = {
      method: 'PUT',
      body: { licence_number: 'ABC123', payload: { name: 'Test' } },
    };

    mockUpdateOrganisation.mockRejectedValue(new Error('Unexpected error'));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to export organisations',
    });
  });
});
