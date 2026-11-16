import { JOURNEY_PAGES } from 'data/journey';
import {
  rawSessionId,
  withSessionEncryptionKey,
} from 'test-utils/sessionEncryption';
import { decryptSessionId } from 'utils/sessionToken';

import { getJourneyContext } from './getJourneyContext';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

describe('getJourneyContext', () => {
  withSessionEncryptionKey();

  it('redirects onto the page URL when sessionId is missing', () => {
    const result = getJourneyContext(
      {},
      { language: 'en' },
      JOURNEY_PAGES.YOUR_INCOME,
    );

    expect(result).toEqual({
      redirect: {
        destination: expect.stringMatching(
          /^\/en\/your-income\?sessionId=[^&]+$/,
        ),
        permanent: false,
      },
    });

    if (!('redirect' in result)) {
      throw new Error('Expected a redirect');
    }

    const sessionId = new URL(
      result.redirect.destination,
      'http://localhost',
    ).searchParams.get('sessionId');

    expect(sessionId).not.toBe(rawSessionId);
    expect(decryptSessionId(sessionId ?? '')).toBe(rawSessionId);
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
