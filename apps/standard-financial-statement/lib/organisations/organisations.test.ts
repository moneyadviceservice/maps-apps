import { dbConnect } from '../database/dbConnect';
import { organisations, OrganisationsQueryProps } from './organisations';

jest.mock('../database/dbConnect');

describe('API - Organisations', () => {
  const mockResources = [
    { id: '1', name: 'Org A', licence_number: '001' },
    { id: '2', name: 'Org B', licence_number: '002' },
    { id: '3', name: 'Org C', licence_number: '003' },
    { id: '4', name: 'Org D', licence_number: '004' },
    { id: '5', name: 'Org E', licence_number: '005' },
    { id: '6', name: 'Org F', licence_number: '006' },
    { id: '7', name: 'Org G', licence_number: '007' },
    { id: '8', name: 'Org H', licence_number: '008' },
    { id: '9', name: 'Org I', licence_number: '009' },
    { id: '10', name: 'Org J', licence_number: '010' },
  ];

  const mockQuery = ({
    resources,
    continuation = null,
    count = null,
  }: {
    resources: { id: string; name: string; licence_number: string }[];
    continuation?: string | null;
    count?: number | null;
  }) => {
    const queryMock = {
      query: jest.fn().mockImplementation(() => ({
        fetchNext: jest.fn().mockResolvedValue({ resources, continuation }),
        fetchAll: jest
          .fn()
          .mockResolvedValue({ resources: [count ?? resources.length] }),
      })),
    };

    (dbConnect as jest.Mock).mockResolvedValue({
      container: {
        items: queryMock,
      },
    });

    return queryMock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const runTest = async ({
    props,
    expectedData,
    queryMock,
    querySpec,
    queryOptions,
    expectedPages = 0,
    expectedRecords = 0,
    continuationToken = null,
  }: {
    props: OrganisationsQueryProps;
    expectedData: { id: string; name: string; licence_number: string }[];
    queryMock: { query: jest.Mock };
    querySpec: {
      query: string;
      parameters: {
        name: string;
        value: string;
      }[];
    };
    queryOptions: {
      maxItemCount: number;
      continuationToken?: string;
    };
    expectedPages?: number | null;
    expectedRecords?: number | null;
    continuationToken?: string | null;
  }) => {
    const response = await organisations({
      ...props,
    } as OrganisationsQueryProps);

    expect(response).toEqual({
      data: expectedData,
      totalPages: expectedPages,
      totalRecords: expectedRecords,
      continuationToken,
    });

    expect(queryMock.query).toHaveBeenCalledWith(querySpec, queryOptions);
  };

  it('fetches first page without search query', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources.slice(0, 5)],
      count: 10,
      continuation: 'next-token',
    });

    await runTest({
      props: { page: '1', itemsPerPage: '5' },
      expectedData: [...mockResources.slice(0, 5)],
      expectedPages: 2,
      expectedRecords: 10,
      continuationToken: 'next-token',
      queryMock,
      querySpec: {
        query: 'SELECT * FROM c WHERE 1=1 AND (c.sfs_live = true)',
        parameters: [],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches second page without search query', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources.slice(5, 10)],
      count: 10,
      continuation: 'next-token',
    });

    await runTest({
      props: { page: '2', itemsPerPage: '5' },
      expectedData: [...mockResources.slice(5, 10)],
      expectedPages: 0,
      expectedRecords: 0,
      continuationToken: 'next-token',
      queryMock,
      querySpec: {
        query: 'SELECT * FROM c WHERE 1=1 AND (c.sfs_live = true)',
        parameters: [],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches with a search query', async () => {
    const queryMock = mockQuery({
      resources: [mockResources[0]],
      count: 2,
    });

    await runTest({
      props: { searchQuery: 'search term', page: '1', itemsPerPage: '5' },
      expectedData: [mockResources[0]],
      expectedPages: 1,
      expectedRecords: 2,
      queryMock,
      querySpec: {
        query:
          'SELECT * FROM c WHERE 1=1 AND (CONTAINS(c.name, @searchQuery, true) OR TO_STRING(c.licence_number) = @searchQuery) AND (c.sfs_live = true)',
        parameters: [{ name: '@searchQuery', value: 'search term' }],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches with single status filter query', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources.slice(0, 3)],
      count: 3,
    });

    await runTest({
      props: { filterQuery: 'pending', page: '1', itemsPerPage: '5' },
      expectedData: [...mockResources.slice(0, 3)],
      expectedPages: 1,
      expectedRecords: 3,
      queryMock,
      querySpec: {
        query:
          'SELECT * FROM c WHERE 1=1 AND (c.sfs_live = true) AND ((c.licence_status = @licenceStatus0))',
        parameters: [{ name: '@licenceStatus0', value: 'Pending' }],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches with multiple status filter queries', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources.slice(0, 3)],
      count: 3,
    });

    await runTest({
      props: {
        filterQuery: 'pending,requesting_info',
        page: '1',
        itemsPerPage: '5',
      },
      expectedData: [...mockResources.slice(0, 3)],
      expectedPages: 1,
      expectedRecords: 3,
      queryMock,
      querySpec: {
        query:
          'SELECT * FROM c WHERE 1=1 AND (c.sfs_live = true) AND ((c.licence_status = @licenceStatus0) OR (c.licence_status = @licenceStatus1))',
        parameters: [
          { name: '@licenceStatus0', value: 'Pending' },
          { name: '@licenceStatus1', value: 'Requesting info' },
        ],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches with empty props', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources],
      count: 3,
    });

    await runTest({
      props: {},
      expectedData: [...mockResources],
      expectedPages: 1,
      expectedRecords: 3,
      queryMock,
      querySpec: {
        query: 'SELECT * FROM c WHERE 1=1 AND (c.sfs_live = true)',
        parameters: [],
      },
      queryOptions: { maxItemCount: 15 },
    });
  });

  it('fetches with continuation token', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources],
      continuation: 'next-token',
    });

    await runTest({
      props: {
        page: '2',
        itemsPerPage: '5',
        continuationToken: 'some-token',
      },
      expectedData: [...mockResources],
      continuationToken: 'next-token',
      queryMock,
      querySpec: {
        query: 'SELECT * FROM c WHERE 1=1 AND (c.sfs_live = true)',
        parameters: [],
      },
      queryOptions: { maxItemCount: 5, continuationToken: 'some-token' },
    });
  });

  it('fetches with a type filter', async () => {
    const queryMock = mockQuery({
      resources: [...mockResources],
      count: 1,
    });

    await runTest({
      props: { page: '1', itemsPerPage: '5', type: 'clinic' },
      expectedData: [...mockResources],
      expectedPages: 1,
      expectedRecords: 1,
      queryMock,
      querySpec: {
        query:
          'SELECT * FROM c WHERE 1=1 AND CONTAINS(c.type.title, @type, true) AND (c.sfs_live = true)',
        parameters: [{ name: '@type', value: 'clinic' }],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches with type and search query combined', async () => {
    const queryMock = mockQuery({
      resources: [mockResources[0]],
      count: 1,
    });

    await runTest({
      props: {
        searchQuery: 'search term',
        page: '1',
        itemsPerPage: '5',
        type: 'clinic',
      },
      expectedData: [mockResources[0]],
      expectedPages: 1,
      expectedRecords: 1,
      queryMock,
      querySpec: {
        query:
          'SELECT * FROM c WHERE 1=1 AND (CONTAINS(c.name, @searchQuery, true) OR TO_STRING(c.licence_number) = @searchQuery) AND CONTAINS(c.type.title, @type, true) AND (c.sfs_live = true)',
        parameters: [
          { name: '@searchQuery', value: 'search term' },
          { name: '@type', value: 'clinic' },
        ],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('fetches with type and search query and status filters combined', async () => {
    const queryMock = mockQuery({
      resources: [mockResources[0]],
      count: 1,
    });

    await runTest({
      props: {
        searchQuery: 'search term',
        filterQuery: 'pending,requesting_info',
        page: '1',
        itemsPerPage: '5',
        type: 'clinic',
      },
      expectedData: [mockResources[0]],
      expectedPages: 1,
      expectedRecords: 1,
      queryMock,
      querySpec: {
        query:
          'SELECT * FROM c WHERE 1=1 AND (CONTAINS(c.name, @searchQuery, true) OR TO_STRING(c.licence_number) = @searchQuery) AND CONTAINS(c.type.title, @type, true) AND (c.sfs_live = true) AND ((c.licence_status = @licenceStatus0) OR (c.licence_status = @licenceStatus1))',
        parameters: [
          { name: '@searchQuery', value: 'search term' },
          { name: '@type', value: 'clinic' },
          { name: '@licenceStatus0', value: 'Pending' },
          { name: '@licenceStatus1', value: 'Requesting info' },
        ],
      },
      queryOptions: { maxItemCount: 5 },
    });
  });

  it('handles errors gracefully', async () => {
    (dbConnect as jest.Mock).mockResolvedValue(new Error('Database error'));

    const props = { page: '1', itemsPerPage: '5' };

    const result = await organisations(props);

    expect(result).toEqual({ error: 'Failed to fetch data' });
  });
});
