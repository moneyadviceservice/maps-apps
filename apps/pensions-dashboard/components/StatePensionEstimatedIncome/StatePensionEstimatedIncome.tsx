import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { currencyAmount, formatDate } from '../../lib/utils/ui';
import { ProgressBar } from '../ProgressBar';

type Props = {
  data: PensionArrangement;
};

export const StatePensionEstimatedIncome = ({ data }: Props) => {
  const { t } = useTranslation();

  if (!data.benefitIllustrations?.length || !data.detailData?.statePayment) {
    return null;
  }

  const {
    estimatedMonthlyAmount,
    accruedMonthlyAmount,
    estimatedAnnualAmount,
    accruedAnnualAmount,
    illustrationDate,
  } = data.detailData.statePayment;

  if (
    estimatedMonthlyAmount === undefined ||
    accruedMonthlyAmount === undefined ||
    estimatedAnnualAmount === undefined ||
    accruedAnnualAmount === undefined
  ) {
    return null;
  }

  const bars = {
    estimate: {
      amount: accruedMonthlyAmount,
      total: estimatedMonthlyAmount,
      text: `${currencyAmount(accruedMonthlyAmount ?? 0)} ${t(
        'common.a-month',
      )} or ${currencyAmount(accruedAnnualAmount ?? 0)} ${t('common.a-year')}`,
    },
    forecast: {
      amount: estimatedMonthlyAmount,
      total: estimatedMonthlyAmount,
      text: `${currencyAmount(estimatedMonthlyAmount ?? 0)} ${t(
        'common.a-month',
      )} or ${currencyAmount(estimatedAnnualAmount ?? 0)} ${t(
        'common.a-year',
      )}`,
    },
  };

  const date = formatDate(illustrationDate ?? '');

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
      <ProgressBar {...bars.estimate} testId="sp-progress-bar-ap" />
      <Paragraph
        className="mt-4 md:mt-6 leading-[1.6] md:mb-2"
        data-testid="sp-estimated-income-eri"
      >
        {t('pages.pension-details.estimated-income.eri')}
      </Paragraph>
      <ProgressBar {...bars.forecast} testId="sp-progress-bar-eri" />
    </div>
  );
};
