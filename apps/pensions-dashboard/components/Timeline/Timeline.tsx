import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { PensionType } from '../../lib/constants';
import { TimelineYear } from '../../lib/types';
import { currencyAmount, tooltipScreenReaderText } from '../../lib/utils/ui';
import { TimelineEntry } from './TimelineEntry';

type TimelineProps = {
  data: TimelineYear[];
};

const Total = ({
  amount,
  annualAmount,
  amountText,
  totalType,
}: {
  amount: number;
  annualAmount?: number;
  amountText: string;
  totalType: 'monthly' | 'lump-sum' | 'cash-balance';
}) => {
  const { t } = useTranslation();

  const tooltipContent = {
    'lump-sum': t(`tooltips.lump-sum`),
    'cash-balance': t(`tooltips.type-CBLUMP`),
  };

  const tooltipScreenReader = {
    'lump-sum': t(`tooltips.sr-text.lump-sum`),
    'cash-balance': t(`tooltips.sr-text.cash-balance-lump-sums`),
  };

  const isMonthly = totalType === 'monthly';

  return (
    <p
      className="text-[26px] max-lg:mt-2 max-lg:leading-[1.5] lg:text-4xl"
      data-testid={`${totalType}-total`}
    >
      {!isMonthly && '+ '}
      <strong data-testid={`timeline-year-${totalType}`}>
        {currencyAmount(amount)}
      </strong>{' '}
      {amountText.toLowerCase()}{' '}
      {isMonthly && annualAmount !== undefined ? (
        <>
          <strong data-testid="timeline-year-annual">
            {currencyAmount(annualAmount)}
          </strong>{' '}
          {t('common.a-year')}
        </>
      ) : null}
      {!isMonthly && (
        <Markdown
          data-testid={`${totalType}-tooltip`}
          className="[&_>span]:-top-[6px]"
          disableParagraphs
          content={tooltipContent[totalType]}
          tooltipProps={{
            accessibilityLabelOpen: tooltipScreenReaderText(
              tooltipScreenReader[totalType],
              t,
            ),
          }}
        />
      )}
    </p>
  );
};

export const Timeline = ({ data }: TimelineProps) => {
  const { t } = useTranslation();

  if (data.length === 0) return null;

  const beforeClasses = [
    "before:content-['']",
    'before:absolute',
    'before:top-0',
    'before:left-[-8px]',
    'before:w-[14px]',
    'before:h-[14px]',
    'before:bg-black',
    'before:rounded-full',
    'lg:before:left-[-9px]',
    'lg:before:w-[16px]',
    'lg:before:h-[16px]',
  ];

  const afterClasses = [
    "after:content-['']",
    'after:absolute',
    'after:bottom-0',
    'after:h-[40px]',
    'after:w-[2px]',
    'after:left-[-2px]',
    'after:bg-gradient-to-b',
    'after:from-black',
    'after:to-white',
  ];

  return (
    <ol data-testid="timeline" className="my-8 max-lg:ml-1">
      {data.map((entry, i) => {
        const { year, monthlyTotal, annualTotal, arrangements } = entry;
        const numberOfArrangements = arrangements.length;
        const isLastLi = i === data.length - 1;

        const getTotals = entry.arrangements.reduce(
          (total, yearEntry) => {
            if (yearEntry.lumpSumAmount && yearEntry.lumpSumYear !== year) {
              return { lumpSumTotal: 0, cashBalanceLumpSumTotal: 0 };
            }

            const cashBalanceLumpSumTotal =
              total.cashBalanceLumpSumTotal +
              (yearEntry.pensionType === PensionType.CB &&
              yearEntry.lumpSumAmount
                ? yearEntry.lumpSumAmount
                : 0);

            const lumpSumTotal =
              total.lumpSumTotal +
              (yearEntry.pensionType !== PensionType.CB &&
              yearEntry.lumpSumAmount
                ? yearEntry.lumpSumAmount
                : 0);

            return {
              lumpSumTotal,
              cashBalanceLumpSumTotal,
            };
          },
          { lumpSumTotal: 0, cashBalanceLumpSumTotal: 0 },
        );

        const { lumpSumTotal, cashBalanceLumpSumTotal } = getTotals;

        return (
          <li
            key={year}
            className="lg:flex max-lg:border-l-2 max-lg:border-black max-lg:pb-5 max-lg:relative max-lg:pl-4 last:pb-0"
          >
            <p
              data-testid={`timeline-year-${year}`}
              className="lg:w-[152px] relative top-[-9px] lg:top-[-12px] text-[20px] lg:text-2xl capitalize"
            >
              {t('common.year')}: <span className="font-bold">{year}</span>
            </p>
            <div
              className={twMerge(
                'lg:border-l-2 lg:border-black lg:pb-14 lg:relative lg:pl-12',
                isLastLi && 'lg:pb-0',
                beforeClasses,
                isLastLi && afterClasses,
              )}
            >
              <div className="relative top-[-11px] lg:top-[-22px]">
                <Total
                  amount={monthlyTotal}
                  annualAmount={annualTotal}
                  amountText={`${t('common.a-month')} ${t('common.or')} `}
                  totalType="monthly"
                />
                {cashBalanceLumpSumTotal > 0 && (
                  <Total
                    amount={cashBalanceLumpSumTotal}
                    amountText={t('common.cash-balance')}
                    totalType="cash-balance"
                  />
                )}
                {lumpSumTotal > 0 && (
                  <Total
                    amount={lumpSumTotal}
                    amountText={t('common.lump-sum')}
                    totalType="lump-sum"
                  />
                )}

                {numberOfArrangements > 0 && (
                  <ExpandableSection
                    title={`${t(
                      'pages.your-pensions-timeline.view-pensions',
                    )} (${numberOfArrangements})`}
                    closedTitle={`${t(
                      'pages.your-pensions-timeline.hide-pensions',
                    )} (${numberOfArrangements})`}
                    testId={`timeline-accordion-${year}`}
                  >
                    <ol className="mt-4 lg:mt-6">
                      {arrangements.map((arrangement) => {
                        return (
                          <TimelineEntry
                            key={arrangement.id}
                            arrangement={arrangement}
                            year={year}
                          />
                        );
                      })}
                    </ol>
                  </ExpandableSection>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
