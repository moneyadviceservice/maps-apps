import { updatePage as updatePageData } from 'src/data/updatePage.data';

import { expect, test } from '../lib/test.lib';

/**
 * @story 54588 - Learning Hub Pathway: Create Update Page in React
 */
test.describe('update page', () => {
  test.beforeEach(async ({ updatePage }) => {
    await updatePage.navigateToPage(updatePageData.sidebarLink);
  });

  /**
   * @test 55366 - 54588 AC1 TEST CASE 1: Learning pathway Update page
   */
  test('loads all sub headings', async ({ updatePage }) => {
    await expect(updatePage.currentGuidanceHeading).toHaveText(
      updatePageData.currentGuidance,
    );
    await expect(
      updatePage.subHeading(updatePageData.updates2026, 3),
    ).toHaveText(updatePageData.updates2026);

    await expect(
      updatePage.subHeading(updatePageData.updates2025, 3),
    ).toHaveText(updatePageData.updates2025);

    await expect(
      updatePage.subHeading(updatePageData.olderUpdates, 3),
    ).toHaveText(updatePageData.olderUpdates);

    await expect(
      updatePage.subHeading(updatePageData.updates2024, 4),
    ).toHaveText(updatePageData.updates2024);

    await expect(
      updatePage.subHeading(updatePageData.updates2023, 4),
    ).toHaveText(updatePageData.updates2023);

    await expect(
      updatePage.subHeading(updatePageData.updates2022, 4),
    ).toHaveText(updatePageData.updates2022);
  });

  /**
   * @test 55386 - 54588 AC2 TEST CASE 2: Update page links working and downloads
   */
  test('downloads the most recent update PDF', async ({ page, updatePage }) => {
    await expect(updatePage.mostRecentUpdateLink).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await updatePage.mostRecentUpdateLink.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });
});
