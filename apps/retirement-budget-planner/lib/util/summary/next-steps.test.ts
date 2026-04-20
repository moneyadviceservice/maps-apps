jest.mock('./state-pension-age', () => ({
  getCurrentAgeInYearsAndMonths: jest.fn(),
  parsePensionAge: jest.fn(),
  getStatePensionAge: jest.fn(),
}));

jest.mock('../summaryCalculations/calculations', () => ({
  sumFields: jest.fn(),
}));

import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';
import { INCOME_FIELDS, prefix } from 'data/retirementIncomeData';
import { FIELD_NAMES } from 'data/essentialOutgoingsData';

import {
  getCurrentAgeInYearsAndMonths,
  getStatePensionAge,
  parsePensionAge,
} from './state-pension-age';

import {
  findDisplayBoostStatePension,
  getAllCostRelatedNextStepsFlags,
  getlifeExpectancyDetails,
  hasentitelementsToAdditionalBenefits,
  shouldDisplayAgeHeading,
} from './next-steps';

import { sumFields } from '../summaryCalculations/calculations';

describe('retirement/helpers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('findDisplayBoostStatePension', () => {
    it('returns true when below full pension, age < pension age', () => {
      (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(60);
      (parsePensionAge as jest.Mock).mockReturnValue(67);

      const income = {
        [`${prefix}${INCOME_FIELDS.STATE}`]: '500',
        [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.MONTH,
      };

      const result = findDisplayBoostStatePension(income, '67', {
        day: '01',
        month: '01',
        year: '1960',
      });

      expect(result).toBe(true);
    });

    it('returns false when annual pension >= full amount', () => {
      (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(60);
      (parsePensionAge as jest.Mock).mockReturnValue(67);

      const income = {
        [`${prefix}${INCOME_FIELDS.STATE}`]: '2000',
        [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.MONTH,
      };

      const result = findDisplayBoostStatePension(income, '67', {
        day: '05',
        month: '02',
        year: '1955',
      });

      expect(result).toBe(false);
    });

    it('returns false when current age >= pension age', () => {
      (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(68);
      (parsePensionAge as jest.Mock).mockReturnValue(67);

      const income = {
        [`${prefix}${INCOME_FIELDS.STATE}`]: '100',
        [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.WEEK,
      };

      expect(
        findDisplayBoostStatePension(income, '67', {
          day: '01',
          month: '01',
          year: '1950',
        }),
      ).toBe(false);
    });
  });

  describe('hasentitelementsToAdditionalBenefits', () => {
    beforeEach(() => jest.clearAllMocks());
    it('returns true when benefits > 0', () => {
      (sumFields as jest.Mock).mockReturnValue(5000);

      const income = {
        [`${prefix}${INCOME_FIELDS.BENEFITS}`]: '100',
      };

      expect(hasentitelementsToAdditionalBenefits(income)).toBe(true);
    });

    it('returns true when annual income < pension credit threshold', () => {
      (sumFields as jest.Mock).mockReturnValue(500);

      const income = {
        [`${prefix}${INCOME_FIELDS.STATE}`]: '500',
        [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.YEAR,
        [`${prefix}${INCOME_FIELDS.BENEFITS}`]: '0',
      };

      expect(hasentitelementsToAdditionalBenefits(income)).toBe(true);
    });

    it('returns false when income high and no benefits', () => {
      (sumFields as jest.Mock).mockReturnValue(100_000);

      const income = {
        [`${prefix}${INCOME_FIELDS.BENEFITS}`]: '0',
      };

      expect(hasentitelementsToAdditionalBenefits(income)).toBe(false);
    });
  });

  describe('getAllCostRelatedNextStepsFlags', () => {
    it('returns mortgage, rent, unsecured loans array', () => {
      const costs = {
        [`${prefix}${FIELD_NAMES.MORTGAGE_REPAYMENT}`]: '800',
        [`${prefix}${FIELD_NAMES.RENT}`]: '500',
        [`${prefix}${FIELD_NAMES.LOANS}`]: '200',
        [`${prefix}${FIELD_NAMES.BUY_NOW_PAY_LATER}`]: '0',
      };

      expect(getAllCostRelatedNextStepsFlags(costs)).toEqual([800, 500, 200]);
    });

    it('falls back to buy-now-pay-later when creditCardAmount = 0', () => {
      const costs = {
        [`${prefix}${FIELD_NAMES.MORTGAGE_REPAYMENT}`]: '0',
        [`${prefix}${FIELD_NAMES.RENT}`]: '0',
        [`${prefix}${FIELD_NAMES.LOANS}`]: '0',
        [`${prefix}${FIELD_NAMES.BUY_NOW_PAY_LATER}`]: '150',
      };

      expect(getAllCostRelatedNextStepsFlags(costs)).toEqual([0, 0, 150]);
    });
  });

  describe('getlifeExpectancyDetails', () => {
    const t = jest.fn().mockImplementation((key, data) => {
      if (key === 'summaryPage.retirementCallout.lifeExpectancy.title') {
        return `[${key}] ${data?.years ?? ''}`;
      }
      if (key === 'summaryPage.retirementCallout.lifeExpectancy.content') {
        return `[${key}] ${data?.age ?? ''}`;
      }
      return `[${key}]`;
    });

    it('computes male life expectancy correctly', () => {
      const result = getlifeExpectancyDetails('65', 'male', t);

      expect(result.remainingLifeExpectancy).toBe(19);
      expect(result.lifeExpectancyTitle).toContain('19');
      expect(result.lifeExpectancyContent).toContain('84');
    });

    it('computes female life expectancy correctly', () => {
      const result = getlifeExpectancyDetails('70', 'female', t);

      expect(result.remainingLifeExpectancy).toBe(17);
      expect(result.lifeExpectancyContent).toContain('87');
    });

    it('returns 0 remaining years if retire age >= life expectancy', () => {
      const result = getlifeExpectancyDetails('90', 'male', t);

      expect(result.remainingLifeExpectancy).toBe(0);
    });
  });
});
describe('shouldDisplayAgeHeading', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns true when current age <= state pension age', () => {
    (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(60 * 12);
    (getStatePensionAge as jest.Mock).mockReturnValue('67');
    (parsePensionAge as jest.Mock).mockReturnValue(67 * 12);
    const dob = { day: '01', month: '01', year: '1960' };
    const result = shouldDisplayAgeHeading(dob);

    expect(result).toBe(true);
  });

  it('returns false when current age > state pension age', () => {
    (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(70 * 12);

    (getStatePensionAge as jest.Mock).mockReturnValue('67');
    (parsePensionAge as jest.Mock).mockReturnValue(67 * 12);
    const dob = { day: '01', month: '01', year: '1950' };
    const result = shouldDisplayAgeHeading(dob);

    expect(result).toBe(false);
  });

  it('returns false when current age is null', () => {
    (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(null);

    (getStatePensionAge as jest.Mock).mockReturnValue('67');
    (parsePensionAge as jest.Mock).mockReturnValue(67 * 12);
    const dob = { day: '', month: '', year: '' };
    const result = shouldDisplayAgeHeading(dob);

    expect(result).toBeFalsy();
  });

  it('returns true when current age equals state pension age', () => {
    (getCurrentAgeInYearsAndMonths as jest.Mock).mockReturnValue(67 * 12);

    (getStatePensionAge as jest.Mock).mockReturnValue('67');
    (parsePensionAge as jest.Mock).mockReturnValue(67 * 12);
    const dob = { day: '01', month: '01', year: '1957' };
    const result = shouldDisplayAgeHeading(dob);

    expect(result).toBe(true);
  });
});
