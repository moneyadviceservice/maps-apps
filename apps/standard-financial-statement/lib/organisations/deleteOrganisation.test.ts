import { Organisation } from '../../types/Organisations';
import { dbConnect } from '../database/dbConnect';
import { deleteOrganisation } from './deleteOrganisation';

jest.mock('../database/dbConnect');
const mockDbConnect = dbConnect as jest.Mock;

const mockOrg = {
  id: '',
  licence_number: '',
  uuid: '',
  name: '',
  type: { title: '' },
  licence_status: '',
  sfs_live: 1,
  created: '',
  modified: '',
};

const createMockContainer = (options: {
  resources?: Organisation[];
  throwOnFetch?: boolean;
  throwOnDelete?: boolean;
}) => {
  const {
    resources = [],
    throwOnFetch = false,
    throwOnDelete = false,
  } = options;

  const fetchAll = jest.fn(() => {
    if (throwOnFetch) throw new Error('Query error');
    return Promise.resolve({ resources });
  });

  const deleteFn = jest.fn(() => {
    if (throwOnDelete) throw new Error('Delete error');
    return Promise.resolve();
  });

  return {
    items: {
      query: jest.fn(() => ({ fetchAll })),
    },
    item: jest.fn(() => ({ delete: deleteFn })),
  };
};

describe('deleteOrganisation', () => {
  const licenceNumber = 'ABC123';

  const runTest = async (
    mockOptions: Parameters<typeof createMockContainer>[0],
  ) => {
    const mockContainer = createMockContainer(mockOptions);
    mockDbConnect.mockResolvedValue({ container: mockContainer });
    return await deleteOrganisation(licenceNumber);
  };

  it('returns success when organisation is found and deleted', async () => {
    const org = {
      ...mockOrg,
      id: 'org1',
      licence_number: licenceNumber,
    };
    const result = await runTest({ resources: [org] });

    expect(result).toEqual({
      success: true,
      message: 'Organisation deleted successfully',
    });
  });

  it('returns not found when organisation does not exist', async () => {
    const result = await runTest({ resources: [] });

    expect(result).toEqual({ error: 'Organisation not found' });
  });

  it('returns error when fetchAll throws', async () => {
    const result = await runTest({ throwOnFetch: true });

    expect(result).toEqual({ error: 'Failed to delete organisation' });
  });

  it('returns error when delete throws', async () => {
    const org = { ...mockOrg, id: 'org1', licence_number: licenceNumber };
    const result = await runTest({ resources: [org], throwOnDelete: true });

    expect(result).toEqual({ error: 'Failed to delete organisation' });
  });
});
