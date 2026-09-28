import { handlePensionsAction } from './handlePensionsAction';

jest.mock('lib/session/pensionsSession', () => ({
  savePensionsToSession: jest.fn().mockResolvedValue(undefined),
}));

describe('handlePensionsAction', () => {
  const request = (overrides: Record<string, unknown> = {}) => ({
    hasPotOfMoneyPension: 'yes',
    potCount: '1',
    'pension-pot-0-currentValue': '26900',
    ...overrides,
  });

  it('skips DC details when the user chooses no', async () => {
    const result = await handlePensionsAction({
      action: 'continue',
      step: 'screening',
      language: 'en',
      sessionId: 'abc',
      body: request({ hasPotOfMoneyPension: 'no' }),
    });
    expect(result.redirectPath).toBe('/en/income-pensions?sessionId=abc');
  });

  it('adds a pot and directs focus to its name field', async () => {
    const result = await handlePensionsAction({
      action: 'add',
      step: 'details',
      language: 'en',
      sessionId: 'abc',
      body: request(),
    });
    expect(result.data.pots).toHaveLength(2);
    expect(result.redirectPath).toContain('#pension-pot-1-name');
  });

  it('requires a valid pension value before contributions', async () => {
    const result = await handlePensionsAction({
      action: 'continue',
      step: 'details',
      language: 'en',
      sessionId: 'abc',
      body: request({ 'pension-pot-0-currentValue': '' }),
    });
    expect(result.valid).toBe(false);
    expect(result.redirectPath).toContain('/en/pots-of-money/details');
  });

  it('advances valid contributions to the summary route', async () => {
    const result = await handlePensionsAction({
      action: 'continue',
      step: 'contributions',
      language: 'en',
      sessionId: 'abc',
      body: request(),
    });
    expect(result.valid).toBe(true);
    expect(result.redirectPath).toBe('/en/pots-of-money/summary?sessionId=abc');
  });
});
