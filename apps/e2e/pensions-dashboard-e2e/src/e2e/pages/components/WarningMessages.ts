import { Locator, Page } from '@playwright/test';

interface PensionData {
  warningPNR?: string;
  warningPSO?: string;
  warningPEO?: string;
  warningSCP?: string;
  warningFAS?: string;
}

interface PensionWarning {
  type: string;
  visible: boolean;
  expectedTitle: string;
  expectedDescription: string;
}

class WarningMessages {
  readonly page: Page;
  readonly expectedWarnings: PensionWarning[];

  constructor(page: Page, pension: PensionData) {
    this.page = page;

    this.expectedWarnings = [
      {
        type: 'PNR',
        visible: pension.warningPNR === 'PNR',
        expectedTitle: 'This pension’s retirement date is in the past',
        expectedDescription:
          'We cannot show an estimated income because the pension’s retirement date is in the past. You do not have to retire or take your pension on this date - you can usually change it by contacting your provider.',
      },
      {
        type: 'PSO',
        visible: pension.warningPSO === 'PSO',
        expectedTitle: 'This scheme has a pension sharing order',
        expectedDescription:
          'A pension sharing order (sometimes called ‘splitting’) means some or all of this pension will be transferred to your ex-spouse or ex-civil partner. Values shown could be before or after the order is applied. The Court order will state the percentage or amount.',
      },
      {
        type: 'PEO',
        visible: pension.warningPEO === 'PEO',
        expectedTitle:
          'This scheme has a pension attachment or earmarking order',
        expectedDescription:
          'A pension attachment or earmarking order means some or all of this pension will be paid to your ex-spouse or ex-civil partner.',
      },
      {
        type: 'SCP',
        visible: pension.warningSCP === 'SCP',
        expectedTitle: 'This scheme pays any annual allowance tax charge',
        expectedDescription:
          'The scheme will pay any annual allowance tax charge if it applies to you, and adjust your pot value or benefits.',
      },
      {
        type: 'FAS',
        visible: pension.warningFAS === 'FAS',
        expectedTitle:
          'This scheme is supplemented by the Financial Assistance Scheme',
        expectedDescription:
          'Some or all of the income or other benefits you get from this scheme will be supplemented by the Financial Assistance Scheme (FAS).',
      },
    ];
  }
  getAllVisibleWarnings(): Locator {
    return this.page.locator('[data-testid^="callout-default-warning-"]');
  }

  getCallout(warningType: string): Locator {
    return this.page.getByTestId(`callout-default-warning-${warningType}`);
  }

  getTitle(warningType: string): Locator {
    return this.page.getByTestId(`warning-title-${warningType}`);
  }

  getDescription(warningType: string): Locator {
    return this.page.getByTestId(`warning-description-${warningType}`);
  }

  async isWarningVisible(warningType: string): Promise<boolean> {
    return await this.getCallout(warningType).isVisible();
  }

  async verifyWarningContent(
    warningType: string,
    expectedTitle: string,
    expectedDescription: string,
  ): Promise<boolean> {
    const titleText = await this.getTitle(warningType).innerText();
    const descriptionText = await this.getDescription(warningType).innerText();

    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

    const titleCheck = normalize(titleText).includes(expectedTitle);
    const descriptionCheck =
      normalize(descriptionText).includes(expectedDescription);
    return titleCheck && descriptionCheck;
  }
}
export default WarningMessages;
