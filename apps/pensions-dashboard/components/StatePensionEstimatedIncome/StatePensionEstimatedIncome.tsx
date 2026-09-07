import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { currencyAmount, formatDate } from '../../lib/utils/ui';
import { ProgressBar } from '../ProgressBar';
import { StatePensionCallout } from '../StatePensionCallout';

type Props = {
  data: PensionArrangement;
};

export const StatePensionEstimatedIncome = ({ data }: Props) => {
  const { t, locale } = useTranslation();

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
      text: (
        <>
          <strong>{currencyAmount(accruedMonthlyAmount ?? 0)}</strong>{' '}
          {t('common.a-month')}
        </>
      ),
    },
    forecast: {
      amount: estimatedMonthlyAmount,
      total: estimatedMonthlyAmount,
      text: (
        <>
          <strong>{currencyAmount(estimatedMonthlyAmount ?? 0)}</strong>{' '}
          {t('common.a-month')}
        </>
      ),
    },
  };

  const date = formatDate(illustrationDate ?? '', locale);

  return (
    <div
      className="mt-10 md:mt-16"
      data-testid="state-pension-estimated-income"
    >
      <StatePensionCallout
        forecastAmount={estimatedMonthlyAmount}
        accruedAmount={accruedMonthlyAmount}
      />
      <Heading
        level="h2"
        className="mt-6 mb-2 text-3xl font-bold md:mt-10 md:mb-4 md:text-5xl"
      >
        {t('pages.pension-details.estimated-income.ap-heading')}
      </Heading>
      <Paragraph
        className="leading-[1.6] mb-2 text-lg md:text-2xl"
        data-testid="sp-estimated-income-ap"
      >
        {t('pages.pension-details.estimated-income.ap', {
          date,
        })}
      </Paragraph>
      <ProgressBar {...bars.estimate} testId="sp-progress-bar-ap" />
      <Heading
        level="h2"
        className="mt-10 mb-2 text-3xl font-bold md:mt-16 md:mb-4 md:text-5xl"
      >
        {t('pages.pension-details.estimated-income.eri-heading')}
      </Heading>
      <Paragraph
        className="leading-[1.6] mb-2 text-lg md:text-2xl"
        data-testid="sp-estimated-income-eri"
      >
        {t('pages.pension-details.estimated-income.eri')}
      </Paragraph>
      <ProgressBar {...bars.forecast} testId="sp-progress-bar-eri" />
    </div>
  );
};
