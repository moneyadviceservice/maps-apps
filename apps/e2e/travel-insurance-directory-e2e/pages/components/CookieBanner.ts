import { type Locator, type Page } from '@playwright/test';

import { BasePage } from '../basePage';

type CookieType = 'Analytics Cookies' | 'Marketing Cookies';
type CookieStatus = 'accepted' | 'revoked' | 'unknown';

export interface ConsentCookieData {
  optionalCookies?: {
    analytics?: CookieStatus;
    marketing?: CookieStatus;
  };
}

export class CookieBanner extends BasePage {
  //SELECTORS

  private readonly cookieBannerId = 'ccc-notify';
  private readonly acceptButtonId = 'ccc-notify-accept';
  private readonly rejectButtonId = 'ccc-notify-reject';
  private readonly setPreferencesLinkClass = 'ccc-notify-link';
  private readonly preferencesModuleId = 'ccc-module';

  private readonly preferencesAcceptButtonId = 'ccc-recommended-settings';
  private readonly preferencesRejectButtonId = 'ccc-reject-settings';
  private readonly optionalCategoriesId = 'ccc-optional-categories';

  private readonly optionalCookieContainerClass = 'optional-cookie';
  private readonly checkboxToggleClass = 'checkbox-toggle';
  private readonly checkboxToggleInputClass = 'checkbox-toggle-input';

  private readonly savePreferencesButtonId = 'ccc-dismiss-button';

  private readonly footerCookieButtonTestId = 'cookie-button';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS

  cookieBannerComponent(): Locator {
    return this.page.locator(`id=${this.cookieBannerId}`);
  }

  acceptButton(): Locator {
    return this.page.locator(`id=${this.acceptButtonId}`);
  }

  rejectButton(): Locator {
    return this.page.locator(`id=${this.rejectButtonId}`);
  }

  setPreferencesButton(): Locator {
    return this.page.locator(`.${this.setPreferencesLinkClass}`);
  }

  preferencesModule(): Locator {
    return this.page.locator(`id=${this.preferencesModuleId}`);
  }

  preferencesAcceptButton(): Locator {
    return this.page.locator(`id=${this.preferencesAcceptButtonId}`);
  }

  preferencesRejectButton(): Locator {
    return this.page.locator(`id=${this.preferencesRejectButtonId}`);
  }

  optionalCategories(): Locator {
    return this.page.locator(`id=${this.optionalCategoriesId}`);
  }

  savePreferencesButton(): Locator {
    return this.page.locator(`id=${this.savePreferencesButtonId}`);
  }

  optionalCookieToggle(cookieType: CookieType): Locator {
    return this.page
      .locator(`.${this.optionalCookieContainerClass}`, { hasText: cookieType })
      .locator(`.${this.checkboxToggleClass}`);
  }

  optionalCookieInput(cookieName: CookieType): Locator {
    return this.page
      .locator(`.${this.optionalCookieContainerClass}`, { hasText: cookieName })
      .locator(`.${this.checkboxToggleInputClass}`);
  }

  footerCookieButton(): Locator {
    return this.page.getByTestId(this.footerCookieButtonTestId);
  }
  //ACTIONS
  /**
   * Clicks the primary "Accept" button on the main cookie banner.
   * @returns A promise that resolves when the click action completes.
   */
  async clickAcceptButton(): Promise<void> {
    await this.acceptButton().click();
  }

  /**
   * Clicks the primary "Reject" button on the main cookie banner.
   * @returns A promise that resolves when the click action completes.
   */
  async clickRejectButton(): Promise<void> {
    await this.rejectButton().click();
  }

  /**
   * Clicks the button to open the cookie preference settings modal/panel.
   * @returns A promise that resolves when the click action completes.
   */
  async clickSetPreferencesButton(): Promise<void> {
    await this.setPreferencesButton().click();
  }

  /**
   * Clicks the "Accept" button inside the cookie preferences panel.
   * @returns A promise that resolves when the click action completes.
   */
  async clickPreferencesAcceptButton(): Promise<void> {
    await this.preferencesAcceptButton().click();
  }

  /**
   * Clicks the "Reject" button inside the cookie preferences panel.
   * @returns A promise that resolves when the click action completes.
   */
  async clickPreferencesRejectButton(): Promise<void> {
    await this.preferencesRejectButton().click();
  }

  /**
   * Clicks the toggle switch for a specific optional cookie category.
   * @param cookieName - The category of the optional cookie toggle to click.
   * @returns A promise that resolves when the click action completes.
   */
  async clickOptionalCookieToggle(cookieName: CookieType): Promise<void> {
    await this.optionalCookieToggle(cookieName).click();
  }

  /**
   * Checks (enables) the toggle switch for a specific optional cookie category.
   * @param cookieType - The category of the optional cookie toggle to check.
   * @returns A promise that resolves when the check action completes.
   */
  async checkOptionalCookieToggle(cookieType: CookieType): Promise<void> {
    await this.optionalCookieToggle(cookieType).check();
  }

  /**
   * Unchecks (disables) the toggle switch for a specific optional cookie category.
   * @param cookieType - The category of the optional cookie toggle to uncheck.
   * @returns A promise that resolves when the uncheck action completes.
   */
  async uncheckOptionalCookieToggle(cookieType: CookieType): Promise<void> {
    await this.optionalCookieToggle(cookieType).uncheck();
  }

  /**
   * Clicks the "Save Preferences" button inside the cookie preferences panel.
   * @returns A promise that resolves when the click action completes.
   */
  async clickSavePreferencesButton(): Promise<void> {
    await this.savePreferencesButton().click();
  }

  /**
   * Clicks the link/button in the footer designed to reopen the cookie banner or preferences.
   * @returns A promise that resolves when the click action completes.
   */
  async clickFooterCookieButton(): Promise<void> {
    await this.footerCookieButton().click();
  }

  /**
   * Helper to fetch and parse the raw consent cookie object.
   * @returns A promise that resolves to the parsed cookie data object, or null if the cookie is not found.
   */
  async getConsentCookieData(): Promise<ConsentCookieData | null> {
    const cookies = await this.page.context().cookies();
    const consentCookie = cookies.find((c) => c.name === 'CookieControl');

    if (!consentCookie) {
      return null;
    }

    const decodedValue = decodeURIComponent(consentCookie.value);
    return JSON.parse(decodedValue);
  }

  /**
   * Returns 'accepted' or 'revoked' for a given optional cookie type.
   * @param cookieType - The category of the optional cookie to check ('analytics' | 'marketing').
   * @returns A promise that resolves to the current status of the cookie, or 'unknown' if not set.
   */
  async getOptionalCookieStatus(
    cookieType: 'analytics' | 'marketing',
  ): Promise<CookieStatus> {
    const cookieData = await this.getConsentCookieData();

    const status = cookieData?.optionalCookies?.[cookieType];

    return status ?? 'unknown';
  }
}
