import {
  NO_AGE_RESTRICTION_VALUE,
  NOT_OFFERED_VALUE,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';

import {
  formatAgeLimitDisplay,
  formatDurationBucketDisplay,
} from './formatAgeLimitDisplay';

describe('formatAgeLimitDisplay', () => {
  it('defaults null to no age restriction', () => {
    expect(formatAgeLimitDisplay(null)).toBe('No age restriction');
  });

  it('formats special values', () => {
    expect(formatAgeLimitDisplay(NO_AGE_RESTRICTION_VALUE)).toBe(
      'No age restriction',
    );
    expect(formatAgeLimitDisplay(NOT_OFFERED_VALUE)).toBe('Not offered');
  });

  it('formats numeric ages', () => {
    expect(formatAgeLimitDisplay(75)).toBe('75');
  });
});

describe('formatDurationBucketDisplay', () => {
  it('returns a single label when land and cruise match', () => {
    const ageLimits = emptyTripCoverAgeLimits();
    ageLimits.up_to_30_days.land = NO_AGE_RESTRICTION_VALUE;
    ageLimits.up_to_30_days.cruise = NO_AGE_RESTRICTION_VALUE;

    expect(formatDurationBucketDisplay(ageLimits, 'up_to_30_days')).toBe(
      'No age restriction',
    );
  });

  it('combines land and cruise when values differ', () => {
    const ageLimits = emptyTripCoverAgeLimits();
    ageLimits.up_to_90_days.land = 75;
    ageLimits.up_to_90_days.cruise = NOT_OFFERED_VALUE;

    expect(formatDurationBucketDisplay(ageLimits, 'up_to_90_days')).toBe(
      'Land: 75, Cruise: Not offered',
    );
  });

  it('defaults when age limits are undefined', () => {
    expect(formatDurationBucketDisplay(undefined, 'over_90_days')).toBe(
      'No age restriction',
    );
  });
});
