import { BasePage } from 'pages/base.page';
import { QuestionPageData } from 'types/common.types';
import { ENV } from '@lib/env.lib';
import { Page } from '@lib/test.lib';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class QuestionPage<TOptions extends string = string> extends BasePage {
  constructor(
    protected readonly page: Page,
    public readonly data: QuestionPageData,
  ) {
    super(page);
  }

  static readonly EXPECTED_PAGE_TITLE = 'Get your pension guidance';

  public optionRadio(text: string) {
    return this.page.getByRole('radio', { name: text, exact: true });
  }

  private optionLabel(text: string) {
    return this.page
      .getByTestId('radio-button-label')
      .filter({ hasText: text });
  }

  async selectOption(optionText: TOptions) {
    if (!this.data.options?.includes(optionText)) {
      throw new Error(`Option "${optionText}" does not exist for this page.`);
    }
    await this.optionLabel(optionText).click();
  }
  public get radioOptions() {
    return this.page.getByRole('radio');
  }

  private get nextButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  public get accordionSection() {
    return this.page.getByTestId('expandable-section');
  }

  public get accordionContent() {
    return this.accordionSection.getByTestId('paragraph');
  }

  public get accordionHeader() {
    return this.accordionSection.getByTestId('summary-block-title');
  }

  public get link() {
    return this.page.getByRole('link', { name: 'Find out your pension type' });
  }

  /**
   * Navigate to the Leave Pot Untouched calculator page.
   *
   * @param endpoint - Optional path suffix to navigate to a specific route under the page.
   * @param options - Navigation options.
   * @param options.ignoreCookiesBanner - If true, skips accepting the cookies banner after navigation.
   */
  async goto(options: GotoOptions = {}) {
    const { ignoreCookiesBanner = !ENV.CI } = options;
    await this.page.goto('/en/' + this.data.endpoint);
    if (!ignoreCookiesBanner) {
      await this.acceptAllCookiesButton.click();
    }
  }

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  async toggleAccordion() {
    if (!this.data.accordion)
      throw new Error('No accordion present on this page config.');
    await this.accordionHeader.click();
  }

  async submit() {
    await this.nextButton.click();
  }
}
