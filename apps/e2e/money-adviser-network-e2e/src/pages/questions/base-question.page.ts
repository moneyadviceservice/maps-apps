import { Page } from '@lib/test.lib';
import { BasePage } from '@pages/base.page';

import { IQuestionOption, IQuestionPageData } from '../../types/common.types';

export class BaseQuestionPage<
  TOptions extends readonly IQuestionOption[] = readonly IQuestionOption[],
> extends BasePage {
  constructor(
    protected readonly page: Page,
    public readonly data: IQuestionPageData & {
      options: TOptions;
    },
  ) {
    super(page);
  }

  /**
   * The title text of an accordion that is clicked to expand it.
   */
  get expandableSectionTitle() {
    return this.page.getByTestId('summary-block-title');
  }

  /**
   * The text that is shown when expanding an accordion.
   */
  get expandableSectionText() {
    return this.page.locator(
      '[data-testid="expandable-section"] > summary + *',
    );
  }

  /**
   * The main fieldset wrapping the question options.
   */
  get fieldset() {
    return this.page.locator('fieldset');
  }

  /**
   * Standard continue button found at the bottom of the page.
   */
  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }

  /**
   * Standard error label for multi option questions.
   */
  get errorLabel() {
    return this.page.locator('[data-testid^="errorMessage"]');
  }

  /**
   * Standard error summary at the top of a question page.
   */
  get errorSummary() {
    return this.page.locator('[data-testid^="error-link"]');
  }

  /**
   * Navigate directly to the question page.
   */
  async goto() {
    await this.page.goto('/en/' + this.data.endpoint);
  }

  /**
   * To be used by custom matcher expect(page).toHaveExpectedOptions()
   * This returns an array of objects containing the text and the hints.
   */
  async getOptionContents(): Promise<IQuestionOption[]> {
    return this.page.getByTestId('radio-button').evaluateAll((options) =>
      options.map((option) => {
        const labelSelector = '[data-testid="radio-button-label"]';

        const label = option.querySelector(labelSelector);
        const hintParagraph = option.parentElement?.querySelector('p');

        if (!label) {
          throw new Error(
            `Could not find radio button label using selector ${labelSelector}`,
          );
        }

        const result: { text: string; hint?: string } = {
          text: label.textContent?.trim() ?? '',
        };

        if (hintParagraph) {
          result.hint = hintParagraph.textContent?.trim() ?? '';
        }

        return result;
      }),
    );
  }

  /**
   * Type safe method for getting an option based on the question data provided.
   * An example of this would be if the options were Yes and No, the parameter would
   * be limited to just Yes or No, else it will throw a TS error.
   */
  option(optionText: TOptions[number]['text']) {
    if (!this.data.options.some((o) => o.text === optionText)) {
      throw new Error(`Option "${optionText}" does not exist for this page.`);
    }
    return this.page
      .getByTestId('radio-button-label')
      .filter({ hasText: optionText });
  }

  /**
   * Same as option, but actually returns you the checkbox instead of the whole element.
   */
  optionCheckbox(optionText: TOptions[number]['text']) {
    if (!this.data.options.some((o) => o.text === optionText)) {
      throw new Error(`Option "${optionText}" does not exist for this page.`);
    }
    return this.page
      .getByTestId('radio-button')
      .filter({ hasText: optionText })
      .locator('input');
  }
}
