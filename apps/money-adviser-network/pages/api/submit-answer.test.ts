import { NextApiRequest, NextApiResponse } from 'next';

import { getNextPage } from './utils/getNextPage';
import handler from './submit-answer';

jest.mock('./utils/getNextPage');
jest.mock('../../utils/getCookieData/getCookieData', () => ({
  setCookie: jest.fn(),
}));

describe('API handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let mockRedirect: jest.Mock;

  beforeEach(() => {
    mockRedirect = jest.fn();
    req = {
      body: {
        language: 'en',
        question: 'q-1',
        isEmbed: 'false',
        dataPath: 'start',
        answer: 'Some answer',
        type: 'single',
      },
    };

    res = {
      redirect: mockRedirect,
    };

    (getNextPage as jest.Mock).mockReturnValue('/next-page');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect correctly for valid input (single question type)', async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(
      false,
      1,
      {
        'q-1': 'Some answer',
      },
      {},
      'start',
      false,
      {},
    );

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=Some%20answer',
    );
  });

  it('should set an error in the data and redirect when no answer is provided', async () => {
    req.body.answer = '';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(
      true,
      1,
      {},
      {},
      'start',
      false,
      {},
    );

    expect(mockRedirect).toHaveBeenCalledWith(302, '/en/next-page?error=q-1');
  });

  it('should handle multiple question types', async () => {
    req.body.type = 'multiple';
    req.body.answer = 'Answer 1';
    req.body.answer1 = 'Answer 2';
    req.body.clearAll = 'false';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(
      false,
      1,
      {
        'q-1': 'Answer 1,Answer 2',
      },
      {},
      'start',
      false,
      {},
    );

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=Answer%201%2CAnswer%202',
    );
  });

  it('should handle moneyInput type and format the answer correctly', async () => {
    req.body.type = 'moneyInput';
    req.body.answer = '1,234';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(
      false,
      1,
      {
        'q-1': '£1234',
      },
      {},
      'start',
      false,
      {},
    );

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=%C2%A31234',
    );
  });
});
