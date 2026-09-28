import { Locator, Page } from '@maps/playwright';

import type BasePage from './BasePage';

class PensionsThatNeedActionPage {
  constructor(private readonly page: Page) {}

  readonly redPensionPageTitle = 'page-title';
  readonly showAndHideContactDetails = 'summary-block-title';
  readonly heading = `h1:has-text("Pensions that need action")`;
  readonly redPensionsPageTitleText =
    'Pensions that need action - MoneyHelper Pensions Dashboard';

  async pageLoads(): Promise<void> {
    await this.page.getByTestId('page-title').waitFor();
  }

  async proceedToPensionNeedingActionDetailsPage(): Promise<void> {
    const redPension = this.page.getByTestId('notification-box-negative');
    await redPension.waitFor();
    await redPension.scrollIntoViewIfNeeded();
    await this.page
      .getByRole('link', { name: 'See pensions that need action' })
      .waitFor();
    await this.page
      .getByRole('link', { name: 'See pensions that need action' })
      .click();
    await this.page
      .getByTestId(this.redPensionPageTitle)
      .waitFor({ state: 'visible' });
    await this.clickAllShowAndHideContactDetails();
  }

  async proceedToRedTrafficPensionDetailsPage(): Promise<void> {
    await this.page
      .getByRole('link', { name: 'See pensions that need action' })
      .click();
  }

  async navigateBack(): Promise<void> {
    await this.page.locator('a[data-testid="back"]').click();
  }

  async getAllInformationCalloutTexts(): Promise<string[]> {
    const infoCallouts = this.page.getByTestId('information-callout');
    const count = await infoCallouts.count();
    const allTexts = [];
    for (let i = 0; i < count; i++) {
      const callout = infoCallouts.nth(i);
      await callout.waitFor({ state: 'visible' });
      allTexts.push(await callout.innerText());
    }
    return allTexts;
  }

  async clickAllShowAndHideContactDetails(): Promise<void> {
    const details = this.page.getByTestId(this.showAndHideContactDetails);
    const count = await details.count();
    for (let i = 0; i < count; i++) {
      const detail = details.nth(i);
      if (await detail.isVisible()) {
        await detail.click();
      }
    }
  }

  async showAndHideContactDetailsText(): Promise<string> {
    const detailsElement = this.page.getByTestId(
      this.showAndHideContactDetails,
    );
    await detailsElement.waitFor();
    return detailsElement.innerText();
  }

  async proceedToLogoutViaWhatYouCanDoSection(
    basePage: BasePage,
  ): Promise<void> {
    await this.page
      .getByRole('heading', { name: 'What you can do' })
      .scrollIntoViewIfNeeded();
    // Logout lives in the header burger menu (not in page copy anymore).
    await basePage.clickBurgerIcon();
    const logoutLink = this.page
      .getByTestId('header')
      .getByTestId('logout-link');
    await logoutLink.waitFor({ state: 'visible' });
    await logoutLink.click();
    await this.page
      .getByRole('heading', { name: 'You’re about to leave' })
      .isVisible();
  }

  async proceedToPensionDetailsPageFromMEMPension(): Promise<void> {
    const memPensionTitle = this.page.getByRole('heading', {
      name: 'MEM Trust Local',
    });
    await memPensionTitle.waitFor({ state: 'visible' });
    await memPensionTitle.scrollIntoViewIfNeeded();
    await this.page.getByTestId('details-link').click();
    await this.page
      .getByTestId('tab-pension-income-and-values')
      .nth(0)
      .waitFor({ state: 'visible' });
    await this.page
      .getByTestId('tab-about-this-pension')
      .nth(0)
      .waitFor({ state: 'visible' });
    await this.page
      .getByTestId('tab-contact-pension-provider')
      .nth(0)
      .waitFor({ state: 'visible' });
  }

  async assertPensionsThatNeedAction(pensions: any): Promise<void> {
    await this.page.locator(this.heading).waitFor();

    const pensionCards = this.page.getByTestId('information-callout');
    let index = 0;
    await pensionCards.nth(index).waitFor();

    const isContactPension = ({ matchType: mt, unavailableReason: ur }) =>
      mt === 'CONT' || mt === 'POSS' || (mt === 'DEFN' && ur === 'MEM');

    const contactPensions = pensions.filter(isContactPension);

    const possMatchPensions = contactPensions.filter(
      (p: any) => p.matchType === 'POSS',
    );
    const moreInfoPensions = contactPensions.filter(
      (p: any) => p.matchType !== 'POSS',
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
  }

  get paragraph1() {
    return this.page.getByText(
      'You may need to provide more information to confirm whether a pension belongs to you, or there could be another issue the provider needs to speak to you about.',
    );
  }

  get heading2() {
    return this.page.getByRole('heading', { name: 'What you can do' });
  }

  get paragraph2() {
    return this.page.getByText(
      'Call, email or write to your provider using the details on this page',
    );
  }

  get paragraph3() {
    return this.page.getByText(
      `Contact your provider using the details on the card and let them know you'd like to resolve an issue with a pension on the MoneyHelper Pensions Dashboard. They might ask you for:`,
    );
  }

  get listItems(): Locator {
    return this.page.getByTestId('list-element').locator('li');
  }

  get paragraph4() {
    return this.page.getByText(
      `Once the issue is resolved, the pension will show up in 'Your pensions' or 'Pending pensions'. If it was matched to you by mistake, it will no longer show up on the Pensions Dashboard.`,
    );
  }

  get possibleMatchHeading() {
    return this.page.getByRole('heading', {
      name: 'Possible match with your details',
    });
  }

  get possibleMatchParagraph() {
    return this.page.getByText(
      `The pension provider needs to make sure your information matches their records.`,
    );
  }

  get moreInfoHeading() {
    return this.page.getByRole('heading', {
      name: 'More information, action or decision needed',
    });
  }

  get moreInfoParagraph() {
    return this.page.getByText(
      `The pension provider cannot send any more details until you contact them.`,
    );
  }
}

export default PensionsThatNeedActionPage;
