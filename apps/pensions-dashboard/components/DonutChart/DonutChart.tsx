import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionType } from '../../lib/constants';
import { currencyAmount, getYearFromDate } from '../../lib/utils/ui';

type Donut = {
  date: string | undefined;
  amount: number;
};

export interface DonutChartProps {
  ap: Donut;
  eri: Donut;
  pensionType: PensionType;
  testId?: string;
}

const FillColor: Record<string, string> = {
  [PensionType.DB]: 'fill-purple-650', // purple-650
  [PensionType.DC]: 'fill-teal-700', // teal-700
};

const StrokeColor: Record<string, string> = {
  [PensionType.DB]: 'stroke-purple-650', // purple-650
  [PensionType.DC]: 'stroke-teal-700', // teal-700
};

export const DonutChart = ({
  ap,
  eri,
  pensionType,
  testId = 'donut-charts',
}: DonutChartProps) => {
  const { t } = useTranslation();
  const fillClass = FillColor[pensionType];
  const strokeColor = StrokeColor[pensionType];
  const data = [ap, eri];
  const highestAmount = Math.max(...data.map((item) => item.amount));

  return (
    <div data-testid={testId} className="mx-auto">
      <Paragraph
        data-testid="donut-heading"
        className="mb-4 text-xl font-bold text-center md:text-2xl lg:mb-14 md:h-[38px]"
      >
        {t(
          `pages.pension-details.details.${
            pensionType === PensionType.DC ? 'pot-value' : 'lump-sum'
          }`,
        )}
        <Markdown
          disableParagraphs
          className="ml-1 font-normal text-left"
          content={t(
            `tooltips.${
              pensionType === PensionType.DC ? 'pot-value' : 'lump-sum'
            }`,
          )}
        />
      </Paragraph>

      <div className="flex justify-center gap-7 lg:gap-8" aria-hidden="true">
        {data.map((donut, index) => {
          const value = Math.max(0, Math.min(donut.amount, highestAmount));
          const percentage =
            highestAmount > 0 ? (value / highestAmount) * 100 : 0;
          const year = donut.date ? getYearFromDate(donut.date) : undefined;
          const isAP = index === 0;
          const fillColor = isAP ? 'fill-slate-350' : fillClass;
          const strokeClass =
            isAP || percentage === 0 ? 'stroke-slate-500' : strokeColor;

          const donutSize = 170;
          const donutPadding = 2; // Extra space for stroke to avoid clipping
          const totalSize = donutSize + donutPadding * 2; // Total size including padding
          const strokeWidth = 22;
          const center = donutSize / 2 + donutPadding;
          const outerRadius = donutSize / 2;
          const innerRadius = outerRadius - strokeWidth;

          const startAngle = -90;
          const endAngle = startAngle + (percentage / 100) * 360;

          const polarToCartesian = (r: number, angle: number) => {
            const rad = (angle * Math.PI) / 180;
            return {
              x: center + r * Math.cos(rad),
              y: center + r * Math.sin(rad),
            };
          };

          const startOuter = polarToCartesian(outerRadius, endAngle);
          const endOuter = polarToCartesian(outerRadius, startAngle);
          const startInner = polarToCartesian(innerRadius, endAngle);
          const endInner = polarToCartesian(innerRadius, startAngle);
          const largeArcFlag = percentage > 50 ? 1 : 0;

          const arcPath =
            percentage < 100
              ? `
                M ${startOuter.x} ${startOuter.y}
                A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}
                L ${endInner.x} ${endInner.y}
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}
                Z
              `
              : `
                M ${center + outerRadius} ${center}
                A ${outerRadius} ${outerRadius} 0 1 0 ${
                  center - outerRadius
                } ${center}
                A ${outerRadius} ${outerRadius} 0 1 0 ${
                  center + outerRadius
                } ${center}
                L ${center + innerRadius} ${center}
                A ${innerRadius} ${innerRadius} 0 1 1 ${
                  center - innerRadius
                } ${center}
                A ${innerRadius} ${innerRadius} 0 1 1 ${
                  center + innerRadius
                } ${center}
                Z
              `;

          return (
            <div className="mt-5" key={index}>
              <div className="relative mx-auto mb-3 lg:mb-9 h-[110px] sm:h-[170px] w-[110px] sm:w-[170px]">
                <svg
                  viewBox={`0 0 ${totalSize} ${totalSize}`}
                  data-testid={`donut-${index}`}
                  aria-hidden="true"
                >
                  {/* Outer border */}
                  <circle
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    strokeWidth={1}
                    className={twMerge(strokeClass, 'fill-white')}
                    data-testid={`donut-outer-${index}`}
                  />

                  {/* Inner circle with border */}
                  <circle
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    className={twMerge(strokeClass, 'fill-white')}
                    strokeWidth={1}
                    data-testid={`donut-inner-${index}`}
                  />

                  {/* Progress arc */}
                  <path
                    d={arcPath}
                    strokeWidth={percentage > 0 && percentage < 100 ? 1 : 0}
                    className={twMerge(strokeClass, fillColor)}
                    data-testid={`donut-arc-${index}`}
                  />
                </svg>
                <span
                  data-testid={`donut-label-${index}`}
                  className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] px-1 text-sm text-center md:text-base z-10 w-auto bg-white"
                >
                  {!donut.amount
                    ? t('common.no-data')
                    : currencyAmount(donut.amount)}
                </span>
              </div>
              <p
                data-testid={`donut-legend-${index}`}
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
      <div data-testid="donut-sr-content" className="sr-only">
        {data.map((donut, index) => {
          const year = donut.date ? getYearFromDate(donut.date) : undefined;
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
              {!donut.amount
                ? t('common.no-data')
                : currencyAmount(donut.amount)}
            </p>
          );
        })}
      </div>
    </div>
  );
};
