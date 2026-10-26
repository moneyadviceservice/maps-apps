import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('lib/api/ev/getAccessToken');
jest.mock('data/mock/cashflow-forecast-request', () => ({
  mockCashflowForecastRequest: { mockDataKey: 'mockDataValue' },
}));

describe('Cashflow Forecast API Route Handler', () => {
  const ORIGINAL_ENV = process.env;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });

    process.env = {
      ...ORIGINAL_ENV,
      EV_API_CASHFLOW_FORECAST_URL: 'https://api.example.com/cashflow-forecast',
    };

    global.fetch = jest.fn();

    req = {
      method: 'POST',
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  async function loadModule() {
    jest.resetModules();
    const tokenModule = await import('lib/api/ev/getAccessToken');
    const handlerModule = await import('pages/api/cashflow-forecast');

    return {
      handler: handlerModule.default,
      mockGetAccessToken: tokenModule.getAccessToken as jest.MockedFunction<
        typeof tokenModule.getAccessToken
      >,
    };
  }

  it('should return 500 if EV_API_CASHFLOW_FORECAST_URL environment variable is missing', async () => {
    delete process.env.EV_API_CASHFLOW_FORECAST_URL;
    const { handler } = await loadModule();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing cashflow forecast API URL',
    });
  });

  it('should successfully acquire token, execute API call, and return forecast data', async () => {
    const { handler, mockGetAccessToken } = await loadModule();
    mockGetAccessToken.mockResolvedValueOnce('test-access-token');

    const mockForecastResponse = { forecast: [100, 200, 300] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockForecastResponse),
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockGetAccessToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/cashflow-forecast',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-access-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mockDataKey: 'mockDataValue' }),
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockForecastResponse);
  });

  it('should return external API error status and text when the downstream API call fails', async () => {
    const { handler, mockGetAccessToken } = await loadModule();
    mockGetAccessToken.mockResolvedValueOnce('test-access-token');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: jest.fn().mockResolvedValueOnce('Unprocessable Entity'),
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unprocessable Entity' });
    expect(console.error).toHaveBeenCalledWith(
      'API call failed:',
      'Unprocessable Entity',
    );
  });

  it('should catch thrown errors and return 500 internal server error', async () => {
    const { handler, mockGetAccessToken } = await loadModule();
    const mockError = new Error('Failed to retrieve token');
    mockGetAccessToken.mockRejectedValueOnce(mockError);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(console.error).toHaveBeenCalledWith(
      'Error in cashflow-forecast handler:',
      mockError,
    );
  });
});
