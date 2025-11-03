import Cookies from 'cookies';

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
} from './session';

describe('session utilities', () => {
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
});
