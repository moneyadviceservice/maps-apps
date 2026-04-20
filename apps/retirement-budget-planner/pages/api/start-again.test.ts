import { NextApiRequest, NextApiResponse } from 'next';

import { deleteAllSessionData } from 'lib/util/deleteAllSessionData';

import handler from './start-again';

jest.mock('lib/util/deleteAllSessionData', () => ({
  deleteAllSessionData: jest.fn(),
}));

const mockRequest = (params: { sessionId: string; language: string }) => {
  const { sessionId, language } = { ...params };

  return {
    body: {
      sessionId,
      language,
    },
  } as unknown as NextApiRequest;
};

describe('Start again api', () => {
  let response: NextApiResponse;
  let request: NextApiRequest;

  beforeEach(() => {
    response = {
      redirect: jest.fn(),
      status: jest.fn().mockImplementation(() => ({
        json: jest.fn(),
      })),
    } as unknown as NextApiResponse;
    request = mockRequest({ sessionId: 'session-id-test', language: 'en' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Success
   */

  it('should delete data and redirect', async () => {
    await handler(request, response);
    expect(deleteAllSessionData).toHaveBeenCalledWith('session-id-test');
    expect(response.redirect).toHaveBeenCalledWith(303, '/en/about-you');
  });

  /**
   * Missing input values
   */

  it('should return 400 error if sessionId is missing', async () => {
    // @ts-expect-error – testing invalid input
    request = mockRequest({ language: 'en' });
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 error if language is missing', async () => {
    // @ts-expect-error – testing invalid input
    request = mockRequest({ sessionId: 'session-id-test' });
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 error if both sessionId and language are missing', async () => {
    // @ts-expect-error – testing invalid input
    request = mockRequest();
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  /**
   * Incorrect input types
   */

  it('should return 400 error if sessionId is incorrect type', async () => {
    // @ts-expect-error – testing invalid input
    request = mockRequest({ language: 'en', sessionId: 123 });
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 error if language is incorrect type', async () => {
    // @ts-expect-error – testing invalid input
    request = mockRequest({ language: 123, sessionId: 'session-id-test' });
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });
});
