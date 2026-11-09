import { STATE_PENSION_WEEKLY_AMOUNT_ID } from 'data/state-pension';
import { defaultStatePensionData } from 'types/statePension';

import { hasStatePensionErrors, validateStatePension } from './statePension';

const maxWeeklyAmount = '250.00';
const amountError = 'Enter an amount in pounds, like 250.00';

describe('validateStatePension', () => {
  it('accepts a blank or whitespace amount', () => {
    expect(
      validateStatePension(defaultStatePensionData(), maxWeeklyAmount),
    ).toEqual({});
    expect(
      validateStatePension({ weeklyAmount: '   ' }, maxWeeklyAmount, 'en'),
    ).toEqual({});
  });

  it('accepts a numeric amount up to 999', () => {
    expect(
      validateStatePension({ weeklyAmount: '180.5' }, maxWeeklyAmount, 'en'),
    ).toEqual({});
    expect(
      validateStatePension({ weeklyAmount: '999' }, maxWeeklyAmount),
    ).toEqual({});
    expect(
      validateStatePension({ weeklyAmount: '999.00' }, maxWeeklyAmount),
    ).toEqual({});
  });

  it('rejects an amount above 999', () => {
    const tooLarge = 'Enter an amount of £999 or less';

    expect(
      validateStatePension({ weeklyAmount: '1,000,000' }, maxWeeklyAmount),
    ).toEqual({
      [STATE_PENSION_WEEKLY_AMOUNT_ID]: [tooLarge],
    });
    expect(
      validateStatePension({ weeklyAmount: '999.01' }, maxWeeklyAmount, 'cy'),
    ).toEqual({
      [STATE_PENSION_WEEKLY_AMOUNT_ID]: [tooLarge],
    });
  });

  it('rejects a non-numeric amount in English', () => {
    expect(
      validateStatePension({ weeklyAmount: 'abc' }, maxWeeklyAmount),
    ).toEqual({
      [STATE_PENSION_WEEKLY_AMOUNT_ID]: [amountError],
    });
  });

  it('uses the English message when Welsh copy is empty', () => {
    expect(
      validateStatePension({ weeklyAmount: 'abc' }, maxWeeklyAmount, 'cy'),
    ).toEqual({
      [STATE_PENSION_WEEKLY_AMOUNT_ID]: [amountError],
    });
  });
});

describe('hasStatePensionErrors', () => {
  it('is false for an empty error map and true when a field has an error', () => {
    expect(hasStatePensionErrors({})).toBe(false);
    expect(
      hasStatePensionErrors({
        [STATE_PENSION_WEEKLY_AMOUNT_ID]: [amountError],
      }),
    ).toBe(true);
  });
});
