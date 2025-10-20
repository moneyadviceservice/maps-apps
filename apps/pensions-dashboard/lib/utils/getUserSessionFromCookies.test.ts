import Cookies from 'cookies';

import { UserSession } from '../fetch/get-pensions-data';
import { getUserSessionFromCookies } from './getUserSessionFromCookies';

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

describe('getUserSessionFromCookies', () => {
  let cookies: jest.Mocked<Cookies>;

  beforeEach(() => {
    cookies = {
      get: jest.fn(),
    } as unknown as jest.Mocked<Cookies>;
  });

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
