import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';
import type { IncomingMessage, ServerResponse } from 'node:http';

// Mock the Cookies module
jest.mock('cookies');

import { BACKEND_TIMEOUT_SECONDS, COOKIE_OPTIONS } from '../../constants';
import { UserSession } from '../../types';
import {
  clearMhpdSessionConfig,
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  isSessionExpired,
  MhpdSessionConfig,
  setMhpdSessionConfig,
  updateSessionConfigField,
  withAuth,
} from './session';

describe('session utilities, with cookies', () => {
  let cookies: jest.Mocked<Cookies>;

  beforeEach(() => {
    cookies = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<Cookies>;
  });

  describe('getMhpdSessionConfig', () => {
    it('should return consolidated config when mhpdSessionConfig cookie exists', () => {
      const mockConfig: MhpdSessionConfig = {
        authorizationCode: 'auth123',
        userSessionId: 'session123',
        redirectUrl: '/redirect',
        currentUrl: '/current',
        supportCurrentUrl: '/support',
        channel: 'CONFIRMED',
        pensionID: 'pension123',
        sessionTimeout: '3600',
        sessionStart: '',
        analyticsDataSent: false,
      };

      cookies.get.mockReturnValue(JSON.stringify(mockConfig));

      const result = getMhpdSessionConfig(cookies);

      expect(cookies.get).toHaveBeenCalledWith('mhpdSessionConfig');
      expect(result).toEqual(mockConfig);
    });

    it('should return empty config when mhpdSessionConfig does not exist', () => {
      cookies.get.mockReturnValue(undefined);

      const result = getMhpdSessionConfig(cookies);

      expect(result).toEqual({
        authorizationCode: '',
        userSessionId: '',
        redirectUrl: '',
        currentUrl: '',
        supportCurrentUrl: '',
        channel: '',
        pensionID: '',
        sessionTimeout: '',
        sessionStart: '',
        analyticsDataSent: false,
      });
    });

    it('should return empty config when JSON parsing fails', () => {
      cookies.get.mockReturnValue('invalid-json');

      const result = getMhpdSessionConfig(cookies);

      expect(result).toEqual({
        authorizationCode: '',
        userSessionId: '',
        redirectUrl: '',
        currentUrl: '',
        supportCurrentUrl: '',
        channel: '',
        pensionID: '',
        sessionTimeout: '',
        sessionStart: '',
        analyticsDataSent: false,
      });
    });
  });

  describe('setMhpdSessionConfig', () => {
    it('should set consolidated cookie with merged config', () => {
      const existingConfig = {
        authorizationCode: 'existing-auth',
        userSessionId: 'existing-session',
        redirectUrl: '',
        currentUrl: '',
        supportCurrentUrl: '',
        channel: '',
        pensionID: '',
        sessionTimeout: '',
        sessionStart: '',
        analyticsDataSent: false,
      };

      cookies.get.mockReturnValue(JSON.stringify(existingConfig));

      const updateData = {
        redirectUrl: '/new-redirect',
        channel: 'CONFIRMED',
      };

      setMhpdSessionConfig(cookies, updateData);

      const expectedConfig = {
        ...existingConfig,
        ...updateData,
      };

      expect(cookies.set).toHaveBeenCalledWith(
        'mhpdSessionConfig',
        JSON.stringify(expectedConfig),
        expect.any(Object),
      );
    });
  });

  describe('clearMhpdSessionConfig', () => {
    it('should clear consolidated cookie only', () => {
      clearMhpdSessionConfig(cookies);

      expect(cookies.set).toHaveBeenCalledWith('mhpdSessionConfig', '', {
        ...COOKIE_OPTIONS,
        expires: new Date(0),
      });
      expect(cookies.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateSessionConfigField', () => {
    it('should update a single field in the session config', () => {
      const existingConfig = {
        authorizationCode: 'auth123',
        userSessionId: 'session123',
        redirectUrl: '',
        currentUrl: '',
        supportCurrentUrl: '',
        channel: '',
        pensionID: '',
        sessionTimeout: '',
        sessionStart: '',
        analyticsDataSent: false,
      };

      cookies.get.mockReturnValue(JSON.stringify(existingConfig));

      updateSessionConfigField(cookies, 'pensionID', 'pension456');

      const expectedConfig = {
        ...existingConfig,
        pensionID: 'pension456',
      };

      expect(cookies.set).toHaveBeenCalledWith(
        'mhpdSessionConfig',
        JSON.stringify(expectedConfig),
        expect.any(Object),
      );
    });
  });

  describe('getUserSessionFromCookies', () => {
    type MockSessionConfig = {
      authorizationCode: string;
      userSessionId: string;
      redirectUrl: string;
      currentUrl: string;
      supportCurrentUrl: string;
      channel: string;
      pensionID: string;
      sessionTimeout: string;
    };

    const setupCookieMock = (sessionConfig: MockSessionConfig) => {
      cookies.get.mockImplementation((name: string) => {
        if (name === 'mhpdSessionConfig') {
          return JSON.stringify(sessionConfig);
        }
        return undefined;
      });
    };

    const testUserSessionResult = (
      sessionConfig: MockSessionConfig,
      expectedResult: UserSession,
    ) => {
      setupCookieMock(sessionConfig);
      const result = getUserSessionFromCookies(cookies);
      expect(result).toEqual(expectedResult);
    };

    const fullSessionConfig: MockSessionConfig = {
      authorizationCode: 'authCode',
      userSessionId: '12345',
      redirectUrl: '/redirect',
      currentUrl: '/current',
      supportCurrentUrl: '/support',
      channel: 'CONFIRMED',
      pensionID: 'pension123',
      sessionTimeout: '3600',
    };

    const partialSessionConfig: MockSessionConfig = {
      authorizationCode: '',
      userSessionId: '12345',
      redirectUrl: '',
      currentUrl: '',
      supportCurrentUrl: '',
      channel: '',
      pensionID: '',
      sessionTimeout: '',
    };

    const expectedFullResult: UserSession = {
      userSessionId: '12345',
      authorizationCode: 'authCode',
      sessionStart: '',
    };

    const expectedPartialResult: UserSession = {
      userSessionId: '12345',
      authorizationCode: '',
      sessionStart: '',
    };

    test.each`
      description                                                                  | mockSessionConfig       | expectedResult
      ${'should return a UserSession object with values from consolidated cookie'} | ${fullSessionConfig}    | ${expectedFullResult}
      ${'should return partial values from consolidated cookie'}                   | ${partialSessionConfig} | ${expectedPartialResult}
    `('$description', ({ mockSessionConfig, expectedResult }) => {
      testUserSessionResult(mockSessionConfig, expectedResult);
    });

    test('should return a UserSession object with empty strings if no consolidated cookie exists', () => {
      cookies.get.mockReturnValue(undefined);

      const result = getUserSessionFromCookies(cookies);
      expect(result).toEqual({
        userSessionId: '',
        authorizationCode: '',
        sessionStart: '',
      } as UserSession);
    });
  });
});

describe('isSessionExpired', () => {
  const mockNow = 1000000000; // Fixed timestamp for consistent testing

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each`
    description                                             | sessionStart                                                   | expected
    ${'should return false when sessionStart is empty'}     | ${''}                                                          | ${false}
    ${'should return false when sessionStart is undefined'} | ${undefined}                                                   | ${false}
    ${'should return false when session is not expired'}    | ${(mockNow - (BACKEND_TIMEOUT_SECONDS - 1) * 1000).toString()} | ${false}
    ${'should return true when session is exactly expired'} | ${(mockNow - BACKEND_TIMEOUT_SECONDS * 1000).toString()}       | ${true}
    ${'should return true when session is over expired'}    | ${(mockNow - (BACKEND_TIMEOUT_SECONDS + 1) * 1000).toString()} | ${true}
  `('$description', async ({ sessionStart, expected }) => {
    const result = await isSessionExpired(sessionStart);
    expect(result).toBe(expected);
  });

  test('should handle invalid sessionStart format', async () => {
    const result = await isSessionExpired('invalid-timestamp');
    expect(result).toBe(false); // parseInt('invalid-timestamp') returns NaN, NaN comparisons are always false
  });

  test('should handle negative timestamps', async () => {
    const result = await isSessionExpired('-1000');
    expect(result).toBe(true); // Negative timestamp makes duration very large (current time - negative = large positive)
  });
});

describe('withAuth', () => {
  let mockContext: GetServerSidePropsContext;
  let mockReq: IncomingMessage & {
    cookies: Partial<{ [key: string]: string }>;
  };
  let mockRes: ServerResponse<IncomingMessage>;
  let mockGetServerSideProps: jest.MockedFunction<GetServerSideProps>;
  let mockCookies: jest.Mocked<Cookies>;
  const MockedCookies = Cookies as jest.MockedClass<typeof Cookies>;

  const setupMockContext = () => {
    mockReq = { cookies: {} } as IncomingMessage & {
      cookies: Partial<{ [key: string]: string }>;
    };
    mockRes = {} as ServerResponse<IncomingMessage>;
    mockContext = {
      req: mockReq,
      res: mockRes,
      query: {},
      params: {},
      resolvedUrl: '/test',
      locale: 'en',
      locales: ['en'],
      defaultLocale: 'en',
    };
  };

  const setupMocks = () => {
    mockGetServerSideProps = jest.fn();
    mockCookies = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<Cookies>;
    MockedCookies.mockImplementation(() => mockCookies);
  };

  const testWithAuthReturnsNotFound = async (
    mockReturnValue: string | undefined,
  ) => {
    mockCookies.get.mockReturnValue(mockReturnValue);
    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);
    const result = await wrappedGetServerSideProps(mockContext);
    expect(result).toEqual({ notFound: true });
    expect(mockGetServerSideProps).not.toHaveBeenCalled();
  };

  const expectContextIntegrity = (ctx: GetServerSidePropsContext) => {
    expect(ctx).toEqual(mockContext);
    return Promise.resolve({ props: {} });
  };

  beforeEach(() => {
    setupMockContext();
    setupMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    description                                                           | mockReturnValue
    ${'should return { notFound: true } when userSessionId is missing'}   | ${JSON.stringify({ userSessionId: '' })}
    ${'should return { notFound: true } when userSessionId is undefined'} | ${JSON.stringify({ authorizationCode: 'auth123' })}
    ${'should return { notFound: true } when session config is empty'}    | ${undefined}
  `('$description', async ({ mockReturnValue }) => {
    await testWithAuthReturnsNotFound(mockReturnValue);
  });

  it('should call original getServerSideProps when userSessionId exists', async () => {
    const expectedResult = { props: { data: 'test' } };
    mockGetServerSideProps.mockResolvedValue(expectedResult);

    mockCookies.get.mockReturnValue(
      JSON.stringify({
        userSessionId: 'session123',
        authorizationCode: 'auth123',
      }),
    );

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);
    const result = await wrappedGetServerSideProps(mockContext);

    expect(result).toEqual(expectedResult);
    expect(mockGetServerSideProps).toHaveBeenCalledWith(mockContext);
  });

  it('should pass through any result from original getServerSideProps', async () => {
    const redirectResult = {
      redirect: { destination: '/login', permanent: false },
    };
    mockGetServerSideProps.mockResolvedValue(redirectResult);

    mockCookies.get.mockReturnValue(
      JSON.stringify({
        userSessionId: 'session123',
      }),
    );

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);
    const result = await wrappedGetServerSideProps(mockContext);

    expect(result).toEqual(redirectResult);
    expect(mockGetServerSideProps).toHaveBeenCalledWith(mockContext);
  });

  it('should handle exceptions from original getServerSideProps', async () => {
    const error = new Error('Original function error');
    mockGetServerSideProps.mockRejectedValue(error);

    mockCookies.get.mockReturnValue(
      JSON.stringify({
        userSessionId: 'session123',
      }),
    );

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);

    await expect(wrappedGetServerSideProps(mockContext)).rejects.toThrow(
      'Original function error',
    );
    expect(mockGetServerSideProps).toHaveBeenCalledWith(mockContext);
  });

  it('should call original getServerSideProps without checking userSessionId when requireAuth is false', async () => {
    const expectedResult = { props: { data: 'test' } };
    mockGetServerSideProps.mockResolvedValue(expectedResult);

    // Don't set up any session config
    mockCookies.get.mockReturnValue(undefined);

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps, {
      requireAuth: false,
    });
    const result = await wrappedGetServerSideProps(mockContext);

    expect(result).toEqual(expectedResult);
    expect(mockGetServerSideProps).toHaveBeenCalledWith(mockContext);
  });

  it('should work even when userSessionId is missing and requireAuth is false', async () => {
    const expectedResult = { props: { message: 'No auth required' } };
    mockGetServerSideProps.mockResolvedValue(expectedResult);

    mockCookies.get.mockReturnValue(
      JSON.stringify({
        userSessionId: '',
      }),
    );

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps, {
      requireAuth: false,
    });
    const result = await wrappedGetServerSideProps(mockContext);

    expect(result).toEqual(expectedResult);
    expect(mockGetServerSideProps).toHaveBeenCalledWith(mockContext);
  });

  it('should handle malformed session config JSON gracefully', async () => {
    mockCookies.get.mockReturnValue('invalid-json{');

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);

    // This should not throw, but return notFound since parsing fails and userSessionId will be undefined
    const result = await wrappedGetServerSideProps(mockContext);

    expect(result).toEqual({ notFound: true });
    expect(mockGetServerSideProps).not.toHaveBeenCalled();
  });

  it.each`
    description | errorSetup
    ${'Cookies constructor throws an error'} | ${() => MockedCookies.mockImplementation(() => {
    throw new Error('Cookies constructor failed');
  })}
    ${'cookie operations throw an error'} | ${() => mockCookies.get.mockImplementation(() => {
    throw new Error('Cookie get failed');
  })}
  `(
    'should handle withAuth errors gracefully when $description',
    async ({ errorSetup }) => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Set up the specific error condition
      errorSetup();

      const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);
      const result = await wrappedGetServerSideProps(mockContext);

      expect(result).toEqual({ notFound: true });
      expect(mockGetServerSideProps).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'withAuth error:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    },
  );

  it('should preserve context object integrity', async () => {
    const originalContext = { ...mockContext };
    mockGetServerSideProps.mockImplementation(expectContextIntegrity);

    mockCookies.get.mockReturnValue(
      JSON.stringify({
        userSessionId: 'session123',
      }),
    );

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);
    await wrappedGetServerSideProps(mockContext);

    expect(mockGetServerSideProps).toHaveBeenCalledWith(originalContext);
  });

  it('should work with async original getServerSideProps that returns promises', async () => {
    mockGetServerSideProps.mockResolvedValue({ props: { async: true } });

    mockCookies.get.mockReturnValue(
      JSON.stringify({
        userSessionId: 'session123',
      }),
    );

    const wrappedGetServerSideProps = withAuth(mockGetServerSideProps);
    const result = await wrappedGetServerSideProps(mockContext);

    expect(result).toEqual({ props: { async: true } });
    expect(mockGetServerSideProps).toHaveBeenCalledWith(mockContext);
  });
});
