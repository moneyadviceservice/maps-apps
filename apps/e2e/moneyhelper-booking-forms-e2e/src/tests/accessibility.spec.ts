import { StepName } from '@app/lib/constants';
import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@mhbf-e2e/lib/test.lib';
import { PensionWiseNotEligiblePage } from '@mhbf-e2e/pages/NotEligible';

const wcag22AATags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function getAccessibilityViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(wcag22AATags)
    .exclude('iframe')
    .analyze();
  return violations;
}

test.describe('Accessibility', () => {
  test('guidance page has no WCAG 2.2 AA violations', async ({
    page,
    definedContributionPage,
  }) => {
    await definedContributionPage.gotoHome();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('defined contribution page has no WCAG 2.2 AA violations', async ({
    page,
    definedContributionPage,
  }) => {
    await definedContributionPage.goToEligibilityDefinedContribution();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('over 50 page has no WCAG 2.2 AA violations', async ({
    page,
    over50Page,
  }) => {
    await over50Page.goToEligibilityOver50();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('age exceptions page has no WCAG 2.2 AA violations', async ({
    page,
    ageExceptionsPage,
  }) => {
    await ageExceptionsPage.goToEligibilityAgeExceptions();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('UK pensions page has no WCAG 2.2 AA violations', async ({
    page,
    ukPensionsPage,
  }) => {
    await ukPensionsPage.goToUKPension();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('access support page has no WCAG 2.2 AA violations', async ({
    page,
    ukPensionsPage,
  }) => {
    await ukPensionsPage.goToUKPension();
    await ukPensionsPage.selectAnswerAndContinue('Yes');
    await expect(page).toHaveURL(`/en/${StepName.ACCESS_SUPPORT}`);
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('pension safeguarding landing page has no WCAG 2.2 AA violations', async ({
    page,
    safeguardingLandingPage,
  }) => {
    await safeguardingLandingPage.goTo();
    await expect(safeguardingLandingPage.heading).toBeVisible();
    await expect(page).toHaveURL(
      `/en/${StepName.PENSION_SAFEGUARDING_APPOINTMENT}`,
    );
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('pension provider page has no WCAG 2.2 AA violations', async ({
    page,
    pensionProviderPage,
  }) => {
    await pensionProviderPage.goToProviderStep();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('not eligible page has no WCAG 2.2 AA violations', async ({ page }) => {
    const notEligiblePage = new PensionWiseNotEligiblePage(page);
    await notEligiblePage.goToPensionWiseNotEligible(
      StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
    );
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('error page has no WCAG 2.2 AA violations', async ({ page }) => {
    await page.goto(`/en/${StepName.ERROR}`);
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });
});
