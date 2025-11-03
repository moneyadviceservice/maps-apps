import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { STATE_RETIREMENT_AGE } from '../../lib/constants';
import { PensionTotals } from '../../lib/types';
import { currencyAmount } from '../../lib/utils/ui';

type SummaryCalloutProps = {
  totals: PensionTotals;
};

export const SummaryCallout = ({ totals }: SummaryCalloutProps) => {
  const { t } = useTranslation();

  const age = `${STATE_RETIREMENT_AGE}`;

  const monthlyTotal =
    totals.monthlyTotal > 0
      ? currencyAmount(totals.monthlyTotal)
      : t('common.amount-unavailable');

  const annualTotal =
    totals.annualTotal > 0
      ? currencyAmount(totals.annualTotal)
      : t('common.amount-unavailable');

  return (
    <Callout variant={CalloutVariant.WHITE} className="mt-10 mb-2">
      <Heading level="h3" className="mb-4">
        {t('pages.your-pension-breakdown.callout.heading')}
      </Heading>
      <Markdown
        className="mb-0 text-xl"
        content={t('pages.your-pension-breakdown.callout.description', {
          age,
          monthlyTotal,
          annualTotal,
        })}
      />
    </Callout>
  );
};
