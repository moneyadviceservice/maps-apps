import { dbConnect } from '../database/dbConnect';
import { organisations, OrganisationsQueryProps } from './organisations';

jest.mock('../database/dbConnect');

describe('API - Organisations', () => {
  const mockQuery = ({
    resources,
    continuation = null,
    count = null,
  }: {
    resources: { id: string; name: string; licence_number: string }[];
    continuation?: string | null;
    count?: number | null;
  }) => ({
    query: jest.fn().mockImplementation(() => ({
      fetchNext: jest.fn().mockResolvedValue({ resources, continuation }),
      fetchAll: jest
        .fn()
        .mockResolvedValue({ resources: [count ?? resources.length] }),
    })),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const runTest = async ({
    props,
    expectedData,
    expectedPages = 0,
    expectedRecords = 0,
    continuationToken = null,
  }: {
    props: OrganisationsQueryProps;
    expectedData: { id: string; name: string; licence_number: string }[];
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
  };

  it('fetches first page without search query', async () => {
    (dbConnect as jest.Mock).mockResolvedValue({
      container: {
        items: mockQuery({
          resources: [{ id: '1', name: 'Org A', licence_number: '123' }],
          count: 10,
        }),
      },
    });

    await runTest({
      props: { page: '1', itemsPerPage: '5' },
      expectedData: [{ id: '1', name: 'Org A', licence_number: '123' }],
      expectedPages: 2,
      expectedRecords: 10,
    });
  });

  it('fetches with a search query', async () => {
    (dbConnect as jest.Mock).mockResolvedValue({
      container: {
        items: mockQuery({
          resources: [{ id: '2', name: 'Search Match', licence_number: '456' }],
          count: 3,
        }),
      },
    });

    await runTest({
      props: { searchQuery: 'Search Match', page: '1', itemsPerPage: '5' },
      expectedData: [{ id: '2', name: 'Search Match', licence_number: '456' }],
      expectedPages: 1,
      expectedRecords: 3,
    });
  });

  it('fetches with empty props', async () => {
    (dbConnect as jest.Mock).mockResolvedValue({
      container: {
        items: mockQuery({
          resources: [{ id: '2', name: 'Search Match', licence_number: '456' }],
          count: 3,
        }),
      },
    });

    await runTest({
      props: {},
      expectedData: [{ id: '2', name: 'Search Match', licence_number: '456' }],
      expectedPages: 1,
      expectedRecords: 3,
    });
  });

  it('fetches with continuation token', async () => {
    const nextOrg = { id: '3', name: 'Next Page Org', licence_number: '789' };
    (dbConnect as jest.Mock).mockResolvedValue({
      container: {
        items: {
          query: jest.fn().mockImplementation(() => ({
            fetchNext: jest.fn().mockResolvedValue({
              resources: [nextOrg],
              continuation: 'next-token',
            }),
          })),
        },
      },
    });

    await runTest({
      props: {
        page: '2',
        itemsPerPage: '5',
        continuationToken: 'some-token',
      },
      expectedData: [nextOrg],
      continuationToken: 'next-token',
    });
  });

  it('fetches with a type filter', async () => {
    const expected = { id: '4', name: 'Clinic Org', licence_number: '111' };
    const queryMock = jest.fn().mockImplementation((querySpec) => {
      expect(querySpec.query).toContain('CONTAINS(c.type.title, @type, true)');
      expect(querySpec.parameters).toContainEqual({
        name: '@type',
        value: 'clinic',
      });

      return {
        fetchNext: jest
          .fn()
          .mockResolvedValue({ resources: [expected], continuation: null }),
        fetchAll: jest.fn().mockResolvedValue({ resources: [1] }),
      };
    });

    (dbConnect as jest.Mock).mockResolvedValue({
      container: { items: { query: queryMock } },
    });

    await runTest({
      props: { page: '1', itemsPerPage: '5', type: 'clinic' },
      expectedData: [expected],
      expectedPages: 1,
      expectedRecords: 1,
    });
  });

  it('fetches with type and search query combined', async () => {
    const expected = { id: '5', name: 'Special Org', licence_number: '222' };
    const queryMock = jest.fn().mockImplementation((querySpec) => {
      expect(querySpec.query).toContain('@type');
      expect(querySpec.query).toContain('@searchQuery');
      expect(querySpec.parameters).toEqual(
        expect.arrayContaining([
          { name: '@type', value: 'clinic' },
          { name: '@searchQuery', value: 'Special Org' },
        ]),
      );

      return {
        fetchNext: jest
          .fn()
          .mockResolvedValue({ resources: [expected], continuation: null }),
        fetchAll: jest.fn().mockResolvedValue({ resources: [1] }),
      };
    });

    (dbConnect as jest.Mock).mockResolvedValue({
      container: { items: { query: queryMock } },
    });

    await runTest({
      props: {
        page: '1',
        itemsPerPage: '5',
        type: 'clinic',
        searchQuery: 'Special Org',
      },
      expectedData: [expected],
      expectedPages: 1,
      expectedRecords: 1,
    });
  });

  it('handles errors gracefully', async () => {
    (dbConnect as jest.Mock).mockResolvedValue(new Error('Database error'));

    const props = { page: '1', itemsPerPage: '5' };

    const result = await organisations(props);

    expect(result).toEqual({ error: 'Failed to fetch data' });
  });
});
