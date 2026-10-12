import { Page } from '@maps/playwright';

import { BackendUiAssertion } from './detailTabsBackendUIAssertion';

export class UnknownPensionTypeDetailsHelper {
  static async verifyPensionDetailsTabs(page: Page, matchingArrangement: any) {
    //Verify Summary Tab - Unavailable message for SYS and NEW matchType
    await BackendUiAssertion.verifySysNewSummaryTabUnavailableMessage(
      page,
      matchingArrangement.matchType,
    );

    //Navigate to Income and Values Tab
    const incomeAndValuesTab = page
      .getByTestId('tab-pension-income-and-values')
      .first();
    await incomeAndValuesTab.click();
    await page.waitForURL(/\/pension-details\/pension-income-and-values/);

    const hasPensionType = Boolean(matchingArrangement.pensionType);
    const allComponents =
      matchingArrangement.benefitIllustrations?.flatMap(
        (bi: any) => bi.illustrationComponents ?? [],
      ) ?? [];
    const hasBenefitType = allComponents.some((ic: any) =>
      Boolean(ic.benefitType),
    );
    const hasPensionOrBenefitType = hasPensionType || hasBenefitType;

    if (!hasPensionOrBenefitType) {
      await BackendUiAssertion.verifySysNewNoBenefitTypeMessage(
        page,
        matchingArrangement.matchType,
      );
    } else if (hasPensionOrBenefitType) {
      await BackendUiAssertion.verifySysNewIncomeAndValuesTabWithBenefits(page);
      if (hasBenefitType) {
        await BackendUiAssertion.verifyBenefitTypeTitleOnIncomeTab(
          page,
          matchingArrangement,
        );
      }
    }
    //}
  }
}
