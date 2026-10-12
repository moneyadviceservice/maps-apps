import { LOAD_TIMES_FAILED, SESSION_EXPIRED } from '../../constants';
import { handlePageError, logger } from './error';

describe('Error Utilities', () => {
  describe('handlePageError', () => {
    const language = 'en';
    const mockError = new Error('Test error');

    beforeEach(() => {
      jest.clearAllMocks();
      console.error = jest.fn();
    });

    it('should log the error with default message', () => {
      const result = handlePageError(mockError, language);

      expect(console.error).toHaveBeenCalledWith(
        'Error in getServerSideProps:',
        mockError,
      );
      expect(result).toEqual({ notFound: true });
    });

    it('should log the error with custom message', () => {
      const customMessage = 'Custom error message:';

      const result = handlePageError(mockError, language, customMessage);

      expect(console.error).toHaveBeenCalledWith(customMessage, mockError);
      expect(result).toEqual({ notFound: true });
    });

    it('should return session expired redirect when error is SESSION_EXPIRED', () => {
      const expectedRedirect = {
        redirect: {
          destination: '/en/your-session-has-expired',
          permanent: false,
        },
      };

      const sessionError = new Error(SESSION_EXPIRED);
      const result = handlePageError(sessionError, language);

      expect(console.error).toHaveBeenCalledWith(
        'Error in getServerSideProps:',
        sessionError,
      );
      expect(result).toEqual(expectedRedirect);
    });

    it('should return notFound for generic error', () => {
      const result = handlePageError(mockError, language);

      expect(console.error).toHaveBeenCalledWith(
        'Error in getServerSideProps:',
        mockError,
      );
      expect(result).toEqual({ notFound: true });
    });

    it('should handle unknown error types', () => {
      const stringError = 'String error';
      const result = handlePageError(stringError, language);

      expect(console.error).toHaveBeenCalledWith(
        'Error in getServerSideProps:',
        stringError,
      );
      expect(result).toEqual({ notFound: true });
    });

    it('should return default load times for LOAD_TIMES_FAILED error', () => {
      const loadTimesError = new Error(LOAD_TIMES_FAILED);
      const result = handlePageError(loadTimesError, language);

      expect(console.error).toHaveBeenCalledWith(
        'Error in getServerSideProps:',
        loadTimesError,
      );
      expect(result).toEqual({
        props: {
          expectedTime: 80,
          remainingTime: 80,
        },
      });
    });

    it('should work with Welsh language for session expired', () => {
      const expectedRedirect = {
        redirect: {
          destination: '/cy/your-session-has-expired',
          permanent: false,
        },
      };

      const sessionError = new Error(SESSION_EXPIRED);
      const result = handlePageError(sessionError, 'cy');

      expect(result).toEqual(expectedRedirect);
    });
  });

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
});
