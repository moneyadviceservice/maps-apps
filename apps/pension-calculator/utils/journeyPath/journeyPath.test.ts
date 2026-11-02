import { withSessionId } from 'utils/journeyPath';

describe('withSessionId', () => {
  it('appends an encoded sessionId to a path', () => {
    expect(withSessionId('/en/about-you', 'abc&x=1')).toBe(
      '/en/about-you?sessionId=abc%26x%3D1',
    );
  });

  it('preserves existing query params and replaces sessionId', () => {
    expect(withSessionId('/en/about-you?error=true&sessionId=old', 'new')).toBe(
      '/en/about-you?error=true&sessionId=new',
    );
  });
});
