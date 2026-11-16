export const convertCSPReportToString = (val: any): string => {
  if (!val || Object.keys(val).length < 1) return '';
  let data = '';

  data += `Created date: ${new Date().toISOString().slice(0, -1)}
    Blocked url: ${val['blockedURL']}
    {
      column-number: ${val.columnNumber}
      document-url: ${val.documentURL}
      directive: ${val.effectiveDirective}
      line-number: ${val.lineNumber}
      source-file: ${val.sourceFile}
      status-code: ${val.statusCode}
    }
  `;

  return data;
};
