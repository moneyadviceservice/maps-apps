import { JOURNEY_PAGES } from 'data/journey';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';
import { getIncomeFromSession } from 'lib/session/incomeSession';
import { defaultYourIncomeData } from 'types/income';

import { requireJourneyAccess } from './requireJourneyAccess';

jest.mock('lib/session/aboutYouSession', () => ({
  getAboutYouFromSession: jest.fn(),
}));

jest.mock('lib/session/incomeSession', () => ({
  getIncomeFromSession: jest.fn(),
}));

const mockedAboutYou = getAboutYouFromSession as jest.MockedFunction<
  typeof getAboutYouFromSession
>;

const mockedIncome = getIncomeFromSession as jest.MockedFunction<
  typeof getIncomeFromSession
>;

const validIncome = {
  ...defaultYourIncomeData(),
  grossPay: '26900',
};

const validAboutYou = {
  day: '10',
  month: '09',
  year: '1986',
  sex: 'male' as const,
  retireAge: '65',
};

describe('requireJourneyAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAboutYou.mockResolvedValue(null);
    mockedIncome.mockResolvedValue(null);
  });

  it('allows about you with no previous pages', async () => {
    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.ABOUT_YOU,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
  });

  it('redirects to about you when your income is opened without valid about you', async () => {
    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.YOUR_INCOME,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({
      redirect: {
        destination: '/en/about-you?sessionId=abc',
        permanent: false,
      },
    });
  });

  it('allows your income when about you is valid', async () => {
    mockedAboutYou.mockResolvedValue(validAboutYou);

    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.YOUR_INCOME,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
  });

  it('redirects to about you when state pension is opened without valid about you', async () => {
    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.STATE_PENSION,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({
      redirect: {
        destination: '/en/about-you?sessionId=abc',
        permanent: false,
      },
    });
  });

  it('redirects to your income when state pension is opened without valid income', async () => {
    mockedAboutYou.mockResolvedValue(validAboutYou);

    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.STATE_PENSION,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({
      redirect: {
        destination: '/en/your-income?sessionId=abc',
        permanent: false,
      },
    });
  });

  it('allows state pension when about you and your income are valid', async () => {
    mockedAboutYou.mockResolvedValue(validAboutYou);
    mockedIncome.mockResolvedValue(validIncome);

    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.STATE_PENSION,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
  });
});
