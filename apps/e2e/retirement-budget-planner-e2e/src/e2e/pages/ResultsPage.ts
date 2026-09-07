import { BrowserContext, Locator, Page } from '@playwright/test';

import {
  feedback,
  otherToolsToTryAccessibleLinkName,
  pageHeading,
  retirementCostsVisual,
  summaryTotal,
  type SummaryTotalValueType,
} from '../data/your-results';
import { basePage } from './basePage';

interface ResultsPage {
  waitForPageToBeReady(page: Page): Promise<void>;
  heading(page: Page): Locator;
  verifyNavigationLink(
    page: Page,
    navLink: string,
    pageHeading: string,
  ): Promise<boolean>;
  navigateBackToResults(page: Page): Promise<void>;
  getAccordionState(page: Page, index: number): Promise<boolean>;
  toggleAccordion(page: Page, index: number): Promise<void>;
  isAccordionContentVisible(
    page: Page,
    index: number,
    text: string,
  ): Promise<boolean>;
  getAccordionSummaryText(page: Page, index: number): Promise<string>;
  getAccordionContentText(page: Page, index: number): Promise<string>;
  getCalloutComponent(
    page: Page,
    calloutTestId: string,
    titleTestId: string,
  ): Promise<{
    root: Locator;
    title: Locator;
    paragraph1: Locator;
    paragraph2: Locator;
  }>;
  yourResultsHeading(page: Page): Locator;
  statePensionHeading(page: Page): Locator;
  incomeAndCostsHeading(page: Page): Locator;
  moneyLeftOverHeading(page: Page): Locator;
  costsHigherThanIncomeHeading(page: Page): Locator;
  retirementIncomeStatementBoldAmount(page: Page): Locator;
  incomeAndCostsDescription(page: Page): Locator;
  retireBeforeStatePensionCallout: {
    component(page: Page): Locator;
    title(page: Page): Locator;
  };
  incomeTaxParagraph(page: Page): Locator;
  getRetirementPlanningChecklistHeader(page: Page): Locator;
  getOtherToolsHeader(page: Page): Locator;
  getTeaserCards(page: Page): Locator;
  getTeaserCardLink(page: Page, title: string): Locator;
  getFeedbackHeading(page: Page): Promise<Locator>;
  getShareCalculatorText(page: Page): Locator;
  getShareLink(page: Page, shareLink: string): Locator;
  getEmailLinkHref(page: Page): Promise<string | null>;
  getTextByTestId(page: Page, testId: string): Promise<string>;
  getByTestId(page: Page, testId: string): Locator;
  clickSocialShare(
    page: Page,
    context: BrowserContext,
    socialMedia: string,
  ): Promise<Page>;
  closeSocialMediaTab(tab: Page): Promise<void>;

  feedback: {
    component(page: Page): Locator;
    heading(page: Page): Locator;
    positiveResponseButton(page: Page): Locator;
    negativeResponseButton(page: Page): Locator;
    reportProblemButton(page: Page): Locator;
    backButton(page: Page): Locator;
    submissionHeading(page: Page): Locator;
    positiveTextboxLabel(page: Page): Locator;
    negativeTextboxLabel(page: Page): Locator;
    reportProblemTextbox1Label(page: Page): Locator;
    reportProblemTextbox2Label(page: Page): Locator;
    textbox(page: Page): Locator;
    submitButton(page: Page): Locator;
    submissionConfirmationHeading(page: Page): Locator;
    submissionConfirmationMessage(page: Page): Locator;
    waitForHeading(page: Page): Promise<void>;
    waitForTextbox(page: Page): Promise<void>;
  };
  summaryTotal: {
    component(page: Page): Locator;
    heading(page: Page): Locator;
    frequencySelect(page: Page): Locator;
    updateResultsButton(page: Page): Locator;
    label(
      page: Page,
      options: {
        labelType: SummaryTotalValueType;
      },
    ): Locator;
    value(
      page: Page,
      options: {
        valueType: SummaryTotalValueType;
      },
    ): Locator;
  };
  retirementCostsVisual: {
    component(page: Page): Locator;
    heading(page: Page): Locator;
    pieChart(page: Page): Locator;
    costCategoryByLabel(page: Page, category: string): Locator;
    costCategoryValueByLabel(page: Page, category: string): Locator;
    costCategoryEditButtonByLabel(page: Page, category: string): Locator;
  };
}

const resultsPage: ResultsPage = {
  /**
   * Wait for the page to be ready by waiting for the main heading to be visible
   *
   * @param page - Playwright page object
   * @returns Promise that resolves when the page is ready
   */
  async waitForPageToBeReady(page) {
    return await basePage.waitForPageHeading(page, pageHeading);
  },

  heading: (page) => {
    return page.locator('h1');
  },

  async verifyNavigationLink(page, navTab, pageHeading) {
    await page.getByTestId(navTab).waitFor({ state: 'visible' });
    await page.getByTestId(navTab).click();
    await page.waitForLoadState('load');
    const heading = page.locator('h1', { hasText: pageHeading });
    await heading.waitFor({ state: 'visible', timeout: 5000 });
    return true;
  },

  async navigateBackToResults(page) {
    await page.getByTestId('summary').waitFor({ state: 'visible' });
    await page.getByTestId('summary').click();
    await page.waitForLoadState('load');
    const heading = page.locator('h1', { hasText: 'Your results' });
    await heading.waitFor({ state: 'visible', timeout: 5000 });
  },

  getRetirementPlanningChecklistHeader(page: Page) {
    return page.getByRole('heading', {
      name: 'Retirement planning checklist',
    });
  },

  async getAccordionState(page: Page, index: number) {
    const accordion = page.getByTestId('expandable-section').nth(index);
    const isOpen = (await accordion.getAttribute('open')) !== null;
    return isOpen;
  },

  async toggleAccordion(page: Page, index: number) {
    const accordion = page.getByTestId('expandable-section').nth(index);
    await accordion.locator('summary').click();
  },

  async isAccordionContentVisible(page: Page, index: number, text: string) {
    const accordion = page.getByTestId('expandable-section').nth(index);
    const content = accordion
      .getByTestId('paragraph')
      .filter({ hasText: text })
      .first();
    await content.waitFor({ state: 'visible', timeout: 3000 });
    return await content.isVisible();
  },

  async getAccordionSummaryText(page: Page, index: number): Promise<string> {
    const accordion = page.getByTestId('expandable-section').nth(index);
    return await accordion.getByTestId('summary-block-title').innerText();
  },

  async getAccordionContentText(page: Page, index: number): Promise<string> {
    const accordion = page.getByTestId('expandable-section').nth(index);
    const contentContainer = accordion.locator('div').nth(1);
    const text = await contentContainer.innerText();
    return text?.replaceAll(/\s+/g, ' ').trim() || '';
  },

  getOtherToolsHeader(page: Page): Locator {
    return page.locator('h2', { hasText: 'Other tools to try' });
  },

  getTeaserCards(page: Page): Locator {
    return page.getByTestId('teaserCard');
  },

  getTeaserCardLink(page: Page, title: string): Locator {
    return this.getTeaserCards(page).getByRole('link', {
      name: otherToolsToTryAccessibleLinkName(title),
    });
  },

  async getFeedbackHeading(page: Page): Promise<Locator> {
    const locator = page
      .locator('.izHeader', {
        hasText: /Was this tool useful\?/,
      })
      .first();
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    return locator;
  },

  getShareCalculatorText(page) {
    return page.getByTestId('share-tool-title');
  },
  getShareLink(page, shareLink) {
    return page.locator(`a[title="${shareLink}"]`);
  },
  async getEmailLinkHref(page) {
    const shareEmailLink = this.getShareLink(page, 'email');
    return await shareEmailLink.getAttribute('href');
  },

  async clickSocialShare(page, context, socialMedia) {
    const pagePromise = context.waitForEvent('page');
    const shareSocialLink = this.getShareLink(page, socialMedia);
    await shareSocialLink.click();
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    return newTab;
  },

  async closeSocialMediaTab(tab): Promise<void> {
    await tab.close();
  },
  async getTextByTestId(page: Page, testId: string): Promise<string> {
    return await page.getByTestId(testId).innerText();
  },
  getByTestId(page, testId) {
    return page.getByTestId(testId);
  },
  async getCalloutComponent(
    page: Page,
    calloutTestId: string,
    titleTestId: string,
  ) {
    const root = page
      .getByTestId(calloutTestId)
      .filter({ has: page.getByTestId(titleTestId) })
      .first();
    await root.waitFor({ state: 'visible', timeout: 5000 });
    const title = root.getByTestId(titleTestId);
    const paragraph1 = root.getByTestId('paragraph').first();
    const paragraph2 = root.getByTestId('paragraph').nth(1);
    return { root, title, paragraph1, paragraph2 };
  },
  yourResultsHeading(page: Page) {
    return page.getByTestId('title');
  },

  statePensionHeading(page: Page) {
    return page.getByTestId('your-results-subheading');
  },

  incomeAndCostsHeading(page: Page) {
    return page.getByRole('heading', {
      name: 'Your retirement income and costs from State Pension age',
    });
  },

  moneyLeftOverHeading(page: Page) {
    return page.getByTestId('summary-results-costs-lower-than-income-title');
  },

  costsHigherThanIncomeHeading(page: Page) {
    return page.getByTestId('summary-results-costs-higher-than-income-title');
  },

  retirementIncomeStatementBoldAmount(page: Page) {
    return resultsPage
      .statePensionHeading(page)
      .locator('strong')
      .filter({ hasText: /£[\d,]+/ })
      .first();
  },

  incomeAndCostsDescription(page: Page) {
    return page.getByText(
      'Based on the information you gave us, here’s how your estimated retirement income compares to your costs using today’s values. This is a guide to help you plan – these figures are not guaranteed.',
    );
  },

  retireBeforeStatePensionCallout: {
    component(page) {
      return page.getByTestId('retire-before-state-pension-age-callout');
    },
    title(page) {
      return page.getByTestId('retire-before-state-pension-age-title');
    },
  },

  incomeTaxParagraph(page: Page) {
    return page.getByTestId('your-results-tax-rates-disclaimer');
  },

  // Feedback component
  feedback: {
    /**
     * Get the feedback component within the page
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component
     */
    component(page) {
      return page.locator('[id^="informizely-embed-"]').getByRole('dialog');
    },

    /**
     * Get the heading element of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component heading
     */
    heading(page) {
      return page.getByText(feedback.heading);
    },

    /**
     * Get the positive response button of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component positive response button
     */
    positiveResponseButton(page) {
      return resultsPage.feedback.component(page).getByRole('button', {
        name: feedback.positiveResponse.buttonText,
        exact: true,
      });
    },

    /**
     * Get the negative response button of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component negative response button
     */
    negativeResponseButton(page) {
      return resultsPage.feedback.component(page).getByRole('button', {
        name: feedback.negativeResponse.buttonText,
        exact: true,
      });
    },

    /**
     * Get the report problem button of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component report problem button
     */
    reportProblemButton(page) {
      return resultsPage.feedback.component(page).getByRole('button', {
        name: feedback.reportProblemResponse.buttonText,
        exact: true,
      });
    },

    /**
     * Get the back/previous button of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component back/previous button
     */
    backButton(page) {
      return resultsPage.feedback
        .component(page)
        .getByRole('button', { name: feedback.backButton.label, exact: true });
    },

    /**
     * Get the submission form heading of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component submission form heading
     */
    submissionHeading(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.responseForm.heading, { exact: true });
    },

    /**
     * Get the label for the textbox of the positive response of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component label for the textbox of the positive response
     */
    positiveTextboxLabel(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.positiveResponse.textboxLabel, { exact: true });
    },

    /**
     * Get the label for the textbox of the negative response of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component label for the textbox of the negative response
     */
    negativeTextboxLabel(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.negativeResponse.textboxLabel, { exact: true });
    },

    /**
     * Get the label for the first textbox of the report a problem response of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component label for the first textbox of the report a problem response
     */
    reportProblemTextbox1Label(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.reportProblemResponse.textbox1Label, {
          exact: true,
        });
    },

    /**
     * Get the label for the second textbox of the report a problem response of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component label for the second textbox of the report a problem response
     */
    reportProblemTextbox2Label(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.reportProblemResponse.textbox2Label, {
          exact: true,
        });
    },

    /**
     * Get the textbox(es) of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component textbox(es)
     */
    textbox(page) {
      return resultsPage.feedback.component(page).getByRole('textbox');
    },

    /**
     * Get the submit button of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component submit button
     */
    submitButton(page) {
      return resultsPage.feedback.component(page).getByRole('button', {
        name: feedback.responseForm.submitButtonText,
        exact: true,
      });
    },

    /**
     * Get the submission confirmation heading of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component submission confirmation heading
     */
    submissionConfirmationHeading(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.submissionConfirmation.heading, { exact: true });
    },

    /**
     * Get the submission confirmation message of the feedback component
     *
     * @param page - Playwright page object
     * @returns Locator for feedback component submission confirmation message
     */
    submissionConfirmationMessage(page) {
      return resultsPage.feedback
        .component(page)
        .getByText(feedback.submissionConfirmation.message, { exact: true });
    },

    /**
     * Wait for the feedback component heading to be visible
     *
     * @param page - Playwright page object
     * @returns Promise that resolves when the feedback component heading is visible
     */
    async waitForHeading(page) {
      return await resultsPage.feedback.heading(page).waitFor();
    },

    /**
     * Wait for the first feedback component textbox to be visible
     *
     * @param page - Playwright page object
     * @returns Promise that resolves when the first feedback component textbox is visible
     */
    async waitForTextbox(page) {
      return await resultsPage.feedback.textbox(page).first().waitFor();
    },
  },

  // Summary total subcomponent
  summaryTotal: {
    /**
     * Get the summary total subcomponent within the page
     *
     * @param page - Playwright page object
     * @returns Locator for summary total subcomponent
     */
    component(page) {
      return page.getByTestId(summaryTotal.testId);
    },

    /**
     * Get the heading of the summary total subcomponent within the page
     *
     * @param page - Playwright page object
     * @returns Locator for summary total heading
     */
    heading(page) {
      return resultsPage.summaryTotal
        .component(page)
        .getByRole('heading', { name: summaryTotal.heading, exact: true });
    },

    /**
     * Get the frequency select dropdown of the summary total subcomponent within the page
     *
     * @param page - Playwright page object
     * @returns Locator for summary total frequency select dropdown
     */
    frequencySelect(page) {
      return page.getByTestId(summaryTotal.frequencySelect.testId);
    },

    /**
     * Get the update results button of the summary total subcomponent within the page
     * (Only present when JavaScript is disabled)
     *
     * @param page - Playwright page object
     * @returns Locator for summary total update results button
     */
    updateResultsButton(page) {
      return page.getByRole('button', {
        name: summaryTotal.updateResultsButtonText,
        exact: true,
      });
    },

    /**
     * Get a specific value label from the summary total subcomponent within the page
     *
     * @param page - Playwright page object
     * @param options - Options object
     * @param options.labelType - Which type of label to retrieve
     * @returns Locator for the specified value label
     */
    label(page, options) {
      const { labelType } = options;

      switch (labelType) {
        case 'income':
          return resultsPage.summaryTotal
            .component(page)
            .getByText(summaryTotal.valueTypes.income.label, { exact: true });
        case 'costs':
          return resultsPage.summaryTotal
            .component(page)
            .getByText(summaryTotal.valueTypes.costs.label, { exact: true });
        case 'balance':
          return resultsPage.summaryTotal
            .component(page)
            .getByText(summaryTotal.valueTypes.balance.label, { exact: true });
        default:
          throw new Error(`Invalid summary total labelType: ${labelType}`);
      }
    },

    /**
     * Get a specific calculated value from the summary total subcomponent within the page
     *
     * @param page - Playwright page object
     * @param options - Options object
     * @param options.valueType - Which type of value to retrieve
     * @returns Locator for the specified calculated value type
     */
    value(page, options) {
      const { valueType } = options;

      switch (valueType) {
        case 'income':
          return page.getByTestId(summaryTotal.valueTypes.income.valueTestId);
        case 'costs':
          return page.getByTestId(summaryTotal.valueTypes.costs.valueTestId);
        case 'balance':
          return page.getByTestId(summaryTotal.valueTypes.balance.valueTestId);
        default:
          throw new Error(`Invalid summary total valueType: ${valueType}`);
      }
    },
  },

  // Retirement summary costs chart visual subcomponent
  retirementCostsVisual: {
    /**
     * Get the retirement costs visual subcomponent within the page
     *
     * @param page - Playwright page object
     * @returns Locator for retirement costs visual subcomponent
     */
    component(page) {
      return page.getByTestId(retirementCostsVisual.componentTestId);
    },

    /**
     * Get the heading of the retirement costs visual subcomponent within the page
     *
     * @param page - Playwright page object
     * @returns Locator for retirement costs visual heading
     */
    heading(page) {
      return resultsPage.retirementCostsVisual
        .component(page)
        .getByRole('heading', {
          name: retirementCostsVisual.heading,
          exact: true,
        });
    },

    /**
     * Get the pie chart of the retirement costs visual subcomponent within the page
     *
     * @param page - Playwright page object
     * @returns Locator for retirement costs visual pie chart
     */
    pieChart(page) {
      return resultsPage.retirementCostsVisual
        .component(page)
        .getByTestId(retirementCostsVisual.pieChartTestId)
        .locator('div[style*="conic-gradient"]');
    },

    /**
     * Get a cost category with a specific label from the retirement costs visual subcomponent within the page
     *
     * @param page - Playwright page object
     * @param category - Label text of the cost category
     * @returns Locator for retirement costs visual category
     */
    costCategoryByLabel(page, category) {
      return resultsPage.retirementCostsVisual
        .component(page)
        .locator('dl>div')
        .filter({ hasText: category });
    },

    /**
     * Get the value of a particular cost category from the retirement costs visual subcomponent within the page
     *
     * @param page - Playwright page object
     * @param category - Label text of the cost category
     * @returns Locator for retirement costs visual category value
     */
    costCategoryValueByLabel(page, category) {
      return resultsPage.retirementCostsVisual
        .costCategoryByLabel(page, category)
        .getByRole('definition')
        .first();
    },

    /**
     * Get the edit button of a particular cost category from the retirement costs visual subcomponent within the page
     *
     * @param page - Playwright page object
     * @param category - Label text of the cost category
     * @returns Locator for retirement costs visual category edit button
     */
    costCategoryEditButtonByLabel(page, category) {
      return resultsPage.retirementCostsVisual
        .costCategoryByLabel(page, category)
        .getByRole('link', {
          name: retirementCostsVisual.editButtonLabel,
          exact: true,
        });
    },
  },
};

export default resultsPage;
