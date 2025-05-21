import { ChangeEvent, ReactNode, SelectHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
export interface Options {
  text: ReactNode;
  value: string;
}

export type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  emptyItemText?: string;
  hideEmptyItem?: boolean;
  hidePlaceholder?: boolean;
  options: Options[];
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
};

export const Select = ({
  defaultValue = '',
  emptyItemText,
  hideEmptyItem,
  hidePlaceholder,
  options,
  onChange,
  className,
  selectClassName,
  ...props
}: Props) => {
  return (
    <div
      className={twMerge(
        'relative block focus-within:border-purple-600 border-transparent border focus-within:rounded focus-within:shadow-select-focus',
        className,
      )}
    >
      <span className="absolute inset-y-0 right-0 flex items-center w-10 pl-1 pr-1 text-white bg-pink-600 rounded-r pointer-events-none print:hidden shadow-bottom-gray focus:shadow-none">
        <Icon className="h-full" type={IconType.CHEVRON_DOWN}></Icon>
      </span>

      <select
        {...props}
        defaultValue={!props.value ? defaultValue : undefined}
        className={twMerge(
          'print:p-1 text-gray-500 border-gray-400 border-y border-l w-full outline-none block text-md h-10 pl-3 pr-12 bg-white rounded focus:border-white tool-dd',
          selectClassName,
        )}
        onChange={onChange}
      >
        {!hideEmptyItem && (
          <option disabled hidden={hidePlaceholder} value="">
            {emptyItemText}
          </option>
        )}
        {options.map(({ text, value }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
};
