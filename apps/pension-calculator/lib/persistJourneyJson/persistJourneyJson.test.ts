import { persistJourneyJson } from './persistJourneyJson';

describe('persistJourneyJson', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('posts JSON and returns the parsed body', async () => {
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

  it('throws when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as jest.Mock;

    await expect(
      persistJourneyJson('/api/about-you', 'continue', 'en', 'abc', {}),
    ).rejects.toThrow('Failed to persist journey data (500)');
  });
});
