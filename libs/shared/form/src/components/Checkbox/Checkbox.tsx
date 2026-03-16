import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';

export type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  checkboxClassName?: string;
  hasError?: boolean;
  labelTestId?: string;
};

const baseClasses = `
  flex items-center justify-center flex-none w-10 h-10 p-1
  bg-white border border-gray-400 rounded text-white
`;

const checkedClasses = `
  peer-checked:bg-magenta-500 peer-checked:text-white peer-checked:border-magenta-500
`;

const focusClasses = `
  peer-focus:border-4 peer-focus:border-blue-700 peer-focus:ring-[3px] peer-focus:ring-yellow-400
`;

const hoverClasses = `
  peer-checked:hover:bg-pink-800 peer-checked:hover:border-pink-800 peer-checked:hover:text-white
`;

const activeClasses = `
  active:bg-pink-400 active:border-pink-400 active:text-white
  peer-checked:active:bg-pink-400 peer-checked:active:border-pink-400
`;

const disabledClasses = `
  peer-disabled:bg-slate-400
  peer-disabled:border-slate-400 
  peer-disabled:text-slate-400
  peer-disabled:cursor-not-allowed
`;

const getErrorClasses = (hasError?: boolean) => {
  if (!hasError) return '';
  return `
    border-4 border-red-700
    peer-focus:border-red-700 peer-focus:bg-red-700
    peer-checked:bg-red-700 peer-checked:border-red-700
  `;
};

export const Checkbox = ({
  children,
  style,
  className,
  checkboxClassName,
  hasError,
  labelTestId,
  ...rest
}: CheckboxProps) => {
  const errorClasses = getErrorClasses(hasError);

  return (
    <label
      style={style}
      className={twMerge('flex', className)}
      data-testid={labelTestId}
    >
      <input type="checkbox" className="sr-only peer tool-cbox" {...rest} />
      <div
        className={twMerge(
          baseClasses,
          checkedClasses,
          focusClasses,
          hoverClasses,
          activeClasses,
          errorClasses,
          disabledClasses,
          checkboxClassName,
        )}
      >
        <Icon
          className="w-6 h-5"
          role="presentation"
          type={IconType.TICK_SQUARE}
        />
      </div>
      <p className="self-center ml-4">{children}</p>
    </label>
  );
};
