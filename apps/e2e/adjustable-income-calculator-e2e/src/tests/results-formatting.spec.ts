import { expect, test } from '@lib/test.lib';

const resultsFormattingScenarios = [
  {
    language: 'English',
    path: '/en/adjustable-income-calculator',
    firstSentence: 'lower tax-free lump sum than we’ve estimated',
    allowanceLinkName: 'lump sum allowance (LSA)',
    adviserLinkName: 'regulated financial adviser',
    allowanceUrl:
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
    adviserUrl:
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser',
  },
  {
    language: 'Welsh',
    path: '/cy/adjustable-income-calculator',
    firstSentence: 'cyfandaliad di-dreth is nag yr ydym wedi’i amcangyfrif',
    allowanceLinkName: 'lwfans cyfandaliad (LSA)',
    adviserLinkName: 'ymgynghorydd ariannol rheoleiddiedig',
    allowanceUrl:
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
    adviserUrl:
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser',
  },
] as const;

test.describe('Adjustable income results formatting - US-59101', () => {
  for (const scenario of resultsFormattingScenarios) {
    test(`keeps allowance and adviser guidance together in ${scenario.language}`, async ({
      adjustableIncomePage,
      setCookieControl,
    }) => {
      await setCookieControl();
      await adjustableIncomePage.goto(scenario.path);
      await adjustableIncomePage.potInput.fill('250000');
      await adjustableIncomePage.ageInput.fill('55');
      await adjustableIncomePage.submitButton.click();

      await expect(adjustableIncomePage.resultsSection).toBeVisible();

      const allowanceNote = adjustableIncomePage.allowanceNote;
      await expect(allowanceNote).toHaveCount(1);
      await expect(allowanceNote).toContainText(scenario.firstSentence);
      await expect(allowanceNote).toContainText('£268,275');
      await expect(adjustableIncomePage.allowanceLink).toContainText(
        scenario.allowanceLinkName,
      );
      await expect(adjustableIncomePage.allowanceLink).toHaveAttribute(
        'href',
        scenario.allowanceUrl,
      );
      await expect(adjustableIncomePage.adviserLink).toContainText(
        scenario.adviserLinkName,
      );
      await expect(adjustableIncomePage.adviserLink).toHaveAttribute(
        'href',
        scenario.adviserUrl,
      );
    });
  }
});
