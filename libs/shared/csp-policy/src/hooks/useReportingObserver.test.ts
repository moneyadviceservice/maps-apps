import { renderHook } from '@testing-library/react';

import { useReportingObserver } from './useReportingObserver';

const mockreports = [
  {
    body: {
      toJSON: jest.fn().mockImplementation(() => ({
        blockedURL: 'http://assets.adobedtm.com',
        columnNumber: 29382,
        documentURL: 'http://localhost:8888/en/pension-wise-appointment',
        effectiveDirective: 'script-src-elem',
        lineNumber: 12,
        sourceFile:
          'http://assets.adobedtm.com/c3a3920a84ef/2104df5e2099/launch-834de5c44d2c-staging.min.js',
        statusCode: 200,
      })),
    },
  },
];

const reportingObserverspy = (window.ReportingObserver = jest
  .fn()
  .mockImplementation((callback, options) => {
    callback(mockreports, {});
    return {
      observe: jest.fn(),
    };
  }));

describe('useReportingObserver', () => {
  it('should call ReportingObserver once', () => {
    renderHook(() => useReportingObserver());
    expect(reportingObserverspy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
