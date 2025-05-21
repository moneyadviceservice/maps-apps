import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';

export type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Checkbox = ({
  children,
  style,
  className,
  ...rest
}: CheckboxProps) => (
  <label style={style} className={twMerge('flex', className)}>
    <input type="checkbox" className="sr-only peer tool-cbox" {...rest} />
    <div className="flex items-center justify-center flex-none w-10 h-10 p-1 text-white bg-white border border-gray-400 rounded peer-checked:text-pink-600 peer-focus:border-2 peer-focus:border-purple-700 peer-focus:ring-4 peer-focus:ring-yellow-300 peer-disabled:border-slate-400 peer-checked:disabled:text-gray-500">
      <Icon className="w-6 h-5" role="presentation" type={IconType.TICK} />
    </div>
    <p className="self-center ml-4">{children}</p>
  </label>
);
