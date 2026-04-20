import { Locator, Page } from '@maps/playwright';

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
          'Your estimated income may not be accurate because you’ve passed your retirement date, which is the date the provider used to calculate it. You do not usually have to retire or take your pension on this date - contact your provider to ask about your options.',
      },
      {
        type: 'PSO',
        visible: pension.warningPSO === 'PSO',
        expectedTitle:
          'A pension sharing order has or is being applied to your pension',
        expectedDescription:
          'A pension sharing order (sometimes called ‘splitting’) has been or is being put in place. This means some or all of this pension will be transferred to your ex-spouse or ex-civil partner. The court order will say the percentage or amount. This means the values shown could be higher than what you’ll receive. Learn more about divorce and pensions.',
      },
      {
        type: 'PEO',
        visible: pension.warningPEO === 'PEO',
        expectedTitle:
          'A pension attachment or earmarking order has or is being applied to your pension',
        expectedDescription:
          'A pension attachment or earmarking order means some or all of this pension will be paid to your ex-spouse or ex-civil partner when you take your pension. Contact your provider for more details.',
      },
      {
        type: 'SCP',
        visible: pension.warningSCP === 'SCP',
        expectedTitle: 'This scheme pays any annual allowance tax charge',
        expectedDescription:
          'An annual allowance tax charge from your scheme may impact these estimates. Once the charge is paid, your income, pot value or lump sums might be lower.',
      },
      {
        type: 'FAS',
        visible: pension.warningFAS === 'FAS',
        expectedTitle:
          'The benefits in your pension will be supplemented by the Financial Assistance Scheme',
        expectedDescription:
          'Some or all of the income or other benefits you get from this scheme will be supplemented by the Financial Assistance Scheme (FAS). Get more information on FAS from the Pension Protection Fund.',
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
