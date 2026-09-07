import {
  expect as baseExpect,
  ExpectMatcherState,
  Page,
  test,
} from '@playwright/test';

import { basePage } from '../pages/basePage';
import checkAnswersPage from '../pages/checkAnswersPage';
import homePage from '../pages/HomePage';
import question1Page from '../pages/question1Page';
import question2Page from '../pages/question2Page';
import question3Page from '../pages/question3Page';
import question4Page from '../pages/question4Page';
import question5Page from '../pages/question5Page';
import question6Page from '../pages/question6Page';
import question7Page from '../pages/question7Page';
import question8Page from '../pages/question8Page';
import question9Page from '../pages/question9Page';
import question10Page from '../pages/question10Page';
import question11Page from '../pages/question11Page';
import resultsPage from '../pages/resultsPage';

type AnalyticsEvent = {
  event?: string;
  page?: Record<string, unknown>;
  tool?: Record<string, unknown>;
};

const matchesSubset = (actual: unknown, expected: unknown): boolean => {
  if (typeof expected !== 'object' || expected === null) {
    return actual === expected;
  }

  if (typeof actual !== 'object' || actual === null) {
    return false;
  }

  return Object.entries(expected).every(([key, value]) => {
    const actualValue = (actual as Record<string, unknown>)[key];
    return matchesSubset(actualValue, value);
  });
};

const getAdobeDataLayerEvents = async (
  page: Page,
): Promise<AnalyticsEvent[]> => {
  return page.evaluate(() => {
    type BrowserEvent = {
      event?: string;
      page?: Record<string, unknown>;
      tool?: Record<string, unknown>;
    };

    type AdobeDataLayerWithHistory = {
      getHistory?: () => unknown;
    };

    const win = window as Window & {
      adobeDataLayer?: unknown;
    };

    const dataLayer = win.adobeDataLayer;

    if (Array.isArray(dataLayer)) {
      return dataLayer as BrowserEvent[];
    }

    if (
      dataLayer &&
      typeof dataLayer === 'object' &&
      'getHistory' in dataLayer &&
      typeof (dataLayer as AdobeDataLayerWithHistory).getHistory === 'function'
    ) {
      const history = (dataLayer as AdobeDataLayerWithHistory).getHistory?.();
      return Array.isArray(history) ? (history as BrowserEvent[]) : [];
    }

    return [];
  });
};

const createDataLayerMatcher = (isPartial: boolean) => {
  return async function (
    this: ExpectMatcherState,
    page: Page,
    expectedEvent: AnalyticsEvent,
    options?: { timeout?: number; count?: number },
  ) {
    const timeout = options?.timeout ?? 15_000;
    const count = options?.count ?? 1;
    let lastDataLayer: AnalyticsEvent[] = [];

    let pass = false;
    try {
      await baseExpect
        .poll(
          async () => {
            lastDataLayer = await getAdobeDataLayerEvents(page);

            return lastDataLayer.filter((event) => {
              if (!isPartial) {
                return JSON.stringify(event) === JSON.stringify(expectedEvent);
              }

              return matchesSubset(event, expectedEvent);
            }).length;
          },
          { timeout },
        )
        .toBeGreaterThanOrEqual(count);

      pass = true;
    } catch {
      pass = false;
    }

    const message = () => {
      const expectedText = this.utils.printExpected(expectedEvent);
      const receivedText = this.utils.printReceived(lastDataLayer);

      return pass
        ? `Expected page not to have ${
            isPartial ? 'partial ' : ''
          }dataLayer event: ${expectedText}`
        : `Expected page to have ${
            isPartial ? 'partial ' : ''
          }dataLayer event (count >= ${count}): ${expectedText}\n\nReceived dataLayer:\n${receivedText}`;
    };

    return { pass, message };
  };
};

const expect = baseExpect.extend({
  toHaveDataLayerEvent: createDataLayerMatcher(false),
  toHavePartialDataLayerEvent: createDataLayerMatcher(true),
});

const completeJourneyToResults = async (page: Page): Promise<void> => {
  await homePage.startRetirementGuidance(page);
  await page.getByTestId('start-button').click();
  await question1Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'How my pension works');
  await basePage.clickContinue(page);
  await question2Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'Yes');
  await basePage.clickContinue(page);
  await question3Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'No, I’m not employed');
  await basePage.clickContinue(page);
  await question4Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'Not sure');
  await basePage.clickContinue(page);
  await question5Page.waitForPage(page);
  await basePage.clickCheckboxOption(page, 'Defined contribution');
  await basePage.clickContinue(page);
  await question6Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'Yes');
  await basePage.clickContinue(page);
  await question7Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'No');
  await basePage.clickContinue(page);
  await question8Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'Yes');
  await basePage.clickContinue(page);
  await question9Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'Mortgage');
  await basePage.clickContinue(page);
  await question10Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'Yes');
  await basePage.clickContinue(page);
  await question11Page.waitForPage(page);
  await basePage.clickRadioOption(page, 'No');
  await basePage.clickContinue(page);
  await checkAnswersPage.waitForPage(page);
  await resultsPage.clickContinueButton(page);
  await resultsPage.waitForPage(page);
};

/**
 * @tests User Story: 54045
 * @test AC1: Page load ACDL event and required objects are present on Get Retirement Guidance pages
 * @test AC2: Tool start ACDL event is present when the user starts the tool
 * @test AC3: Tool completion ACDL event is present when the user completes the tool
 */
test.describe('Retirement Guidance - Analytics ACDL Baseline (US-54045)', () => {
  test('Page load: landing page pushes pageLoadReact with required page and tool objects', async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').waitFor();

    const dataLayerEvents = await getAdobeDataLayerEvents(page);
    expect(dataLayerEvents.length).toBeGreaterThan(0);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'get-retirement-guidance--landing',
        pageType: 'tool page',
        lang: 'en',
        site: 'moneyhelper',
      },
      tool: {
        toolName: 'Get Retirement Guidance',
        toolCategory: 'Complex Tool',
        toolStep: '1',
        stepName: 'Landing Page',
      },
    });
  });

  test('Tool start: landing page pushes toolStart when user starts the tool', async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').waitFor();

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      tool: {
        toolName: 'Get Retirement Guidance',
        toolCategory: 'Complex Tool',
        toolStep: '1',
        stepName: 'Landing Page',
      },
    });
  });

  test('Tool completion: results page pushes toolComplete on journey completion', async ({
    page,
  }) => {
    await completeJourneyToResults(page);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'get-retirement-guidance--results',
        pageType: 'tool page',
        lang: 'en',
        site: 'moneyhelper',
      },
      tool: {
        toolName: 'Get Retirement Guidance',
        toolCategory: 'Complex Tool',
        toolStep: '14',
        stepName: 'Results',
      },
    });

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolCompletion',
      tool: {
        toolName: 'Get Retirement Guidance',
        toolCategory: 'Complex Tool',
        toolStep: '14',
        stepName: 'Results',
        completionStatus: 'completed',
      },
    });
  });
});
