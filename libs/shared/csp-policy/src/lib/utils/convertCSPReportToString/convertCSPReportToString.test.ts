import { convertCSPReportToString } from './';

const mockResponse = `
    Blocked url: http://assets.adobedtm.com
    {
      column-number: 29382
      document-url: http://localhost:8888/en/pension-wise-appointment
      directive: script-src-elem
      line-number: 12
      source-file: http://assets.adobedtm.com/c3a3920a84ef/2104df5e2099/launch-834de5c44d2c-staging.min.js
      status-code: 200
    }`;

describe('Convert CSP report to srring', () => {
  it('should convert ReportData object to string', () => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 7, 11, 1, 0, 0));

    expect(
      convertCSPReportToString({
        blockedURL: 'http://assets.adobedtm.com',
        columnNumber: 29382,
        documentURL: 'http://localhost:8888/en/pension-wise-appointment',
        effectiveDirective: 'script-src-elem',
        lineNumber: 12,
        sourceFile:
          'http://assets.adobedtm.com/c3a3920a84ef/2104df5e2099/launch-834de5c44d2c-staging.min.js',
        statusCode: 200,
      }),
    ).toContain(mockResponse);
  });

  it('should display empty string if data is empty object', () => {
    expect(convertCSPReportToString({})).toBe('');
  });
});
