import { defaultYourIncomeData } from 'types/income';

import { handleYourIncomeAction } from './handleYourIncomeAction';

jest.mock('lib/session/incomeSession', () => ({
  saveIncomeToSession: jest.fn().mockResolvedValue(undefined),
}));

describe('handleYourIncomeAction', () => {
  const sessionId = 'session123';

  it('redirects to pots of money when continue is valid', async () => {
    const result = await handleYourIncomeAction({
      action: 'continue',
      language: 'en',
      sessionId,
      body: {
        grossPay: '26900',
        grossPayFrequency: 'year',
        otherIncomeCount: '1',
        'other-income-0-name': '',
        'other-income-0-amount': '',
        'other-income-0-frequency': 'year',
      },
    });

    expect(result.valid).toBe(true);
    expect(result.redirectPath).toBe('/en/pots-of-money?sessionId=session123');
  });

  it('stays on your income with errors when gross pay is missing', async () => {
    const result = await handleYourIncomeAction({
      action: 'continue',
      language: 'en',
      sessionId,
      body: defaultYourIncomeData(),
    });

    expect(result.valid).toBe(false);
    expect(result.errors.grossPay).toBeDefined();
    expect(result.redirectPath).toContain('/en/your-income');
    expect(result.redirectPath).toContain('error=true');
  });

  it('adds a row and focuses the new name field', async () => {
    const result = await handleYourIncomeAction({
      action: 'add',
      language: 'en',
      sessionId,
      body: defaultYourIncomeData(),
    });

    expect(result.data.otherIncome).toHaveLength(2);
    expect(result.redirectPath).toBe(
      '/en/your-income?sessionId=session123#other-income-1-name',
    );
  });

  it('removes a row and returns focus to the other-income list', async () => {
    const result = await handleYourIncomeAction({
      action: 'remove',
      language: 'en',
      sessionId,
      removeIndex: 1,
      body: {
        grossPay: '100',
        otherIncome: [
          { name: 'A', amount: '1', frequency: 'year' },
          { name: 'B', amount: '2', frequency: 'year' },
        ],
      },
    });

    expect(result.data.otherIncome).toHaveLength(1);
    expect(result.data.otherIncome[0].name).toBe('A');
    expect(result.redirectPath).toBe(
      '/en/your-income?sessionId=session123#other-income',
    );
  });

  it('uses body.index when removeIndex is omitted', async () => {
    const result = await handleYourIncomeAction({
      action: 'remove',
      language: 'en',
      sessionId,
      body: {
        index: '1',
        grossPay: '100',
        otherIncome: [
          { name: 'A', amount: '1', frequency: 'year' },
          { name: 'B', amount: '2', frequency: 'year' },
        ],
      },
    });

    expect(result.data.otherIncome).toHaveLength(1);
    expect(result.data.otherIncome[0].name).toBe('A');
  });

  it('leaves rows unchanged when the remove index is invalid', async () => {
    const result = await handleYourIncomeAction({
      action: 'remove',
      language: 'en',
      sessionId,
      body: {
        index: 'nope',
        grossPay: '100',
        otherIncome: [
          { name: 'A', amount: '1', frequency: 'year' },
          { name: 'B', amount: '2', frequency: 'year' },
        ],
      },
    });

    expect(result.data.otherIncome).toHaveLength(2);
  });

  it('persists an update without changing the path', async () => {
    const result = await handleYourIncomeAction({
      action: 'update',
      language: 'en',
      sessionId,
      body: {
        grossPay: '100',
        otherIncome: [{ name: 'A', amount: '1', frequency: 'year' }],
      },
    });

    expect(result.redirectPath).toBe('/en/your-income?sessionId=session123');
    expect(result.data.grossPay).toBe('100');
  });

  it('saves and redirects to the save journey', async () => {
    const result = await handleYourIncomeAction({
      action: 'save',
      language: 'en',
      sessionId,
      body: defaultYourIncomeData(),
    });

    expect(result.redirectPath).toBe('/en/save?sessionId=session123');
  });
});
