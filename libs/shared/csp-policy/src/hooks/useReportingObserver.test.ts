import { renderHook } from '@testing-library/react';

import { useReportingObserver } from './useReportingObserver';

// Mock the saveDataToBlob function
jest.mock('../utils/netlify/handleCSPViolationBlob', () => ({
  saveDataToBlob: jest.fn().mockResolvedValue('Violation saved successfully'),
}));

const mockreports = [
  {
    body: {
      toJSON: jest.fn().mockImplementation(() => ({
        blockedURL: 'test-blocked-url.example',
        columnNumber: 29382,
        documentURL: 'test-document-url/page',
        effectiveDirective: 'script-src-elem',
        lineNumber: 12,
        sourceFile: 'test-source-file.js',
        statusCode: 200,
      })),
    },
  },
];

const reportingObserverspy = (window.ReportingObserver = jest
  .fn()
  .mockImplementation((callback) => {
    callback(mockreports, {});
    return {
      observe: jest.fn(),
    };
  }));

describe('useReportingObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ReportingObserver once', () => {
    renderHook(() => useReportingObserver());
    expect(reportingObserverspy).toHaveBeenCalledTimes(1);
  });

  it('should call saveDataToBlob when violations are detected', async () => {
    const { saveDataToBlob } = jest.requireMock(
      '../utils/netlify/handleCSPViolationBlob',
    );

    renderHook(() => useReportingObserver());

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(saveDataToBlob).toHaveBeenCalledTimes(1);
    expect(saveDataToBlob).toHaveBeenCalledWith(
      expect.stringContaining('Created date:'),
    );
  });

  it('should handle reports without body gracefully', async () => {
    const reportsWithoutBody = [{ body: null }];

    window.ReportingObserver = jest.fn().mockImplementation((callback) => {
      callback(reportsWithoutBody, {});
      return { observe: jest.fn() };
    });

    const { saveDataToBlob } = jest.requireMock(
      '../utils/netlify/handleCSPViolationBlob',
    );

    renderHook(() => useReportingObserver());

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Should not call saveDataToBlob when no valid violations
    expect(saveDataToBlob).not.toHaveBeenCalled();
  });

  it('should handle saveDataToBlob errors gracefully', async () => {
    const { saveDataToBlob } = jest.requireMock(
      '../utils/netlify/handleCSPViolationBlob',
    );

    // Mock saveDataToBlob to throw an error
    saveDataToBlob.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    window.ReportingObserver = jest.fn().mockImplementation((callback) => {
      callback(mockreports, {});
      return { observe: jest.fn() };
    });

    renderHook(() => useReportingObserver());

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save csp violations to Netlify blobs',
    );

    consoleSpy.mockRestore();
  });

  it('should handle reports without body property gracefully', () => {
    const reportsWithoutBody = [
      {
        // No body property - testing edge case
        type: 'csp-violation',
      },
    ];

    const mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };

    const { saveDataToBlob } = jest.requireMock(
      '../utils/netlify/handleCSPViolationBlob',
    );

    (window.ReportingObserver as jest.Mock).mockImplementation((callback) => {
      // Simulate calling the callback with reports without body
      setTimeout(() => callback(reportsWithoutBody, mockObserver), 0);
      return mockObserver;
    });

    renderHook(() => useReportingObserver());

    // Wait for async callback
    return new Promise((resolve) => {
      setTimeout(() => {
        // Should not cause errors even without body property
        expect(mockObserver.observe).toHaveBeenCalled();
        // saveDataToBlob should not be called since no valid violations
        expect(saveDataToBlob).not.toHaveBeenCalled();
        resolve(true);
      }, 10);
    });
  });

  it('should not call saveDataToBlob when violations string is empty', () => {
    const reportsWithEmptyBody = [
      {
        body: null, // Null body - testing the if (violation.body) condition
        type: 'csp-violation',
      },
    ];

    const mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };

    const { saveDataToBlob } = jest.requireMock(
      '../utils/netlify/handleCSPViolationBlob',
    );

    (window.ReportingObserver as jest.Mock).mockImplementation((callback) => {
      // Simulate calling the callback with reports with null body
      setTimeout(() => callback(reportsWithEmptyBody, mockObserver), 0);
      return mockObserver;
    });

    renderHook(() => useReportingObserver());

    // Wait for async callback
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockObserver.observe).toHaveBeenCalled();
        // saveDataToBlob should not be called since violations string remains empty
        expect(saveDataToBlob).not.toHaveBeenCalled();
        resolve(true);
      }, 10);
    });
  });

  it('should not initialize when ReportingObserver is undefined', () => {
    // Save original ReportingObserver
    const originalReportingObserver = window.ReportingObserver;

    // Mock ReportingObserver as undefined
    Object.defineProperty(window, 'ReportingObserver', {
      value: undefined,
      configurable: true,
    });

    // Also check if global ReportingObserver is undefined
    Object.defineProperty(global, 'ReportingObserver', {
      value: undefined,
      configurable: true,
    });

    const { saveDataToBlob } = jest.requireMock(
      '../utils/netlify/handleCSPViolationBlob',
    );

    renderHook(() => useReportingObserver());

    // ReportingObserver should not be created and saveDataToBlob should not be called
    expect(saveDataToBlob).not.toHaveBeenCalled();

    // Restore original ReportingObserver
    Object.defineProperty(window, 'ReportingObserver', {
      value: originalReportingObserver,
      configurable: true,
    });
  });
});
