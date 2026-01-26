import Cookies from 'cookies';

import { mockContext, mockSessionId } from '../mocks';
import { getSessionId } from './getSessionId';

jest.mock('cookies');

describe('getSessionId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the session ID if it exists in cookies', () => {
    // Mock Cookies to return a session ID
    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue(mockSessionId),
    }));

    const sessionId = getSessionId(mockContext);
    expect(sessionId).toBe(mockSessionId);
  });

  it('should return null if the session ID does not exist in cookies', () => {
    // Mock Cookies to return null
    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null),
    }));

    const sessionId = getSessionId(mockContext);
    expect(sessionId).toBe(null);
  });
});
