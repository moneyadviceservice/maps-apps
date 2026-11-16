import { Page } from '@maps/playwright';

class ContactUsPage {
  constructor(private readonly page: Page) {}

  async clickContactUs(): Promise<void> {
    await this.page.getByTestId('welcome-button').click();
  }

  get pageTitle() {
    return this.page.getByTestId('page-title');
  }

  get introText() {
    return this.page.getByTestId('tool-intro');
  }

  get paragraph() {
    return this.page.getByTestId('contact-us-intro-paragraph');
  }

  get hyperlink() {
    return this.page.getByRole('link', { name: 'Make a complaint' });
  }

  get contactUsFormHeading() {
    return this.page
      .frameLocator('#contact-us-form')
      .getByRole('heading', { name: 'Get in touch', level: 1 });
  }

  get onlineFormButton() {
    return this.page.getByTestId('contact-form-button');
  }

  get backButton() {
    return this.page.getByTestId('back');
  }

  get backToTopAnchor() {
    return this.page.getByRole('link', { name: 'Back to top' });
  }

  get accessibleOptionsHeading() {
    return this.page.getByRole('heading', { name: 'Accessibility options' });
  }

  async clickHelpAndSupportContactUs(): Promise<void> {
    const container = this.page.getByTestId('help-and-support');
    const link = container.getByRole('link', { name: 'Contact us' });
    await link.click();
    await this.page.locator('h1:text-is("Contact us")').waitFor();
  }
}

export default ContactUsPage;
