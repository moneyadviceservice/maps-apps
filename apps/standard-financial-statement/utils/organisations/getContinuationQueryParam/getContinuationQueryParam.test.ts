import { getContinuationQueryParam } from './getContinuationQueryParam';

describe('getContinuationQueryParam', () => {
  it('returns param when a token is defined', () => {
    const continuationParam = getContinuationQueryParam('test-token');

    expect(continuationParam).toEqual(
      `&continuationToken=${encodeURIComponent('test-token')}`,
    );
  });

  it('returns empty string when a token is not defined', () => {
    const continuationParam = getContinuationQueryParam('');

    expect(continuationParam).toEqual('');
  });
});
