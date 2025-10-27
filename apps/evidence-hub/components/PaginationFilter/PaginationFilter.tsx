import { ChangeEvent } from 'react';

import { Options, Select } from '@maps-react/form/components/Select';
import { twMerge } from 'tailwind-merge';

export interface PaginationFilterProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  'data-testid'?: string;
  name?: string;
}

export const PaginationFilter = ({
  value,
  onChange,
  className,
  'data-testid': testId,
  name,
}: PaginationFilterProps) => {
  // Generate options from 10 to 50 in increments of 10
  const options: Options[] = Array.from({ length: 5 }, (_, index) => {
    const pageSize = (index + 1) * 10;
    return {
      text: `${pageSize} per page`,
      value: pageSize.toString(),
    };
  });

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number.parseInt(event.target.value, 10);
    onChange(newValue);
  };

  return (
    <div className={twMerge('flex justify-end items-center gap-2', className)}>
      <label htmlFor={name} className="block text-[18px]">
        View per page
      </label>
      <Select
        data-testid={testId}
        id={name}
        name={name}
        value={value.toString()}
        onChange={handleChange}
        options={options}
        hideEmptyItem={true}
        aria-label="Select items per page"
        selectClassName="min-w-[140px]"
      />
    </div>
  );
};
