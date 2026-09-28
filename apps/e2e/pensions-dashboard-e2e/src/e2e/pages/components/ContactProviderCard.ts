import {
  ContactCardDetailsNumberRow,
  Pension,
} from 'src/e2e/types/contactCardScenario.types';
import { expect, type Page } from '@maps/playwright';

const MAX_NUMBER_OF_CONTACT_NUMBERS_EXPECTED_TO_BE_SHOWN = 10;

export class ContactProviderCard {
  constructor(private readonly page: Page) {}

  private readonly headerTestIds = {
    title: 'definition-list-title',
    subtext: 'definition-list-sub-text',
  };

  get definitionListTitle() {
    return this.page.getByTestId(this.headerTestIds.title).textContent();
  }

  get definitionListSubText() {
    return this.page.getByTestId(this.headerTestIds.subtext).textContent();
  }

  async assertHeading() {
    const definitionListHeading = await this.definitionListTitle;
    const definitionListHeadingCopy = 'Contact provider';
    expect(definitionListHeading).toEqual(definitionListHeadingCopy);
  }

  async assertSubText() {
    const definitionListSubText = await this.definitionListSubText;
    const definitionListSubTextCopy =
      'Have your plan reference number and personal details ready when you contact your provider. You’ll usually get a quicker reply using the preferred contact method(s). But you can choose the best option for you.';
    expect(definitionListSubText).toEqual(definitionListSubTextCopy);
  }

  private async assertTelephoneContactMethods(
    scenarioRow: ContactCardDetailsNumberRow,
  ) {
    const contactPhoneNumberElements = this.page
      .getByTestId(`dd-${scenarioRow.selector}`)
      .locator('p');

    const amountOfContactsNumbers = await contactPhoneNumberElements.count();
    const expectedAmountOfNumbers = Math.min(
      amountOfContactsNumbers,
      MAX_NUMBER_OF_CONTACT_NUMBERS_EXPECTED_TO_BE_SHOWN,
    );

    expect(amountOfContactsNumbers).toEqual(expectedAmountOfNumbers);

    // For every number in the contact methods, check it exists in the correct place
    for (let i = 0; i < expectedAmountOfNumbers; i++) {
      const expectedContactNumber = scenarioRow.description[i];
      const contactNumberElementText = contactPhoneNumberElements.nth(i);
      await expect(contactNumberElementText).toContainText(
        expectedContactNumber,
      );
    }
  }

  async assertTableContentsMatchScenario(
    contactCardDetailRows: Pension['contactCardDetailsTable'],
  ) {
    for (const scenarioRow of contactCardDetailRows) {
      const elementRowTitle = this.page.getByTestId(
        `dt-${scenarioRow.selector}`,
      );
      const elementRowDesc = this.page.getByTestId(
        `dd-${scenarioRow.selector}`,
      );

      await expect(elementRowTitle).toHaveText(scenarioRow.title);

      /**
       * (AC4)
       * If there is a phone number field, there should only be 10 numbers at maximum.
       */
      if (scenarioRow.title === 'Phone number') {
        await this.assertTelephoneContactMethods(scenarioRow);
      } else {
        await expect(elementRowDesc).toHaveText(scenarioRow.description);
      }
    }
  }
}

export default ContactProviderCard;
