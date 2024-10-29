import { NextApiRequest, NextApiResponse } from 'next';
import handler from './submit-answer';
import { getNextPage } from './utils/getNextPage';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

jest.mock('./utils/getNextPage');
jest.mock('@maps-react/utils/addEmbedQuery');

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
        answer: 'Some answer',
        type: 'single',
      },
    };

    res = {
      redirect: mockRedirect,
    };

    (getNextPage as jest.Mock).mockReturnValue('/next-page');
    (addEmbedQuery as jest.Mock).mockReturnValue('');
  });

  it('should redirect correctly for valid input (single question type)', async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(false, 1, {
      'q-1': 'Some answer',
    });

    expect(addEmbedQuery).toHaveBeenCalledWith(false, '&');

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=Some%20answer',
    );
  });

  it('should set an error in the data and redirect when no answer is provided', async () => {
    req.body.answer = '';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(true, 1, {});

    expect(mockRedirect).toHaveBeenCalledWith(302, '/en/next-page?error=q-1');
  });

  it('should handle multiple question types', async () => {
    req.body.type = 'multiple';
    req.body.answer = 'Answer 1';
    req.body.answer1 = 'Answer 2';
    req.body.clearAll = 'false';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(false, 1, {
      'q-1': 'Answer 1,Answer 2',
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=Answer%201%2CAnswer%202',
    );
  });

  it('should correctly append embed query when isEmbed is true', async () => {
    (addEmbedQuery as jest.Mock).mockReturnValueOnce('&embed=true');

    req.body.isEmbed = 'true';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(addEmbedQuery).toHaveBeenCalledWith(true, '&');

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=Some%20answer&embed=true',
    );
  });

  it('should handle moneyInput type and format the answer correctly', async () => {
    req.body.type = 'moneyInput';
    req.body.answer = '1,234';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(getNextPage).toHaveBeenCalledWith(false, 1, {
      'q-1': '£1234',
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      302,
      '/en/next-page?q-1=%C2%A31234',
    );
  });
});
