import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

export type JsonObject = { [key: string]: unknown };

export const defaultJsonHeader = {
  'content-type': 'application/json',
} as const;

export function createMockRes(): NextApiResponse {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

export function createMockReq<TBody extends JsonObject>(
  body: TBody,
  headers: Record<string, string> = defaultJsonHeader,
  method = 'POST',
): NextApiRequest {
  return {
    method,
    body,
    headers,
  } as unknown as NextApiRequest;
}

export function stubCookies(
  mockedCookies: jest.MockedClass<typeof Cookies>,
  getValue?: string,
) {
  const cookieInstance = {
    get: jest.fn().mockReturnValue(getValue),
    set: jest.fn(),
  } as unknown as Cookies;

  mockedCookies.mockImplementation(() => cookieInstance);
  return cookieInstance;
}

export function expectJsonError(
  res: NextApiResponse,
  status: number,
  fields: Record<string, unknown>,
) {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith({ error: true, fields, ok: false });
}
