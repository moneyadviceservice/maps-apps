import * as cacheData from 'memory-cache';

import calculatePagination from './calculatePagination';
import compareAccountsGetServerSideProps from './compareAccountsGetServerSideProps';
import findAccounts from './findAccounts';
import hydrateAccountsFromJson, { Account } from './hydrateAccountsFromJson';
import pageFilters from './pageFilters';
import { createTestAccount, createCurrencyAmount } from './testHelpers';

jest.mock('memory-cache');
jest.mock('./calculatePagination');
jest.mock('./findAccounts');
jest.mock('./hydrateAccountsFromJson');
jest.mock('./pageFilters');

global.fetch = jest.fn();

describe('compareAccountsGetServerSideProps', () => {
  const mockCacheData = cacheData as jest.Mocked<typeof cacheData>;
  const mockCalculatePagination = calculatePagination as jest.MockedFunction<
    typeof calculatePagination
  >;
  const mockFindAccounts = findAccounts as jest.MockedFunction<
    typeof findAccounts
  >;
  const mockHydrateAccountsFromJson =
    hydrateAccountsFromJson as jest.MockedFunction<
      typeof hydrateAccountsFromJson
    >;
  const mockPageFilters = pageFilters as jest.MockedFunction<
    typeof pageFilters
  >;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  const mockAccount: Account = createTestAccount({
    features: ['overdraftFacilities'],
    access: ['online'],
    monthlyFee: createCurrencyAmount(1000),
    unauthODMonthlyCap: createCurrencyAmount(2000),
    minimumMonthlyCredit: createCurrencyAmount(50000),
  });

  const mockApiResponse = {
    'jcr:lastModified': '2023-12-01T10:00:00Z',
    items: [{ id: '1', name: 'Test Account' }],
  };

  const mockContext = {
    query: { page: '1', accountsPerPage: '5' },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.ACCOUNTS_API = 'https://api.example.com/accounts';

    mockPageFilters.mockReturnValue({
      page: 1,
      accountsPerPage: 5,
      searchQuery: '',
      order: 'random',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
      count: 0,
      setOrder: jest.fn(),
      setAccountsPerPage: jest.fn(),
      removeFilterHref: jest.fn(),
      removeSearchQueryHref: jest.fn(),
      isFilterActive: jest.fn(),
      setPageHref: jest.fn(),
      clearFiltersHref: jest.fn(),
    });

    mockHydrateAccountsFromJson.mockReturnValue([mockAccount]);
    mockFindAccounts.mockReturnValue([mockAccount]);
    mockCalculatePagination.mockReturnValue({
      page: 1,
      pageSize: 5,
      totalItems: 1,
      totalPages: 1,
      startIndex: 0,
      endIndex: 5,
      nextPage: 2,
      previousPage: 0,
      previousEnabled: false,
      nextEnabled: false,
    });
  });

  it('should fetch data and return server side props when no cache exists', async () => {
    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    const result = await compareAccountsGetServerSideProps(mockContext);

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/accounts');
    expect(mockCacheData.put).toHaveBeenCalled();
    expect(mockHydrateAccountsFromJson).toHaveBeenCalledWith(mockApiResponse);
    expect(mockPageFilters).toHaveBeenCalledWith(mockContext);
    expect(mockFindAccounts).toHaveBeenCalledWith(
      [mockAccount],
      expect.any(Object),
    );
    expect(mockCalculatePagination).toHaveBeenCalledWith({
      page: 1,
      pageSize: 5,
      totalItems: 1,
    });

    expect(result).toEqual({
      props: {
        accounts: [mockAccount],
        totalItems: 1,
        lastUpdated: '2023-12-01T10:00:00Z',
        isEmbed: false,
      },
    });
  });

  it('should use cached data when cache is valid', async () => {
    const currentTime = new Date().getTime();
    const cachedData = {
      data: mockApiResponse,
      timestamp: currentTime - 3 * 60 * 60 * 1000, // 3 hours ago (within 6 hour expiry)
    };

    mockCacheData.get.mockReturnValue(cachedData);

    const result = await compareAccountsGetServerSideProps(mockContext);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCacheData.put).not.toHaveBeenCalled();
    expect(result.props.lastUpdated).toBe('2023-12-01T10:00:00Z');
  });

  it('should refetch data when cache is expired', async () => {
    const currentTime = new Date().getTime();
    const expiredCachedData = {
      data: { old: 'data' },
      timestamp: currentTime - 7 * 60 * 60 * 1000, // 7 hours ago (expired)
    };

    mockCacheData.get.mockReturnValue(expiredCachedData);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    await compareAccountsGetServerSideProps(mockContext);

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/accounts');
    expect(mockCacheData.put).toHaveBeenCalled();
  });

  it('should handle isEmbedded query parameter', async () => {
    const contextWithEmbed = {
      query: { isEmbedded: 'true' },
    };

    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    const result = await compareAccountsGetServerSideProps(contextWithEmbed);

    expect(result.props.isEmbed).toBe(true);
  });

  it('should handle missing isEmbedded query parameter', async () => {
    const contextWithoutEmbed = {
      query: {},
    };

    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    const result = await compareAccountsGetServerSideProps(contextWithoutEmbed);

    expect(result.props.isEmbed).toBe(false);
  });

  it('should slice accounts based on pagination', async () => {
    const multipleAccounts = [
      { ...mockAccount, id: '1' },
      { ...mockAccount, id: '2' },
      { ...mockAccount, id: '3' },
      { ...mockAccount, id: '4' },
      { ...mockAccount, id: '5' },
      { ...mockAccount, id: '6' },
    ];

    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);
    mockHydrateAccountsFromJson.mockReturnValue(multipleAccounts);
    mockFindAccounts.mockReturnValue(multipleAccounts);
    mockCalculatePagination.mockReturnValue({
      page: 2,
      pageSize: 3,
      totalItems: 6,
      totalPages: 2,
      startIndex: 3,
      endIndex: 6,
      nextPage: 3,
      previousPage: 1,
      previousEnabled: true,
      nextEnabled: false,
    });

    const result = await compareAccountsGetServerSideProps(mockContext);

    expect(result.props.accounts).toEqual([
      { ...mockAccount, id: '4' },
      { ...mockAccount, id: '5' },
      { ...mockAccount, id: '6' },
    ]);
    expect(result.props.totalItems).toBe(6);
  });

  it('should handle empty accounts list', async () => {
    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ...mockApiResponse, items: [] }),
    } as any);
    mockHydrateAccountsFromJson.mockReturnValue([]);
    mockFindAccounts.mockReturnValue([]);
    mockCalculatePagination.mockReturnValue({
      page: 1,
      pageSize: 5,
      totalItems: 0,
      totalPages: 0,
      startIndex: 0,
      endIndex: 5,
      nextPage: 2,
      previousPage: 0,
      previousEnabled: false,
      nextEnabled: false,
    });

    const result = await compareAccountsGetServerSideProps(mockContext);

    expect(result.props.accounts).toEqual([]);
    expect(result.props.totalItems).toBe(0);
  });

  it('should handle different page filters', async () => {
    const customFilters = {
      page: 2,
      accountsPerPage: 10,
      searchQuery: 'premium',
      order: 'providerNameAZ',
      accountTypes: ['premium'],
      accountFeatures: ['overdraft'],
      accountAccess: ['online'],
      count: 3,
      setOrder: jest.fn(),
      setAccountsPerPage: jest.fn(),
      removeFilterHref: jest.fn(),
      removeSearchQueryHref: jest.fn(),
      isFilterActive: jest.fn(),
      setPageHref: jest.fn(),
      clearFiltersHref: jest.fn(),
    };

    mockPageFilters.mockReturnValue(customFilters);
    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    await compareAccountsGetServerSideProps(mockContext);

    expect(mockFindAccounts).toHaveBeenCalledWith([mockAccount], customFilters);
    expect(mockCalculatePagination).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      totalItems: 1,
    });
  });

  it('should handle missing lastModified field', async () => {
    const apiResponseWithoutLastModified = {
      items: [{ id: '1', name: 'Test Account' }],
    };

    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(apiResponseWithoutLastModified),
    } as any);

    const result = await compareAccountsGetServerSideProps(mockContext);

    expect(result.props.lastUpdated).toBeUndefined();
  });

  it('should use default URL when fetchWithCache is called without parameter', async () => {
    mockCacheData.get.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    delete process.env.ACCOUNTS_API;

    await compareAccountsGetServerSideProps(mockContext);

    expect(mockFetch).toHaveBeenCalledWith('');
  });

  it('should handle cache expiration edge case', async () => {
    const currentTime = new Date().getTime();
    const exactlyExpiredData = {
      data: { old: 'data' },
      timestamp: currentTime - 6 * 60 * 60 * 1000,
    };

    mockCacheData.get.mockReturnValue(exactlyExpiredData);
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    await compareAccountsGetServerSideProps(mockContext);

    expect(mockFetch).toHaveBeenCalled();
  });
});
