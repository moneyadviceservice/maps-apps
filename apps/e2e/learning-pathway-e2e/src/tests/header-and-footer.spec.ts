import { expect, test } from '../lib/test.lib';
import { HeaderFooterComponent } from '../pages/header-and-footer.component';
import LandingPage from '../pages/landing.page';
import { LearningHubStartPage } from '../pages/start.page';

/**
 * @tests User story - 51831
 * @test 55727 : 51831 AC2 AC3 TEST CASE 1: Header and footer components are visible and correct on the Learning Hub Pathway page
 */
test.describe('Header and Footer (TC 55727)', () => {
  let headerFooter: HeaderFooterComponent;
  let lhStartPage: LearningHubStartPage;
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    lhStartPage = new LearningHubStartPage(page);
    headerFooter = new HeaderFooterComponent(page);
    landingPage = new LandingPage(page);

    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();
  });

  test('Header: Logo, navigation, search, and language toggle visible', async () => {
    await headerFooter.assertLogoVisible();
    await headerFooter.assertNavigationMenuVisible();
    await headerFooter.assertSearchVisible();
    await headerFooter.assertLanguageToggleVisible();

    // Verify key navigation links from test case
    const navLinks = await headerFooter.getAllNavLinks();
    const navText = navLinks.join(' ');
    const expectedLinks = [
      'About us',
      'Our work',
      'Work with us',
      'Media Centre',
      'Tools and research',
    ];
    for (const link of expectedLinks) {
      expect(navText).toContain(link);
    }
  });

  test('Footer: All sections and links visible', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await headerFooter.assertFooterVisible();

    // Verify Legal section
    await expect(
      headerFooter.getLegalLink('Terms and conditions'),
    ).toBeVisible();
    await expect(headerFooter.getLegalLink('Privacy notice')).toBeVisible();
    await expect(headerFooter.getLegalLink('Cookie policy')).toBeVisible();
    await expect(
      headerFooter.getLegalLink('Money and Pensions Service standards'),
    ).toBeVisible();

    // Verify Our Services section
    await expect(headerFooter.getOurServicesLink('MoneyHelper')).toBeVisible();
    await expect(
      headerFooter.getOurServicesLink(
        'Financial Capability Strategy for the UK',
      ),
    ).toBeVisible();

    // Verify Stay In Touch section
    await expect(headerFooter.getContactLink('Contact us')).toBeVisible();
    await expect(
      headerFooter.getContactLink('Sign up to newsletter'),
    ).toBeVisible();
    await expect(headerFooter.getContactLink('X')).toBeVisible();
    await expect(headerFooter.getContactLink('LinkedIn')).toBeVisible();
    await expect(headerFooter.getContactLink('YouTube')).toBeVisible();

    // Verify copyright
    await headerFooter.assertCopyrightVisible();
  });

  test('Mobile (375px): Header and footer render correctly', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 844 });
    await page.reload({ waitUntil: 'load' });

    // Header should be visible on mobile
    await headerFooter.assertLogoVisible();
    await headerFooter.assertLanguageToggleVisible();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Footer should be visible and complete
    await headerFooter.assertFooterVisible();
    await expect(headerFooter.getLegalLink('Privacy notice')).toBeVisible();
    await expect(headerFooter.getContactLink('Contact us')).toBeVisible();
  });

  test('Directory page: Header and footer consistent with landing page', async ({
    page,
  }) => {
    await lhStartPage.clickLearningPathwayHub();
    await headerFooter.assertLogoVisible();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify footer sections present
    await headerFooter.assertAllFooterSectionsVisible();
    await expect(
      headerFooter.getLegalLink('Terms and conditions'),
    ).toBeVisible();
    await expect(headerFooter.getOurServicesLink('MoneyHelper')).toBeVisible();
    await expect(headerFooter.getContactLink('LinkedIn')).toBeVisible();
    await headerFooter.assertCopyrightVisible();
  });
});
