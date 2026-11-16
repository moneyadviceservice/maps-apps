import {
  safeReturnTo,
  saveJourneyPath,
  withSessionId,
} from 'utils/journeyPath';

describe('withSessionId', () => {
  it('appends an encoded sessionId to a path', () => {
    expect(withSessionId('/en/about-you', 'abc&x=1')).toBe(
      '/en/about-you?sessionId=abc%26x%3D1',
    );
  });

  it('builds a save path that remembers the page being left', () => {
    expect(saveJourneyPath('en', 'your-income', 'abc')).toBe(
      '/en/save?returnTo=%2Fen%2Fyour-income%3FsessionId%3Dabc&sessionId=abc',
    );
  });

  it('keeps a return path on this site and replaces its session id', () => {
    expect(safeReturnTo('/en/your-income?sessionId=old', 'en', 'abc')).toBe(
      '/en/your-income?sessionId=abc',
    );
  });

  it('sends any other return path back to about you', () => {
    expect(safeReturnTo('https://example.com', 'en', 'abc')).toBe(
      '/en/about-you?sessionId=abc',
    );
  });

  it('preserves existing query params and replaces sessionId', () => {
    expect(withSessionId('/en/about-you?error=true&sessionId=old', 'new')).toBe(
      '/en/about-you?error=true&sessionId=new',
    );
  });
});
