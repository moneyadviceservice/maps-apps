import type { NextApiRequest, NextApiResponse } from 'next';

import { cosmosConnection } from 'lib/cosmos';

import handler from './cosmos-connection';

jest.mock('lib/cosmos', () => ({
  cosmosConnection: jest.fn(),
}));

const mockedConnection = cosmosConnection as jest.Mock;

const mockResponse = () => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return response as unknown as NextApiResponse & typeof response;
};

describe('cosmos-connection', () => {
  beforeEach(() => {
    mockedConnection.mockReset();
  });

  it('returns connected true when Cosmos accepts the check', async () => {
    mockedConnection.mockResolvedValue(true);
    const response = mockResponse();

    await handler({} as NextApiRequest, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ connected: true });
  });

  it('returns connected false when Cosmos is unavailable', async () => {
    mockedConnection.mockResolvedValue(false);
    const response = mockResponse();

    await handler({} as NextApiRequest, response);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({ connected: false });
  });
});
