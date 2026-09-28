import { JOURNEY_PAGES } from 'data/journey';

import { getJourneyContext } from './getJourneyContext';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

describe('getJourneyContext', () => {
  it('redirects onto the page URL when sessionId is missing', () => {
    expect(
      getJourneyContext({}, { language: 'en' }, JOURNEY_PAGES.YOUR_INCOME),
    ).toEqual({
      redirect: {
        destination:
          '/en/your-income?sessionId=123e4567e89b12d3a456426614174000',
        permanent: false,
      },
    });
  });

  it('returns language and sessionId when the query already has a session', () => {
    expect(
      getJourneyContext(
        { sessionId: 'abc' },
        { language: 'cy' },
        JOURNEY_PAGES.YOUR_INCOME,
      ),
    ).toEqual({
      language: 'cy',
      sessionId: 'abc',
    });
  });

  it('defaults unsupported language params to en', () => {
    expect(
      getJourneyContext(
        { sessionId: 'abc' },
        { language: 'fr' },
        JOURNEY_PAGES.YOUR_INCOME,
      ),
    ).toEqual({
      language: 'en',
      sessionId: 'abc',
    });
  });
});
