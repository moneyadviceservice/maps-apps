import { expect, test } from '@maps/playwright';

test.describe('Beta banner', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToStartPage();
  });

  test('should render and contain a link that opens in a new tab', async ({
    betaBanner,
  }) => {
    await expect(betaBanner.banner).toBeVisible();
    await expect(betaBanner.link).toHaveAttribute('target', '_blank');
  });
});
