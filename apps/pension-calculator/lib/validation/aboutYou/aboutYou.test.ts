import { defaultAboutYouData } from 'types/aboutYou';
import { DAY_ID, RETIRE_AGE_ID, SEX_MALE_ID } from 'data/aboutYouFieldIds';

import { validateAboutYou } from './aboutYou';

const now = new Date(2026, 8, 10);

const validData = {
  day: '10',
  month: '09',
  year: '1986',
  sex: 'male' as const,
  retireAge: '65',
};

describe('validateAboutYou', () => {
  it('returns the format error for blank, invalid or future dates of birth', () => {
    expect(validateAboutYou(defaultAboutYouData(), 'en', now)[DAY_ID]).toEqual([
      'Enter your date of birth as DD:MM:YYYY. For example, 27 03 1960.',
    ]);
    expect(
      validateAboutYou(
        { ...validData, day: '31', month: '02', year: '1960' },
        'en',
        now,
      )[DAY_ID],
    ).toBeDefined();
    expect(
      validateAboutYou(
        { ...validData, day: '11', month: '09', year: '2026' },
        'en',
        now,
      )[DAY_ID],
    ).toBeDefined();
  });

  it('returns the age range error outside 18-74 and accepts the boundaries', () => {
    expect(
      validateAboutYou(
        { ...validData, day: '11', month: '09', year: '2008' },
        'en',
        now,
      )[DAY_ID],
    ).toEqual(['Your age must be between 18 and 74.']);
    expect(
      validateAboutYou(
        { ...validData, day: '10', month: '09', year: '2008', retireAge: '55' },
        'en',
        now,
      )[DAY_ID],
    ).toBeUndefined();
    expect(
      validateAboutYou(
        { ...validData, day: '10', month: '09', year: '1952', retireAge: '74' },
        'en',
        now,
      )[DAY_ID],
    ).toBeUndefined();
  });

  it('requires male or female', () => {
    expect(
      validateAboutYou({ ...validData, sex: '' }, 'en', now)[SEX_MALE_ID],
    ).toEqual(['Select male or female.']);
  });

  it('rejects invalid retirement ages and allows retiring at current age when 55+', () => {
    expect(
      validateAboutYou({ ...validData, retireAge: '54' }, 'en', now)[
        RETIRE_AGE_ID
      ],
    ).toBeDefined();
    expect(
      validateAboutYou(
        { ...validData, day: '10', month: '09', year: '1966', retireAge: '55' },
        'en',
        now,
      )[RETIRE_AGE_ID],
    ).toBeDefined();
    expect(
      validateAboutYou(
        { ...validData, day: '10', month: '09', year: '1966', retireAge: '60' },
        'en',
        now,
      ),
    ).toEqual({});
  });
});
