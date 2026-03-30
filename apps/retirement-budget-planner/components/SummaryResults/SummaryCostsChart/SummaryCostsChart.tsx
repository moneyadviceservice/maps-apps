import { HTMLAttributes } from 'react';

import { useRouter } from 'next/router';

import {
  getCostCategoryName,
  getSummaryResultsCostsChartColourFromIndex,
} from 'data/summaryResultsData';
import { PAGES_NAMES, SUMMARY_PROPS } from 'lib/constants/pageConstants';
import { costBreakdown } from 'lib/util/summaryCalculations/calculations';
import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import NumberFormat from '@maps-react/common/components/NumberFormat';
import PieChart, {
  type PieChartProps,
} from '@maps-react/common/components/PieChart';
import useTranslation from '@maps-react/hooks/useTranslation';

export type SummaryCostsChartProps = {
  title: string;
  items: ReturnType<typeof costBreakdown>;
  summaryData: {
    [SUMMARY_PROPS.INCOME]: number;
    [SUMMARY_PROPS.SPENDING]: number;
  };
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

export const SummaryCostsChart = ({
  title,
  items,
  summaryData,
  className,
}: SummaryCostsChartProps) => {
  const { locale, t } = useTranslation();
  const router = useRouter();

  const chartItems = items.map(({ name, value }, index) => ({
    name,
    amount: value,
    percentage: (value / summaryData.spending) * 100,
    colour: getSummaryResultsCostsChartColourFromIndex(index),
  })) satisfies PieChartProps['items'];

  return (
    <div
      className={twMerge(
        'lg:shadow-1md flex w-full flex-col gap-4 rounded border border-gray-300 pb-4 pt-6 sm:flex-row sm:px-4 lg:flex-col lg:border-blue-700 xl:flex-row',
        className,
      )}
    >
      {/* Pie chart */}
      <div className="basis-1/2">
        <Heading
          component="h3"
          level="h4"
          className="text-center sm:text-start"
        >
          {title}
        </Heading>
        <div className="px-10 sm:px-0">
          <PieChart
            title="Retirement costs"
            items={chartItems}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Breakdown/legend */}
      <dl className="flex basis-1/2 flex-col gap-4 px-10 sm:px-0">
        {chartItems.map(({ name, amount, colour }) => (
          <div
            key={name}
            className="grid items-center gap-x-2 [grid-template-areas:'swatch_name_edit''empty_amount_amount'] [grid-template-columns:30px_1fr_auto]"
          >
            {/* Colour swatch */}
            <span
              className="mt-1 block h-[30px] w-[30px] flex-none rounded-full [grid-area:swatch] lg:mt-0 print:hidden"
              style={{ backgroundColor: colour }}
              aria-hidden="true"
            />

            {/* Category name */}
            <dt className="grow [grid-area:name]">
              {getCostCategoryName({ category: name, t })}
            </dt>

            {/* Amount */}
            <dd className="font-bold [grid-area:amount]">
              <NumberFormat
                value={amount}
                prefix="£"
                fixedDecimalScale={true}
              />
            </dd>

            {/* Edit button */}
            <Link
              className="[grid-area:edit]"
              href={{
                pathname: `/${locale}/${PAGES_NAMES.ESSENTIALS}`,
                query: {
                  ...router.query,
                },
                hash: name,
              }}
            >
              Edit
            </Link>
          </div>
        ))}
      </dl>
    </div>
  );
};
