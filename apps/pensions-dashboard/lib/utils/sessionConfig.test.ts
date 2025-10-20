import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../constants';
import {
  clearMhpdSessionConfig,
  getMhpdSessionConfig,
  MhpdSessionConfig,
  setMhpdSessionConfig,
  updateSessionConfigField,
} from './sessionConfig';

describe('sessionConfig', () => {
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
});
