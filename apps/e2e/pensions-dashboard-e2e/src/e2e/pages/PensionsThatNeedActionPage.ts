import { Page } from '@playwright/test';

type PensionsThatNeedAction = {
  heading: string;
  redPensionsPageTitleText: string;
  assertPensionsThatNeedAction(page: Page, pensions: any): Promise<void>;
  navigateBack(page: Page): Promise<void>;
  clickAllShowAndHideContactDetails(page: Page): Promise<void>;
  proceedToRedTrafficPensionDetailsPage(page: Page): Promise<void>;
  showAndHideContactDetailsText(page: Page): Promise<string>;
  proceedToPensionNeedingActionDetailsPage(page: Page): Promise<void>;
  proceedToLogoutViaWhatYouCanDoSection(page: Page): Promise<void>;
  proceedToPensionDetailsPageFromMEMPension(page: Page): Promise<void>;
};

const pensionsThatNeedAction: PensionsThatNeedAction = {
  heading: `h1:has-text("Pensions that need action")`,
  redPensionsPageTitleText:
    'Pensions that need action - MoneyHelper Pensions Dashboard',

  async proceedToPensionNeedingActionDetailsPage(page: Page): Promise<void> {
    const redPension = page.getByRole('heading', {
      name: 'Pensions that need you to',
    });
    await redPension.waitFor();
    await redPension.scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: 'Get contact details' }).waitFor();
    await page.getByRole('link', { name: 'Get contact details' }).click();
    await page
      .getByTestId(this.redPensionPageTitle)
      .waitFor({ state: 'visible' });
    await this.clickAllShowAndHideContactDetails(page);
  },

  async proceedToRedTrafficPensionDetailsPage(page: Page): Promise<void> {
    await page.getByRole('link', { name: 'Get contact details' }).click();
  },

  async proceedToLogoutViaWhatYouCanDoSection(page: Page): Promise<void> {
    const whatYouNeedToDoHeader = page.getByRole('heading', {
      name: 'What you need to do',
    });
    const logoutLinkFromWhatYouCanDoSection = page
      .getByTestId('logout-link')
      .nth(1);
    await whatYouNeedToDoHeader.scrollIntoViewIfNeeded();
    await logoutLinkFromWhatYouCanDoSection.click();
    await page
      .getByRole('heading', { name: 'You’re about to leave' })
      .isVisible();
  },

  async showAndHideContactDetailsText(page: Page): Promise<string> {
    const detailsElement = page.getByTestId(this.showAndHideContactDetails);
    await detailsElement.waitFor();
    return detailsElement.innerText();
  },
  async clickAllShowAndHideContactDetails(page: Page): Promise<void> {
    const details = page.getByTestId(this.showAndHideContactDetails);
    const count = await details.count();
    for (let i = 0; i < count; i++) {
      const detail = details.nth(i);
      if (await detail.isVisible()) {
        await detail.click();
      }
    }
  },

  async proceedToPensionDetailsPageFromMEMPension(page: Page) {
    const memPensionTitle = page.getByText('MEM Trust Local');
    await memPensionTitle.waitFor({ state: 'visible' });
    await memPensionTitle.scrollIntoViewIfNeeded();
    await page.getByTestId('details-link').click();
    await page
      .getByTestId('tab-pension-income-and-values')
      .nth(0)
      .waitFor({ state: 'visible' });
    await page
      .getByTestId('tab-about-this-pension')
      .nth(0)
      .waitFor({ state: 'visible' });
    await page
      .getByTestId('tab-contact-pension-provider')
      .nth(0)
      .waitFor({ state: 'visible' });
  },

  async assertPensionsThatNeedAction(page: Page, pensions: any): Promise<void> {
    await page.waitForSelector(this.heading);
    const pensionCards = page.getByTestId('information-callout');
    let index = 0;
    await pensionCards.nth(index).waitFor();

    // requires updating when data mapping completed
    const possPensions = pensions.filter(
      (pension) =>
        ['CONT', 'POSS'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['MEM'].includes(pension.unavailableReason)),
    );

    for (const pension of possPensions) {
      const summaryBlockTitle = pensionCards
        .nth(index)
        .getByTestId('summary-block-title');
      await summaryBlockTitle.waitFor();
      await summaryBlockTitle.click();

      const contactDetails = pensionCards
        .nth(index)
        .getByTestId('expandable-section');
      await contactDetails.waitFor();

      await pensionCards
        .filter({ hasText: pension.schemeName })
        .getByTestId('pension-contact-reference')
        .filter({ hasText: pension.referenceNumber })
        .waitFor({ state: 'visible' });

      await pensionCards
        .filter({ hasText: pension.schemeName })
        .locator(`:has-text("${pension.pensionAdministrator}")`)
        .first()
        .waitFor({ state: 'visible' });
      index++;
    }
  },

  async navigateBack(page: Page): Promise<void> {
    await page.locator('a[data-testid="back"]').click();
  },
};
export default pensionsThatNeedAction;
