import { logger } from './logger';

describe('logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('log', () => {
    it('should log messages with formatted output', () => {
      logger.log({ message: 'Test message' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('// == [LOG] ==============='),
      );
    });

    it('should log messages with data', () => {
      const testData = { testId: '123', name: 'test-item' };
      logger.log({ message: 'Test with data', data: testData });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('Message: Test with data');
      expect(logOutput).toContain('"testId": "123"');
    });

    it('should include session and URL when provided', () => {
      const session = {
        userSessionId: 'test-session-123',
        authorizationCode: 'auth-code-123',
      };
      logger.log({ message: 'Test message', session, url: '/test/page' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('test-session-123');
      expect(logOutput).toContain('URL: /test/page');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error({ message: 'Error occurred' });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('// == [ERROR] ==============='),
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn({ message: 'Warning message' });

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('// == [WARN] ==============='),
      );
    });
  });
});
