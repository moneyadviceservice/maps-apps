import {
  NO_AGE_RESTRICTION_VALUE,
  NOT_OFFERED_VALUE,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';
import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import {
  AGE_LIMIT_FIELD_KEYS,
  areAgeLimitsSaved,
  formatAgeLimitForSelect,
  formatAgeLimitsToFormValues,
  isTripCoverAgeStepComplete,
  parseAgeLimitFields,
} from './ageLimitFormValues';

describe('ageLimitFormValues', () => {
  it('defaults null stored values to an empty select value', () => {
    expect(formatAgeLimitForSelect(null)).toBe('');
    expect(
      formatAgeLimitsToFormValues(emptyTripCoverAgeLimits())[
        'up_to_30_days_land'
      ],
    ).toBe('');
  });

  it('parses valid age limit fields', () => {
    const { ageLimits, fieldErrors } = parseAgeLimitFields({
      up_to_30_days_land: '75',
      up_to_30_days_cruise: String(NOT_OFFERED_VALUE),
      up_to_90_days_land: String(NO_AGE_RESTRICTION_VALUE),
      up_to_90_days_cruise: '70',
      over_90_days_land: '86',
      over_90_days_cruise: '65',
    });

    expect(fieldErrors).toEqual({});
    expect(ageLimits?.up_to_30_days.land).toBe(75);
    expect(ageLimits?.up_to_30_days.cruise).toBe(NOT_OFFERED_VALUE);
    expect(ageLimits?.up_to_90_days.land).toBe(NO_AGE_RESTRICTION_VALUE);
    expect(ageLimits?.over_90_days.cruise).toBe(65);
  });

  it('returns field errors for missing or invalid values', () => {
    const { ageLimits, fieldErrors } = parseAgeLimitFields({
      up_to_30_days_land: '',
    });

    expect(ageLimits).toBeNull();
    expect(fieldErrors.up_to_30_days_land).toEqual({ error: 'required' });
  });

  it('returns required errors for all fields when every value is empty', () => {
    const emptyBody = Object.fromEntries(
      AGE_LIMIT_FIELD_KEYS.map((key) => [key, '']),
    );
    const { ageLimits, fieldErrors } = parseAgeLimitFields(emptyBody);

    expect(ageLimits).toBeNull();
    for (const key of AGE_LIMIT_FIELD_KEYS) {
      expect(fieldErrors[key]).toEqual({ error: 'required' });
    }
  });

  it('treats all default dropdown values as saved', () => {
    const allNoRestriction = formatAgeLimitsToFormValues({
      up_to_30_days: {
        land: NO_AGE_RESTRICTION_VALUE,
        cruise: NO_AGE_RESTRICTION_VALUE,
      },
      up_to_90_days: {
        land: NO_AGE_RESTRICTION_VALUE,
        cruise: NO_AGE_RESTRICTION_VALUE,
      },
      over_90_days: {
        land: NO_AGE_RESTRICTION_VALUE,
        cruise: NO_AGE_RESTRICTION_VALUE,
      },
    });

    const parsed = parseAgeLimitFields(allNoRestriction);
    expect(areAgeLimitsSaved(parsed.ageLimits!)).toBe(true);
    expect(
      isTripCoverAgeStepComplete(
        tripCoverWithAgeLimits(parsed.ageLimits!, {
          cover_area: 'worldwide_including_us_canada',
          trip_type: 'annual_multi_trip',
        }),
      ),
    ).toBe(true);
  });

  it('treats all not offered values as saved', () => {
    const allNotOffered = formatAgeLimitsToFormValues({
      up_to_30_days: { land: NOT_OFFERED_VALUE, cruise: NOT_OFFERED_VALUE },
      up_to_90_days: { land: NOT_OFFERED_VALUE, cruise: NOT_OFFERED_VALUE },
      over_90_days: { land: NOT_OFFERED_VALUE, cruise: NOT_OFFERED_VALUE },
    });

    const parsed = parseAgeLimitFields(allNotOffered);
    expect(areAgeLimitsSaved(parsed.ageLimits!)).toBe(true);
  });

  it('is not saved when any value is still null', () => {
    expect(
      areAgeLimitsSaved(
        tripCoverWithAgeLimits({
          up_to_30_days: { land: 75, cruise: null },
        }).age_limits,
      ),
    ).toBe(false);
  });
});
