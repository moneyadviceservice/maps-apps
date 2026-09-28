import { BasePage } from '@pages/Base.page';
import { AnswersComponent } from '@pages/components/answers.component';
import { DateOfBirthComponent } from '@pages/components/date-of-birth.component';
import { EmployerDateComponent } from '@pages/components/employer-date.component';
import { ErrorComponent } from '@pages/components/error.component';
import { IncomeComponent } from '@pages/components/income.component';
import { LocationComponent } from '@pages/components/location.component';
import { RedundancyAmountComponent } from '@pages/components/redundancy-amount.component';
import { RedundancyOptionComponent } from '@pages/components/redundancy-option.component';
import { RedundantComponent } from '@pages/components/redundant-date.component';
import { ResultsComponent } from '@pages/components/results.component';
import { test as base } from '@playwright/test';

export * from '@playwright/test';

interface CustomFixtures {
  basePage: BasePage;
  locationComponent: LocationComponent;
  dateOfBirthComponent: DateOfBirthComponent;
  redundantComponent: RedundantComponent;
  employerDateComponent: EmployerDateComponent;
  incomeComponent: IncomeComponent;
  redundancyOptionComponent: RedundancyOptionComponent;
  redundancyAmountComponent: RedundancyAmountComponent;
  answersComponent: AnswersComponent;
  resultsComponent: ResultsComponent;
  errorComponent: ErrorComponent;
  setCookieControl: () => Promise<void>;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  locationComponent: async ({ page }, provideFixture) => {
    await provideFixture(new LocationComponent(page));
  },
  dateOfBirthComponent: async ({ page }, provideFixture) => {
    await provideFixture(new DateOfBirthComponent(page));
  },
  redundantComponent: async ({ page }, provideFixture) => {
    await provideFixture(new RedundantComponent(page));
  },
  employerDateComponent: async ({ page }, provideFixture) => {
    await provideFixture(new EmployerDateComponent(page));
  },
  incomeComponent: async ({ page }, provideFixture) => {
    await provideFixture(new IncomeComponent(page));
  },
  redundancyOptionComponent: async ({ page }, provideFixture) => {
    await provideFixture(new RedundancyOptionComponent(page));
  },
  answersComponent: async ({ page }, provideFixture) => {
    await provideFixture(new AnswersComponent(page));
  },
  resultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ResultsComponent(page));
  },
  redundancyAmountComponent: async ({ page }, provideFixture) => {
    await provideFixture(new RedundancyAmountComponent(page));
  },
  errorComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ErrorComponent(page));
  },
  setCookieControl: async ({ context }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;
    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }
    const { hostname } = new URL(baseURL);
    await provideFixture(async () => {
      await context.addCookies([
        {
          name: 'CookieControl',
          value: JSON.stringify({
            necessaryCookies: [],
            optionalCookies: {
              analytics: 'revoked',
              marketing: 'revoked',
            },
            statement: {},
            consentDate: 0,
            consentExpiry: 0,
            interactedWith: true,
            user: 'anonymous',
          }),
          domain: hostname,
          path: '/',
        },
      ]);
    });
  },
});
