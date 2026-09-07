import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import {
  Props as SelectProps,
  Select,
} from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type Item = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
> & {
  label: string;
  value: ReactNode;
  background?: string;
  isEstimate?: boolean;
};

const Item = ({
  label,
  value,
  className,
  background = 'bg-gray-100',
  isEstimate,
  ...rest
}: Item) => {
  return (
    <tr
      data-testid="summary-total-item-value"
      className={twMerge(
        `flex justify-between print:border-none border w-full h-full rounded-[4px] mb-2 py-5 px-4 ${background} ${
          isEstimate
            ? 'rounded-none border-8 border-y-0 rounded-bl-lg border-l-amber-500 text-black'
            : ''
        }`,
        className,
      )}
      {...rest}
    >
      <th className="text-lg font-normal">{label}</th>
      <td className="text-md" data-testid="item-value">
        {value}
      </td>
    </tr>
  );
};

export type Props = {
  children?: ReactNode;
  onSelectChange?: SelectProps['onChange'];
  selectOptions?: SelectProps['options'];
  items: Item[];
  summary: Item;
  defaultValue?: number;
  showHeading?: boolean;
  isProgress?: boolean;
};

export default function SummaryTotal({
  children,
  onSelectChange,
  defaultValue,
  selectOptions,
  items,
  summary,
  showHeading,
  isProgress,
}: Readonly<Props>) {
  const { z } = useTranslation();
  return (
    <div
      className={twMerge(
        `flex flex-col  print:border-none border border-slate-400 rounded-[4px] px-1 pb-4 ${
          !showHeading ? 'pt-3 pb-4' : ''
        }`,
      )}
    >
      {showHeading ? (
        <div className="flex items-center justify-center px-1 py-4 text-center md:flex-col lg:flex-row print:text-left print:p-2">
          <Heading level="h4" component="h3">
            {z({
              en: `${isProgress ? 'Your progress' : 'Summary total'}`,
              cy: `${isProgress ? 'Eich cynnydd' : 'Cyfanswm crynodeb'}`,
            })}
          </Heading>
          {isProgress && (
            <span className="ml-1 text-lg">
              {z({
                en: '(monthly)',
                cy: '(misol)',
              })}
            </span>
          )}
        </div>
      ) : null}
      {selectOptions && (
        <div className="px-6 pt-0 pb-4">
          <Select
            name="divisor"
            hideEmptyItem
            defaultValue={defaultValue ?? 1}
            onChange={onSelectChange}
            options={selectOptions}
          />
        </div>
      )}
      <table className="w-full border-collapse">
        <thead className="sr-only">
          <tr>
            <th className="hidden"></th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody className="flex flex-col mx-1">
          {items.map((item) => (
            <Item
              key={item.label}
              label={item.label}
              value={item.value}
              className={item.className}
              isEstimate={item.isEstimate}
            />
          ))}
          <Item
            label={summary.label}
            value={summary.value}
            background={summary.background}
            isEstimate={summary.isEstimate}
            className="text-white"
          />
        </tbody>
      </table>

      {children ? (
        <div className="flex justify-center px-1 mt-6 mb-4">{children}</div>
      ) : null}
    </div>
  );
}
