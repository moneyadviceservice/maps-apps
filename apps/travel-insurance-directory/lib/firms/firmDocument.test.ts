import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import { hasPositiveAgeLimit } from './firmDocument';

describe('firmDocument', () => {
  describe('hasPositiveAgeLimit', () => {
    it('is false when age_limits has no positive limits', () => {
      const ageLimits = tripCoverWithAgeLimits({}).age_limits;
      expect(hasPositiveAgeLimit(ageLimits, 'up_to_30_days', 'land')).toBe(
        false,
      );
    });

    it('is true when at least one bucket has a positive land or cruise limit', () => {
      const ageLimits = tripCoverWithAgeLimits({
        up_to_30_days: { land: 75, cruise: null },
      }).age_limits;

      expect(hasPositiveAgeLimit(ageLimits, 'up_to_30_days', 'land')).toBe(
        true,
      );
    });
  });
});
