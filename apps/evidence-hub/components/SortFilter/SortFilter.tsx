import { twMerge } from 'tailwind-merge';
import { SORT_OPTIONS } from 'utils/filter/filterConstants';

import { Options, Select } from '@maps-react/form/components/Select';

export interface SortFilterProps {
  value: string;
  hasKeyword: boolean;
  className?: string;
  'data-testid'?: string;
  name?: string;
}

export const SortFilter = ({
  value,
  hasKeyword,
  className,
  'data-testid': testId,
  name,
}: SortFilterProps) => {
  // Base options: Published date and Recently updated
  const baseOptions: Options[] = SORT_OPTIONS.filter(
    (opt) => opt.value !== 'relevance',
  ).map((opt) => ({ text: opt.text, value: opt.value }));

  // Conditional option when keyword is present: Relevance (prepend to array)
  const relevanceOption = SORT_OPTIONS.find((opt) => opt.value === 'relevance');
  const options: Options[] =
    hasKeyword && relevanceOption
      ? [
          { text: relevanceOption.text, value: relevanceOption.value },
          ...baseOptions,
        ]
      : baseOptions;

  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      <label htmlFor={name} className="block text-[18px]">
        Sort results by
      </label>
      <Select
        key={`${name}-${value}-${hasKeyword}`}
        data-testid={testId}
        id={name}
        name={name}
        defaultValue={value}
        options={options}
        hideEmptyItem={true}
        aria-label="Sort results by"
        selectClassName="min-w-[180px]"
      />
      <input type="hidden" name={`${name}-current`} value={value} />
    </div>
  );
};
