import { FooterComponent } from '@components/footer';
import { HeaderComponent } from '@components/header';
import { Page } from '@lib/test.lib';

export class BasePage {
  public readonly footer: FooterComponent;
  public readonly header: HeaderComponent;

  constructor(protected readonly page: Page) {
    this.footer = new FooterComponent(page);
    this.header = new HeaderComponent(page);
  }

  get title() {
    return this.page.getByTestId('toolpage-span-title');
  }

  get subHeader() {
    return this.page.locator('main h1');
  }

  get content() {
    const contentSelectors = [
      '#main li', // Any list items in the main content.
      '[data-testid="paragraph"]', // All paragraph blocks
      '[data-testid="string-definition"]', // All string definitions on a page
    ];
    return this.page.locator(contentSelectors.join(', '));
  }
}
