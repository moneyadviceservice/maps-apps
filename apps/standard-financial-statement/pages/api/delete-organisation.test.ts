import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteOrganisation } from '../../lib/organisations/deleteOrganisation';
import handler from './delete-organisation';

jest.mock('../../lib/organisations/deleteOrganisation');
const mockDeleteOrganisation = deleteOrganisation as jest.Mock;

const createMockRes = () => {
  const res: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as NextApiResponse;
};

const runHandler = async (
  method: string,
  body: object,
): Promise<{
  req: NextApiRequest;
  res: NextApiResponse;
}> => {
  const req = {
    method,
    body: JSON.stringify(body),
  } as unknown as NextApiRequest;

  const res = createMockRes();
  await handler(req, res);
  return { req, res };
};

describe('delete-organisation', () => {
  it.each([
    ['GET', {}, 405, { error: 'Method not allowed. Use DELETE.' }],
    [
      'DELETE',
      {},
      400,
      { error: 'Missing or invalid field: licence_number is required' },
    ],
  ])(
    'returns %i for method %s with body %j',
    async (method, body, status, json) => {
      const { res } = await runHandler(method, body);
      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(json);
    },
  );

  it('returns 404 if organisation is not found', async () => {
    mockDeleteOrganisation.mockResolvedValueOnce({
      error: 'Organisation not found',
    });

    const { res } = await runHandler('DELETE', { licence_number: '12345' });

    expect(mockDeleteOrganisation).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Organisation not found' });
  });

  it('returns 200 on successful delete', async () => {
    const successResult = { success: true };
    mockDeleteOrganisation.mockResolvedValueOnce(successResult);

    const { res } = await runHandler('DELETE', { licence_number: '2837382' });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: successResult,
    });
  });

  it('returns 500 if delete throws an error', async () => {
    mockDeleteOrganisation.mockImplementationOnce(() => {
      throw new Error('Unexpected failure');
    });

    const { res } = await runHandler('DELETE', { licence_number: '94483' });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to delete organisation',
    });
  });
});
