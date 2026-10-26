import { Context } from '@netlify/functions';

import { cspViolationHandler } from './cspViolationHandler';

// Mock @netlify/blobs
jest.mock('@netlify/blobs', () => ({
  getStore: jest.fn(() => ({
    set: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Extend global interface for test mocks
declare global {
  let Request: jest.MockedClass<typeof Request>;
  let Response: jest.MockedClass<typeof Response>;
}

// Mock global Request and Response
global.Request = jest.fn().mockImplementation((url, options) => ({
  method: options?.method || 'GET',
  body: options?.body || null,
  text: jest.fn().mockResolvedValue(options?.body || ''),
})) as jest.MockedClass<typeof Request>;

global.Response = jest.fn().mockImplementation((body, options) => ({
  status: options?.status || 200,
  text: jest.fn().mockResolvedValue(body),
})) as jest.MockedClass<typeof Response>;

describe('CSP Violation Handler', () => {
  const mockContext: Context = {} as Context;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock crypto.randomUUID
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: jest.fn(() => 'test-uuid'),
      },
    });
  });

  it('should handle CSP violation successfully', async () => {
    const mockRequest = new Request('test-url', {
      method: 'POST',
      body: 'CSP violation data',
    });

    const response = await cspViolationHandler(mockRequest, mockContext, {
      appName: 'test-app',
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('CSP violation saved successfully');
  });

  it('should use custom blob store name when provided', async () => {
    const mockRequest = new Request('test-url', {
      method: 'POST',
      body: 'CSP violation data',
    });

    // Get the mocked getStore function
    const { getStore } = jest.requireMock('@netlify/blobs');

    await cspViolationHandler(mockRequest, mockContext, {
      appName: 'test-app',
      blobStoreName: 'custom-blob-store',
    });

    expect(getStore).toHaveBeenCalledWith({
      name: 'custom-blob-store',
      consistency: 'strong',
    });
  });

  it('should return 405 for non-POST requests', async () => {
    const mockRequest = new Request('test-url', {
      method: 'GET',
    });

    const response = await cspViolationHandler(mockRequest, mockContext, {
      appName: 'test-app',
    });

    expect(response.status).toBe(405);
    expect(await response.text()).toBe('Method not allowed');
  });

  it('should handle errors when saving to blob store', async () => {
    const mockRequest = new Request('test-url', {
      method: 'POST',
      body: 'CSP violation data',
    });

    // Get the mocked getStore function
    const { getStore } = jest.requireMock('@netlify/blobs');
    getStore.mockReturnValue({
      set: jest.fn().mockRejectedValue(new Error('Blob store error')),
    });

    await expect(
      cspViolationHandler(mockRequest, mockContext, {
        appName: 'test-app',
      }),
    ).rejects.toThrow('Error saving csp violations Blob store error');
  });
});
