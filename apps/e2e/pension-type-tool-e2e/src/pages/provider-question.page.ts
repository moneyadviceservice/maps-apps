import AxeBuilder from '@axe-core/playwright';
import { CommonComponent } from '@pages/components/common-component.component';

export class ProviderQuestionPage extends CommonComponent {
  async waitForBrowserTitle(title: string) {
    await this.page.waitForFunction(
      (expectedTitle) => document.title === expectedTitle,
      title,
    );
  }

  description(text: string) {
    return this.page.getByText(text, { exact: true });
  }

  get providerItems() {
    return this.page.locator('main li');
  }

  get responseLabels() {
    return this.page.locator('main fieldset label');
  }

  get responseCount() {
    return this.responseLabels.count();
  }

  get languageSwitchLink() {
    return this.page.getByRole('link', { name: /Cymraeg|English/i });
  }

  async getAccessibilityViolations() {
    /** @ts-expect-error AxeBuilder and Playwright use incompatible page types. */
    const results = await new AxeBuilder({ page: this.page })
      .include('main fieldset')
      .analyze();
    return results.violations;
  }
}
