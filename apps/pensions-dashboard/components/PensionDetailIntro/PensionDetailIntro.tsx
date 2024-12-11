import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionType, STATE_RETIREMENT_AGE } from '../../lib/constants';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../lib/types';
import {
  formatDate,
  getAnnualAmount,
  getMonthlyAmount,
  getRetirementAge,
} from '../../lib/utils';

type PensionDetailIntroProps = {
  data: PensionArrangement;
  benefitIllustration?: BenefitIllustrationComponent;
};

export const PensionDetailIntro = ({
  data,
  benefitIllustration,
}: PensionDetailIntroProps) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const retirementAge = getRetirementAge(
    benefitIllustration?.payableDetails
      ? benefitIllustration?.payableDetails.payableDate
      : data.retirementDate,
    data.dateOfBirth,
  );

  return (
    <ToolIntro className="mb-10">
      <Markdown
        content={t('pages.pension-details.description', {
          name: data.schemeName,
          date: benefitIllustration?.payableDetails
            ? formatDate(benefitIllustration.payableDetails.payableDate)
            : t('common.date-unavailable'),
          age: `${
            data.pensionType === PensionType.SP
              ? STATE_RETIREMENT_AGE
              : retirementAge
          }`,
          monthly:
            getMonthlyAmount(benefitIllustration) ??
            t('common.amount-unavailable'),
          yearly:
            getAnnualAmount(benefitIllustration) ??
            t('common.amount-unavailable'),
        })}
      />
    </ToolIntro>
  );
};
