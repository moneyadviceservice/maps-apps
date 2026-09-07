import { expect, test } from '@playwright/test';

import { Pagination } from '../../pages/components/Pagination';
import { ViewFirmsPage } from '../../pages/ViewFirmsPage';
let viewFirmsPage: ViewFirmsPage;
let pagination: Pagination;

test.beforeEach(async ({ page }) => {
  viewFirmsPage = new ViewFirmsPage(page);
  pagination = new Pagination(page);
  await viewFirmsPage.goto();
  await viewFirmsPage.acceptCookiesIfVisible();
});

test.describe('View Firms', () => {
  test('View firms content', async () => {
    await expect(
      viewFirmsPage.headingLocator(
        'Find a travel insurance provider if you have a serious medical condition or disability',
      ),
    ).toBeVisible();

    await expect(viewFirmsPage.resultsSummaryText()).toContainText(
      'Firms presented in no particular order',
    );
    await expect(viewFirmsPage.displayedResults()).toHaveCount(5);
    await expect(viewFirmsPage.toolFeedbackWidget()).toBeVisible();
  });

  test('Display more results', async () => {
    await expect(viewFirmsPage.resultsSummaryText()).toContainText(
      'Showing 1 - 5 of',
    );
    await expect(viewFirmsPage.displayedResults()).toHaveCount(5);

    await viewFirmsPage.selectViewPerPage(10);

    await expect(viewFirmsPage.resultsSummaryText()).toContainText(
      'Showing 1 - 10 of',
    );
    await expect(viewFirmsPage.displayedResults()).toHaveCount(10);
  });

  /**
   * @tests 47439 - Filtering displayed firms
   */
  test('Filters', async () => {
    await test.step('Age', async () => {
      await viewFirmsPage.triggerAgeFilter();
    });

    await test.step('Insurance type', async () => {
      await viewFirmsPage.triggerInsuranceTypeFilter();
    });

    await test.step('Length of trip', async () => {
      await viewFirmsPage.triggerLengthOfTripFilter();
    });

    await test.step('Land based or cruise', async () => {
      await viewFirmsPage.triggerLandOrCruiseFilter();
    });

    await test.step('Destination', async () => {
      await viewFirmsPage.triggerDestinationFilter();
    });
  });

  test('Download all firms', async () => {
    const download = await viewFirmsPage.clickDownloadAllFirms();
    expect(download.suggestedFilename()).toBe('travel-insurance-firms.pdf');
  });
});

test.describe('Feedback tool', () => {
  const successMsg = 'Thank you for your feedback';

  /**
   * @tests 47626 - positive feedback
   */
  test('Was this tool useful - postive feedback', async () => {
    await viewFirmsPage.clickFeedbackYesButton();
    await viewFirmsPage.fillFeedback('my positive feedback!');
    await viewFirmsPage.clickSubmitFeedbackButton();
    await expect(
      viewFirmsPage.toolFeedbackWidget().getByText(successMsg),
    ).toBeVisible();
  });

  /**
   * @tests 49721 - negative feedback
   */
  test('Was this tool useful - negative feedback', async () => {
    await viewFirmsPage.clickFeedbackNoButton();
    await viewFirmsPage.fillFeedback('my negative feedback!');
    await viewFirmsPage.clickSubmitFeedbackButton();
    await expect(
      viewFirmsPage.toolFeedbackWidget().getByText(successMsg),
    ).toBeVisible();
  });

  /**
   * @tests 49722 - report a problem
   */
  test('Was this tool useful - report a problem', async () => {
    await viewFirmsPage.clickFeedbackReportButton();
    await viewFirmsPage.fillFeedback('what I was doing', 'what happened');
    await viewFirmsPage.clickSubmitFeedbackButton();
    await expect(
      viewFirmsPage.toolFeedbackWidget().getByText(successMsg),
    ).toBeVisible();
  });
});

test.describe('Pagination', () => {
  test('Component visible', async () => {
    await expect(pagination.paginationComponent()).toBeVisible();
  });
});
