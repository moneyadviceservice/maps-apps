import { NextApiRequest, NextApiResponse } from 'next';
import handler from './submit-answer';
import { validateForm } from './utils/validateForm';

jest.mock('./utils/validateForm', () => ({
  validateForm: jest.fn(),
}));

describe('handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      body: {},
      headers: {
        referer: 'https://example.com/path?error=something&foo=bar',
      },
    };
    res = {
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect with validation errors if form data is invalid', () => {
    (validateForm as jest.Mock).mockReturnValueOnce({
      isValid: false,
      errors: {},
      conErrors: {},
    });

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(303, expect.any(String));
  });

  it('should redirect to the next tab if form data is valid', () => {
    (validateForm as jest.Mock).mockReturnValueOnce({
      isValid: true,
      errors: {},
      conErrors: {},
    });

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(303, expect.any(String));
  });
});
