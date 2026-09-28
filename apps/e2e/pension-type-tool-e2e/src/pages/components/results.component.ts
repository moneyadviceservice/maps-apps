import AxeBuilder from '@axe-core/playwright';
import { BasePage } from '@pages/Base.page';

export class ResultsComponent extends BasePage {
  async gotoResults(language: 'en' | 'cy', query: string) {
    await this.goto(`/${language}/pension-type/results?${query}`);
  }

  get heading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  async waitForResultsPage() {
    await this.page.waitForURL('**/pension-type/results**', {
      waitUntil: 'commit',
    });
    await this.heading.waitFor();
  }

  get definedContributionSchemesLink() {
    return this.page.locator(
      'a[href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"]',
    );
  }

  get contactPensionSpecialistsLink() {
    return this.contactPensionSpecialistsLinkForLanguage('en');
  }

  contactPensionSpecialistsLinkForLanguage(language: 'en' | 'cy') {
    const linkText = {
      en: 'contact our pension specialists',
      cy: "gysylltu â'n harbenigwyr pensiynau",
    }[language];

    return this.page
      .locator(
        `a[href="https://www.moneyhelper.org.uk/${language}/contact-us"]`,
      )
      .filter({
        hasText: linkText,
      });
  }

  get checkAnotherPensionLink() {
    return this.page.getByText('check another pension');
  }

  content(text: string) {
    return this.page.getByText(text, { exact: false });
  }

  contentMatching(text: RegExp) {
    return this.page.getByText(text);
  }

  async getAccessibilityViolations() {
    /** @ts-expect-error AxeBuilder and Playwright use incompatible page types. */
    const results = await new AxeBuilder({ page: this.page })
      .include('main')
      // The shared footer contains a pre-existing heading-order issue.
      .disableRules(['heading-order'])
      .analyze();
    return results.violations;
  }
}
