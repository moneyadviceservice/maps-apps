import { Page } from '@lib/test.lib';
import { BasePage } from '@pages/base.page';

import { IFieldOption, IInputPageData } from '../../types/common.types';

export class BaseInputPage<
  TOptions extends readonly IFieldOption[] = readonly IFieldOption[],
> extends BasePage {
  constructor(
    protected readonly page: Page,
    public readonly data: IInputPageData & {
      fields: TOptions;
    },
  ) {
    super(page);
  }

  /**
   * Navigate directly to the question page.
   */
  async goto() {
    await this.page.goto('/en/' + this.data.endpoint);
  }

  /**
   * Standard continue button found at the bottom of the page.
   */
  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }

  /**
   * Gets the field locator from the page, given an id from the pages data.
   */
  field(fieldId: TOptions[number]['id']) {
    return this.page.locator(`[name="${fieldId}"]`);
  }

  /**
   * To be used by custom matcher expect(page).toHaveExpectedFields()
   * This returns an array of objects containing the labels and the ids.
   */
  async getFields(): Promise<IFieldOption[]> {
    return this.page
      .locator('input[type="text"], select[name]')
      .filter({ visible: true })
      .evaluateAll((fields) =>
        fields.map((input) => {
          /**
           * A select node type is nested one more layer than a field.
           * Doing it this way means it's more compatibile with other page types.
           */
          let label = input.parentElement?.querySelector('label');
          const id = input.getAttribute('name');

          /**
           * If it can't find the label, try looking one level up first, which should be the fieldSet.
           * For select nodes, the label is a sibling, in the fieldSet.
           */
          if (!label) {
            const fieldSet = input.parentElement?.parentElement;
            label = fieldSet?.querySelector(':scope > label');

            if (!label) {
              throw new Error(`Could not find label of given field`);
            }
          }

          if (!id) {
            throw new Error(`Input field did not have a "name" attribute`);
          }

          const result: IFieldOption = {
            label: label.textContent,
            id,
          };

          return result;
        }),
      );
  }
}
