import { NextApiRequest } from 'next';

import { wantsJson } from './wantsJson';

describe('wantsJson', () => {
  it('should return true when content-type is application/json', () => {
    const mockReq = {
      headers: {
        'content-type': 'application/json',
      },
    } as NextApiRequest;

    expect(wantsJson(mockReq)).toBe(true);
  });

  it('should return true when content-type contains application/json (e.g. with charset)', () => {
    const mockReq = {
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    } as NextApiRequest;

    expect(wantsJson(mockReq)).toBe(true);
  });

  it('should return false for different content types like text/html', () => {
    const mockReq = {
      headers: {
        'content-type': 'text/html',
      },
    } as NextApiRequest;

    expect(wantsJson(mockReq)).toBe(false);
  });

  it('should handle undefined headers gracefully', () => {
    const mockReq = {
      headers: {
        'content-type': undefined,
      },
    } as unknown as NextApiRequest;

    expect(wantsJson(mockReq)).toBeUndefined();
  });
});
