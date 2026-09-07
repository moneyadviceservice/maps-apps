import { expect, type Locator, type Page } from '../lib/test.lib';

export class HeaderFooterComponent {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // =========================================================================
  // HEADER ELEMENTS
  // =========================================================================

  getHeader(): Locator {
    return this.page.locator('header');
  }

  getMoneyAndPensionsLogo(): Locator {
    return this.page.locator('header a img').first();
  }

  getNavLink(linkName: string): Locator {
    return this.page.locator(`header a:has-text("${linkName}")`);
  }

  getAllNavLinks(): Promise<string[]> {
    return this.page
      .getByRole('button', {
        name: /(About us|Our work|Work with us|Media Centre|Tools and research)/i,
      })
      .allTextContents();
  }

  getSearchInput(): Locator {
    return this.page.locator('header input#q').nth(1);
  }

  getLanguageToggle(): Locator {
    return this.page
      .locator('header a:has-text("Cymraeg"), header a:has-text("English")')
      .first();
  }

  async getLanguageToggleText(): Promise<string | null> {
    return this.getLanguageToggle().textContent();
  }

  // =========================================================================
  // HEADER ASSERTIONS
  // =========================================================================

  async assertLogoVisible(): Promise<void> {
    const logoCount = await this.getMoneyAndPensionsLogo().count();
    expect(logoCount).toBeGreaterThan(0);
  }

  async assertNavigationMenuVisible(): Promise<void> {
    await expect(this.page.locator('header nav').nth(1)).toBeVisible();
  }

  async assertSearchVisible(): Promise<void> {
    await expect(this.getSearchInput()).toBeVisible();
  }

  async assertLanguageToggleVisible(): Promise<void> {
    const toggleCount = await this.getLanguageToggle().count();
    expect(toggleCount).toBeGreaterThan(0);
  }

  // =========================================================================
  // FOOTER ELEMENTS
  // =========================================================================

  getFooter(): Locator {
    return this.page.locator('footer');
  }

  getLegalLink(linkName: string): Locator {
    // Match footer context and search for the link
    return this.page.locator(`footer a:has-text("${linkName}")`);
  }

  getOurServicesLink(linkName: string): Locator {
    return this.page.locator(`footer a:has-text("${linkName}")`);
  }

  getContactLink(linkName: string): Locator {
    return this.page.locator(`footer a:has-text("${linkName}")`);
  }

  getCopyrightText(): Promise<string | null> {
    return this.page.locator('footer').textContent();
  }

  // =========================================================================
  // FOOTER ASSERTIONS
  // =========================================================================

  async assertFooterVisible(): Promise<void> {
    await expect(this.getFooter()).toBeVisible();
  }

  async assertFooterAtBottom(): Promise<void> {
    const footerBox = await this.getFooter().boundingBox();
    expect(footerBox).toBeTruthy();
  }

  async scrollFooterIntoView(): Promise<void> {
    await this.getFooter().scrollIntoViewIfNeeded();
  }

  async assertLegalSectionVisible(): Promise<void> {
    await expect(this.getLegalLink('Terms and conditions')).toBeVisible();
  }

  async assertOurServicesSectionVisible(): Promise<void> {
    await expect(this.getOurServicesLink('MoneyHelper')).toBeVisible();
  }

  async assertStayInTouchSectionVisible(): Promise<void> {
    await expect(this.getContactLink('Contact us')).toBeVisible();
  }

  async assertAllFooterSectionsVisible(): Promise<void> {
    await this.assertLegalSectionVisible();
    await this.assertOurServicesSectionVisible();
    await this.assertStayInTouchSectionVisible();
  }

  async assertCopyrightVisible(): Promise<void> {
    const copyrightText = await this.getCopyrightText();
    expect(copyrightText).toContain('Copyright');
    expect(copyrightText).toContain('Money & Pensions Service');
  }
}
