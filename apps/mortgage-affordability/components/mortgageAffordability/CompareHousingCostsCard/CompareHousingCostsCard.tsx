import { CompareHousingCostsCopy } from 'data/mortgage-affordability/compare-housing-costs';

import { DataTableCard } from '@maps-react/common/components/DataTableCard';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

export const CompareHousingCostsCard = ({
  currentPaymentPerMonth,
  newPaymentPerMonth,
}: {
  currentPaymentPerMonth: number;
  newPaymentPerMonth: number;
}) => {
  const difference = newPaymentPerMonth - currentPaymentPerMonth;
  const fDifference = formatCurrency(Math.abs(difference));
  const fNewPaymentPerMonth = formatCurrency(newPaymentPerMonth);
  const fCurrentPaymentPerMonth = formatCurrency(currentPaymentPerMonth);
  const moreLessOrSame =
    fDifference === '£0.00' ? 'same' : difference < 0 ? 'less' : 'more';

  const { z } = useTranslation();
  const d = CompareHousingCostsCopy(z, {
    fNewPaymentPerMonth,
    fDifference,
  });

  return (
    <div data-testid="compare-housing-costs">
      <DataTableCard
        title={d.title}
        description={d[moreLessOrSame].description}
        tableLayout={'fixed'}
        data={{
          rows: [
            {
              cells: [
                {
                  className: 'px-0 pr-6',
                  isHeading: true,
                  data: d.rentOrMortgage,
                },
                {
                  className: 'font-bold px-0 pr-6',
                  data: fCurrentPaymentPerMonth,
                },
              ],
            },
            {
              cells: [
                {
                  className: 'px-0 pr-6',
                  isHeading: true,
                  data: d.newMortgagePayment,
                },
                {
                  className: 'font-bold px-0 pr-6',
                  data: fNewPaymentPerMonth,
                },
              ],
            },
          ],
        }}
        footnote={
          <span className="flex flex-row gap-4">
            <Icon className="text-blue-700" type={IconType.PIGGY_BANK} />
            <Paragraph>{d[moreLessOrSame].footnote}</Paragraph>
          </span>
        }
      />
    </div>
  );
};
