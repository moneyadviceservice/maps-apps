import { IncomingMessage } from 'http';

import { getUrl } from './';

describe('getUrl', () => {
  it('should return the correct value', () => {
    const req = {
      headers: {
        referer: 'https://example.com',
        host: 'example.com',
      },
      url: '/path',
    };
    expect(getUrl(req as IncomingMessage)).toBe('https://example.com/path');
  });
});
