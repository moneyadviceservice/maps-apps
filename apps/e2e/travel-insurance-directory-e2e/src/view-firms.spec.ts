import { test } from '@playwright/test';

import { ViewFirmsPage } from '../pages/ViewFirmsPage';

let viewFirmsPage: ViewFirmsPage;

test.beforeEach(async ({ page }) => {
  viewFirmsPage = new ViewFirmsPage(page);
  await viewFirmsPage.goTo();
  await viewFirmsPage.acceptCookiesIfVisible();
});

test.describe('View Firms', () => {
  test('View firms content', async () => {
    await viewFirmsPage.assertHeading(
      'Find a travel insurance provider if you have a serious medical condition or disability',
    );
    await viewFirmsPage.assertResultsSummaryText(
      'Firms presented in no particular order',
    );
    await viewFirmsPage.assertNumberOfDisplayedResults(5);
    await viewFirmsPage.assertPaginationIsVisibile();
  });

  test('Display more results', async () => {
    await viewFirmsPage.assertNumberOfDisplayedResults(5);
    await viewFirmsPage.selectViewPerPage('10');
    await viewFirmsPage.assertNumberOfDisplayedResults(10);
  });

  //47439
  test('Filters', async () => {
    await test.step('Age', async () => {
      await viewFirmsPage.assertAgeFilterTriggers();
    });

    await test.step('Insurance type', async () => {
      await viewFirmsPage.assertInsuranceTypeFilterTriggers();
    });

    await test.step('Length of trip', async () => {
      await viewFirmsPage.assertLengthOfTripFilterTriggers();
    });

    await test.step('Land based or cruise', async () => {
      await viewFirmsPage.assertLandOrCruiseFilterTriggers();
    });

    await test.step('Destination', async () => {
      await viewFirmsPage.assertDestinationFilterTriggers();
    });
  });

  test('Download all firms', async () => {
    const download = await viewFirmsPage.clickDownloadAllFirms();
    await viewFirmsPage.assertSuggestedFileName(
      download,
      'travel-insurance-firms.pdf',
    );
  });
});
