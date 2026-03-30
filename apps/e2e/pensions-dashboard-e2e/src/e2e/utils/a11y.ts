import { AxeResults } from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter';

export class A11yUtilities {
  static createA11yHtmlReport(dirName: string, results: Partial<AxeResults>) {
    createHtmlReport({
      results: results,
      options: {
        projectKey: 'MaPSFunctionalTests',
        outputDirPath: `test-results/accessibility/${dirName}`,
        reportFileName: `a11y-report.html`,
      },
    });
  }
}
