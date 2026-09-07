import { emptyServiceDetails } from 'lib/firms/firmDefaults';

import {
  buildServiceDetailsPatchRecord,
  formatAdvanceToFormValue,
  formatServiceDetailsToFormValues,
  formatYesNoToFormValue,
  parseAdvanceFromFormValue,
  parseServiceDetailsFields,
  parseYesNoFromFormValue,
} from './serviceDetailsFormValues';

describe('serviceDetailsFormValues', () => {
  describe('formatYesNoToFormValue', () => {
    it('maps booleans to yes/no', () => {
      expect(formatYesNoToFormValue(true)).toBe('yes');
      expect(formatYesNoToFormValue(false)).toBe('no');
    });

    it('accepts legacy yes/no strings', () => {
      expect(formatYesNoToFormValue('yes')).toBe('yes');
      expect(formatYesNoToFormValue('NO')).toBe('no');
    });

    it('returns empty string for null or unknown values', () => {
      expect(formatYesNoToFormValue(null)).toBe('');
      expect(formatYesNoToFormValue('maybe')).toBe('');
    });
  });

  describe('parseYesNoFromFormValue', () => {
    it('parses yes/no to booleans', () => {
      expect(parseYesNoFromFormValue('yes')).toBe(true);
      expect(parseYesNoFromFormValue('no')).toBe(false);
    });

    it('returns null for missing or invalid values', () => {
      expect(parseYesNoFromFormValue('')).toBeNull();
      expect(parseYesNoFromFormValue(undefined)).toBeNull();
    });
  });

  describe('formatAdvanceToFormValue', () => {
    it('maps Cosmos underscore values to form select values', () => {
      expect(formatAdvanceToFormValue('up_to_18_month')).toBe(
        'up-to-18-months',
      );
      expect(formatAdvanceToFormValue('up_to_24_month')).toBe(
        'up-to-24-months',
      );
      expect(formatAdvanceToFormValue('over_24_months')).toBe('over-24-months');
    });

    it('returns empty string for values without form options', () => {
      expect(formatAdvanceToFormValue('up_to_12_month')).toBe('');
      expect(formatAdvanceToFormValue(null)).toBe('');
    });
  });

  describe('parseAdvanceFromFormValue', () => {
    it('parses form values to Cosmos enum', () => {
      expect(parseAdvanceFromFormValue('up-to-18-months')).toBe(
        'up_to_18_month',
      );
      expect(parseAdvanceFromFormValue('up-to-24-months')).toBe(
        'up_to_24_month',
      );
      expect(parseAdvanceFromFormValue('over-24-months')).toBe(
        'over_24_months',
      );
    });

    it('returns null for missing or unknown values', () => {
      expect(parseAdvanceFromFormValue('')).toBeNull();
      expect(parseAdvanceFromFormValue('up_to_12_month')).toBeNull();
    });
  });

  describe('formatServiceDetailsToFormValues', () => {
    it('round-trips Cosmos-shaped service details', () => {
      const values = formatServiceDetailsToFormValues({
        ...emptyServiceDetails(),
        offers_telephone_quote: true,
        will_cover_specialist_equipment: false,
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up_to_18_month',
      });

      expect(values).toEqual({
        offers_telephone_quote: 'yes',
        will_cover_specialist_equipment: 'no',
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up-to-18-months',
      });
    });

    it('returns empty values for null fields', () => {
      const values = formatServiceDetailsToFormValues(emptyServiceDetails());

      expect(values).toEqual({
        offers_telephone_quote: '',
        will_cover_specialist_equipment: '',
        medical_screening_company: '',
        how_far_in_advance_trip_cover: '',
      });
    });
  });

  describe('parseServiceDetailsFields', () => {
    it('parses valid form fields to Cosmos-shaped partial', () => {
      const { serviceDetails, fieldErrors } = parseServiceDetailsFields({
        offers_telephone_quote: 'yes',
        will_cover_specialist_equipment: 'no',
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up-to-18-months',
      });

      expect(fieldErrors).toEqual({});
      expect(serviceDetails).toEqual({
        offers_telephone_quote: true,
        will_cover_specialist_equipment: false,
        medical_screening_company: 'verisk',
        how_far_in_advance_trip_cover: 'up_to_18_month',
      });
    });

    it('returns field errors for missing values', () => {
      const { serviceDetails, fieldErrors } = parseServiceDetailsFields({});

      expect(serviceDetails).toBeNull();
      expect(fieldErrors).toEqual({
        offers_telephone_quote: { error: 'required' },
        will_cover_specialist_equipment: { error: 'required' },
        medical_screening_company: { error: 'required' },
        how_far_in_advance_trip_cover: { error: 'required' },
      });
    });
  });

  describe('buildServiceDetailsPatchRecord', () => {
    it('builds patch paths for service_details fields', () => {
      expect(
        buildServiceDetailsPatchRecord({
          offers_telephone_quote: true,
          how_far_in_advance_trip_cover: 'up_to_18_month',
        }),
      ).toEqual({
        'service_details/offers_telephone_quote': true,
        'service_details/how_far_in_advance_trip_cover': 'up_to_18_month',
      });
    });
  });
});
