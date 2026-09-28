import { Page } from '@lib/test.lib';

/**
 * getters added for footer elements that are shared across all pages of MAN
 */

export class FooterComponent {
  constructor(protected readonly page: Page) {}

  get footer() {
    return this.page.getByRole('contentinfo');
  }

  get footerMainNav() {
    return this.footer.getByRole('navigation', { name: 'Footer navigation' });
  }

  get footerSocialNav() {
    return this.footer.getByRole('navigation', {
      name: 'Follow us',
    });
  }

  get footerLegalNav() {
    return this.footer.getByRole('navigation', { name: 'Legal navigation' });
  }

  get socialMediaHeading() {
    return this.page.getByText('Follow us:');
  }
}
