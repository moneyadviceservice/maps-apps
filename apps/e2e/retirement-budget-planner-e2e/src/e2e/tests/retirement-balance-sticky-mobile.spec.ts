import { expect, type Locator, type Page, test } from '@playwright/test';

import { otherToolsToTry } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

const MOBILE_VIEWPORT = { width: 375, height: 667 };
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const POSITION_TOLERANCE_PX = 2;
// The bar can only pin once the form (its container) has scrolled into view below the page header
const SCROLL_PAST_HEADER_PX = 400;

const stickyBalance = (page: Page) => page.getByTestId('summary-balance-bar');

const summaryRow = (page: Page, valueTestId: string): Locator =>
  page.getByTestId(valueTestId).locator('xpath=ancestor::div[1]');

const inPageBalanceRow = (page: Page) =>
  summaryRow(page, 't-summary-value-balance');

const inPageCostsRow = (page: Page) =>
  summaryRow(page, 't-summary-value-retirement-costs');

const boxOf = async (locator: Locator) => {
  const box = await locator.boundingBox();

  if (!box) throw new Error('Expected element to have a bounding box');

  return box;
};

// A long form pushes the summary box below the fold, as with many fields or a partner added
const expandAllSections = async (page: Page) => {
  await page
    .locator('details[data-testid="expandable-section"]')
    .evaluateAll((sections) =>
      sections.forEach(
        (section) => ((section as HTMLDetailsElement).open = true),
      ),
    );
};

const scrollToPageBottom = async (page: Page) => {
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
};

const expectPinnedToBottomOfScreen = async (page: Page) => {
  const { height } = page.viewportSize() ?? MOBILE_VIEWPORT;

  await expect
    .poll(async () => {
      const { y, height: barHeight } = await boxOf(stickyBalance(page));

      return Math.abs(y + barHeight - height);
    })
    .toBeLessThanOrEqual(POSITION_TOLERANCE_PX);
};

const expectLockedOverInPageBalance = async (page: Page) => {
  // Largest offset between the bar and the in-page balance row (position and size)
  await expect
    .poll(async () => {
      const bar = await boxOf(stickyBalance(page));
      const row = await boxOf(inPageBalanceRow(page));

      return Math.max(
        Math.abs(bar.y - row.y),
        Math.abs(bar.height - row.height),
        Math.abs(bar.x - row.x),
        Math.abs(bar.width - row.width),
      );
    })
    .toBeLessThanOrEqual(POSITION_TOLERANCE_PX);

  const bar = await boxOf(stickyBalance(page));
  const costs = await boxOf(inPageCostsRow(page));

  // Sits below the "Retirement costs" line of the summary box
  expect(bar.y).toBeGreaterThanOrEqual(
    costs.y + costs.height - POSITION_TOLERANCE_PX,
  );
};

const verifyStickyBalanceBehaviour = async (page: Page) => {
  const bar = stickyBalance(page);

  await expandAllSections(page);

  await test.step('Balance is visible and pinned to the bottom while the summary box is off screen', async () => {
    await page.evaluate(
      (offset) => window.scrollTo(0, offset),
      SCROLL_PAST_HEADER_PX,
    );

    await expect(bar).toBeVisible();
    await expect(bar).toContainText('Balance');
    await expect(bar).toContainText('£');
    await expectPinnedToBottomOfScreen(page);
  });

  await test.step('Balance stays in the same fixed position while scrolling down', async () => {
    const before = await boxOf(bar);

    await page.evaluate(() => window.scrollBy(0, 300));
    await expectPinnedToBottomOfScreen(page);

    const after = await boxOf(bar);

    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(
      POSITION_TOLERANCE_PX,
    );
  });

  await test.step('Balance locks in place below the "Retirement costs" line at the bottom of the page', async () => {
    await scrollToPageBottom(page);
    await expectLockedOverInPageBalance(page);

    const inPageValue = (
      await page.getByTestId('t-summary-value-balance').textContent()
    )?.trim();

    expect(inPageValue).toBeTruthy();
    await expect(bar).toContainText(inPageValue as string);
  });

  await test.step('Balance becomes pinned again when scrolling back up', async () => {
    await page.evaluate(
      (offset) => window.scrollTo(0, offset),
      SCROLL_PAST_HEADER_PX,
    );
    await expectPinnedToBottomOfScreen(page);
  });
};

/**
 * @test Retirement income (mobile): balance is fixed at the bottom of the screen and locks below the "Retirement costs" line
 * @test Retirement costs (mobile): balance is fixed at the bottom of the screen and locks below the "Retirement costs" line
 */
test.describe('Retirement Budget Planner - Sticky balance (mobile)', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test('Retirement income page: balance is fixed at the bottom while scrolling and locks below the retirement costs line', async ({
    page,
  }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);

    await verifyStickyBalanceBehaviour(page);
  });

  test('Retirement costs page: balance is fixed at the bottom while scrolling and locks below the retirement costs line', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = otherToolsToTry.aboutYou;
    const { pensionValue } = otherToolsToTry.income;

    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.waitForRetirementCostsIntroText(page);

    await verifyStickyBalanceBehaviour(page);
  });
});

test.describe('Retirement Budget Planner - Sticky balance (desktop)', () => {
  test.use({ viewport: DESKTOP_VIEWPORT });

  test('Retirement income page: the mobile-only balance bar is not shown', async ({
    page,
  }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);

    await expect(stickyBalance(page)).toBeHidden();
    await expect(page.getByTestId('t-summary-value-balance')).toBeVisible();
  });
});
