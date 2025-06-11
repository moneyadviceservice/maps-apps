import { updateOrganisation } from './updateOrganisation';
import { dbConnect } from '../database/dbConnect';

jest.mock('../database/dbConnect');

const mockReplace = jest.fn();
const mockQuery = jest.fn();
const mockFetchAll = jest.fn();

const mockContainer = {
  items: {
    query: mockQuery,
  },
  item: () => ({
    replace: mockReplace,
  }),
};

describe('updateOrganisation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (dbConnect as jest.Mock).mockResolvedValue({ container: mockContainer });
  });

  it('should return error if organisation not found', async () => {
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await updateOrganisation({
      licence_number: 'ABC123',
      payload: { name: 'New Name' },
    });

    expect(result).toEqual({ error: 'Organisation not found' });
  });

  it('should update and return the organisation on success', async () => {
    const existingOrg = {
      id: 'org1',
      licence_number: 'ABC123',
      name: 'Old Name',
    };
    const updatedOrg = { ...existingOrg, name: 'New Name' };

    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
    mockFetchAll.mockResolvedValue({ resources: [existingOrg] });
    mockReplace.mockResolvedValue({
      resource: { ...updatedOrg, modified: expect.any(String) },
    });

    const result = await updateOrganisation({
      licence_number: 'ABC123',
      payload: { name: 'New Name' },
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'org1',
        licence_number: 'ABC123',
        name: 'New Name',
        modified: expect.any(String),
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'org1',
        name: 'New Name',
        modified: expect.any(String),
      }),
    );
  });

  it('should handle exceptions and return error message', async () => {
    mockReplace.mockRejectedValueOnce(new Error('Error replacing record'));

    const result = await updateOrganisation({
      licence_number: 'XYZ999',
      payload: { name: 'Oops' },
    });

    expect(result).toEqual({ error: 'Failed to update organisation' });
  });
});
