import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { getCookieAndCleanUp } from './getCookieAndCleanUp';

jest.mock('cookies');

describe('getCookieAndCleanUp', () => {
  let mockReq: Partial<GetServerSidePropsContext['req']>;
  let mockRes: Partial<GetServerSidePropsContext['res']>;
  let mockCookiesInstance: { get: jest.Mock; set: jest.Mock };

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockCookiesInstance = {
      get: jest.fn(),
      set: jest.fn(),
    };
    (Cookies as unknown as jest.Mock).mockImplementation(
      () => mockCookiesInstance,
    );
    jest.clearAllMocks();
  });

  it('should return null if the cookie does not exist', async () => {
    mockCookiesInstance.get.mockReturnValue(undefined);

    const result = await getCookieAndCleanUp(
      { req: mockReq, res: mockRes } as GetServerSidePropsContext,
      'form_error',
    );

    expect(result).toBeNull();
    expect(mockCookiesInstance.get).toHaveBeenCalledWith('form_error');
  });

  it('should parse and return cookie data if it exists', async () => {
    const mockData = { field: 'error' };
    mockCookiesInstance.get.mockReturnValue(JSON.stringify(mockData));

    const result = await getCookieAndCleanUp(
      { req: mockReq, res: mockRes } as GetServerSidePropsContext,
      'form_error',
    );

    expect(result).toEqual(mockData);
    expect(mockCookiesInstance.set).not.toHaveBeenCalled();
  });

  it('should delete the cookie when cleanup is true', async () => {
    const mockData = { success: false };
    mockCookiesInstance.get.mockReturnValue(JSON.stringify(mockData));

    await getCookieAndCleanUp(
      { req: mockReq, res: mockRes } as GetServerSidePropsContext,
      'form_error',
      true,
    );

    expect(mockCookiesInstance.set).toHaveBeenCalledWith(
      'form_error',
      '',
      expect.objectContaining({ expires: new Date(0) }),
    );
  });

  it('should handle JSON parse errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });
    mockCookiesInstance.get.mockReturnValue('not-valid-json');

    const result = await getCookieAndCleanUp(
      { req: mockReq, res: mockRes } as GetServerSidePropsContext,
      'form_error',
    );

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to parse error cookie',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
