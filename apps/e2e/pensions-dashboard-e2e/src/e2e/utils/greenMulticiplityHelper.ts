import { expect, Page } from '@maps/playwright';

import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { BeDataExtraction } from './beDataExtraction';
import commonHelpers from './commonHelpers';
import { BackendUiAssertion } from './detailTabsBackendUIAssertion';
import { MatchingPensionArrangement } from './pensionCardBackendUIAssertion';
import { RequestHelper } from './request';

export class GreenMulticiplityHelper {
  private static async getConfirmedArrangements(page: Page, request: any) {
    const response = await RequestHelper.getPensionCategory(
      page,
      request,
      'CONFIRMED',
    );
    const responseJson = await response.json();
    return responseJson?.arrangements ?? [];
  }

  static async verifySummaryAndIncomeTab(
    page: Page,
    request: any,
    arrangement?: any,
  ) {
    const { arrangementToVerify, confirmedArrangements } =
      await this.resolveSummaryTabArrangement(page, request, arrangement);
    const warnings =
      BeDataExtraction.aggregateIllustrationWarnings(arrangementToVerify);

    const pensionCards = await pensionBreakdownPage.pensionCards(page);
    console.info(`Found ${pensionCards.length} pension cards to process`);
    console.info(`Warning codes to verify: ${warnings.join(', ')}`);

    for (const pensionCard of pensionCards) {
      const cardData = await BackendUiAssertion.getValidPensionCardData(
        page,
        request,
        pensionCard,
        confirmedArrangements,
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

      await this.verifySummaryTabWarningsOnDetailsPage(
        page,
        request,
        pensionCard,
        data,
        cardIdentifier,
      );

      await this.verifyIncomeAndValueTab(
        page,
        request,
        data.matchingArrangement,
      );

      console.info(`Successfully processed card: ${cardIdentifier}`);
    }
  }

  private static async resolveSummaryTabArrangement(
    page: Page,
    request: any,
    arrangement?: any,
  ) {
    const confirmedArrangements = await this.getConfirmedArrangements(
      page,
      request,
    );
    if (arrangement) {
      return { arrangementToVerify: arrangement, confirmedArrangements };
    }
    const arrangementToVerify =
      confirmedArrangements.find(
        (a: any) =>
          BeDataExtraction.aggregateIllustrationWarnings(a).length > 0,
      ) ?? confirmedArrangements[0];
    if (!arrangementToVerify) {
      throw new Error('No arrangements available from backend to verify.');
    }
    return { arrangementToVerify, confirmedArrangements };
  }

  private static async verifySummaryTabWarningsOnDetailsPage(
    page: Page,
    request: any,
    pensionCard: any,
    data: any,
    cardIdentifier: string,
  ) {
    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
    const warningElements = page.getByTestId(/warning-title-/);
    console.info('Warning elements:', warningElements);
    const summaryTabText = page.getByTestId('pension-detail-intro');
    await summaryTabText.waitFor({ state: 'visible' });
    await BackendUiAssertion.verifySummaryStatementOnSummaryTab(
      page,
      data,
      request,
    );
    const warningContainer = page.getByTestId('warnings');
    if (!(await warningContainer.isVisible())) return;
    const warningElementCount = await warningElements.count();
    console.info(
      `Warning element count for ${cardIdentifier}:`,
      warningElementCount,
    );
    for (const warningElement of await warningElements.all()) {
      await expect(warningElement).toBeVisible();
    }
  }

  static async verifyIncomeAndValueTab(
    page: Page,
    request: any,
    arrangement?: any,
  ) {
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

    const incomeAndValuesTab = page
      .getByTestId('tab-pension-income-and-values')
      .first();
    await incomeAndValuesTab.click();
    await page.waitForURL(/\/pension-details\/pension-income-and-values/);

    await BackendUiAssertion.verifyTimelineOnIncomeTab(
      page,
      arrangement,
      pensionType,
    );

    await BackendUiAssertion.verifyChartsOnIncomeTab(
      page,
      arrangement,
      pensionType,
    );

    await commonHelpers.clickBackLink(page);

    console.info(`Successfully processed Income and Values tab`);
  }

  static async verifyBreakdownPageSummaryAndMultiTranchePensionCards(
    page: Page,
    request: any,
  ): Promise<any[]> {
    const confirmedArrangements = await this.getConfirmedArrangements(
      page,
      request,
    );
    const pensionCards = await pensionBreakdownPage.pensionCards(page);
    for (const pensionCard of pensionCards) {
      const cardData = await BackendUiAssertion.getValidPensionCardData(
        page,
        request,
        pensionCard,
        confirmedArrangements,
      );

      if (!cardData) {
        return;
      }
      const { schemeNameOnCard, data } = cardData;
      const arrangement = data.matchingArrangement;

      if (!arrangement?.hasMultipleTranches) {
        continue;
      }
      await MatchingPensionArrangement.verifySummaryStatementOnBreakdownPage(
        page,
        arrangement,
      );
      await MatchingPensionArrangement.verifyPensionCardByType(
        page,
        pensionCard,
        schemeNameOnCard,
        data,
      );
    }

    return confirmedArrangements;
  }
}
