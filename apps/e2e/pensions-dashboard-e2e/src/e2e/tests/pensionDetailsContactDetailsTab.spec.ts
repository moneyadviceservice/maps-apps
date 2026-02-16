/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/no-focused-test */

import { test } from '@maps/playwright';

import { detailsContactMethods as dataScenario } from '../data/scenarioDetails';
import { detailsContactMethodsPending as dataScenarioPending } from '../data/scenarioDetails';
import { ContactProviderCard } from '../pages/components/ContactProviderCard';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 36780 and 36781
 * @scenario The detailsContactMethods test scenario contains 5 green pensions and 1 yellow pension that cover the following scenarios:
 * - All data fields available
 * - Data fields not available
 * - Data fields where there are preferred methods of contact
 * - Data fields where there are no preferred methods of contact
 * - Payload containing greater than the max amount of phone numbers that can be displayed (10)
 *
 * @tests Test case 38556 [AC1 AC5] Component Heading and Subtext
 *
 * @tests Test case 38557 [AC2 AC3 AC5] - Contact provider Tab: all data fields available
 * @tests Test case 38558 [AC2 AC3 AC5] - Contact provider Tab: data fields not available
 *
 * @tests Test case 38560 [AC4 AC5] - Contact provider Tab: Phone Number Order preferred methods of contact
 * @tests Test case 38561 [AC4 AC5]- Contact provider Tab: Address Order preferred methods of contact
 * @tests Test case 38575 [AC4 AC5]- Contact provider Tab: Phone Number Order no preferred methods of contact
 * @tests Test case 38576 [AC4 AC5] - Contact provider Tab: Address Order no preferred methods of contact
 * @tests Test case 38577 [AC4 AC5] - Max phone numbers
 *
 * @tests Test case 38763 [AC3 AC5] - Contact provider Tab: Email preferred method of contact
 * @tests Test case 38764 [AC3 AC5] - Contact provider Tab: Email no preferred method of contact
 * @tests Test case 38765 [AC3 AC5] - Contact provider Tab: Website preferred method of contact
 * @tests Test case 38766 [AC3 AC5] - Contact provider Tab: Website no preferred method of contact
 */

test.describe('Pension Details page - Contact details tab', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Contact details tab elements are working as expected for Your Pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(page, dataScenario.option);
    await pensionsFoundPage.clickSeeYourPensions(page);

    console.log('Pensions array length:', dataScenario.pensions.length);

    for (const pension of dataScenario.pensions) {
      await pensionBreakdownPage.viewDetailsOfPension(page, pension.schemeName);
      await pensionDetailsPage.assertHeading(page, pension.schemeName);
      await pensionDetailsPage.selectTab(page, 'Contact provider');

      // assert heading, subtext and table
      const contactProviderCard = new ContactProviderCard();
      await page.waitForURL('**/pension-details/contact-pension-provider');
      await contactProviderCard.assertHeading(page);
      await contactProviderCard.assertSubText(page);
      await contactProviderCard.assertTableContentsMatchScenario(
        page,
        pension.contactCardDetailsTable,
      );

      // Take it back to the pension breakdown for the next pension.
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Contact details tab elements are working as expected for Pending Pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      dataScenarioPending.option,
    );
    await pensionsFoundPage.clickSeePendingPensions(page);

    for (const pension of dataScenarioPending.pensions) {
      await pendingPensionsPage.viewDetailsOfPendingPension(
        page,
        pension.schemeName,
      );
      await pensionDetailsPage.assertHeading(page, pension.schemeName);
      await pensionDetailsPage.selectTab(page, 'Contact provider');

      // assert heading, subtext and table
      const contactProviderCard = new ContactProviderCard();
      await page.waitForURL('**/pension-details/contact-pension-provider');

      await contactProviderCard.assertHeading(page);
      await contactProviderCard.assertSubText(page);
      await contactProviderCard.assertTableContentsMatchScenario(
        page,
        pension.contactCardDetailsTable,
      );

      // Take it back to the pension breakdown for the next pension.
      await commonHelpers.clickLink(page, 'Back');
      await pendingPensionsPage.pageLoads(page);
    }
  });
});
