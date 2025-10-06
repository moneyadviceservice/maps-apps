import { getPostLogoutRedirectUri } from './getPostLogoutRedirectUri';

describe('getPostLogoutRedirectUri', () => {
  it('should return "/" when no referer is provided', () => {
    expect(getPostLogoutRedirectUri()).toBe('/');
  });

  it('should return "/" when referer is an invalid URL', () => {
    expect(getPostLogoutRedirectUri('not-a-valid-url')).toBe('/');
  });

  it('should return root origin when referer does not include /admin', () => {
    expect(
      getPostLogoutRedirectUri('https://example.com/en/use-the-sfs/'),
    ).toBe('https://example.com/');
  });

  it('should return truncated admin path when /admin is in pathname', () => {
    expect(
      getPostLogoutRedirectUri('https://example.com/admin/dashboard/'),
    ).toBe('https://example.com/admin/');
  });

  it('should handle trailing slashes and return proper path', () => {
    expect(getPostLogoutRedirectUri('https://example.com/admin/')).toBe(
      'https://example.com/admin/',
    );
  });
});
