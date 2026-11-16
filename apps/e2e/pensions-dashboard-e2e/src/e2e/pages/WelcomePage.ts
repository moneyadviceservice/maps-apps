import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';

class WelcomePage {
  constructor(private readonly page: Page) {}

  readonly pageHeading = `h1:text-is("Welcome to the MoneyHelper Pensions Dashboard")`;
  readonly iUnderstandButton = 'welcome-button';
  readonly welcomePageTitleText =
    'Welcome to the MoneyHelper Pensions Dashboard - MoneyHelper Pensions Dashboard';

  async welcomePageLoads(locale: Locale = 'en'): Promise<void> {
    const welcomeMessages = {
      en: 'Welcome to the MoneyHelper Pensions Dashboard',
      cy: 'Croeso i Ddangosfwrdd Pensiynau HelpwrArian',
    };

    await this.page.getByText(welcomeMessages[locale]).waitFor();
  }

  async clickWelcomeButton(): Promise<void> {
    await this.page.getByTestId('list-element').nth(0).isVisible();
    await this.page.getByTestId('list-element').nth(1).isVisible();
    await this.page.getByTestId(this.iUnderstandButton).click();
  }
}

export default WelcomePage;
