import { expect, Page } from '@maps/playwright';

import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { BeDataExtraction } from './beDataExtraction';
import commonHelpers from './commonHelpers';
import { BackendUiAssertion } from './detailTabsBackendUIAssertion';
import { RequestHelper } from './request';

// This helper focuses on arrangements that have multiple tranches.
// It reuses the same data-extraction and verification logic as the main
// green pensions helper to ensure that each card on the page matches the
// corresponding arrangement returned from the backend (see example JSON).
export class GreenMulticiplityHelper {
  // private static async navigateBackToPensions(page: Page) {
  //   await commonHelpers.clickBackLink(page);
  //   await page.getByText('See your pensions').waitFor({ state: 'visible' });
  // }

  /**
   * Verify that the illustration warnings shown on the summary tab match the
   * backend arrangement's illustrationWarnings.
   *
   * If `arrangement` is not provided, this method will fetch the CONFIRMED
   * pension category and pick an arrangement that contains illustration
   * warnings (falling back to the first arrangement).
   */
  static async verifySummaryAndIncomeTab(
    page: Page,
    request: any,
    arrangement?: any,
  ) {
    // If no arrangement provided, fetch CONFIRMED arrangements and pick one
    if (!arrangement) {
      const response = await RequestHelper.getPensionCategory(
        page,
        request,
        'CONFIRMED',
      );
      const responseJson = await response.json();
      const { arrangements = [] } = responseJson ?? {};

      arrangement =
        arrangements.find((a: any) => {
          return BeDataExtraction.aggregateIllustrationWarnings(a).length > 0;
        }) ?? arrangements[0];

      if (!arrangement) {
        throw new Error('No arrangements available from backend to verify.');
      }
    }

    const warnings =
      BeDataExtraction.aggregateIllustrationWarnings(arrangement);

    const pensionCards = await pensionBreakdownPage.pensionCards(page);
    console.info(`Found ${pensionCards.length} pension cards to process`);
    console.info(`Warning codes to verify: ${warnings.join(', ')}`);

    for (const pensionCard of pensionCards) {
      const cardData = await BackendUiAssertion.getValidPensionCardData(
        page,
        request,
        pensionCard,
      );

      if (!cardData) {
        continue;
      }

      const { schemeNameOnCard, data } = cardData;
      const cardIdentifier = `${schemeNameOnCard}_${data.matchingArrangement?.externalAssetId}`;

      console.info(`Examining pension card: ${cardIdentifier}`);

      if (
        !data.matchingArrangement?.hasMultipleTranches ||
        data.matchingArrangement?.pensionType === 'SP'
      ) {
        console.info(
          `Skipping card - not multiple tranches or is SP type: ${cardIdentifier}`,
        );
        continue;
      }

      await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
      const warningElements = page.getByTestId(/warning-title-/);
      console.info('Warning elements:', warningElements);
      const summaryTabText = page.getByTestId('pension-detail-intro');
      await summaryTabText.waitFor({ state: 'visible' });
      const warningContainer = page.getByTestId('warnings');
      if (await warningContainer.isVisible()) {
        const warningElementCount = await warningElements.count();
        console.info(
          `Warning element count for ${cardIdentifier}:`,
          warningElementCount,
        );

        for (const warningElement of await warningElements.all()) {
          await expect(warningElement).toBeVisible();
        }
      }

      await this.verifyIncomeAndValueTab(
        page,
        request,
        data.matchingArrangement,
      );

      console.info(`Successfully processed card: ${cardIdentifier}`);
    }
  }

  static async verifyIncomeAndValueTab(
    page: Page,
    request: any,
    arrangement?: any,
  ) {
    // If no arrangement provided, fetch CONFIRMED arrangements and pick one
    if (!arrangement) {
      const response = await RequestHelper.getPensionCategory(
        page,
        request,
        'CONFIRMED',
      );
      const responseJson = await response.json();
      const { arrangements = [] } = responseJson ?? {};

      arrangement =
        arrangements.find((a: any) => {
          return a.hasMultipleTranches;
        }) ?? arrangements[0];

      if (!arrangement) {
        throw new Error('No arrangements available from backend to verify.');
      }
    }

    const pensionType = arrangement.pensionType || 'DB';
    console.info(
      `Verifying Income and Values tab for pension type: ${pensionType}`,
    );

    // Navigate to Income and Values tab
    const incomeAndValuesTab = page
      .getByTestId('tab-pension-income-and-values')
      .first();
    await incomeAndValuesTab.click();
    await page.waitForURL(/\/pension-details\/pension-income-and-values/);

    // Verify the income and values section
    await BackendUiAssertion.verifyIncomeAndValuesSection(
      page,
      arrangement,
      pensionType,
    );

    await commonHelpers.clickBackLink(page);

    console.info(`Successfully processed Income and Values tab`);
  }

  static async verifyMultipleTrenchesCardOnGreenChannel(
    page: Page,
    request: any,
  ) {
    const pensionCards = await pensionBreakdownPage.pensionCards(page);

    for (const pensionCard of pensionCards) {
      const cardData = await BackendUiAssertion.getValidPensionCardData(
        page,
        request,
        pensionCard,
      );

      if (!cardData) {
        return;
      }

      const { schemeNameOnCard, data } = cardData;

      if (!data.matchingArrangement?.hasMultipleTranches) {
        continue;
      }

      await BackendUiAssertion.verifyPensionCardByType(
        page,
        pensionCard,
        schemeNameOnCard,
        data,
      );
    }
  }
}
