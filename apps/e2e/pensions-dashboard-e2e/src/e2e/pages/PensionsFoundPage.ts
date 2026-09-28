import { Locator, Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import { PensionChannel } from '../utils/pensionClassification/types';

class PensionsFoundPage {
  constructor(private readonly page: Page) {}

  readonly heading = `h1:text-is("Pensions found")`;
  readonly headingNoPensions = `h1:text-is("No pensions found")`;
  //readonly pendingPensionsHeading = `h3:text-is("Pending pensions")`;
  readonly container = String.raw`div.lg\:grid`;
  readonly unsupportedPensionsCallout = '[data-testid="unsupported-callout"]';
  readonly seePendingPensionsButton = `a[href*="pending-pensions"]`;
  readonly seePendingPensionsButtonWelsh = `Gweld pensiynau sydd ar y gweill`;
  readonly seePensionsBreakdownButton = 'a[href*="your-pension-breakdown"]';
  readonly seePensionsBreakdownButtonWelsh = 'Gweld eich pensiynau';
  readonly noPensionsIntro =
    'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.';
  readonly noPensionsSubheading = 'What you can do:';
  readonly unsupportedPensionsFound = 'Unsupported pensions found';
  readonly pensionFoundPageTitleText =
    'Your Pension Search Results - MoneyHelper Pensions Dashboard';

  positiveContainer() {
    return this.page.locator(`[data-testid="callout-positive"]`);
  }

  negativeContainer() {
    return this.page.locator(`[data-testid="callout-negative"]`);
  }

  warningContainer() {
    return this.page.locator(`[data-testid="callout-warning"]`);
  }

  async clickReviewPensions(locale: Locale = 'en'): Promise<void> {
    const reviewPensionsText = {
      en: 'Pensions that need action',
      cy: 'Pensiynau sydd angen gweithredu',
    };

    const reviewPensionsLinkText = {
      en: 'See pensions that need action',
      cy: 'Gweld pensiynau sydd angen gweithredu',
    };

    await this.page
      .getByTestId('callout-negative')
      .waitFor({ state: 'visible' });

    await this.page
      .getByRole('link', { name: reviewPensionsLinkText[locale] })
      .click();

    await this.page
      .getByTestId('page-title')
      .filter({ hasText: reviewPensionsText[locale] })
      .waitFor({ state: 'visible' });
  }

  async clickReportATechnicalProblem(locale: Locale = 'en'): Promise<void> {
    const reportProblemText = {
      en: 'Report a technical problem',
      cy: 'Rhoi gwybod am broblem dechnegol',
    };

    const text = reportProblemText[locale];

    await this.page.getByRole('link', { name: text }).click();
    await this.page
      .getByTestId('page-title')
      .filter({ hasText: text })
      .waitFor({ state: 'visible' });
  }

  async clickExploreThePensionsDashboard(locale: Locale = 'en'): Promise<void> {
    const exploreDashboardText = {
      en: 'Explore the Pensions Dashboard',
      cy: "Archwilio'r Dangosfwrdd",
    };

    const text = exploreDashboardText[locale];

    await this.page.getByRole('link', { name: text }).click();
    await this.page
      .getByTestId('page-title')
      .filter({ hasText: text })
      .waitFor({ state: 'visible' });
  }

  async clickUnderstandYourPensions(locale: Locale = 'en'): Promise<void> {
    const understandPensionsText = {
      en: 'Understand your pensions',
      cy: 'Deall eich pensiynau',
    };

    const titleText = understandPensionsText[locale];

    await this.page.getByRole('link', { name: titleText }).click();
    await this.page
      .getByTestId('page-title')
      .filter({ hasText: titleText })
      .waitFor({ state: 'visible' });
  }

  async navigateToPensionBreakdownPage(): Promise<void> {
    await this.page
      .getByTestId('callout-positive')
      .waitFor({ state: 'visible' });
    await this.page.getByRole('link', { name: 'See your pensions' }).click();
    await this.page
      .getByTestId('page-title')
      .filter({ hasText: 'Your pensions' })
      .waitFor({ state: 'visible' });
  }

  async linkExpectingOtherPensions(): Promise<Locator> {
    return this.page.getByTestId('urgent-callout');
  }

  async unsupportedPensionsCallOut(): Promise<Locator> {
    return this.page.getByTestId('unsupported-callout');
  }

  async noPensionGuideText(): Promise<Locator> {
    return this.page.getByTestId('tool-intro');
  }

  async noPensionFound(): Promise<Locator> {
    return this.page.getByTestId('page-title');
  }

  async getAllChannelText(): Promise<string> {
    const channels = this.page.locator(
      '[data-testid="callout-positive"], [data-testid="callout-negative"], [data-testid="callout-warning"]',
    );
    const texts = await channels.allTextContents();
    return texts.join(' ').replace(/\s+/g, '').toLowerCase();
  }

  getExpectedSchemeNames(pensions: any): string[] {
    return pensions.flatMap((policy: any) =>
      policy.pensionArrangements
        .filter(
          (arr: any) =>
            ['DC', 'SP', 'DB'].includes(arr.pensionType) ||
            arr.matchType === 'POSS',
        )
        .map((arr: any) => arr.schemeName),
    );
  }

  normalizeText(text: string): string {
    return text.replace(/\s+/g, '').toLowerCase();
  }

  async hasGreenChannel(): Promise<boolean> {
    return await this.page
      .locator('[data-testid="callout-positive"]')
      .isVisible();
  }

  async hasYellowChannel(): Promise<boolean> {
    return await this.page
      .locator('[data-testid="callout-warning"]')
      .isVisible();
  }

  async hasRedChannel(): Promise<boolean> {
    return await this.page
      .locator('[data-testid="callout-negative"]')
      .isVisible();
  }

  async noChannelsVisible(): Promise<boolean> {
    return (
      (await this.negativeContainer().isHidden()) &&
      (await this.positiveContainer().isHidden()) &&
      (await this.warningContainer().isHidden())
    );
  }

  async clickSeePendingPensions(locale: Locale = 'en'): Promise<void> {
    const pendingPensionsText = {
      en: {
        link: 'See pending pensions',
        heading: 'Pending pensions',
      },
      cy: {
        link: 'Gweld pensiynau sydd ar y gweill',
        heading: 'Pensiynau ar y gweill',
      },
    };

    const content = pendingPensionsText[locale];
    const pendingLink = this.page.getByRole('link', { name: content.link });

    await pendingLink.waitFor({ state: 'visible' });
    await pendingLink.click();
    await this.page
      .getByRole('heading', { name: content.heading, level: 1 })
      .waitFor({ state: 'visible' });
  }

  async clickSeeYourPensions(locale: Locale = 'en'): Promise<void> {
    const seeYourPensionsText = {
      en: { link: 'See your pensions', heading: 'Your pensions' },
      cy: { link: 'Gweld eich pensiynau', heading: 'Eich pensiynau' },
    };

    const t = seeYourPensionsText[locale];
    const linkLocator = this.page.getByRole('link', { name: t.link });

    await linkLocator.waitFor();
    await linkLocator.click();
    await this.page
      .getByRole('heading', { name: t.heading, exact: true })
      .waitFor();
  }

  async clickFooterContactUs(locale: Locale = 'en'): Promise<void> {
    if (locale === 'cy') {
      await this.page
        .getByTestId('footer')
        .getByRole('link', { name: 'Cysylltu â ni' })
        .click();

      await this.page
        .getByTestId('page-title')
        .filter({ hasText: 'Cysylltwch â ni' })
        .waitFor({ state: 'visible' });
    } else {
      await this.page
        .getByTestId('footer')
        .getByRole('link', { name: 'Contact us' })
        .click();
    }
  }

  async clickHelpAndSupportContactUs(): Promise<void> {
    const container = this.page.getByTestId('help-and-support');
    const contactUsLink = container.getByRole('link', { name: 'Contact us' });
    await contactUsLink.click();
  }

  async waitForPensionsFound(locale: Locale = 'en'): Promise<void> {
    const pensionsFoundHeadings = {
      en: 'Pensions found',
      cy: "Pensiynau wedi'u darganfod",
    };

    await this.page
      .locator(`h1:text-is("${pensionsFoundHeadings[locale]}")`)
      .waitFor({ timeout: 100000 });
  }

  async assertPensionsFound(page, pensions) {
    const negativeContainer = page.locator(`[data-testid="callout-negative"]`);
    const positiveContainer = page.locator(`[data-testid="callout-positive"]`);

    // Check all pensions
    for (const pension of pensions) {
      let expectedContainer = null;
      let expectedHeader = '';
      let shouldBeDisplayed = true;

      if (
        ['POSS', 'CONT'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          ['MEM'].includes(pension.unavailableReason))
      ) {
        expectedContainer = negativeContainer;
        expectedHeader = 'Pensions that need action';
      } else if (
        ['SYS', 'NEW'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          [
            null,
            '',
            'DCSM',
            'DB',
            'PPF',
            'DCHA',
            'DCHP',
            'WU',
            'DBC',
            'DCC',
            'NEW',
            'ANO',
            'NET',
            'TRN',
          ].includes(pension.unavailableReason)) ||
        pension.payableDetails?.reason === 'SML'
      ) {
        expectedContainer = positiveContainer;
        expectedHeader = 'Confirmed pensions';
      } else if (
        pension.matchType === 'DEFN' &&
        ['AVC', 'CDC', 'HYB', 'CB'].includes(pension.pensionType)
      ) {
        shouldBeDisplayed = false;
      }

      if (shouldBeDisplayed) {
        if (!expectedContainer) {
          throw new Error(
            `ERROR: Pension scheme "${pension.schemeName}" should be displayed but was not found.`,
          );
        }
        // Check if the pension scheme is listed in the expected container
        const matchingItems = expectedContainer.locator(
          `li:has-text("${pension.schemeName}")`,
        );
        const count = await matchingItems.count();

        if (count === 0) {
          throw new Error(
            `No matching items found for pension scheme: "${pension.schemeName}"`,
          );
        }

        await expectedContainer
          .locator(`h3:has-text("${expectedHeader}")`)
          .waitFor({ state: 'visible' });
      } else {
        // Ensure that pensionAdministrator is not displayed anywhere
        const allContainers = [negativeContainer, positiveContainer];
        for (const container of allContainers) {
          const matchingItems = container.locator(
            `li:has-text("${pension.pensionAdministrator}")`,
          );
          if ((await matchingItems.count()) > 0) {
            throw new Error(
              `ERROR: Pension administrator "${pension.pensionAdministrator}" should not be displayed but was found.`,
            );
          }
        }
      }
    }
  }

  async assertInvalidPensionsNotVisible(pensions: any): Promise<void> {
    const allowedPensionTypes = new Set(['SP', 'DC', 'DB', 'AVC', 'HYB']);

    for (const pension of pensions) {
      const schemeLocator = this.page.locator(
        `:has-text("${pension.schemeName}")`,
      );

      if (allowedPensionTypes.has(pension.pensionType)) {
        // Throw Error if allowed pension is not visible
        if (
          (await schemeLocator.count()) === 0 ||
          !(await schemeLocator.first().isVisible())
        ) {
          throw new Error(
            `ERROR: Pension scheme "${pension.schemeName}" with ALLOWED pensionType "${pension.pensionType}" should be visible but was not found.`,
          );
        } else {
          console.log(
            `Pension scheme "${pension.schemeName}" with allowed pensionType "${pension.pensionType}" is correctly displayed.`,
          );
        }
      } else {
        // Throw Error is disallowed pension is visible
        if (
          (await schemeLocator.count()) > 0 &&
          (await schemeLocator.first().isVisible())
        ) {
          throw new Error(
            `ERROR: Pension scheme "${pension.schemeName}" with DISALLOWED pensionType "${pension.pensionType}" should NOT be visible but was found.`,
          );
        } else {
          console.log(
            `Pension scheme "${pension.schemeName}" with disallowed pensionType "${pension.pensionType}" is NOT displayed (as expected).`,
          );
        }
      }
    }
  }

  async noPensionsFound(): Promise<void> {
    await this.page.locator(this.headingNoPensions).waitFor();
  }

  async getUnsupportedPensionsText() {
    return this.page.locator(this.unsupportedPensionsCallout).innerText();
  }

  // Return computed style of container
  async getLayoutDisplay() {
    return this.page
      .locator(this.container)
      .first()
      .evaluate((el) => getComputedStyle(el).display);
  }

  async getUnsupportedCalloutLocator() {
    return this.page.locator(this.unsupportedPensionsCallout);
  }

  async scrollUnsupportedCalloutIntoView() {
    const callout = this.page.locator(this.unsupportedPensionsCallout);
    await callout.scrollIntoViewIfNeeded();
  }

  areYouExpectingHeader() {
    return this.page.getByRole('heading', {
      name: 'Are you expecting to see other pensions?',
    });
  }

  pensionsNotShowingLink() {
    return this.page
      .locator('[data-testid="urgent-callout"]')
      .getByRole('link', { name: /here['’]s what you can do/i });
  }

  /**
   * Returns the channel a pension is showing in on the frontend.
   * Must be on the pensiosn found page for this to work.
   */
  async getPensionChannelByName(
    page: Page,
    pensionName: string,
  ): Promise<PensionChannel> {
    const allPensionListItems = page.locator('[data-testid^="callout"] li');
    const targetPensionListItem = allPensionListItems.getByText(pensionName, {
      exact: true,
    });

    const parentCalloutContainer = targetPensionListItem.locator(
      'xpath=ancestor::*[@data-testid="callout-positive" or @data-testid="callout-negative"][1]',
    );
    const containerName = await parentCalloutContainer
      .getAttribute('data-testid')
      .catch((error: Error) => {
        throw new Error(
          `Could not find a pension card (or its container) with the name "${pensionName}"\nReason: ${error.message}`,
        );
      });

    const containerNameToChannel: Record<string, PensionChannel> = {
      'callout-positive': 'GREEN',
      'callout-negative': 'RED',
    };

    // Check that it exists in a container.
    if (!containerName)
      throw new Error(`Container element not found for "${pensionName}"`);

    const channelKeys = Object.keys(containerNameToChannel);
    if (!channelKeys.includes(containerName))
      throw new Error(`Unexpected container test-id, should be ${channelKeys}`);

    // TODO: How to handle unsupported pension?

    const channel = containerNameToChannel[containerName];
    return channel;
  }

  get reportTechnicalProblemLink() {
    return this.page.getByTestId('error-text').locator('a');
  }

  async clickReportTechnicalProblemLink() {
    await this.reportTechnicalProblemLink.click();
  }

  get errorPensionBanner() {
    return this.page.getByTestId('error-pensions-callout');
  }

  get errorPensionTitle() {
    return this.page.getByTestId('error-title');
  }

  get errorPensionParagraph() {
    return this.page.getByTestId('error-text');
  }

  getPendingPensionsHeading(): Locator {
    return this.page.locator(`h3:text-is("Pending pensions")`);
  }
}

export default PensionsFoundPage;
