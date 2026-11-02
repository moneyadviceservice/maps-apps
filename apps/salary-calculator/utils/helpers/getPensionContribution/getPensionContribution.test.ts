import { getPensionContribution } from './getPensionContribution';

describe('getPensionContribution', () => {
  describe('employee contributions', () => {
    it('returns a percentage when the type is percentage', () => {
      const result = getPensionContribution({
        pensionType: 'percentage',
        pensionValue: '5',
      });
      expect(result).toEqual({ pensionType: 'percentage', pensionValue: 5 });
    });

    it('returns a fixed amount when the type is fixed', () => {
      const result = getPensionContribution({
        pensionType: 'fixed',
        pensionValue: '100',
      });
      expect(result).toEqual({ pensionType: 'fixed', pensionValue: 100 });
    });

    it('strips thousands separators from the value', () => {
      const result = getPensionContribution({
        pensionType: 'fixed',
        pensionValue: '1,250.50',
      });
      expect(result).toEqual({ pensionType: 'fixed', pensionValue: 1250.5 });
    });

    it('defaults to percentage when the type is missing or unknown', () => {
      expect(getPensionContribution({ pensionValue: '5' })).toEqual({
        pensionType: 'percentage',
        pensionValue: 5,
      });
      expect(
        getPensionContribution({ pensionType: 'other', pensionValue: '5' }),
      ).toEqual({ pensionType: 'percentage', pensionValue: 5 });
    });

    it('keeps the chosen type with a null value when the value is blank or 0', () => {
      expect(
        getPensionContribution({ pensionType: 'fixed', pensionValue: '' }),
      ).toEqual({ pensionType: 'fixed', pensionValue: null });
      expect(
        getPensionContribution({ pensionType: 'fixed', pensionValue: '0' }),
      ).toEqual({ pensionType: 'fixed', pensionValue: null });
    });

    it('returns percentage with a null value when nothing is provided', () => {
      expect(getPensionContribution({})).toEqual({
        pensionType: 'percentage',
        pensionValue: null,
      });
    });

    it('ignores non-numeric values', () => {
      expect(
        getPensionContribution({ pensionType: 'fixed', pensionValue: 'abc' }),
      ).toEqual({ pensionType: 'fixed', pensionValue: null });
    });
  });

  describe('employer contributions', () => {
    it('reads the employer keys', () => {
      const result = getPensionContribution(
        {
          pensionType: 'fixed',
          pensionValue: '100',
          employerPensionType: 'percentage',
          employerPensionValue: '3',
        },
        'employer',
      );
      expect(result).toEqual({ pensionType: 'percentage', pensionValue: 3 });
    });

    it('returns percentage with a null value when the employer keys are absent', () => {
      const result = getPensionContribution(
        { pensionType: 'fixed', pensionValue: '100' },
        'employer',
      );
      expect(result).toEqual({ pensionType: 'percentage', pensionValue: null });
    });
  });

  describe('links created before the type dropdown existed', () => {
    it('falls back to pensionPercent', () => {
      const result = getPensionContribution({
        pensionPercent: '7',
        pensionFixed: '',
      });
      expect(result).toEqual({ pensionType: 'percentage', pensionValue: 7 });
    });

    it('falls back to pensionFixed when pensionPercent is 0', () => {
      const result = getPensionContribution({
        pensionPercent: '0',
        pensionFixed: '150',
      });
      expect(result).toEqual({ pensionType: 'fixed', pensionValue: 150 });
    });

    it('ignores the old keys once the new keys are present', () => {
      const result = getPensionContribution({
        pensionType: 'percentage',
        pensionValue: '',
        pensionPercent: '7',
      });
      expect(result).toEqual({ pensionType: 'percentage', pensionValue: null });
    });

    it('never applies the old keys to the employer', () => {
      const result = getPensionContribution(
        { pensionPercent: '7' },
        'employer',
      );
      expect(result).toEqual({ pensionType: 'percentage', pensionValue: null });
    });
  });
});
