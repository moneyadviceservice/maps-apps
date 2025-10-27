import { REQUEST_FAILED } from '../constants';
import { getCsrfToken } from './get-csrf-token';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

describe('getCsrfToken', () => {
  const serviceUrl = 'http://test-service.com';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return token and cookie when successful', async () => {
    const token = 'test-csrf-token';
    const cookie = `X-XSRF-TOKEN=${token}; Path=/; HttpOnly`;

    // Mock fetch response with Set-Cookie header
    const mockResponse = {
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue(cookie),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await getCsrfToken(serviceUrl);

    expect(mockFetch).toHaveBeenCalledWith(`${serviceUrl}/csrf-token`, {
      method: 'GET',
    });

    expect(result).toEqual({
      token,
      cookie,
    });
  });

  it('should throw error when serviceUrl is not provided', async () => {
    await expect(getCsrfToken()).rejects.toThrow('Service URL is not defined');

    expect(console.error).toHaveBeenCalledWith(
      `${REQUEST_FAILED}: Error fetching CSRF token from undefined:`,
      expect.any(Error),
    );
  });

  it.each`
    scenario                        | mockSetupHeader
    ${'set-cookie header is null'}  | ${() => null}
    ${'set-cookie header is empty'} | ${() => ''}
  `('should throw error when $scenario', async ({ mockSetupHeader }) => {
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue(mockSetupHeader()),
      },
    });

    await expect(getCsrfToken(serviceUrl)).rejects.toThrow(
      'Set-Cookie header not found in response',
    );

    expect(console.error).toHaveBeenCalledWith(
      `${REQUEST_FAILED}: Error fetching CSRF token from ${serviceUrl}:`,
      expect.any(Error),
    );
  });

  it.each`
    scenario                            | mockSetupHeader
    ${'token is empty string'}          | ${() => 'X-XSRF-TOKEN='}
    ${'token contains only whitespace'} | ${() => 'X-XSRF-TOKEN=   '}
    ${'token pattern not found'}        | ${() => 'other-cookie=value'}
  `('should throw error when $scenario', async ({ mockSetupHeader }) => {
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue(mockSetupHeader()),
      },
    });

    await expect(getCsrfToken(serviceUrl)).rejects.toThrow(
      'CSRF token not found in Set-Cookie header',
    );

    expect(console.error).toHaveBeenCalledWith(
      `${REQUEST_FAILED}: Error fetching CSRF token from ${serviceUrl}:`,
      expect.any(Error),
    );
  });

  it.each`
    scenario                      | mockSetup
    ${'response is not ok (404)'} | ${() => mockFetch.mockResolvedValue({ status: 404 })}
    ${'response is not ok (500)'} | ${() => mockFetch.mockResolvedValue({ status: 500 })}
  `('should throw error when $scenario', async ({ mockSetup }) => {
    mockSetup();

    await expect(getCsrfToken(serviceUrl)).rejects.toThrow(
      `Response not OK: Failed to fetch CSRF token from ${serviceUrl}/csrf-token`,
    );

    expect(console.error).toHaveBeenCalledWith(
      `${REQUEST_FAILED}: Error fetching CSRF token from ${serviceUrl}:`,
      expect.any(Error),
    );
  });
});
