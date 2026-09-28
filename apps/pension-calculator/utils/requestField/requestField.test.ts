import type { NextApiRequest } from 'next';

import { isJsonRequest, requestField } from './requestField';

describe('requestField', () => {
  it('reads from query then body', () => {
    const request = {
      query: { index: '1', step: 'details' },
      body: { index: '2', sessionId: 'abc' },
    } as unknown as NextApiRequest;

    expect(requestField(request, 'index')).toBe('1');
    expect(requestField(request, 'step')).toBe('details');
    expect(requestField(request, 'sessionId')).toBe('abc');
    expect(requestField(request, 'missing')).toBeUndefined();
  });
});

describe('isJsonRequest', () => {
  it('detects JSON content type', () => {
    expect(
      isJsonRequest({
        headers: { 'content-type': 'application/json' },
      } as unknown as NextApiRequest),
    ).toBe(true);
    expect(isJsonRequest({ headers: {} } as unknown as NextApiRequest)).toBe(
      false,
    );
  });
});
