import { BasePage } from '@pages/Base.page';
import { CalculatorInput } from '@pages/components/calculator-input.component';
import { CalculatorType } from '@pages/components/calculator-type.component';
import { ErrorComponent } from '@pages/components/error.component';
import { NextSteps } from '@pages/components/next-steps.component';
import { Results } from '@pages/components/results.component';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  basePage: BasePage;
  calculatorType: CalculatorType;
  calculatorInput: CalculatorInput;
  results: Results;
  nextSteps: NextSteps;
  error: ErrorComponent;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  calculatorType: async ({ page }, provideFixture) => {
    await provideFixture(new CalculatorType(page));
  },
  results: async ({ page }, provideFixture) => {
    await provideFixture(new Results(page));
  },
  calculatorInput: async ({ page }, provideFixture) => {
    await provideFixture(new CalculatorInput(page));
  },
  nextSteps: async ({ page }, provideFixture) => {
    await provideFixture(new NextSteps(page));
  },
  error: async ({ page }, provideFixture) => {
    await provideFixture(new ErrorComponent(page));
  },
});
