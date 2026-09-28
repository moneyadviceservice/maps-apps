import { selfServeCreds } from '../../data/selfServeCredentials.data';
import { expect, test } from '../../fixtures/selfServeTest';
import { resetSelfServe } from '../../helpers/loginAndResetSelfServe';
import { SelfServePage } from '../../pages/SelfServePage';

let selfServePage: SelfServePage;

async function assertBlockedTradingName(
  selfServePage: SelfServePage,
  firm: string,
  statusLabel: string,
): Promise<void> {
  await expect(selfServePage.registeredNameValue(firm)).toBeVisible();
  await expect(selfServePage.tradingNameStatusValue(firm)).toHaveText(
    statusLabel,
  );
  await expect(selfServePage.removeTradingNameButton(firm)).toBeHidden();
  await expect(
    selfServePage.tradingNameCoverAndServiceLink(firm),
  ).toBeVisible();
  await expect(
    selfServePage.tradingNameCustomerContactDetailsLink(firm),
  ).toBeVisible();
}

test.describe('Account', () => {
  test.beforeEach(async ({ page }) => {
    selfServePage = await resetSelfServe(page);
  });

  /**
   * @tests 51836 - Registered name and FRN displayed
   * @tests 51843 - Status displayed
   */
  test('Main Authorised Firm content', async () => {
    await expect(
      selfServePage.registeredNameValue(selfServeCreds.DEFAULT_REGISTERED_NAME),
    ).toBeVisible();
    await expect(selfServePage.frnValue()).toHaveText(
      selfServeCreds.DEFAULT_FRN,
    );
    await expect(selfServePage.accountStatusValue()).toHaveText('Hidden');
    await expect(selfServePage.coverAndServiceLinkValue()).toHaveText(
      'not started',
    );
    await expect(selfServePage.customerContactDetailsLinkValue()).toHaveText(
      'not started',
    );
  });

  /**
   * @tests 51841 - cover and service redirect
   */
  test('Cover and service redirect', async () => {
    await selfServePage.clickCoverAndServiceLink();
    await selfServePage.expectNavigationTo(/\/trip-cover\/regions/);
    await expect(selfServePage.headingLocator('Regions covered')).toBeVisible();
  });

  /**
   * @tests 51842 - customer contact details redirect
   */
  test('Customer contact details redirect', async () => {
    await selfServePage.clickCustomerContactDetailsLink();
    await expect(
      selfServePage.headingLocator('Customer contact details'),
    ).toBeVisible();
  });

  /**
   * @tests 51935 - Trading name added/removed
   * @tests 51938
   * @tests 51939
   * @tests 51940 - searching for available trading names
   */
  test('Trading names', async () => {
    const firm = selfServeCreds.DEFAULT_TRADING_NAME;
    let initialAvailableCount: number;

    await test.step('Reset trading name state', async () => {
      await selfServePage
        .removeTradingNameButton(firm)
        .click({ timeout: 1000 })
        .catch(() => undefined);
      await expect(selfServePage.registeredNameValue(firm)).toBeHidden();
      initialAvailableCount = await selfServePage
        .availableTradingNameRow()
        .count();
      expect(initialAvailableCount).toBeGreaterThan(0);
    });

    await test.step('Search for trading name', async () => {
      await selfServePage.fillAvailableTradingNameSearchField('DOES_NOT_EXIST');
      await expect(selfServePage.noResultsText()).toBeVisible();
      await selfServePage.fillAvailableTradingNameSearchField(firm);
      await expect(selfServePage.noResultsText()).toBeHidden();
      await expect(selfServePage.availableTradingNameRow()).toHaveCount(1);
    });

    await test.step('Add to directory', async () => {
      await selfServePage.clickAddToDirectoryButton(firm);
      await expect(selfServePage.registeredNameValue(firm)).toBeVisible();
      await expect(selfServePage.availableTradingNameRow()).toHaveCount(
        initialAvailableCount - 1,
      );
      const availableTradingNamesList =
        await selfServePage.getAvailableTradingNames();
      expect(availableTradingNamesList.includes(firm)).toBe(false);
    });

    await test.step('Remove trading name', async () => {
      await expect(selfServePage.removeTradingNameButton(firm)).toBeVisible();
      await selfServePage.clickRemoveTradingNameButton(firm);
      await expect(selfServePage.registeredNameValue(firm)).toBeHidden();
      await expect(selfServePage.availableTradingNameRow()).toHaveCount(
        initialAvailableCount,
      );
      const availableTradingNamesList =
        await selfServePage.getAvailableTradingNames();
      expect(availableTradingNamesList.includes(firm)).toBe(true);
    });
  });
});

test.describe('FCA status', () => {
  const firm = selfServeCreds.DEFAULT_TRADING_NAME;

  /**
   * @tests 56468 - main firm status updated when FCA is no longer approved
   * @tests 56469 - trading name status updated when main firm status is no longer approved
   */
  test('Main firm and trading name show No longer authorised when FCA is invalid', async ({
    page,
  }) => {
    const selfServePage = await resetSelfServe(
      page,
      'setFcaUnauthorisedSelfServeState',
    );

    await expect(selfServePage.accountStatusValue()).toHaveText(
      'No longer authorised',
    );
    await expect(selfServePage.coverAndServiceLink()).toBeVisible();
    await expect(selfServePage.customerContactDetailsLink()).toBeVisible();
    await assertBlockedTradingName(selfServePage, firm, 'No longer authorised');
  });

  /**
   * @tests 56470 - individual trading name no longer valid
   * @tests 56471 - ability to remove trading name hidden
   */
  test('Trading name shows No longer valid when the name is blocked', async ({
    page,
  }) => {
    const selfServePage = await resetSelfServe(
      page,
      'setInvalidTradingNameSelfServeState',
    );

    await assertBlockedTradingName(selfServePage, firm, 'No longer valid');
  });

  /**
   * @tests 56472 - C&S and CCD are still accessible with invalid FCA number
   */
  test('Cover & service and Customer Contact details are still accessible', async ({
    page,
  }) => {
    const selfServePage = await resetSelfServe(
      page,
      'setFcaUnauthorisedSelfServeState',
    );

    await expect(selfServePage.accountStatusValue()).toHaveText(
      'No longer authorised',
    );
    await selfServePage.clickCoverAndServiceLink();
    await expect(selfServePage.headingLocator('Regions covered')).toBeVisible();
    await selfServePage.clickBackButton();
    await selfServePage.clickCustomerContactDetailsLink();
    await expect(
      selfServePage.headingLocator('Customer contact details'),
    ).toBeVisible();
  });
});
