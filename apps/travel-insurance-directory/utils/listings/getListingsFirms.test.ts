import { getListingsFirms } from './getListingsFirms';

const mockGetFirmsPaginated = jest.fn();

jest.mock('lib/firms/getFirmsPaginated', () => ({
  getFirmsPaginated: (...args: unknown[]) => mockGetFirmsPaginated(...args),
}));

describe('getListingsFirms', () => {
  beforeEach(() => {
    mockGetFirmsPaginated.mockResolvedValue({
      firms: [],
      pagination: {
        page: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 0,
        endIndex: 0,
      },
    });
  });

  it('calls getFirmsPaginated with page and limit from query', async () => {
    await getListingsFirms({ p: '2', limit: '10' });
    expect(mockGetFirmsPaginated).toHaveBeenCalledWith(
      { p: '2', limit: '10' },
      2,
      10,
    );
  });

  it('uses default limit 5 when limit missing', async () => {
    await getListingsFirms({});
    expect(mockGetFirmsPaginated).toHaveBeenCalledWith({}, 1, 5);
  });
});
