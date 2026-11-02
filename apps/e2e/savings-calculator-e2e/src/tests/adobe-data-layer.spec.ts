import { adobeDataLayerEvents } from '@data/analytics.data';
import { expect, test } from '@lib/test.lib';

import { Language } from '../types/analytics';

const languages: Language[] = ['en', 'cy'];
const savingsYear = (new Date().getFullYear() + 1).toString();

for (const language of languages) {
  test.describe(`Savings Calculator`, () => {
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    /**
     * @tests 59170 - DataLayer - pageLoadReact
     * @tests 59175 - DataLayer - toolStart
     * @tests 59179 - DataLayer - toolCompletion
     * @tests 59180 - DataLayer - errorMessage
     */
    test(`DataLayer - pageLoadReact - ${language}`, async ({
      page,
      calculatorType,
      calculatorInput,
    }) => {
      await page.goto(`/${language}/`);
      await calculatorType.howLong.click();
      await calculatorInput.inputHowLong({
        savingsGoal: '5000',
        howLongAmount: '300',
        alreadySaved: '10001',
        interestRate: '5.5',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.pageLoadReactOne({ language }),
      );

      await calculatorInput.inputHowLong({
        savingsGoal: '25000',
        howLongAmount: '2000',
        alreadySaved: '1000',
        interestRate: '6.25',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.pageLoadReactTwo({ language }),
      );

      await page.goto(`/${language}/`);

      await calculatorType.howMuch.click();
      await calculatorInput.inputHowMuch({
        savingsGoal: '10000',
        howMuchMonth: '7',
        howMuchYear: savingsYear,
        interestRate: '5.5',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.pageLoadReactThree({ language }),
      );

      await calculatorInput.inputHowMuch({
        savingsGoal: '25000',
        howMuchMonth: '7',
        howMuchYear: savingsYear,
        interestRate: '6.25',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.pageLoadReactFour({ language }),
      );
    });

    test(`DataLayer - toolStart - ${language}`, async ({
      page,
      calculatorType,
      calculatorInput,
    }) => {
      await page.goto(`/${language}/`);
      await calculatorType.howLong.click();
      await calculatorInput.inputHowLong({
        savingsGoal: '5000',
      });
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.toolStartOne({ language }),
      );

      await page.goto(`/${language}/`);
      await calculatorType.howMuch.click();
      await calculatorInput.inputHowMuch({
        savingsGoal: '10000',
      });
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.toolStartTwo({ language }),
      );
    });

    test(`DataLayer - toolCompletion - ${language}`, async ({
      page,
      calculatorType,
      calculatorInput,
    }) => {
      await page.goto(`/${language}/`);
      await calculatorType.howLong.click();
      await calculatorInput.inputHowLong({
        savingsGoal: '5000',
        howLongAmount: '400',
        alreadySaved: '10001',
        interestRate: '4.5',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.toolCompletionOne({ language }),
      );

      await page.goto(`/${language}/`);
      await calculatorType.howMuch.click();

      await calculatorInput.inputHowMuch({
        savingsGoal: '25000',
        howMuchMonth: '7',
        howMuchYear: savingsYear,
        interestRate: '6.25',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.toolCompletionTwo({ language }),
      );
    });

    test(`DataLayer - errorMessage - ${language}`, async ({
      page,
      calculatorType,
      calculatorInput,
    }) => {
      await page.goto(`/${language}/`);
      await calculatorType.howLong.click();
      await calculatorInput.inputHowLong({
        savingsGoal: '5000',
        alreadySaved: '10001',
        interestRate: '7.5',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.errorMessageOne({ language }),
      );

      await page.goto(`/${language}/`);
      await calculatorType.howMuch.click();

      await calculatorInput.inputHowMuch({
        howMuchMonth: '7',
        interestRate: '6.25',
      });
      await calculatorInput.calculate.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.errorMessageTwo({ language }),
      );
    });
  });
}
