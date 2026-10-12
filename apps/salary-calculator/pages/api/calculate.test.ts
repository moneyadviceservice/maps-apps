import { NextApiRequest, NextApiResponse } from 'next';

import handler from './calculate';

describe('Calculate API Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  it('should redirect with no errors if only gross income is given', async () => {
    req = {
      body: {
        grossIncome: '55000',
      },
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withData(
      {
        grossIncome: '55000',
      },
      queryParams,
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}`,
    );
  });

  it('should redirect with no errors for joint calculation, if only gross income is given', async () => {
    const data = {
      grossIncome: '55000',
      salary2_grossIncome: '55000',
      calculationType: 'joint',
    };

    req = {
      body: data,
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withData(
      {
        grossIncome: '55000',
        salary2_grossIncome: '55000',
        calculationType: 'joint',
      },
      queryParams,
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}`,
    );
  });

  it('should redirect with single error request body is empty', async () => {
    req = {
      body: {},
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withErrors(
      [
        {
          field: 'grossIncome',
          type: 'income-required',
        },
      ],
      queryParams,
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}#error-summary-heading`,
    );
  });

  it('should redirect with salary2_ errors if salary2 inputs fail validation', async () => {
    const data = {
      grossIncome: '155000',
      taxCode: undefined,
      salary2_grossIncome: '255000',
      salary2_taxCode: '12345L',
      calculationType: 'joint',
    };

    req = {
      body: data,
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withData(data, queryParams);
    withErrors(
      [
        {
          field: 'taxCode',
          type: 'tax-code-invalid',
        },
      ],
      queryParams,
      'salary2_',
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}#error-summary-heading`,
    );
  });

  it('should redirect with errors if salary1 inputs fail validation but salary2 is fine', async () => {
    const data = {
      grossIncome: '155000',
      taxCode: '12345L',
      salary2_grossIncome: '255000',
      salary2_taxCode: undefined,
      calculationType: 'joint',
    };

    req = {
      body: data,
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withData(data, queryParams);
    withErrors(
      [
        {
          field: 'taxCode',
          type: 'tax-code-invalid',
        },
      ],
      queryParams,
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}#error-summary-heading`,
    );
  });

  it('should redirect with errors and salary2_ errors if salary 1 and 2 inputs fail validation', async () => {
    const data = {
      grossIncome: '155000',
      taxCode: '12345L',
      salary2_grossIncome: '255000',
      salary2_taxCode: 'not-a-tax-code',
      calculationType: 'joint',
    };

    req = {
      body: data,
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withData(data, queryParams);
    withErrors(
      [
        {
          field: 'taxCode',
          type: 'tax-code-invalid',
        },
      ],
      queryParams,
      'salary2_',
    );
    withErrors(
      [
        {
          field: 'taxCode',
          type: 'tax-code-invalid',
        },
      ],
      queryParams,
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}#error-summary-heading`,
    );
  });

  it('should redirect with multiple errors if multiple inputs fail validation', async () => {
    const data = {
      grossIncome: 'abcdef-not-a-number',
      grossIncomeFrequency: 'invalid-frequency',
    };

    req = {
      body: data,
    };

    res = {
      redirect: jest.fn(),
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    const queryParams = new URLSearchParams();
    withData(data, queryParams);
    withErrors(
      [
        {
          field: 'grossIncome',
          type: 'income-invalid',
        },
        {
          field: 'grossIncomeFrequency',
          type: 'income-frequency-invalid',
        },
      ],
      queryParams,
    );

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/en?${queryParams.toString()}#error-summary-heading`,
    );
  });
});

const withErrors = (
  errors: { field: string; type: string }[],
  queryParams: URLSearchParams,
  prefix = '',
) => {
  const prefixedErrors = errors.map((error) =>
    prefix ? { ...error, field: `${prefix}${error.field}` } : error,
  );

  // only stringify, do NOT encodeURIComponent
  queryParams.append(`${prefix}errors`, JSON.stringify(prefixedErrors));
};

const withData = (data: Object, queryParams: URLSearchParams) => {
  Object.entries(data).forEach(([key, value]) => {
    queryParams.set(key, value as string);
  });
};
