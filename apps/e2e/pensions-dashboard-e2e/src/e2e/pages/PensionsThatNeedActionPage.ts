import { Locator, Page } from '@maps/playwright';

import basePage from './BasePage';

type PensionsThatNeedAction = {
  heading: string;
  redPensionPageTitle: string;
  redPensionsPageTitleText: string;
  showAndHideContactDetails: string;
  pageLoads(page: Page): Promise<void>;
  assertPensionsThatNeedAction(page: Page, pensions: any): Promise<void>;
  navigateBack(page: Page): Promise<void>;
  getAllInformationCalloutTexts(page: Page): Promise<string[]>;
  clickAllShowAndHideContactDetails(page: Page): Promise<void>;
  proceedToRedTrafficPensionDetailsPage(page: Page): Promise<void>;
  showAndHideContactDetailsText(page: Page): Promise<string>;
  proceedToPensionNeedingActionDetailsPage(page: Page): Promise<void>;
  proceedToLogoutViaWhatYouCanDoSection(page: Page): Promise<void>;
  proceedToPensionDetailsPageFromMEMPension(page: Page): Promise<void>;
  getParagraph1(page: Page): Locator;
  getHeading2(page: Page): Locator;
  getParagraph2(page: Page): Locator;
  getParagraph3(page: Page): Locator;
  getListItems(page: Page): Locator;
  getParagraph4(page: Page): Locator;
  getPossibleMatchHeading(page: Page): Locator;
  getPossibleMatchParagraph(page: Page): Locator;
  getMoreInfoHeading(page: Page): Locator;
  getMoreInfoParagraph(page: Page): Locator;
};

const pensionsThatNeedAction: PensionsThatNeedAction = {
  redPensionPageTitle: 'page-title',
  showAndHideContactDetails: 'summary-block-title',
  heading: `h1:has-text("Pensions that need action")`,
  redPensionsPageTitleText:
    'Pensions that need action - MoneyHelper Pensions Dashboard',

  async pageLoads(page: Page): Promise<void> {
    await page.getByTestId('page-title').waitFor();
  },

  async proceedToPensionNeedingActionDetailsPage(page: Page): Promise<void> {
    const redPension = page.getByTestId('callout-negative');
    await redPension.waitFor();
    await redPension.scrollIntoViewIfNeeded();
    await page
      .getByRole('link', { name: 'See pensions that need action' })
      .waitFor();
    await page
      .getByRole('link', { name: 'See pensions that need action' })
      .click();
    await page
      .getByTestId(this.redPensionPageTitle)
      .waitFor({ state: 'visible' });
    await this.clickAllShowAndHideContactDetails(page);
  },

  async proceedToRedTrafficPensionDetailsPage(page: Page): Promise<void> {
    await page
      .getByRole('link', { name: 'See pensions that need action' })
      .click();
  },

  async navigateBack(page: Page): Promise<void> {
    await page.locator('a[data-testid="back"]').click();
  },

  async getAllInformationCalloutTexts(page: Page): Promise<string[]> {
    const infoCallouts = page.getByTestId('information-callout');
    const count = await infoCallouts.count();
    const allTexts = [];
    for (let i = 0; i < count; i++) {
      const callout = infoCallouts.nth(i);
      await callout.waitFor({ state: 'visible' });
      allTexts.push(await callout.innerText());
    }
    return allTexts;
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

  async showAndHideContactDetailsText(page: Page): Promise<string> {
    const detailsElement = page.getByTestId(this.showAndHideContactDetails);
    await detailsElement.waitFor();
    return detailsElement.innerText();
  },

  async proceedToLogoutViaWhatYouCanDoSection(page: Page): Promise<void> {
    await page
      .getByRole('heading', { name: 'What you can do' })
      .scrollIntoViewIfNeeded();
    // Logout lives in the header burger menu (not in page copy anymore).
    await basePage.clickBurgerIcon(page);
    const logoutLink = page.getByTestId('header').getByTestId('logout-link');
    await logoutLink.waitFor({ state: 'visible' });
    await logoutLink.click();
    await page
      .getByRole('heading', { name: 'You’re about to leave' })
      .isVisible();
  },

  async proceedToPensionDetailsPageFromMEMPension(page: Page): Promise<void> {
    const memPensionTitle = page.getByRole('heading', {
      name: 'MEM Trust Local',
    });
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
    await page.locator(this.heading).waitFor();

    const pensionCards = page.getByTestId('information-callout');
    let index = 0;
    await pensionCards.nth(index).waitFor();

    const isContactPension = ({ matchType: mt, unavailableReason: ur }) =>
      mt === 'CONT' || mt === 'POSS' || (mt === 'DEFN' && ur === 'MEM');

    const contactPensions = pensions.filter(isContactPension);

    const possMatchPensions = contactPensions.filter(
      (p) => p.matchType === 'POSS',
    );
    const moreInfoPensions = contactPensions.filter(
      (p) => p.matchType !== 'POSS',
    );

    for (const pension of [...possMatchPensions, ...moreInfoPensions]) {
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

  getParagraph1(page: Page) {
    return page.getByText(
      'You may need to provide more information to confirm whether a pension belongs to you, or there could be another issue the provider needs to speak to you about.',
    );
  },

  getHeading2(page: Page) {
    return page.getByRole('heading', { name: 'What you can do' });
  },

  getParagraph2(page: Page) {
    return page.getByText(
      'Call, email or write to your provider using the details on this page',
    );
  },

  getParagraph3(page: Page) {
    return page.getByText(
      `Contact your provider using the details on the card and let them know you'd like to resolve an issue with a pension on the MoneyHelper Pensions Dashboard. They might ask you for:`,
    );
  },

  getListItems(page: Page): Locator {
    return page.getByTestId('list-element').locator('li');
  },

  getParagraph4(page: Page) {
    return page.getByText(
      `Once the issue is resolved, the pension will show up in 'Your pensions' or 'Pending pensions'. If it was matched to you by mistake, it will no longer show up on the Pensions Dashboard.`,
    );
  },

  getPossibleMatchHeading(page: Page) {
    return page.getByRole('heading', {
      name: 'Possible match with your details',
    });
  },

  getPossibleMatchParagraph(page: Page) {
    return page.getByText(
      `The pension provider needs to make sure your information matches their records.`,
    );
  },

  getMoreInfoHeading(page: Page) {
    return page.getByRole('heading', {
      name: 'More information, action or decision needed',
    });
  },

  getMoreInfoParagraph(page: Page) {
    return page.getByText(
      `The pension provider cannot send any more details until you contact them.`,
    );
  },
};
export default pensionsThatNeedAction;
