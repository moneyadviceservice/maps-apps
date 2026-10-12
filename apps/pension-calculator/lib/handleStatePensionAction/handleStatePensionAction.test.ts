import { type JourneyAction } from 'data/journey';
import { STATE_PENSION_WEEKLY_AMOUNT_ID } from 'data/state-pension';
import { getMaxWeeklyAmount } from 'lib/api/ev/stateBenefit';
import { saveStatePensionToSession } from 'lib/session/statePensionSession';

import { handleStatePensionAction } from './handleStatePensionAction';

jest.mock('lib/api/ev/stateBenefit', () => ({
  getMaxWeeklyAmount: jest.fn(),
}));

jest.mock('lib/session/statePensionSession', () => ({
  saveStatePensionToSession: jest.fn(),
}));

const mockedMax = getMaxWeeklyAmount as jest.MockedFunction<
  typeof getMaxWeeklyAmount
>;
const mockedSave = saveStatePensionToSession as jest.MockedFunction<
  typeof saveStatePensionToSession
>;

const sessionId = 'abc';
const amountError = 'Enter an amount in pounds, like 250.00';

const run = (action: JourneyAction, body: Record<string, unknown>) =>
  handleStatePensionAction({ action, language: 'en', sessionId, body });

describe('handleStatePensionAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedMax.mockResolvedValue('250.00');
  });

  it.each(['180', ''])(
    'stores %j and stays on the state pension page',
    async (weeklyAmount) => {
      const result = await run('continue', { weeklyAmount });

      expect(result.valid).toBe(true);
      expect(mockedSave).toHaveBeenCalledWith(sessionId, { weeklyAmount });
      expect(result.redirectPath).toBe('/en/state-pension?sessionId=abc');
    },
  );

  it.each([
    ['continue', { [STATE_PENSION_WEEKLY_AMOUNT_ID]: 'abc' }],
    ['save', { weeklyAmount: 'abc' }],
  ] as const)(
    'sends a non-numeric %s back to the page with an error',
    async (action, body) => {
      const result = await run(action, body);

      expect(result.valid).toBe(false);
      expect(result.errors[STATE_PENSION_WEEKLY_AMOUNT_ID]).toEqual([
        amountError,
      ]);
      expect(mockedSave).toHaveBeenCalledWith(sessionId, {
        weeklyAmount: 'abc',
      });
      expect(result.redirectPath).toBe(
        '/en/state-pension?error=true&sessionId=abc',
      );
    },
  );

  it('rejects a weekly amount above 999', async () => {
    const result = await run('continue', { weeklyAmount: '1,000,000' });

    expect(result.valid).toBe(false);
    expect(result.errors[STATE_PENSION_WEEKLY_AMOUNT_ID]).toEqual([
      'Enter an amount of £999 or less',
    ]);
    expect(result.redirectPath).toBe(
      '/en/state-pension?error=true&sessionId=abc',
    );
  });

  it('sends a valid save to the save page', async () => {
    const result = await run('save', { weeklyAmount: '180' });

    expect(result.valid).toBe(true);
    expect(result.redirectPath).toBe('/en/save?sessionId=abc');
  });
});
