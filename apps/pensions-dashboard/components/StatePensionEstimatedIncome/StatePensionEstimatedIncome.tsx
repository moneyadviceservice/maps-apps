import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationType } from '../../lib/constants';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../../lib/types';
import { formatDate, getLatestIllustration } from '../../lib/utils';
import { ProgressBarCurrency } from '../ProgressBarCurrency';

type Props = {
  data: PensionArrangement;
};

export const StatePensionEstimatedIncome = ({ data }: Props) => {
  const { t } = useTranslation();

  if (!data.benefitIllustrations?.length) {
    return null;
  }

  const eri = getLatestIllustration(IllustrationType.ERI, data);
  const ap = getLatestIllustration(IllustrationType.AP, data);

  if (!eri || !ap) {
    return null;
  }

  const getValue = (illustration: BenefitIllustrationComponent) =>
    (illustration?.payableDetails as RecurringIncomeDetails)?.monthlyAmount;

  const monthly = {
    ERI: getValue(eri),
    AP: getValue(ap),
  };

  const date = formatDate(data.benefitIllustrations[0].illustrationDate ?? '');

  return (
    <div className="mt-10 md:mt-16">
      <Heading
        level="h2"
        className="mt-10 mb-4 text-3xl font-bold md:text-5xl md:mb-10"
      >
        {t('pages.pension-details.headings.estimated-income')}
      </Heading>
      <Paragraph
        className="leading-[1.6] md:mb-2"
        data-testid="sp-estimated-income-ap"
      >
        {t('pages.pension-details.estimated-income.ap', {
          date,
        })}
      </Paragraph>
      <ProgressBarCurrency
        amount={monthly.AP}
        total={monthly.ERI}
        suffix={t('common.a-month')}
        testId="sp-progress-bar-ap"
      />
      <Paragraph
        className="mt-4 md:mt-6 leading-[1.6] md:mb-2"
        data-testid="sp-estimated-income-eri"
      >
        {t('pages.pension-details.estimated-income.eri')}
      </Paragraph>
      <ProgressBarCurrency
        amount={monthly.ERI}
        total={monthly.ERI}
        suffix={t('common.a-month')}
        testId="sp-progress-bar-eri"
      />
    </div>
  );
};
