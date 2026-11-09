import {
  parseCoverAreas,
  parseTripCoverStepParams,
} from './tripCoverValidation';

describe('tripCoverValidation', () => {
  describe('parseTripCoverStepParams', () => {
    it('returns a step for valid cover area and trip type', () => {
      expect(parseTripCoverStepParams('uk_and_europe', 'single_trip')).toEqual({
        coverArea: 'uk_and_europe',
        tripType: 'single_trip',
      });
    });

    it('returns null for invalid values', () => {
      expect(parseTripCoverStepParams('invalid', 'single_trip')).toBeNull();
      expect(parseTripCoverStepParams('uk_and_europe', 'invalid')).toBeNull();
    });
  });

  describe('parseCoverAreas', () => {
    it('filters unknown checkbox values', () => {
      expect(parseCoverAreas(['uk_and_europe', 'invalid-region'])).toEqual([
        'uk_and_europe',
      ]);
    });
  });
});
