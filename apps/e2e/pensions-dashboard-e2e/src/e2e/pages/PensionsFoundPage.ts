import { Locator, Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import { PensionChannel } from '../utils/pensionClassification/types';

type PensionsFoundPage = {
  container: string;
  heading: string;
  headingNoPensions: string;
  seePendingPensionsButton: string;
  seePendingPensionsButtonWelsh: string;
  seePensionsBreakdownButton: string;
  seePensionsBreakdownButtonWelsh: string;
  noPensionsIntro: string;
  noPensionsSubheading: string;
  unsupportedPensionsFound: string;
  unsupportedPensionsCallout: string;
  pensionFoundPageTitleText: string;
  negativeContainer(page: Page): Locator;
  positiveContainer(page: Page): Locator;
  warningContainer(page: Page): Locator;
  reportTechnicalProblemLink(page: Page): Locator;
  errorPensionBanner(page: Page): Locator;
  errorPensionTitle(page: Page): Locator;
  errorPensionParagraph(page: Page): Locator;
  clickReportTechnicalProblemLink(page: Page): Promise<void>;
  clickReviewPensions(page: Page, locale?: Locale): Promise<void>;
  clickSeePendingPensions(page: Page, locale?: Locale): Promise<void>;
  clickSeeYourPensions(page: Page, locale?: Locale): Promise<void>;
  clickReportATechnicalProblem(page: Page, locale?: Locale): Promise<void>;
  clickExploreThePensionsDashboard(page: Page, locale?: Locale): Promise<void>;
  clickUnderstandYourPensions(page: Page, locale?: Locale): Promise<void>;
  clickFooterContactUs(page: Page, locale: Locale): Promise<void>;
  clickHelpAndSupportContactUs(page: Page): Promise<void>;
  waitForPensionsFound(page: Page, locale?: Locale): Promise<void>;
  noPensionFound(page: Page): Promise<Locator>;
  assertPensionsFound(page: Page, pensions: any): Promise<void>;
  assertInvalidPensionsNotVisible(page: Page, pensions: any): Promise<void>;
  noPensionsFound(page: Page): Promise<void>;
  navigateToPensionBreakdownPage(page: Page): Promise<void>;
  linkExpectingOtherPensions(page: Page): Promise<Locator>;
  unsupportedPensionsCallOut(page: Page): Promise<Locator>;
  getAllChannelText(page: Page): Promise<string>;
  getExpectedSchemeNames(pensions: any): string[];
  normalizeText(text: string): string;
  noPensionGuideText(page: Page): Promise<Locator>;
  hasGreenChannel(page: Page): Promise<boolean>;
  hasYellowChannel(page: Page): Promise<boolean>;
  hasRedChannel(page: Page): Promise<boolean>;
  getLayoutDisplay(page: Page): Promise<string>;
  getUnsupportedPensionsText(page: Page): Promise<string>;
  getUnsupportedCalloutLocator(page: Page): Promise<Locator>;
  areYouExpectingHeader(page: Page): Locator;
  pensionsNotShowingLink(page: Page): Locator;
  scrollUnsupportedCalloutIntoView(page: Page): Promise<void>;
  getPensionChannelByName(
    page: Page,
    pensionName: string,
  ): Promise<PensionChannel>;
  noChannelsVisible(page: Page): Promise<boolean>;
};

const pensionsFoundPage: PensionsFoundPage = {
  heading: `h1:text-is("Pensions found")`,
  headingNoPensions: `h1:text-is("No pensions found")`,
  container: 'div.lg\\:grid',
  unsupportedPensionsCallout: '[data-testid="unsupported-callout"]',
  seePendingPensionsButton: `a[href*="pending-pensions"]`,
  seePendingPensionsButtonWelsh: `Gweld pensiynau sydd ar y gweill`,
  seePensionsBreakdownButton: 'a[href*="your-pension-breakdown"]',
  seePensionsBreakdownButtonWelsh: 'Gweld eich pensiynau',
  noPensionsIntro:
    'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.',
  noPensionsSubheading: 'What you can do:',
  unsupportedPensionsFound: 'Unsupported pensions found',
  pensionFoundPageTitleText:
    'Your Pension Search Results - MoneyHelper Pensions Dashboard',

  positiveContainer(page: Page) {
    return page.locator(`[data-testid="callout-positive"]`);
  },
  negativeContainer(page: Page) {
    return page.locator(`[data-testid="callout-negative"]`);
  },
  warningContainer(page: Page) {
    return page.locator(`[data-testid="callout-warning"]`);
  },

  async clickReviewPensions(page: Page, locale: Locale = 'en'): Promise<void> {
    const reviewPensionsText = {
      en: 'Pensions that need action',
      cy: 'Pensiynau sydd angen gweithredu',
    };

    const reviewPensionsLinkText = {
      en: 'See pensions that need action',
      cy: 'Gweld pensiynau sydd angen gweithredu',
    };

    await page.getByTestId('callout-negative').waitFor({ state: 'visible' });

    await page
      .getByRole('link', { name: reviewPensionsLinkText[locale] })
      .click();

    await page
      .getByTestId('page-title')
      .filter({ hasText: reviewPensionsText[locale] })
      .waitFor({ state: 'visible' });
  },

  async clickReportATechnicalProblem(
    page: Page,
    locale: Locale = 'en',
  ): Promise<void> {
    const reportProblemText = {
      en: 'Report a technical problem',
      cy: 'Rhoi gwybod am broblem dechnegol',
    };

    const text = reportProblemText[locale];

    await page.getByRole('link', { name: text }).click();
    await page
      .getByTestId('page-title')
      .filter({ hasText: text })
      .waitFor({ state: 'visible' });
  },

  async clickExploreThePensionsDashboard(
    page: Page,
    locale: Locale = 'en',
  ): Promise<void> {
    const exploreDashboardText = {
      en: 'Explore the Pensions Dashboard',
      cy: "Archwilio'r Dangosfwrdd",
    };

    const text = exploreDashboardText[locale];

    await page.getByRole('link', { name: text }).click();
    await page
      .getByTestId('page-title')
      .filter({ hasText: text })
      .waitFor({ state: 'visible' });
  },

  async clickUnderstandYourPensions(
    page: Page,
    locale: Locale = 'en',
  ): Promise<void> {
    const understandPensionsText = {
      en: 'Understand your pensions',
      cy: 'Deall eich pensiynau',
    };

    const titleText = understandPensionsText[locale];

    await page.getByRole('link', { name: titleText }).click();
    await page
      .getByTestId('page-title')
      .filter({ hasText: titleText })
      .waitFor({ state: 'visible' });
  },

  async navigateToPensionBreakdownPage(page: Page): Promise<void> {
    await page.getByTestId('callout-positive').waitFor({ state: 'visible' });
    await page.getByRole('link', { name: 'See your pensions' }).click();
    await page
      .getByTestId('page-title')
      .filter({ hasText: 'Your pensions' })
      .waitFor({ state: 'visible' });
  },

  async linkExpectingOtherPensions(page: Page): Promise<Locator> {
    return page.getByTestId('urgent-callout');
  },

  async unsupportedPensionsCallOut(page: Page): Promise<Locator> {
    return page.getByTestId('unsupported-callout');
  },

  async noPensionGuideText(page: Page): Promise<Locator> {
    return page.getByTestId('tool-intro');
  },

  async noPensionFound(page: Page): Promise<Locator> {
    return page.getByTestId('page-title');
  },

  async getAllChannelText(page: Page): Promise<string> {
    const channels = page.locator(
      '[data-testid="callout-positive"], [data-testid="callout-negative"], [data-testid="callout-warning"]',
    );
    const texts = await channels.allTextContents();
    return texts.join(' ').replace(/\s+/g, '').toLowerCase();
  },

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
  },

  normalizeText(text: string): string {
    return text.replace(/\s+/g, '').toLowerCase();
  },

  async hasGreenChannel(page: Page): Promise<boolean> {
    return await page.locator('[data-testid="callout-positive"]').isVisible();
  },

  async hasYellowChannel(page: Page): Promise<boolean> {
    return await page.locator('[data-testid="callout-warning"]').isVisible();
  },

  async hasRedChannel(page: Page): Promise<boolean> {
    return await page.locator('[data-testid="callout-negative"]').isVisible();
  },

  async noChannelsVisible(page: Page): Promise<boolean> {
    return (
      (await this.negativeContainer(page).isHidden()) &&
      (await this.positiveContainer(page).isHidden()) &&
      (await this.warningContainer(page).isHidden())
    );
  },

  async clickSeePendingPensions(
    page: Page,
    locale: Locale = 'en',
  ): Promise<void> {
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
    const pendingLink = page.getByRole('link', { name: content.link });

    await pendingLink.waitFor({ state: 'visible' });
    await pendingLink.click();
    await page
      .getByRole('heading', { name: content.heading, level: 1 })
      .waitFor({ state: 'visible' });
  },

  async clickSeeYourPensions(page: Page, locale: Locale = 'en'): Promise<void> {
    const seeYourPensionsText = {
      en: { link: 'See your pensions', heading: 'Your pensions' },
      cy: { link: 'Gweld eich pensiynau', heading: 'Eich pensiynau' },
    };

    const t = seeYourPensionsText[locale];
    const linkLocator = page.getByRole('link', { name: t.link });

    await linkLocator.waitFor();
    await linkLocator.click();
    await page.getByRole('heading', { name: t.heading, exact: true }).waitFor();
  },

  async clickFooterContactUs(page: Page, locale: Locale = 'en'): Promise<void> {
    if (locale === 'cy') {
      await page
        .getByTestId('footer')
        .getByRole('link', { name: 'Cysylltu â ni' })
        .click();

      await page
        .getByTestId('page-title')
        .filter({ hasText: 'Cysylltwch â ni' })
        .waitFor({ state: 'visible' });
    } else {
      await page
        .getByTestId('footer')
        .getByRole('link', { name: 'Contact us' })
        .click();
    }
  },

  async clickHelpAndSupportContactUs(page: Page): Promise<void> {
    const container = page.getByTestId('help-and-support');
    const contactUsLink = container.getByRole('link', { name: 'Contact us' });
    await contactUsLink.click();
  },

  async waitForPensionsFound(page: Page, locale: Locale = 'en'): Promise<void> {
    const pensionsFoundHeadings = {
      en: 'Pensions found',
      cy: "Pensiynau wedi'u darganfod",
    };

    await page
      .locator(`h1:text-is("${pensionsFoundHeadings[locale]}")`)
      .waitFor({ timeout: 100000 });
  },

  async assertPensionsFound(page, pensions) {
    const negativeContainer = page.locator(`[data-testid="callout-negative"]`);
    const positiveContainer = page.locator(`[data-testid="callout-positive"]`);
    const warningContainer = page.locator(`[data-testid="callout-warning"]`);

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
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          [null, '', 'DCSM', 'DB', 'PPF', 'DCHA', 'DCHP', 'WU'].includes(
            pension.unavailableReason,
          )) ||
        pension.payableDetails?.reason === 'SML'
      ) {
        expectedContainer = positiveContainer;
        expectedHeader = 'Confirmed pensions';
      } else if (
        ['SYS', 'NEW'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          ['DBC', 'DCC', 'NEW', 'ANO', 'NET', 'TRN'].includes(
            pension.unavailableReason,
          ))
      ) {
        expectedContainer = warningContainer;
        expectedHeader = 'Pending pensions';
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
        const allContainers = [
          negativeContainer,
          positiveContainer,
          warningContainer,
        ];
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
  },

  async assertInvalidPensionsNotVisible(page, pensions): Promise<void> {
    const allowedPensionTypes = ['SP', 'DC', 'DB', 'AVC'];

    for (const pension of pensions) {
      const schemeLocator = page.locator(`:has-text("${pension.schemeName}")`);

      if (allowedPensionTypes.includes(pension.pensionType)) {
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
  },

  async noPensionsFound(page: Page): Promise<void> {
    await page.locator(this.headingNoPensions).waitFor();
  },

  async getUnsupportedPensionsText(page: Page) {
    return page.locator(this.unsupportedPensionsCallout).innerText();
  },

  // Return computed style of container
  async getLayoutDisplay(page) {
    return page
      .locator(this.container)
      .first()
      .evaluate((el) => getComputedStyle(el).display);
  },

  async getUnsupportedCalloutLocator(page: Page) {
    return page.locator(this.unsupportedPensionsCallout);
  },

  async scrollUnsupportedCalloutIntoView(page: Page) {
    const callout = page.locator(this.unsupportedPensionsCallout);
    await callout.scrollIntoViewIfNeeded();
  },

  areYouExpectingHeader(page: Page) {
    return page.getByRole('heading', {
      name: 'Are you expecting to see other pensions?',
    });
  },

  pensionsNotShowingLink(page: Page) {
    return page
      .locator('[data-testid="urgent-callout"]')
      .getByRole('link', { name: /here['’]s what you can do/i });
  },

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
      'xpath=ancestor::*[@data-testid="callout-positive" or @data-testid="callout-warning" or @data-testid="callout-negative"][1]',
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
      'callout-warning': 'YELLOW',
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
  },

  reportTechnicalProblemLink(page: Page) {
    return page.getByTestId('error-text').locator('a');
  },

  async clickReportTechnicalProblemLink(page: Page) {
    await this.reportTechnicalProblemLink(page).click();
  },

  errorPensionBanner(page: Page) {
    return page.getByTestId('error-pensions-callout');
  },

  errorPensionTitle(page: Page) {
    return page.getByTestId('error-title');
  },

  errorPensionParagraph(page: Page) {
    return page.getByTestId('error-text');
  },
};

export default pensionsFoundPage;
