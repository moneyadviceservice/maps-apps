import { NextApiRequest, NextApiResponse } from 'next';

import { resultPrefix } from 'data/mortgage-affordability/results';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import {
  combineSavedAndFormData,
  removeZeroValuesAndTransform,
} from '../utils';
import { validateResults } from './utils/validateResults';
import handler from './submit-results';

jest.mock('@maps-react/utils/addEmbedQuery');
jest.mock('./utils/validateResults');
jest.mock('../utils', () => ({
  combineSavedAndFormData: jest.fn(),
  removeZeroValuesAndTransform: jest.fn(),
}));

describe('handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      body: {
        language: 'en',
        isEmbed: 'true',
        toolBaseUrl: 'http://example.com/',
        savedData: {},
        nextStep: 'next-step',
        currentStep: 'current-step',
        action: 'calculate',
        validation: JSON.stringify({ bounds: { lower: 0, upper: 1000000 } }),
        [`${resultPrefix}field1`]: 'value1',
        [`${resultPrefix}field2`]: 'value2',
      },
      headers: {
        referer: 'http://example.com/current-step',
      },
    };
    res = {
      redirect: jest.fn(),
    };

    (combineSavedAndFormData as jest.Mock).mockReturnValue({
      [`${resultPrefix}field1`]: 'combinedValue1',
      [`${resultPrefix}field2`]: 'combinedValue2',
    });

    (removeZeroValuesAndTransform as jest.Mock).mockReturnValue({
      [`${resultPrefix}field1`]: 'transformedValue1',
      [`${resultPrefix}field2`]: 'transformedValue2',
    });

    (addEmbedQuery as jest.Mock).mockReturnValue('&embed=true');

    (validateResults as jest.Mock).mockReturnValue({
      isValid: true,
      errors: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful validation and redirect to next step', () => {
    handler(req as NextApiRequest, res as NextApiResponse);

    const expectedQuery = new URLSearchParams({
      [`${resultPrefix}field1`]: 'transformedValue1',
      [`${resultPrefix}field2`]: 'transformedValue2',
    }).toString();

    expect(res.redirect).toHaveBeenCalledWith(
      303,
      `http://example.com/next-step?${expectedQuery}&embed=true`,
    );
  });

  it('should handle recalculation action and redirect to current step', () => {
    req.body.action = 'recalculate';

    handler(req as NextApiRequest, res as NextApiResponse);

    const expectedQuery = new URLSearchParams({
      [`${resultPrefix}field1`]: 'transformedValue1',
      [`${resultPrefix}field2`]: 'transformedValue2',
    }).toString();

    expect(res.redirect).toHaveBeenCalledWith(
      303,
      `http://example.com/current-step?${expectedQuery}&embed=true`,
    );
  });

  it('should handle validation errors and redirect with errors', () => {
    (validateResults as jest.Mock).mockReturnValue({
      isValid: false,
      errors: {
        [`${resultPrefix}field1`]: 'error1',
        [`${resultPrefix}field2`]: 'error2',
      },
    });

    handler(req as NextApiRequest, res as NextApiResponse);

    const errorsString = JSON.stringify({
      [`${resultPrefix}field1`]: 'error1',
      [`${resultPrefix}field2`]: 'error2',
    });
    const encodedErrors = encodeURIComponent(errorsString);
    const queryParams = new URLSearchParams({
      [`${resultPrefix}field1`]: 'transformedValue1',
      [`${resultPrefix}field2`]: 'transformedValue2',
    });
    queryParams.append('errors', encodedErrors);

    expect(res.redirect).toHaveBeenCalledWith(
      303,
      `http://example.com/current-step?${queryParams.toString()}&embed=true`,
    );
  });

  it('should handle missing referer gracefully', () => {
    delete (req as NextApiRequest).headers.referer;

    handler(req as NextApiRequest, res as NextApiResponse);

    const expectedQuery = new URLSearchParams({
      [`${resultPrefix}field1`]: 'transformedValue1',
      [`${resultPrefix}field2`]: 'transformedValue2',
    }).toString();

    expect(res.redirect).toHaveBeenCalledWith(
      303,
      `http://example.com/next-step?${expectedQuery}&embed=true`,
    );
  });

  it('should parse validation JSON correctly', () => {
    handler(req as NextApiRequest, res as NextApiResponse);

    expect(validateResults).toHaveBeenCalledWith(expect.any(Object), 'en', {
      bounds: { lower: 0, upper: 1000000 },
    });
  });

  it('should default to empty object if validation is missing', () => {
    delete req.body.validation;

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(validateResults).toHaveBeenCalledWith(expect.any(Object), 'en', {});
  });
});
