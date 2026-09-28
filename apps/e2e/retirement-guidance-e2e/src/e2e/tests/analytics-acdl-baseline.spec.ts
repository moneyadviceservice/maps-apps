import {
  expect,
  Page,
  test,
} from '@maps-react/playwright/fixtures/default.fixtures';

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

const completeJourneyToQuestion5 = async (page: Page): Promise<void> => {
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
};

const completeJourneyToResults = async (page: Page): Promise<void> => {
  await completeJourneyToQuestion5(page);
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

  /**
   * @tests User Story: 58580
   * @test 58580 AC 1 Test Case 1 : Verify Question 1 pushes toolStart after the user starts the tool
   */
  test('Tool start: question 1 page pushes toolStart when user starts the tool', async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').click();
    await question1Page.waitForPage(page);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      tool: {
        toolName: 'Get Retirement Guidance',
        toolCategory: 'Complex Tool',
        toolStep: '2',
        stepName: 'Question 1',
      },
    });
  });

  /**
   * @tests User Story: 58580
   * @test 58580 AC 1 Test Case 2 : Landing page does not push toolStart before the user starts the tool
   */
  test('Tool start: landing page does not push toolStart', async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').waitFor();

    const dataLayerEvents = await getAdobeDataLayerEvents(page);
    const toolStartEvents = dataLayerEvents.filter(
      ({ event }) => event === 'toolStart',
    );

    expect(toolStartEvents).toHaveLength(0);
  });

  /**
   * @tests User Story: 58218
   * @test AC1: Selecting a pension type on Question 5 pushes a toolInteraction event
   */
  test('Tool interaction: question 5 checkbox pushes the selected pension type', async ({
    page,
  }) => {
    await completeJourneyToQuestion5(page);
    await basePage.clickCheckboxOption(page, 'Defined contribution');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolInteraction',
      tool: {
        toolName: 'Get Retirement Guidance',
        toolStep: '6',
        stepName: 'Question 5',
        interactionType: 'Checkbox',
        fieldName: 'Question 5 - Which types of pension do you have?',
        fieldValue: 'Defined contribution',
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
