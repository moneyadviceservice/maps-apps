import type { NextApiRequest, NextApiResponse } from 'next';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import handler from './change-answer';

jest.mock('@maps-react/utils/addEmbedQuery', () => ({
  addEmbedQuery: jest.fn(),
}));

describe('Handler Function', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  beforeEach(() => {
    req = {
      body: {
        language: 'en',
        questionNbr: '1',
        pagePath: 'money-adviser-network/start/q-1',
        urlData: JSON.stringify({ 'q-1': '0' }),
      },
    };

    res = {
      redirect: jest.fn(),
    };
  });

  it('should redirect with correct URL and query string', async () => {
    const addEmbedQueryMock = addEmbedQuery as jest.Mock;
    addEmbedQueryMock.mockReturnValue('');
    await handler(req as NextApiRequest, res as NextApiResponse);

    const expectedURL = `/en/money-adviser-network/start/q-1?q-1=0&changeAnswer=q-1`;

    expect(res.redirect).toHaveBeenCalledWith(302, expectedURL);
  });

  it('should handle empty savedData and language set to cy', async () => {
    const addEmbedQueryMock = addEmbedQuery as jest.Mock;
    addEmbedQueryMock.mockReturnValue('&embed=true');
    req.body.urlData = '';
    req.body.isEmbed = true;
    req.body.language = 'cy';

    await handler(req as NextApiRequest, res as NextApiResponse);

    const expectedURL = `/cy/money-adviser-network/start/q-1?changeAnswer=q-1`;

    expect(res.redirect).toHaveBeenCalledWith(302, expectedURL);
  });
});
