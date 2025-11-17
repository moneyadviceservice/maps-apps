import { expect, type Page } from '@playwright/test';

import {
  ContactCardDetailsNumberRow,
  Pension,
} from '../../data/ContactCardScenario.types';

const MAX_NUMBER_OF_CONTACT_NUMBERS_EXPECTED_TO_BE_SHOWN = 10;

export class ContactProviderCard {
  private readonly headerTestIds = {
    title: 'definition-list-title',
    subtext: 'definition-list-sub-text',
  };

  async getDefinitionListTitle(page: Page) {
    return await page.getByTestId(this.headerTestIds.title).textContent();
  }

  async getDefinitionListSubText(page: Page) {
    return await page.getByTestId(this.headerTestIds.subtext).textContent();
  }

  async assertHeading(page: Page) {
    const definitionListHeading = await this.getDefinitionListTitle(page);
    const definitionListHeadingCopy = 'Contact provider';
    expect(definitionListHeading).toEqual(definitionListHeadingCopy);
  }

  async assertSubText(page: Page) {
    const definitionListSubText = await this.getDefinitionListSubText(page);
    const definitionListSubTextCopy =
      'Have your plan reference number and personal details ready when you contact your provider. You’ll usually get a quicker reply using the preferred contact method(s). But you can choose the best option for you.';
    expect(definitionListSubText).toEqual(definitionListSubTextCopy);
  }

  private async assertTelephoneContactMethods(
    page: Page,
    scenarioRow: ContactCardDetailsNumberRow,
  ) {
    const contactPhoneNumberElements = page
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
      await expect(contactNumberElementText).toHaveText(expectedContactNumber);
    }
  }

  async assertTableContentsMatchScenario(
    page: Page,
    contactCardDetailRows: Pension['contactCardDetailsTable'],
  ) {
    for (const scenarioRow of contactCardDetailRows) {
      const elementRowTitle = page.getByTestId(`dt-${scenarioRow.selector}`);
      const elementRowDesc = page.getByTestId(`dd-${scenarioRow.selector}`);

      await expect(elementRowTitle).toHaveText(scenarioRow.title);

      /**
       * (AC4)
       * If there is a phone number field, there should only be 10 numbers at maximum.
       */
      if (scenarioRow.title === 'Phone number') {
        this.assertTelephoneContactMethods(page, scenarioRow);
      } else {
        await expect(elementRowDesc).toHaveText(scenarioRow.description);
      }
    }
  }
}
