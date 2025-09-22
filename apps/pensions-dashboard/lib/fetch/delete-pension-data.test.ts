import { deletePensionData } from './delete-pension-data';
import { getCsrfToken } from './get-csrf-token';

// Mock fetch globally
global.fetch = jest.fn();

// Mock getCsrfToken
jest.mock('./get-csrf-token', () => ({
  getCsrfToken: jest.fn(),
}));

describe('deletePensionData', () => {
  const mockUserSessionId = 'test-session-id';
  const mockGetCsrfToken = getCsrfToken as jest.Mock;

  // Mock console methods to suppress logs during testing
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MHPD_PENSION_DATA_SERVICE = 'https://test-service.example.com';

    // Setup default CSRF mock
    mockGetCsrfToken.mockResolvedValue({
      token: 'test-csrf-token',
      cookie: 'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly',
    });

    // Mock console methods to suppress test output
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    delete process.env.MHPD_PENSION_DATA_SERVICE;
    // Restore console methods
    consoleErrorSpy?.mockRestore();
    consoleWarnSpy?.mockRestore();
  });

  it('should call DELETE endpoint with correct parameters', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 204,
    });

    // Act
    await deletePensionData({ userSessionId: mockUserSessionId });

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-service.example.com/pensions-data',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: 'test-session-id',
          mhpdCorrelationId: 'test-session-id',
          'X-XSRF-TOKEN': 'test-csrf-token',
          Cookie: 'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly',
        },
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('should handle successful deletion (204 No Content)', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 204,
    });

    // Act & Assert
    await expect(
      deletePensionData({ userSessionId: mockUserSessionId }),
    ).resolves.toBeUndefined();
  });

  it('should handle successful deletion (200 OK)', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    // Act & Assert
    await expect(
      deletePensionData({ userSessionId: mockUserSessionId }),
    ).resolves.toBeUndefined();
  });

  it('should handle 404 Not Found without throwing', async () => {
    // Mock the DELETE request to return 404
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    // Should not throw for 404
    await expect(
      deletePensionData({ userSessionId: mockUserSessionId }),
    ).resolves.not.toThrow();

    // Should not log anything for 404 (silently continues)
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should throw error for 5XX server errors', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    // Act & Assert
    await expect(
      deletePensionData({ userSessionId: mockUserSessionId }),
    ).rejects.toThrow('500: Network response was not ok');
  });

  it('should log warning for other non-2xx responses but not throw', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
    });

    // Act & Assert - should not throw for 4XX (except handled cases)
    await expect(
      deletePensionData({ userSessionId: mockUserSessionId }),
    ).resolves.toBeUndefined();

    // Should log warning
    expect(console.warn).toHaveBeenCalledWith(
      'DELETE pension data returned 400, continuing with logout',
    );
  });

  it('should throw error when fetch fails', async () => {
    // Arrange
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    // Act & Assert
    await expect(
      deletePensionData({ userSessionId: mockUserSessionId }),
    ).rejects.toThrow('Network error');
  });
});
