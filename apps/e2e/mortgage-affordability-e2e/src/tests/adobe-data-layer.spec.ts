import { adobeDataLayerEvents } from 'src/data/adobeDataLayer.data';
import { AnnualIncomeComponent } from 'src/pages/components/annual-income.component';
import { MonthlyCostsComponent } from 'src/pages/components/monthly-costs.component';
import { expect, test } from '@lib/test.lib';

import { Language } from '../types/analytics';

const languages: Language[] = ['en', 'cy'];

async function plrIncomeInput(annualIncomeComponent: AnnualIncomeComponent) {
  await annualIncomeComponent.incomeInput.fill('35000');
  await annualIncomeComponent.takeHomeInput.fill('2400');
  await annualIncomeComponent.otherIncomeInput.fill('1200');
  await (await annualIncomeComponent.secondApplicantRadioButton('yes')).click();
  await annualIncomeComponent.secondApplicantIncomeInput.fill('14000');
  await annualIncomeComponent.secondApplicantTakeHomeInput.fill('1000');
  await annualIncomeComponent.secondApplicantOtherIncomeInput.fill('600');
  await annualIncomeComponent.continueButton.click();
}

async function toolCompletionMonthlyInput(
  monthlyCostsComponent: MonthlyCostsComponent,
) {
  await monthlyCostsComponent.rentMortgageInput.fill('650.00');
  await monthlyCostsComponent.creditCardInput.fill('45.00');
  await monthlyCostsComponent.childAndSpouseInput.fill('12.00');
  await monthlyCostsComponent.childcareInput.fill('22.00');
  await monthlyCostsComponent.travelInput.fill('15.00');
  await monthlyCostsComponent.billsInsuranceInput.fill('35.00');
  await monthlyCostsComponent.foodInput.fill('41.00');
  await monthlyCostsComponent.entertainmentInput.fill('28.00');
  await monthlyCostsComponent.holidaysInput.fill('25.00');
  await monthlyCostsComponent.continueButton.click();
}

async function errorMessageFourValidation(
  annualIncomeComponent: AnnualIncomeComponent,
) {
  await annualIncomeComponent.incomeInput.fill('30000.00');
  await annualIncomeComponent.secondApplicantIncomeInput.fill('14000.00');
  await annualIncomeComponent.secondApplicantTakeHomeInput.clear();
  await annualIncomeComponent.continueButton.click();
}

for (const language of languages) {
  test.describe(`Mortgage Affordability`, () => {
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    /**
     * @tests 57500 - Page Load React
     * @tests 57505 - Tool Start
     * @tests 57506 - Tool Completion
     * @tests 57508 - Error Message
     */
    test(`Page Load React - ${language}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
    }) => {
      await page.goto(`/${language}/annual-income`);
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.pageLoadReactOne({ language }),
      );

      await plrIncomeInput(annualIncomeComponent);
      await monthlyCostsComponent.creditCardInput.fill('45');
      await monthlyCostsComponent.childAndSpouseInput.fill('12');
      await monthlyCostsComponent.childcareInput.fill('22');
      await monthlyCostsComponent.travelInput.fill('15');
      await monthlyCostsComponent.billsInsuranceInput.fill('35');
      await monthlyCostsComponent.rentMortgageInput.fill('650');
      await monthlyCostsComponent.entertainmentInput.fill('28');
      await monthlyCostsComponent.holidaysInput.fill('25');
      await monthlyCostsComponent.foodInput.fill('41');

      await monthlyCostsComponent.continueButton.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.pageLoadReactTwo({ language }),
      );
    });

    test(`Tool Start - ${language}`, async ({
      page,
      annualIncomeComponent,
    }) => {
      const expectedEvent = adobeDataLayerEvents.toolStart({ language });
      await page.goto(`/${language}/annual-income`);
      await annualIncomeComponent.incomeInput.fill('200');
      await expect(page).toHavePartialDataLayerEvent(expectedEvent);
    });

    test(`Tool Completion Scenario One - ${language}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
    }) => {
      const expectedEvent = adobeDataLayerEvents.toolCompletionOne({
        language,
      });
      await page.goto(`/${language}/annual-income`);

      await annualIncomeComponent.incomeInput.fill('35000.00');
      await annualIncomeComponent.takeHomeInput.fill('2400.00');
      await annualIncomeComponent.continueButton.click();

      await monthlyCostsComponent.rentMortgageInput.fill('600.00');
      await monthlyCostsComponent.creditCardInput.fill('25.00');
      await monthlyCostsComponent.childAndSpouseInput.fill('22.00');
      await monthlyCostsComponent.childcareInput.fill('11.00');
      await monthlyCostsComponent.travelInput.fill('15.00');

      await monthlyCostsComponent.billsInsuranceInput.fill('35.00');
      await monthlyCostsComponent.foodInput.fill('41.00');

      await monthlyCostsComponent.entertainmentInput.fill('28.00');
      await monthlyCostsComponent.holidaysInput.fill('25.00');
      await monthlyCostsComponent.continueButton.click();

      await expect(page).toHavePartialDataLayerEvent(expectedEvent);
    });

    test(`Tool Completion Scenario Two - ${language}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
    }) => {
      const expectedEvent = adobeDataLayerEvents.toolCompletionTwo({
        language,
      });
      await page.goto(`/${language}/annual-income`);
      await annualIncomeComponent.incomeInput.fill('36000.00');
      await annualIncomeComponent.takeHomeInput.fill('2300.00');
      await annualIncomeComponent.otherIncomeInput.fill('1100.00');
      await (
        await annualIncomeComponent.secondApplicantRadioButton('yes')
      ).click();
      await annualIncomeComponent.secondApplicantIncomeInput.fill('14000.00');
      await annualIncomeComponent.secondApplicantTakeHomeInput.fill('1000.00');
      await annualIncomeComponent.secondApplicantOtherIncomeInput.fill(
        '600.00',
      );
      await annualIncomeComponent.continueButton.click();

      await toolCompletionMonthlyInput(monthlyCostsComponent);
      await expect(page).toHavePartialDataLayerEvent(expectedEvent);
    });

    test(`ErrorMessage - ${language}`, async ({
      page,
      annualIncomeComponent,
    }) => {
      await page.goto(`/${language}/annual-income`);

      await annualIncomeComponent.incomeInput.fill('30000.00');
      await annualIncomeComponent.continueButton.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.errorMessageOne({ language }),
      );

      await annualIncomeComponent.incomeInput.clear();
      await annualIncomeComponent.takeHomeInput.fill('1000.00');
      await annualIncomeComponent.continueButton.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.errorMessageTwo({ language }),
      );

      await annualIncomeComponent.incomeInput.fill('30000.00');
      await (
        await annualIncomeComponent.secondApplicantRadioButton('yes')
      ).click();
      await annualIncomeComponent.secondApplicantTakeHomeInput.fill('1000.00');
      await annualIncomeComponent.continueButton.click();
      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.errorMessageThree({ language }),
      );

      await errorMessageFourValidation(annualIncomeComponent);

      await expect(page).toHavePartialDataLayerEvent(
        adobeDataLayerEvents.errorMessageFour({ language }),
      );
    });
  });
}
