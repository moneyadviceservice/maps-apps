import { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';

import { getOrganisations } from '../../lib/organisations/getOrganisations';
import handler from './organisations';

jest.mock('../../lib/organisations/getOrganisations');

describe('organisations handler', () => {
  const mockedGetOrganisations = getOrganisations as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getOrganisations with correct params and return 200', async () => {
    const mockData = {
      organisations: ['Org1', 'Org2'],
      continuationToken: null,
    };
    mockedGetOrganisations.mockResolvedValue(mockData);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        page: '2',
        itemsPerPage: '10',
        searchQuery: 'abc',
        continuationToken: encodeURIComponent('token123'),
        type: 'school',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(mockedGetOrganisations).toHaveBeenCalledWith({
      page: '2',
      queryParams: [],
      queryOptions: {
        maxItemCount: 10,
        continuationToken: 'token123',
      },
      searchQuery: 'abc',
      type: 'school',
      isAdmin: true,
    });

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(mockData);
  });

  it('should handle invalid continuationToken and still call getOrganisations', async () => {
    const mockData = { organisations: ['Org3'] };
    mockedGetOrganisations.mockResolvedValue(mockData);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        continuationToken: '%E0%A4%A',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(mockedGetOrganisations).toHaveBeenCalledWith({
      page: '1',
      queryParams: [],
      queryOptions: {
        maxItemCount: 15,
      },
      searchQuery: undefined,
      type: undefined,
      isAdmin: true,
    });

    expect(res._getStatusCode()).toBe(200);
  });

  it('should handle errors and return 500', async () => {
    mockedGetOrganisations.mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Failed to fetch data' });
  });
});
