import { NextRequest, NextResponse } from 'next/server';

import { setCSPScriptException } from './utils/cspHelper';
import { withCSP } from './withCSP';

// Mock the setCSPScriptException
jest.mock('./utils/cspHelper', () => ({
  setCSPScriptException: jest.fn(),
}));

describe('withCSP', () => {
  let mockRequest: NextRequest;
  let mockResponse: NextResponse;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    // Store original environment
    originalEnv = process.env;
    // Reset environment for each test
    process.env = { ...originalEnv };

    // Reset the crypto mock
    (global.crypto.randomUUID as jest.Mock).mockReturnValue('mock-uuid-1234');
    (setCSPScriptException as jest.Mock).mockReturnValue('mock-csp-header');

    mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue('test-host'),
      },
    } as unknown as NextRequest;

    mockResponse = {
      headers: {
        set: jest.fn(),
      },
    } as unknown as NextResponse;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should add CSP headers when CSP_CONSOLE_LOGGING_ENABLED is true', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    const result = withCSP(mockResponse, mockRequest);

    expect(result).toBe(mockResponse);
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      'Content-Security-Policy-Report-Only',
      'mock-csp-header',
    );
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      'X-Nonce',
      expect.any(String),
    );
  });

  it('should not add CSP headers when CSP_CONSOLE_LOGGING_ENABLED is false', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'false';

    const result = withCSP(mockResponse, mockRequest);

    expect(result).toBe(mockResponse);
    expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
      'Content-Security-Policy-Report-Only',
      expect.any(String),
    );
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      'X-Nonce',
      expect.any(String),
    );
  });

  it('should not add CSP headers when CSP_CONSOLE_LOGGING_ENABLED is not set (defaults to false)', () => {
    // Don't set the environment variable (undefined)
    delete process.env.CSP_CONSOLE_LOGGING_ENABLED;

    const result = withCSP(mockResponse, mockRequest);

    expect(result).toBe(mockResponse);
    expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
      'Content-Security-Policy-Report-Only',
      expect.any(String),
    );
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      'X-Nonce',
      expect.any(String),
    );
  });

  it('should generate a nonce from crypto.randomUUID', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest);

    expect(global.crypto.randomUUID).toHaveBeenCalled();
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      'X-Nonce',
      'bW9jay11dWlkLTEyMzQ=', // base64 of 'mock-uuid-1234'
    );
  });

  it('should call setCSPScriptException with correct parameters for localhost', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';
    (mockRequest.headers.get as jest.Mock).mockReturnValue('test-localhost');

    withCSP(mockResponse, mockRequest);

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': "'unsafe-eval'",
      },
    });
  });

  it('should call setCSPScriptException with correct parameters for production', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';
    (mockRequest.headers.get as jest.Mock).mockReturnValue(
      'test-production-host',
    );

    withCSP(mockResponse, mockRequest);

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
      },
    });
  });

  it('should handle null host header', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';
    (mockRequest.headers.get as jest.Mock).mockReturnValue(null);

    withCSP(mockResponse, mockRequest);

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
      },
    });
  });

  it('should accept custom CSP options', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest, {
      'form-action': 'test-form-action',
      'connect-src': "'self'",
    });

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
        'form-action': 'test-form-action',
        'connect-src': "'self'",
      },
    });
  });

  it('should override default options with custom options', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest, {
      'style-src': "'strict-dynamic'",
      'report-uri': 'test-custom-report',
    });

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': "'strict-dynamic'", // overridden
        'report-uri': 'test-custom-report', // overridden
      },
    });
  });

  it('should filter out undefined values from custom options', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest, {
      'form-action': 'test-form-action',
      'report-uri': undefined, // should be filtered out
      'connect-src': "'self'",
    });

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
        'form-action': 'test-form-action',
        'connect-src': "'self'",
        // 'report-uri' should not be present because it was undefined
      },
    });
  });

  it('should enable CSP reporting when report-uri is explicitly provided', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest, {
      'report-uri': '/.netlify/functions/saveCSPViolationsDetails',
    });

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
        'report-uri': '/.netlify/functions/saveCSPViolationsDetails',
      },
    });
  });

  it('should generate unique nonces for multiple calls', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    (global.crypto.randomUUID as jest.Mock)
      .mockReturnValueOnce('uuid-1')
      .mockReturnValueOnce('uuid-2');

    withCSP(mockResponse, mockRequest);
    withCSP(mockResponse, mockRequest);

    expect(setCSPScriptException).toHaveBeenNthCalledWith(1, {
      urlExceptions: {
        'script-src': "'nonce-dXVpZC0x'", // base64 of 'uuid-1'
        'style-src': '',
      },
    });

    expect(setCSPScriptException).toHaveBeenNthCalledWith(2, {
      urlExceptions: {
        'script-src': "'nonce-dXVpZC0y'", // base64 of 'uuid-2'
        'style-src': '',
      },
    });
  });

  it('should handle crypto.randomUUID throwing an error', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    (global.crypto.randomUUID as jest.Mock).mockImplementation(() => {
      throw new Error('Crypto not available');
    });

    expect(() => withCSP(mockResponse, mockRequest)).toThrow(
      'Crypto not available',
    );
  });

  it('should handle empty custom options object', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest, {});

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
      },
    });
  });

  it('should preserve all custom directives even if not in defaults', () => {
    process.env.CSP_CONSOLE_LOGGING_ENABLED = 'true';

    withCSP(mockResponse, mockRequest, {
      sandbox: 'allow-scripts',
      'upgrade-insecure-requests': '',
      'base-uri': "'self'",
    });

    expect(setCSPScriptException).toHaveBeenCalledWith({
      urlExceptions: {
        'script-src': "'nonce-bW9jay11dWlkLTEyMzQ='",
        'style-src': '',
        sandbox: 'allow-scripts',
        'upgrade-insecure-requests': '',
        'base-uri': "'self'",
      },
    });
  });
});
