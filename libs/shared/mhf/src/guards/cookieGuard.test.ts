import { mockContext, mockSessionId } from '../mocks';
import { getSessionId } from '../utils/getSessionId';
import { cookieGuard } from './cookieGuard';

jest.mock('../utils/getSessionId');

describe('cookieGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
  });

  it('should throw an error if the session ID is missing (key is falsy)', async () => {
    (getSessionId as jest.Mock).mockReturnValue(undefined);
    await expect(cookieGuard(mockContext)).rejects.toThrow(
      '[cookieGuard] Session ID is missing',
    );
  });

  it('should do nothing if the cookie is present', async () => {
    await expect(cookieGuard(mockContext)).resolves.not.toThrow();
  });
});
