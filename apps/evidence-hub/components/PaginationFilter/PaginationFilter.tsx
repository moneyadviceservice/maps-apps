import { twMerge } from 'tailwind-merge';
import { PAGINATION_OPTIONS } from 'utils/filter/filterConstants';

import { Options, Select } from '@maps-react/form/components/Select';

export interface PaginationFilterProps {
  value: number;
  className?: string;
  'data-testid'?: string;
  name?: string;
}

export const PaginationFilter = ({
  value,
  className,
  'data-testid': testId,
  name,
}: PaginationFilterProps) => {
  const options: Options[] = PAGINATION_OPTIONS.map((opt) => ({
    text: opt.text,
    value: opt.value,
  }));

  return (
    <div className={twMerge('flex justify-end items-center gap-2', className)}>
      <label htmlFor={name} className="block text-[18px]">
        View per page
      </label>
      <Select
        key={`${name}-${value}`}
        data-testid={testId}
        id={name}
        name={name}
        defaultValue={value.toString()}
        options={options}
        hideEmptyItem={true}
        aria-label="Select items per page"
        selectClassName="min-w-[140px]"
      />
    </div>
  );
};
