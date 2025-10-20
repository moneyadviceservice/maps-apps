import { NextApiRequest, NextApiResponse } from 'next';

import { validateForm } from '../utils/validateForm';
import handler from './submit-answer';

jest.mock('../utils/validateForm', () => ({
  validateForm: jest.fn(),
}));

describe('handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      body: {},
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
    });

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(303, expect.any(String));
  });

  it('should redirect to the next tab if form data is valid', () => {
    (validateForm as jest.Mock).mockReturnValueOnce({
      isValid: true,
      errors: {},
    });

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(303, expect.any(String));
  });
});
