import { Locator, Page } from '@playwright/test';

import { guidanceData } from '../data/guidance-data';

const guidancePackages = {
  GP01: 'consolidation-1-section',
  GP01a: 'consolidation-1a-section',
  GP01c: 'consolidation-1c-section',
  GP02: 'employment-02-section',
  GP02a: 'employment-02a-section',
  GP02b: 'employment-02b-section',
  GP03: 'employment-03-section',
  GP04: 'employment-04-section',
  GP05: 'employment-05-section',
  GP06: 'employment-06-section',
  GP07: 'employment-07-section',
  GP08: 'overseas-8-section',
  GP08a: 'overseas-8a-section',
  GP08b: 'overseas-8b-section',
  GP09: 'housing-09-section',
  GP09a: 'housing-09a-section',
  GP10: 'housing-10-section',
  GP10a: 'housing-10a-section',
  GP11: 'housing-11-section',
  GP12: 'housing-12-section',
  GP12a: 'housing-12a-section',
  GP13: 'housing-13-section',
  GP14: 'housing-14-section',
  GP14a: 'housing-14a-section',
  GP14b: 'housing-14b-section',
  GP15: 'housing-15-section',
  GP15a: 'housing-15a-section',
  GP16: 'housing-16-section',
  GP16a: 'housing-16a-section',
  GP16b: 'housing-16b-section',
  GP17: 'divorce-17-section',
  GP22: 'find-your-pension-type-22-section',
  GP23: 'debt-23-section',
  GP23a: 'debt-23a-section',
} as const;

type GuidancePackage = keyof typeof guidancePackages;

type PensionType =
  | 'state-pension'
  | 'defined-benefit'
  | 'defined-contribution'
  | 'other'
  | 'not-sure';

const pensionValues: Record<PensionType, string> = {
  'defined-contribution': '0',
  'defined-benefit': '1',
  'state-pension': '2',
  other: '3',
  'not-sure': '4',
};

type YesNoNotSure = 'yes' | 'no' | 'not-sure';

export class RetirementGuidancePage {
  constructor(private readonly page: Page) {}

  guidancePackage(packageName: GuidancePackage) {
    const packageLocator = this.page.getByTestId(guidancePackages[packageName]);

    return {
      container: packageLocator,
      heading: packageLocator.locator('summary'),
      content: packageLocator.locator('summary + div'),
      links: packageLocator.locator('a'),
    };
  }

  private addPensionParams(
    params: URLSearchParams,
    pension: readonly PensionType[],
  ) {
    pension.forEach((type) => {
      params.append('q-5', pensionValues[type]);
    });
  }

  async openDebtResult({
    debt,
    debtAdvice,
  }: {
    debt: 'yes' | 'no';
    debtAdvice?: 'yes' | 'no';
  }) {
    const params = new URLSearchParams({
      'q-1': '0',
      'q-2': '1',
      'q-3': '0',
      'q-4': '0',
      'q-5': '4',
      'q-6': '1',
      'q-7': '1',
      'q-8': '1',
      'q-9': '3',
      'q-10': debt === 'yes' ? '0' : '1',
    });

    if (debt === 'yes' && debtAdvice) {
      params.set('q-11', debtAdvice === 'yes' ? '0' : '1');
    }

    await this.page.goto(`/en/results?${params}`);
  }

  async openHousingResult({
    retirement,
    pension,
    housing,
  }: {
    retirement: 'less-than-10-years' | 'more-than-10-years' | 'already-retired';
    pension: readonly PensionType[];
    housing: 'private-landlord' | 'social-housing' | 'mortgage' | 'none';
  }) {
    const retirementValues = {
      'less-than-10-years': '0',
      'more-than-10-years': '1',
      'already-retired': '2',
    };

    const housingValues = {
      'private-landlord': '0',
      'social-housing': '1',
      mortgage: '2',
      none: '3',
    };

    const params = new URLSearchParams({
      'q-1': '0',
      'q-2': retirementValues[retirement],
      'q-3': '0',
      'q-4': '0',
      'q-6': '1',
      'q-7': '1',
      'q-8': '1',
      'q-9': housingValues[housing],
      'q-10': '1',
    });

    this.addPensionParams(params, pension);

    await this.page.goto(`/en/results?${params}`);
  }

  async openOverseasResult({
    pension,
    overseas,
  }: {
    pension: readonly PensionType[];
    overseas: YesNoNotSure;
  }) {
    const overseasValues = {
      yes: '0',
      no: '1',
      'not-sure': '2',
    };

    const params = new URLSearchParams({
      'q-1': '0',
      'q-2': '1',
      'q-3': '0',
      'q-4': '0',
      'q-6': '1',
      'q-7': overseasValues[overseas],
      'q-8': '1',
      'q-9': '3',
      'q-10': '1',
    });

    this.addPensionParams(params, pension);

    await this.page.goto(`/en/results?${params}`);
  }

  async openDivorceResult({
    divorce,
    pension,
  }: {
    divorce: 'yes' | 'no';
    pension: readonly PensionType[];
  }) {
    const divorceValues = {
      yes: '0',
      no: '1',
    };

    const params = new URLSearchParams({
      'q-1': '0',
      'q-2': '1',
      'q-3': '0',
      'q-4': '0',
      'q-6': '1',
      'q-7': '1',
      'q-8': divorceValues[divorce],
      'q-9': '3',
      'q-10': '1',
    });

    this.addPensionParams(params, pension);

    await this.page.goto(`/en/results?${params}`);
  }

  async openContributionsResult({
    employment,
    contribution,
    pension,
  }: {
    employment: 'employed' | 'self-employed' | 'not-employed';
    contribution: YesNoNotSure;
    pension: readonly PensionType[];
  }) {
    const employmentValues = {
      employed: '0',
      'self-employed': '1',
      'not-employed': '2',
    };

    const contributionValues = {
      yes: '0',
      no: '1',
      'not-sure': '2',
    };

    const params = new URLSearchParams({
      'q-1': '0',
      'q-2': '1',
      'q-3': employmentValues[employment],
      'q-4': contributionValues[contribution],
      'q-6': '1',
      'q-7': '1',
      'q-8': '1',
      'q-9': '3',
      'q-10': '1',
    });

    this.addPensionParams(params, pension);

    await this.page.goto(`/en/results?${params}`);
  }

  async openConsolidationResult({
    pension,
    consolidation,
  }: {
    pension: readonly PensionType[];
    consolidation: YesNoNotSure;
  }) {
    const consolidationValues = {
      yes: '0',
      no: '1',
      'not-sure': '2',
    };

    const params = new URLSearchParams({
      'q-1': '0',
      'q-2': '1',
      'q-3': '0',
      'q-4': '0',
      'q-6': consolidationValues[consolidation],
      'q-7': '1',
      'q-8': '1',
      'q-9': '3',
      'q-10': '1',
    });

    this.addPensionParams(params, pension);

    await this.page.goto(`/en/results?${params}`);
  }

  getExpectedGuidance(packageName: GuidancePackage) {
    const expected = guidanceData[packageName];

    if (!expected) {
      throw new Error(
        'Could not find appropriate guidance data\n' +
          `Searching for ${packageName} in guidance-data.ts\n` +
          'Check if the guidance data file contains the correct key.',
      );
    }

    return {
      expected,
      guidancePackage: this.guidancePackage(packageName),
    };
  }

  async clickGuidanceLink(link: Locator) {
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click(),
    ]);

    return newTab;
  }
}
