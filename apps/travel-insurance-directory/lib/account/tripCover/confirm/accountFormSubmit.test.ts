import { withChangeAnswerApiUrl } from './accountFormSubmit';

describe('accountFormSubmit', () => {
  it('withChangeAnswerApiUrl returns the original URL when not editing from summary', () => {
    expect(withChangeAnswerApiUrl('/api/account/trip-cover/regions')).toBe(
      '/api/account/trip-cover/regions',
    );
  });

  it('withChangeAnswerApiUrl appends isChangeAnswer query param when editing from summary', () => {
    expect(
      withChangeAnswerApiUrl('/api/account/trip-cover/regions', true),
    ).toBe('/api/account/trip-cover/regions?isChangeAnswer=true');
  });

  it('withChangeAnswerApiUrl uses ampersand when the URL already has query params', () => {
    expect(withChangeAnswerApiUrl('/api/account/foo?firmId=123', true)).toBe(
      '/api/account/foo?firmId=123&isChangeAnswer=true',
    );
  });
});
