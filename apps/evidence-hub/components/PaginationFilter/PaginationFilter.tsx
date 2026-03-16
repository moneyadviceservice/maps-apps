import { ChangeEvent } from 'react';

import { twMerge } from 'tailwind-merge';
import { PAGINATION_OPTIONS } from 'utils/filter/filterConstants';

import { Options, Select } from '@maps-react/form/components/Select';

export interface PaginationFilterProps {
  value: number;
  className?: string;
  'data-testid'?: string;
  name?: string;
  id?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const PaginationFilter = ({
  value,
  className,
  'data-testid': testId,
  name,
  id,
  onChange,
}: PaginationFilterProps) => {
  const options: Options[] = PAGINATION_OPTIONS.map((opt) => ({
    text: opt.text,
    value: opt.value,
  }));

  const inputId = id || name;

  return (
    <div className={twMerge('flex justify-end items-center gap-2', className)}>
      <label htmlFor={inputId} className="block text-[18px]">
        View per page
      </label>
      <Select
        key={`${name}-${value}`}
        data-testid={testId}
        id={inputId}
        name={name}
        defaultValue={value.toString()}
        options={options}
        hideEmptyItem={true}
        aria-label="Select items per page"
        selectClassName="min-w-[140px]"
        onChange={onChange}
      />
    </div>
  );
};
