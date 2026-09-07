import { AGE_LIMIT_FIELD_KEYS } from 'lib/account/tripCover/TripCoverAgeLimits/ageLimitFormValues';

import {
  getAgeLimitFieldLabels,
  getAgeLimitRequiredMessages,
  REGIONS_COVERED_FIELD_LABELS,
  REGIONS_COVERED_REQUIRED_MESSAGE,
  TRIP_COVER_REGION_FIELD_NAME,
} from './tripCoverConfig';

describe('tripCoverConfig', () => {
  it('returns labels for every age limit field key', () => {
    const labels = getAgeLimitFieldLabels();

    for (const key of AGE_LIMIT_FIELD_KEYS) {
      expect(labels[key]).toEqual(expect.stringContaining(' - '));
    }

    expect(labels.up_to_30_days_land).toBe(
      'Up to 30 days - Maximum age for non-cruise trips',
    );
  });

  it('returns GDS-aligned required messages for every age limit field key', () => {
    const messages = getAgeLimitRequiredMessages();

    for (const key of AGE_LIMIT_FIELD_KEYS) {
      expect(messages[key]).toMatch(/^Select a maximum age for /);
      expect(messages[key]).not.toMatch(/please/i);
    }

    expect(messages.up_to_30_days_land).toBe(
      'Select a maximum age for non-cruise trips up to 30 days',
    );
    expect(messages.up_to_90_days_cruise).toBe(
      'Select a maximum age for cruise trips up to 90 days',
    );
    expect(messages.over_90_days_land).toBe(
      'Select a maximum age for non-cruise trips over 90 days',
    );
  });

  it('returns the regions covered field label', () => {
    expect(REGIONS_COVERED_FIELD_LABELS[TRIP_COVER_REGION_FIELD_NAME]).toBe(
      'Which regions do you offer cover for?',
    );
    expect(REGIONS_COVERED_REQUIRED_MESSAGE).toBe(
      'At least one region must be selected before continuing',
    );
  });
});
