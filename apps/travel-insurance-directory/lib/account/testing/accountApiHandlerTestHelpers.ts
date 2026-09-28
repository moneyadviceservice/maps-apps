import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import type { IronSessionObject } from 'types/iron-session';
import type { respond } from 'utils/api/respond/respond';

export type AccountApiRequestBody = Record<
  string,
  string | string[] | undefined
>;
type MockedRespond = jest.MockedFunction<typeof respond>;

export const accountSessionHandlerPassthrough = {
  withAccountSession: (handler: NextApiHandler) => handler,
};

export function createAccountApiHandlerTestContext(
  defaultSession: Partial<IronSessionObject> = {
    accountEmail: 'principal@example.com',
    isAccountAuthenticated: true,
  },
) {
  const mockJson = jest.fn();
  const mockStatus = jest
    .fn()
    .mockReturnValue({ json: mockJson, end: jest.fn() });

  const getMockRes = () =>
    ({
      status: mockStatus,
      json: mockJson,
      end: jest.fn(),
    }) as unknown as NextApiResponse;

  const getMockReq = (
    method: string,
    body: AccountApiRequestBody,
    sessionData?: Partial<IronSessionObject>,
  ) =>
    ({
      method,
      body,
      session: {
        ...defaultSession,
        ...sessionData,
      },
    }) as unknown as NextApiRequest & { session: IronSessionObject };

  return { mockJson, mockStatus, getMockRes, getMockReq };
}

type AccountApiHandlerTestContext = ReturnType<
  typeof createAccountApiHandlerTestContext
>;

export async function expectAccountApiRejectsGetMethod(
  handler: NextApiHandler,
  {
    getMockReq,
    getMockRes,
  }: Pick<AccountApiHandlerTestContext, 'getMockReq' | 'getMockRes'>,
) {
  const res = getMockRes();
  await handler(getMockReq('GET', {}), res);
  expect(res.status).toHaveBeenCalledWith(405);
}

export async function expectAccountApiRequiresFirmId(
  handler: NextApiHandler,
  {
    getMockReq,
    getMockRes,
    mockJson,
  }: Pick<
    AccountApiHandlerTestContext,
    'getMockReq' | 'getMockRes' | 'mockJson'
  >,
  body: AccountApiRequestBody,
) {
  const res = getMockRes();
  await handler(getMockReq('POST', body), res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockJson).toHaveBeenCalledWith({ error: 'firmId is required' });
}

export async function expectAccountApiRequiresFields(
  handler: NextApiHandler,
  {
    getMockReq,
    getMockRes,
    mockJson,
  }: Pick<
    AccountApiHandlerTestContext,
    'getMockReq' | 'getMockRes' | 'mockJson'
  >,
  body: AccountApiRequestBody,
  expectedError: string,
) {
  const res = getMockRes();
  await handler(getMockReq('POST', body), res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(mockJson).toHaveBeenCalledWith({ error: expectedError });
}

export async function expectAccountApiFirmNotFound(
  handler: NextApiHandler,
  {
    getMockReq,
    getMockRes,
  }: Pick<AccountApiHandlerTestContext, 'getMockReq' | 'getMockRes'>,
  body: AccountApiRequestBody,
  mockedRespond: MockedRespond,
) {
  const req = getMockReq('POST', body);
  const res = getMockRes();

  await handler(req, res);

  expect(mockedRespond).toHaveBeenCalledWith(
    req,
    res,
    expect.objectContaining({
      status: 404,
      redirect: '/account',
    }),
  );
}

export async function expectAccountApiUpdateFirmFailure(
  handler: NextApiHandler,
  {
    getMockReq,
    getMockRes,
  }: Pick<AccountApiHandlerTestContext, 'getMockReq' | 'getMockRes'>,
  body: AccountApiRequestBody,
  mockedRespond: MockedRespond,
  currentRoute: string,
) {
  const req = getMockReq('POST', body);
  const res = getMockRes();

  await handler(req, res);

  expect(mockedRespond).toHaveBeenCalledWith(
    req,
    res,
    expect.objectContaining({
      status: 500,
      redirect: currentRoute,
    }),
  );
}
