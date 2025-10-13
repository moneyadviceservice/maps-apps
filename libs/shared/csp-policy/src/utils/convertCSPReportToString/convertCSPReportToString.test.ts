import { convertCSPReportToString } from './';

const mockResponse = `
    Blocked url: test-blocked-url.example
    {
      column-number: 29382
      document-url: test-document-url/page
      directive: script-src-elem
      line-number: 12
      source-file: test-source-file.js
      status-code: 200
    }`;

describe('Convert CSP report to srring', () => {
  it('should convert ReportData object to string', () => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 7, 11, 1, 0, 0));

    expect(
      convertCSPReportToString({
        blockedURL: 'test-blocked-url.example',
        columnNumber: 29382,
        documentURL: 'test-document-url/page',
        effectiveDirective: 'script-src-elem',
        lineNumber: 12,
        sourceFile: 'test-source-file.js',
        statusCode: 200,
      }),
    ).toContain(mockResponse);
  });

  it('should display empty string if data is empty object', () => {
    expect(convertCSPReportToString({})).toBe('');
  });
});
