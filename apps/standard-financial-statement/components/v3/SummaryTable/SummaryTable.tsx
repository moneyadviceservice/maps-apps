import React from 'react';

import Link, { LinkProps } from 'next/link';

import { twMerge } from 'tailwind-merge';

import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

type SummaryTableItemType = 'income' | 'outgoing';

export type SummaryTableItem = {
  type: SummaryTableItemType;
  text: string;
  amount: number;
  changeLink: LinkProps & { labelText?: string };
};

type SummaryTableRow = Omit<SummaryTableItem, 'type'>;

type Props = {
  items: SummaryTableItem[];
  captionText: string;
  totalText: string;
  className?: string;
};

const rowClasses =
  'col-span-full grid grid-cols-subgrid border-b-1 border-gray-300';
const cellClasses = 'p-4 lg:px-6';
const firstCellClasses = twMerge(
  cellClasses,
  'pb-0 col-span-full text-left text-sm leading-[normal] font-normal underline lg:pb-4 lg:col-span-1 lg:text-base lg:leading-[1.5rem] lg:font-medium lg:no-underline',
);
const secondCellClasses = twMerge(
  cellClasses,
  'pt-2 text-lg font-bold leading-[normal] text-left lg:pt-4 lg:text-right',
);

const SummaryTableItem = ({ text, amount, changeLink }: SummaryTableRow) => {
  return (
    <tr className={rowClasses}>
      <th scope="row" className={firstCellClasses}>
        {text}
      </th>
      <td className={secondCellClasses}>{formatCurrency(amount)}</td>
      <td
        className={twMerge(
          cellClasses,
          'pt-2 flex flex-row justify-start items-center pl-2 pr-10 lg:pt-4',
        )}
      >
        <Link
          href={changeLink.href}
          className="flex text-sm font-semibold text-green-700 decoration-[2px] hover:underline"
        >
          {changeLink?.labelText || 'Change'}
        </Link>
      </td>
    </tr>
  );
};

export const SummaryTable = ({
  items,
  captionText,
  totalText,
  className,
}: Props) => {
  const sumItemAmountsOfType = (
    items: SummaryTableItem[],
    type: SummaryTableItemType,
  ) =>
    items
      .filter((item) => item.type === type)
      .map((item) => item.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const calculateTotalAmount = (items: SummaryTableItem[]) => {
    const totalIncome = sumItemAmountsOfType(items, 'income');
    const totalOutgoings = sumItemAmountsOfType(items, 'outgoing');

    console.log('totalIncome: ', totalIncome);
    console.log('totalOutgoings: ', totalOutgoings);

    return Math.max(totalIncome - totalOutgoings, 0);
  };

  const totalAmount = calculateTotalAmount(items);

  return (
    <table
      data-testid="summary-table"
      className={twMerge(
        'flex flex-col border-collapse w-full bg-white border-1 border-gray-300 rounded-lg overflow-hidden lg:max-w-[680px]',
        className,
      )}
    >
      <caption className="sr-only">{captionText}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Step / Category</th>
          <th scope="col">Selection</th>
          <th scope="col">Cost</th>
        </tr>
      </thead>
      <tbody className="grid grid-cols-[1fr_max-content] lg:grid-cols-[15fr_max-content_max-content]">
        {items.map((item) => (
          <SummaryTableItem
            key={item.text}
            text={item.text}
            amount={item.amount}
            changeLink={item.changeLink}
          />
        ))}
      </tbody>
      <tfoot className="grid grid-cols-[7fr_3fr]">
        <tr className={twMerge(rowClasses, 'bg-blue-150 border-b-0')}>
          <th scope="row" className={firstCellClasses}>
            {totalText}
          </th>
          <td
            className={twMerge(secondCellClasses, 'text-left lg:text-center')}
            data-testid="summary-table-total-amount"
          >
            {formatCurrency(totalAmount)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
