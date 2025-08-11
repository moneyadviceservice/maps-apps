import { BenefitType } from '../constants';

export const getBenefitType: Record<BenefitType, string> = {
  [BenefitType.AVC]: 'Additional voluntary contribution',
  [BenefitType.CBL]: 'Cash balance expressed as a lump sum',
  [BenefitType.CBS]: 'Cash balance',
  [BenefitType.CDI]:
    'Collective direct contribution benefits expressed as regular income',
  [BenefitType.CDL]:
    'Collective direct contribution benefits expressed as a lump sum',
  [BenefitType.DB]: 'Defined Benefit',
  [BenefitType.DBL]: 'Defined benefit with separately accrued lump sum',
  [BenefitType.DC]: 'Defined Contribution',
  [BenefitType.SP]: 'State Pension',
};
