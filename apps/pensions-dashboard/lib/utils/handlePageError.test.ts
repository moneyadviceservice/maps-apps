import { LOAD_TIMES_FAILED, SESSION_EXPIRED } from '../constants';
import { handlePageError } from './handlePageError';

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
