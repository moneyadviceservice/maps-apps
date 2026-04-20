import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { Bar } from '../../lib/types';
import {
  currencyAmount,
  formatDate,
  getPensionTypeClasses,
  getYearFromDate,
} from '../../lib/utils/ui';

export interface IncomeBarChartProps {
  ap: Bar;
  eri: Bar;
  calcType: PensionType;
  testId?: string;
}

export const IncomeBarChart = ({
  calcType,
  testId = 'bar-charts',
  ap,
  eri,
}: IncomeBarChartProps) => {
  const { t } = useTranslation();
  const { bgDarkClass: backgroundClass } = getPensionTypeClasses(calcType);
  const BAR_HEIGHT = 135; // Base height for the bar in pixels
  const data = [ap, eri];
  const highestAmount = Math.max(...data.map((item) => item.annualAmount));

  return (
    <div data-testid={testId} className="mx-auto">
      <div className="md:h-[70px] mb-8 lg:mb-10">
        <Paragraph
          data-testid="bar-heading"
          className="mb-0 text-xl font-bold text-center md:text-2xl"
        >
          {t('common.estimated-income')}
        </Paragraph>
        <Paragraph className="mb-0 text-center md:text-2xl">
          {t('pages.pension-details.details.payable-date')}:{' '}
          {eri.date ? formatDate(eri.date) : t('common.unavailable')}
        </Paragraph>
      </div>

      <div className="flex justify-center gap-2 lg:gap-4" aria-hidden="true">
        {data.map((bar, index) => {
          const value = Math.max(0, Math.min(bar.annualAmount, highestAmount));
          const height =
            highestAmount > 0 ? (value / highestAmount) * BAR_HEIGHT : 0;
          const year = bar.date ? getYearFromDate(bar.date) : undefined;
          const isAP = index === 0;

          return (
            <div
              key={index}
              className="flex flex-col justify-end"
              style={{
                paddingTop: highestAmount === 0 ? BAR_HEIGHT + 23 : 0,
              }}
            >
              <p
                data-testid={`bar-label-${index}`}
                className="mb-2 text-sm text-center md:text-base"
              >
                {!bar.annualAmount ? (
                  t('common.unavailable')
                ) : (
                  <>
                    {currencyAmount(bar.annualAmount)} {t('common.a-year')}
                    <br />
                    {currencyAmount(bar.monthlyAmount)} {t('common.a-month')}
                  </>
                )}
              </p>
              <div
                className={twMerge(
                  'mx-auto w-[88px] sm:w-[165px] border-b-1 border-b-slate-500 flex flex-col justify-end lg:mb-5',
                )}
              >
                <div
                  data-testid={`bar-${index}`}
                  style={{ height: height }}
                  className={twMerge(
                    'w-[60px] sm:w-[100px] mx-auto bg-slate-350 rounded-tr-md rounded-tl-md',
                    !isAP && backgroundClass,
                    isAP && 'border border-slate-500 border-b-0',
                    height === 0 && 'border border-gray-650 border-b-0',
                  )}
                />
              </div>
              <p
                data-testid={`bar-legend-${index}`}
                className="max-sm:min-h-[87px] max-sm:w-[115px] sm:w-[185px] mx-auto text-center min-h-[62px] leading-[1.6]"
              >
                {isAP
                  ? t('pages.pension-details.details.latest-value')
                  : t('pages.pension-details.details.estimate-at-retirement')}
                {year && <strong className="block">{year}</strong>}
              </p>
            </div>
          );
        })}
      </div>

      {/* Screen reader friendly content */}
      <div data-testid="sr-content" className="sr-only">
        {data.map((bar, index) => {
          const year = bar.date ? getYearFromDate(bar.date) : undefined;
          const isAP = index === 0;

          return (
            <p key={index}>
              {isAP
                ? t('pages.pension-details.details.latest-value')
                : t('pages.pension-details.details.estimate-at-retirement')}
              {year && (
                <>
                  {' ('}
                  {year}
                  {')'}
                </>
              )}
              {' : '}
              {!bar.annualAmount ? (
                t('common.unavailable')
              ) : (
                <>
                  {currencyAmount(bar.annualAmount) + ' ' + t('common.a-year')},{' '}
                  {currencyAmount(bar.monthlyAmount) +
                    ' ' +
                    t('common.a-month')}
                </>
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
};
