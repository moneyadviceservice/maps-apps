import { STATE_PENSION_WEEKLY_AMOUNT_ID } from 'data/state-pension';

import { parseStatePensionForm } from './parseStatePensionForm';

describe('parseStatePensionForm', () => {
  it('reads the weekly amount field', () => {
    expect(
      parseStatePensionForm({ [STATE_PENSION_WEEKLY_AMOUNT_ID]: '180' }),
    ).toEqual({ weeklyAmount: '180' });
  });

  it('falls back to weeklyAmount when the field id is absent', () => {
    expect(parseStatePensionForm({ weeklyAmount: '90' })).toEqual({
      weeklyAmount: '90',
    });
  });

  it('returns an empty string when the value is missing or not text', () => {
    expect(parseStatePensionForm({})).toEqual({ weeklyAmount: '' });
    expect(parseStatePensionForm({ weeklyAmount: 180 })).toEqual({
      weeklyAmount: '',
    });
  });
});
