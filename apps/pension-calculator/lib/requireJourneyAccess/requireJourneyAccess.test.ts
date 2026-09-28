import { JOURNEY_PAGES } from 'data/journey';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';

import { requireJourneyAccess } from './requireJourneyAccess';

jest.mock('lib/session/aboutYouSession', () => ({
  getAboutYouFromSession: jest.fn(),
}));

const mockedAboutYou = getAboutYouFromSession as jest.MockedFunction<
  typeof getAboutYouFromSession
>;

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
});
