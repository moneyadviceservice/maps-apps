import { BenefitType, PensionType } from '../../../lib/constants';
import { getCalculationType } from './getCalculationType';

describe('getCalculationType', () => {
  it.each`
    pensionType        | benefitType        | expected
    ${PensionType.DC}  | ${undefined}       | ${PensionType.DC}
    ${PensionType.DC}  | ${BenefitType.DC}  | ${PensionType.DC}
    ${PensionType.DC}  | ${BenefitType.AVC} | ${PensionType.DC}
    ${PensionType.AVC} | ${undefined}       | ${PensionType.AVC}
    ${PensionType.AVC} | ${BenefitType.AVC} | ${PensionType.AVC}
    ${PensionType.AVC} | ${BenefitType.DB}  | ${PensionType.AVC}
    ${PensionType.DB}  | ${undefined}       | ${PensionType.DB}
    ${PensionType.DB}  | ${BenefitType.DB}  | ${PensionType.DB}
    ${PensionType.DB}  | ${BenefitType.AVC} | ${PensionType.AVC}
    ${PensionType.HYB} | ${undefined}       | ${PensionType.HYB}
    ${PensionType.HYB} | ${BenefitType.DB}  | ${PensionType.DB}
    ${PensionType.HYB} | ${BenefitType.DC}  | ${PensionType.DC}
    ${PensionType.HYB} | ${BenefitType.AVC} | ${PensionType.AVC}
  `(
    'renders the component for $pensionType pension type, $benefitType benefit type',
    ({ pensionType, benefitType, expected }) => {
      expect(getCalculationType(pensionType, benefitType)).toBe(expected);
    },
  );
});
