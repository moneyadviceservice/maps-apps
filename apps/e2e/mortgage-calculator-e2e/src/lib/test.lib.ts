import { BasePage } from '@pages/Base.page';
import { CalculatorInput } from '@pages/components/calculator-input.component';
import { ErrorComponent } from '@pages/components/error.component';
import { ResultsComponent } from '@pages/components/results.component';
import { TeaserCards } from '@pages/components/teaser-cards.component';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  basePage: BasePage;
  calculatorInput: CalculatorInput;
  resultsComponent: ResultsComponent;
  errorComponent: ErrorComponent;
  teaserCards: TeaserCards;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  calculatorInput: async ({ page }, provideFixture) => {
    await provideFixture(new CalculatorInput(page));
  },
  resultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ResultsComponent(page));
  },
  errorComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ErrorComponent(page));
  },
  teaserCards: async ({ page }, provideFixture) => {
    await provideFixture(new TeaserCards(page));
  },
});
