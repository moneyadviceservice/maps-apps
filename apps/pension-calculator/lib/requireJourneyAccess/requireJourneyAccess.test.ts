import { JOURNEY_PAGES } from 'data/journey';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';
import { getIncomeFromSession } from 'lib/session/incomeSession';
import {
  getIncomePensionsFromSession,
  getPensionsFromSession,
} from 'lib/session/pensionsSession';
import { defaultYourIncomeData } from 'types/income';
import { DefinedIncomeData, PotsOfMoneyData } from 'types/pensions';

import { requireJourneyAccess } from './requireJourneyAccess';

jest.mock('lib/session/aboutYouSession', () => ({
  getAboutYouFromSession: jest.fn(),
}));

jest.mock('lib/session/incomeSession', () => ({
  getIncomeFromSession: jest.fn(),
}));

jest.mock('lib/session/pensionsSession', () => ({
  getPensionsFromSession: jest.fn(),
  getIncomePensionsFromSession: jest.fn(),
}));

jest.mock('utils/journeyPath', () => ({
  journeyPath: jest.fn(
    (lang: string, path: string, sessionId: string) =>
      `/${lang}/${path}?sessionId=${sessionId}`,
  ),
}));

const mockedAboutYou = getAboutYouFromSession as jest.MockedFunction<
  typeof getAboutYouFromSession
>;

const mockedIncome = getIncomeFromSession as jest.MockedFunction<
  typeof getIncomeFromSession
>;

const mockedPots = getPensionsFromSession as jest.MockedFunction<
  typeof getPensionsFromSession
>;

const mockedIncomePensions =
  getIncomePensionsFromSession as jest.MockedFunction<
    typeof getIncomePensionsFromSession
  >;

const validAboutYou = {
  day: '10',
  month: '09',
  year: '1986',
  sex: 'male' as const,
  retireAge: '65',
};

const validIncome = {
  ...defaultYourIncomeData(),
  grossPay: '26900',
};

const validPots = {
  hasPotOfMoneyPension: 'yes',
  pots: [{ name: 'Pot 1', currentValue: '1000' }],
} as PotsOfMoneyData;

const validIncomePensions = {
  hasIncomePension: 'yes',
} as DefinedIncomeData;

describe('requireJourneyAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAboutYou.mockResolvedValue(null);
    mockedIncome.mockResolvedValue(null);
    mockedPots.mockResolvedValue(null);
    mockedIncomePensions.mockResolvedValue(null);
  });

  it('allows access to about you page with no prerequisites', async () => {
    await expect(
      requireJourneyAccess({
        page: JOURNEY_PAGES.ABOUT_YOU,
        language: 'en',
        sessionId: 'abc',
      }),
    ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
  });

  describe('YOUR_INCOME page access', () => {
    it('redirects to about you when about you is incomplete', async () => {
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

    it('allows access when about you is valid', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.YOUR_INCOME,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
    });
  });

  describe('POTS_OF_MONEY page access', () => {
    it('redirects to about you when about you is incomplete', async () => {
      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.POTS_OF_MONEY,
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

    it('redirects to your income when income is incomplete', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.POTS_OF_MONEY,
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

    it('allows access when about you and income are valid', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.POTS_OF_MONEY,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
    });
  });

  describe('INCOME_PENSIONS page access', () => {
    it('redirects to pots of money when pots of money is incomplete', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.INCOME_PENSIONS,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({
        redirect: {
          destination: '/en/pots-of-money?sessionId=abc',
          permanent: false,
        },
      });
    });

    it('allows access when about you, income, and pots of money are valid', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);
      mockedPots.mockResolvedValue(validPots);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.INCOME_PENSIONS,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
    });
  });

  describe('STATE_PENSION page access', () => {
    it('redirects to about you when about you is incomplete', async () => {
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

    it('redirects to your income when income is incomplete', async () => {
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

    it('redirects to pots of money when pots of money is incomplete', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.STATE_PENSION,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({
        redirect: {
          destination: '/en/pots-of-money?sessionId=abc',
          permanent: false,
        },
      });
    });

    it('redirects to income pensions when income pensions is incomplete', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);
      mockedPots.mockResolvedValue(validPots);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.STATE_PENSION,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({
        redirect: {
          destination: '/en/income-pensions?sessionId=abc',
          permanent: false,
        },
      });
    });

    it('allows access to state pension when all prerequisites are valid', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);
      mockedPots.mockResolvedValue(validPots);
      mockedIncomePensions.mockResolvedValue(validIncomePensions);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.STATE_PENSION,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
    });
  });

  describe('RETIREMENT_INCOME page access', () => {
    it('redirects to income pensions when that step is incomplete', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);
      mockedPots.mockResolvedValue(validPots);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.RETIREMENT_INCOME,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({
        redirect: {
          destination: '/en/income-pensions?sessionId=abc',
          permanent: false,
        },
      });
    });

    it('allows access when every earlier step is valid', async () => {
      mockedAboutYou.mockResolvedValue(validAboutYou);
      mockedIncome.mockResolvedValue(validIncome);
      mockedPots.mockResolvedValue(validPots);
      mockedIncomePensions.mockResolvedValue(validIncomePensions);

      await expect(
        requireJourneyAccess({
          page: JOURNEY_PAGES.RETIREMENT_INCOME,
          language: 'en',
          sessionId: 'abc',
        }),
      ).resolves.toEqual({ language: 'en', sessionId: 'abc' });
    });
  });
});
