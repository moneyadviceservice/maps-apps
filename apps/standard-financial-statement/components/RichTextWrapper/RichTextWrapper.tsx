import React from 'react';

import { twMerge } from 'tailwind-merge';

import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';

export const buttonStyles = [
  'text-blue-600 bg-green-300 hover:text-blue-600 active:text-blue-600 hover:bg-green-500 active:bg-green-500 active:outline-blue-600',
];

export const radioStyles = [
  'peer-checked:after:border-green-500 active:after:opacity-100 active:after:border-white peer-checked:active:after:border-green-500 peer-focus:active:after:border-green-500 peer-checked:hover:after:border-green-500 peer-focus:hover:after:border-green-500"',
];

export const checkboxStyles = [
  'peer-checked:bg-white peer-checked:text-green-500 peer-checked:border-gray-600',
  'peer-checked:hover:bg-white peer-checked:hover:border-gray-600 peer-checked:hover:text-green-500',
  'active:bg-white active:border-gray-600 active:text-white peer-checked:active:bg-white peer-checked:active:border-gray-600',
];

export const classNamesRichText = [
  '[&_h2]:text-3xl',
  '[&_h2]:lg:text-5xl',
  '[&_h2]:line-height-[1.5]',
  '[&_h3]:lg:text-2xl',
  '[&_h3]:lg:text-4xl',
  '[&_h3]:line-height-[1.5]',
  'mt-8',
  'lg:mt-12',
  '[&_ul>li]:pb-[16px]',
  '[&_a]:text-magenta-800',
  '[&_a]:font-bold',
  '[&_a]:visited:text-magenta-800',
  '[&_details]:!border-t-1',
  '[&_details]:!border-slate-400',
  '[&_details>a]:!text-slate-400',
  '[&_details>summary>div]:!text-slate-600',
  '[&_details>summary>summary]:!no-underline',
  '[&_details>summary>svg]:!text-slate-600',
  '[&_details>summary]:!text-slate-600',
  '[&_table>tbody>tr>th]:py-2',
  '[&_table>tbody>tr>th]:px-4',
  '[&_table>tbody>tr>td]:py-2',
  '[&_table>tbody>tr>td]:px-4',
  '[&_table>tbody>tr>th]:w-auto',
  '[&_table>tbody>tr>td]:w-auto',
  '[&_table>tbody>tr>th]:break-words',
  '[&_table>tbody>tr>td]:break-words',
  '[&_table]:border-1',
  '[&_table]:border-slate-400',
  '[&_table]:tr:border-1',
  '[&_table]:w-full',
  '[&_table]:md:table-fixed',
  '[&_table>tbody>tr]:border-b-1',
  '[&_table>tbody>tr]:border-b-slate-400',
  '[&_table>tbody>tr>th]:bg-blue-600',
  '[&_table>tbody>tr>th]:text-white',
  '[&_table>tbody>tr>th]:text-left',
  '[&_table>tbody>tr>th]:border-r-1',
  '[&_table>tbody>tr>th]:border-r-slate-400',
  '[&_table>tbody>tr>td]:border-r-1',
  '[&_table>tbody>tr>td]:border-r-slate-400',
  '[&_table>tbody>tr:nth-child(even)]:bg-gray-150',
];

interface RichTextWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const RichTextWrapper: React.FC<RichTextWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <RichTextAem className={twMerge(classNamesRichText, className)}>
      {children}
    </RichTextAem>
  );
};

export default RichTextWrapper;
