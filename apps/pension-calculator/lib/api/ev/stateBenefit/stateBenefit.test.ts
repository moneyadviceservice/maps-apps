import { getAccessToken } from 'lib/api/ev/getAccessToken';

import { getMaxWeeklyAmount } from './stateBenefit';

jest.mock('lib/api/ev/getAccessToken', () => ({
  getAccessToken: jest.fn(),
}));

const mockedToken = getAccessToken as jest.MockedFunction<
  typeof getAccessToken
>;

const mockIncome = (body: unknown, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => body,
  });
};

describe('getMaxWeeklyAmount', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      EV_API: 'https://api.example.com/',
    };
    mockedToken.mockResolvedValue('token-1');
    mockIncome({ income: 12590 });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('requests an access token before the income call', async () => {
    const order: string[] = [];
    mockedToken.mockImplementation(async () => {
      order.push('token');
      return 'token-1';
    });
    (global.fetch as jest.Mock).mockImplementation(async () => {
      order.push('income');
      return { ok: true, json: async () => ({ income: 12590 }) };
    });

    await expect(getMaxWeeklyAmount()).resolves.toBe('242.12');

    expect(order).toEqual(['token', 'income']);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/state-benefit/1.0.0/stateBenefitAge/income',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
        }),
      }),
    );
    expect((global.fetch as jest.Mock).mock.calls[0][1].body).toBeUndefined();
  });

  it('keeps an income figure that is already weekly', async () => {
    mockIncome({ income: 241.3 });

    await expect(getMaxWeeklyAmount()).resolves.toBe('241.30');
  });

  it('rejects when the income call fails', async () => {
    mockIncome({}, false);

    await expect(getMaxWeeklyAmount()).rejects.toThrow(
      'State benefit request failed',
    );
  });

  it('rejects when the income response has no amount', async () => {
    mockIncome({ credits: 1 });

    await expect(getMaxWeeklyAmount()).rejects.toThrow(
      'State benefit income response did not include an amount',
    );
  });
});
