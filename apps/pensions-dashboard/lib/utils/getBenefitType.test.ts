import { BenefitType } from '../constants';
import { getBenefitType } from './getBenefitType';

describe('Pension module', () => {
  test('getBenefitType should return correct benefit type description', () => {
    expect(getBenefitType[BenefitType.AVC]).toBe(
      'Additional voluntary contribution',
    );
    expect(getBenefitType[BenefitType.DB]).toBe('Defined Benefit');
    expect(getBenefitType[BenefitType.SP]).toBe('State Pension');
    expect(getBenefitType[BenefitType.CBL]).toBe(
      'Cash balance expressed as a lump sum',
    );
    expect(getBenefitType[BenefitType.CBS]).toBe('Cash balance');
    expect(getBenefitType[BenefitType.CDI]).toBe(
      'Collective direct contribution benefits expressed as regular income',
    );
    expect(getBenefitType[BenefitType.CDL]).toBe(
      'Collective direct contribution benefits expressed as a lump sum',
    );
    expect(getBenefitType[BenefitType.DBL]).toBe(
      'Defined benefit with separately accrued lump sum',
    );
    expect(getBenefitType[BenefitType.DC]).toBe('Defined Contribution');
  });
});
