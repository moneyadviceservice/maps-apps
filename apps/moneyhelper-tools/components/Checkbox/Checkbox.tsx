import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Tick from 'public/icons/tick.svg';

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
    <input type="checkbox" className="peer sr-only tool-cbox" {...rest} />
    <div className="flex justify-center items-center flex-none w-10 h-10  p-1  bg-white text-white peer-checked:text-pink-600  border border-gray-400 rounded peer-focus:border-2 peer-focus:border-purple-700  peer-focus:ring-4 peer-focus:ring-yellow-300 peer-disabled:border-slate-400 peer-checked:disabled:text-gray-500">
      <Tick className="w-6 h-5" role="presentation" />
    </div>
    <p className="ml-4 self-center">{children}</p>
  </label>
);
