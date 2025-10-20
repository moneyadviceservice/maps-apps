import { GetServerSidePropsContext } from 'next';

import { getSessionId } from '../lib/utils/getSessionId';
import { cookieGuard } from './cookieGuard';

jest.mock('../lib/utils/getSessionId');

describe('cookieGuard', () => {
  const mockContext = {
    req: {},
    res: {},
  } as unknown as GetServerSidePropsContext;

  beforeEach(() => {
    jest.clearAllMocks();

    (getSessionId as jest.Mock).mockReturnValue('mockSessionId');
  });

  it('should throw an error if the session ID is missing (key is falsy)', async () => {
    (getSessionId as jest.Mock).mockReturnValue(undefined);

    await expect(cookieGuard(mockContext)).rejects.toThrow(
      '[cookieGuard] Session ID is missing',
    );
  });

  it('should do nothing if the cookie is present', async () => {
    (getSessionId as unknown as jest.Mock).mockReturnValue('mockSessionId');

    await expect(cookieGuard(mockContext)).resolves.not.toThrow();
  });
});
