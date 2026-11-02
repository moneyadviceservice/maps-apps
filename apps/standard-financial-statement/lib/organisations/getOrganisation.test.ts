import { dbConnect } from '../database/dbConnect';
import { getOrganisation } from './getOrganisation';

jest.mock('../database/dbConnect');

const mockQuery = jest.fn();
const mockFetchAll = jest.fn();

const mockContainer = {
  items: {
    query: mockQuery,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getOrganisation', () => {
  it('returns organisation if found', async () => {
    const mockOrg = { id: '1', licence_number: 123 };
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
    mockFetchAll.mockResolvedValue({ resources: [mockOrg] });

    (dbConnect as jest.Mock).mockResolvedValue({ container: mockContainer });

    const result = await getOrganisation(123);
    expect(result).toEqual(mockOrg);
    expect(mockQuery).toHaveBeenCalledWith({
      query: 'SELECT * FROM c WHERE c.licence_number = @licenceNumber',
      parameters: [{ name: '@licenceNumber', value: 123 }],
    });
  });

  it('returns error if no organisation found', async () => {
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
    mockFetchAll.mockResolvedValue({ resources: [] });

    (dbConnect as jest.Mock).mockResolvedValue({ container: mockContainer });

    const result = await getOrganisation(456);
    expect(result).toEqual({ error: 'Organisation not found' });
  });

  it('returns error if query throws', async () => {
    mockQuery.mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    (dbConnect as jest.Mock).mockResolvedValue({ container: mockContainer });

    const result = await getOrganisation(789);
    expect(result).toEqual({ error: 'Failed to fetch organisation' });
  });
});
