import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { getSessionId } from './getSessionId';

jest.mock('cookies');

describe('getSessionId', () => {
  const mockContext = {
    req: {},
    res: {},
  } as unknown as GetServerSidePropsContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the session ID is missing in cookies', () => {
    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null),
    }));

    expect(() => getSessionId(mockContext)).toThrow('Cookie ID is missing');
  });

  it('should return the session ID if it cookie exists', () => {
    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue('cookieValue'),
    }));

    const sessionId = getSessionId(mockContext);
    expect(sessionId).toBe('cookieValue');
  });
});
