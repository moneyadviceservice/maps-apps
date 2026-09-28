import { defaultAboutYouData } from 'types/aboutYou';

import {
  ensureAboutYouDefaults,
  parseAboutYouForm,
  toDateInputDefaultValues,
} from './parseAboutYouForm';

describe('parseAboutYouForm', () => {
  it('reads day, month, year, sex and retirement age', () => {
    expect(
      parseAboutYouForm({
        day: '27',
        month: '03',
        year: '1960',
        sex: 'female',
        retireAge: '65',
      }),
    ).toEqual({
      day: '27',
      month: '03',
      year: '1960',
      sex: 'female',
      retireAge: '65',
    });
  });

  it('ignores unexpected sex values', () => {
    expect(parseAboutYouForm({ sex: 'other' }).sex).toBe('');
  });
});

describe('ensureAboutYouDefaults', () => {
  it('returns empty defaults when no data is stored', () => {
    expect(ensureAboutYouDefaults(null)).toEqual(defaultAboutYouData());
  });
});

describe('toDateInputDefaultValues', () => {
  it('returns an empty string when the date is blank', () => {
    expect(toDateInputDefaultValues(defaultAboutYouData())).toBe('');
  });

  it('joins entered parts for DateInput', () => {
    expect(
      toDateInputDefaultValues({
        ...defaultAboutYouData(),
        day: '27',
        month: '3',
        year: '1960',
      }),
    ).toBe('27-3-1960');
  });
});
