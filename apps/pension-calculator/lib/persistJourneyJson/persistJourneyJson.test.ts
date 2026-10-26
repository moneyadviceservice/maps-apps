import { persistJourneyJson } from './persistJourneyJson';

describe('persistJourneyJson', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('posts JSON without flow and returns parsed response body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        redirectPath: '/en/save?sessionId=abc',
      }),
    }) as jest.Mock;

    await expect(
      persistJourneyJson('/api/your-income', 'continue', 'en', 'abc', {
        grossPay: '26900',
      }),
    ).resolves.toEqual({
      success: true,
      redirectPath: '/en/save?sessionId=abc',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/your-income?action=continue',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'en',
          sessionId: 'abc',
          grossPay: '26900',
        }),
      },
    );
  });

  it.each([['pots-of-money'], ['income-pensions']] as const)(
    'posts JSON including flow parameter when specified: %s',
    async (flow) => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          redirectPath: `/en/${flow}/details?sessionId=abc`,
        }),
      }) as jest.Mock;

      await expect(
        persistJourneyJson(
          '/api/pensions',
          'continue',
          'en',
          'abc',
          { hasPension: 'yes' },
          flow,
        ),
      ).resolves.toEqual({
        success: true,
        redirectPath: `/en/${flow}/details?sessionId=abc`,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/pensions?action=continue',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: 'en',
            sessionId: 'abc',
            hasPension: 'yes',
            flow,
          }),
        },
      );
    },
  );

  it('throws when the response status is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as jest.Mock;

    await expect(
      persistJourneyJson('/api/about-you', 'continue', 'en', 'abc', {}),
    ).rejects.toThrow('Failed to persist journey data (500)');
  });
});
