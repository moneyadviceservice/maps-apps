/**
 * Homepage: AEM content, cookie banner, and teaser accessibility.
 */
import { expect, test } from '@lib/test.fixture';

test.describe('Homepage (live AEM)', () => {
  test('renders homepage content from AEM', async ({ homepagePage }) => {
    await homepagePage.expectCoreContentFromAem();
  });

  test('teaser cards expose accessible title links and descriptions', async ({
    homepagePage,
  }) => {
    await homepagePage.expectAllTeaserCardsAccessible();
  });

  test('teaser card title link receives focus', async ({ homepagePage }) => {
    await homepagePage.expectTeaserCardsVisible();

    const link = await homepagePage.focusFirstTeaserLink();
    const card = homepagePage.teaserCards().first();

    await expect(link).toBeFocused();
    await expect(card).not.toBeFocused();
  });

  test('external teaser links announce when they open in a new window', async ({
    homepagePage,
  }) => {
    await homepagePage.expectTeaserCardsVisible();
    await homepagePage.expectExternalLinksAnnounceNewWindow();
    await homepagePage.expectInternalLinksDoNotAnnounceNewWindow();
  });
});
