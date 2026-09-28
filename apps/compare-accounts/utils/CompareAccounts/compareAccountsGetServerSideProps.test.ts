import calculatePagination from './calculatePagination';
import compareAccountsGetServerSideProps from './compareAccountsGetServerSideProps';
import findAccounts from './findAccounts';
import hydrateAccountsFromJson, { Account } from './hydrateAccountsFromJson';
import pageFilters from './pageFilters';
import { createTestAccount, createCurrencyAmount } from './testHelpers';
import type { GetServerSidePropsContext } from 'next';

jest.mock('./calculatePagination');
jest.mock('./findAccounts');
jest.mock('./hydrateAccountsFromJson');
jest.mock('./pageFilters');

global.fetch = jest.fn();

const DEFAULT_QUERY = { page: '1', accountsPerPage: '5' };
const DEFAULT_PARAMS = { language: 'en' };

function createContext(
  query: Record<string, string | undefined> = DEFAULT_QUERY,
  params: Record<string, string> = DEFAULT_PARAMS,
): GetServerSidePropsContext {
  return {
    query,
    params: DEFAULT_PARAMS,
    req: {
      headers: {
        host: 'localhost:4337',
      },
    },
    res: {},
    resolvedUrl: '/',
  } as unknown as GetServerSidePropsContext;
}

describe('compareAccountsGetServerSideProps', () => {
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

  const mockAccount: Account = createTestAccount({
    features: ['overdraftFacilities'],
    access: ['online'],
    monthlyFee: createCurrencyAmount(1000),
    unauthODMonthlyCap: createCurrencyAmount(2000),
    minimumMonthlyCredit: createCurrencyAmount(50000),
  });

  const mockApiResponse = {
    lastModified: '2023-12-01T10:00:00Z',
    items: [{ id: '1', name: 'Test Account' }],
  };

  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.ACCOUNTS_API = 'https://api.example.com/accounts';

    mockFetch.mockReset();
    mockFetch.mockImplementation((url: string) => {
      console.error(url);
      if (url.endsWith('/api/accounts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponse),
        });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
    global.fetch = mockFetch as unknown as typeof fetch;

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
    const result = await compareAccountsGetServerSideProps(createContext());

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4337/api/accounts',
    );
    expect(mockHydrateAccountsFromJson).toHaveBeenCalledWith({
      items: mockApiResponse.items,
    });
    expect(mockPageFilters).toHaveBeenCalledWith(
      expect.objectContaining({ query: DEFAULT_QUERY }),
    );
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
        lastModified: '2023-12-01T10:00:00Z',
        isEmbed: false,
      },
    });
  });

  it('should handle isEmbedded query parameter', async () => {
    const result = await compareAccountsGetServerSideProps(
      createContext({
        isEmbedded: 'true',
        page: DEFAULT_QUERY.page,
        accountsPerPage: DEFAULT_QUERY.accountsPerPage,
      }),
    );

    expect(result.props.isEmbed).toBe(true);
  });

  it('should handle missing isEmbedded query parameter', async () => {
    const result = await compareAccountsGetServerSideProps(createContext());

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

    const result = await compareAccountsGetServerSideProps(createContext());

    expect(result.props.accounts).toEqual([
      { ...mockAccount, id: '4' },
      { ...mockAccount, id: '5' },
      { ...mockAccount, id: '6' },
    ]);
    expect(result.props.totalItems).toBe(6);
  });

  it('should handle empty accounts list', async () => {
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

    const result = await compareAccountsGetServerSideProps(createContext());

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

    await compareAccountsGetServerSideProps(createContext());

    expect(mockFindAccounts).toHaveBeenCalledWith([mockAccount], customFilters);
    expect(mockCalculatePagination).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      totalItems: 1,
    });
  });
});
