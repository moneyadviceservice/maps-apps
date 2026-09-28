import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from 'react';

import { twMerge } from 'tailwind-merge';

import { linkClasses } from '../../components/Link';

export type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & {
      className?: string;
      analyticsClassName?: string;
      iconLeft?: ReactNode;
      iconRight?: ReactNode;
      variant?:
        | 'primary'
        | 'secondary'
        | 'transparent'
        | 'loading'
        | 'link'
        | 'close'
        | 'whiteLink';
      width?: string;
      as?: 'button';
    })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
      className?: string;
      analyticsClassName?: string;
      iconLeft?: ReactNode;
      iconRight?: ReactNode;
      variant?:
        | 'primary'
        | 'transparent'
        | 'secondary'
        | 'loading'
        | 'link'
        | 'close';
      width?: string;
      as: 'a';
    });

export const commonClasses = [
  't-button',
  'relative',
  'px-3',
  'py-2',
  'font-semibold',
  'rounded',
  'outline-none',
  'shadow-bottom-gray',
  'inline-flex',
  'items-center',
  'justify-between',
  'gap-2',
];

export const closeButtonClasses = ['p-1', 'absolute', 'top-1', 'right-1'];

export const commonActiveButtonClasses = [
  'cursor-pointer',
  'disabled:cursor-not-allowed',
  'disabled:border-slate-400',
  'disabled:border',
  'disabled:bg-transparent',
  'disabled:text-gray-400',
  'disabled:shadow-none',

  'focus:bg-yellow-400',
  'focus:outline-blue-700',
  'focus:outline-[3px]',
  'focus:outline-offset-0',
  'focus:text-gray-800',
  'focus:shadow-none',
  'focus:before:content-[""]',
  'focus:before:w-[calc(100%+6px)]',
  'focus:before:rounded-[0.45rem]',
  'focus:before:absolute',
  'focus:before:inset-0',
  'focus:before:inset-x-[-3px]',
  'focus:before:inset-y-[-3px]',
  'focus:before:shadow-bottom-gray',

  'active:outline-[3px]',
  'active:outline-offset-0',
  'active:shadow-inset',
  'active:before:content-[""]',
  'active:before:w-[calc(100%+6px)]',
  'active:before:rounded-[0.45rem]',
  'active:before:absolute',
  'active:before:inset-0',
  'active:before:inset-x-[-3px]',
  'active:before:inset-y-[-3px]',
  'active:before:shadow-bottom-white',
];

export const classes = {
  primary: [
    'border-0',
    'text-white',
    'bg-magenta-500',

    'hover:bg-pink-800',

    'active:bg-pink-900',
    'active:outline-yellow-400',
    'active:text-white',
  ].concat(commonClasses, commonActiveButtonClasses),
  secondary: [
    'border',
    'border-magenta-500',
    'text-magenta-500',
    'bg-white',

    'hover:border-pink-800',
    'hover:text-pink-800',
    'hover:bg-gray-50',

    'focus:border-transparent',

    'active:text-slate-900',
    'active:outline-blue-700',
    'active:bg-gray-50',
    'active:px-[13px]',
    'active:py-[9px]',
    'active:border-none',
  ].concat(commonClasses, commonActiveButtonClasses),
  transparent: [
    'text-magenta-500',
    'underline',
    'underline-offset-2',
    'decoration-2',
    'shadow-none',

    'hover:bg-black',
    'hover:bg-opacity-25',

    'active:no-underline',
    'active:text-slate-900',
    'active:outline-blue-700',
    'active:bg-gray-50',

    'focus:no-underline',
    'focus:text-slate-900',

    'disabled:border-none',
  ].concat(commonClasses, commonActiveButtonClasses),
  loading: [
    'cursor-not-allowed',
    'border-slate-400',
    'border',
    'bg-gray-100',
    'text-gray-500',
    'shadow-none',
  ].concat(commonClasses),
  close: [closeButtonClasses],
};

export const whiteLinkClasses = [
  'text-white',
  'no-underline',
  'hover:text-pink-400',
  'visited:text-white',
  'focus:text-gray-800',
  'focus:bg-yellow-400',
  'focus:shadow-link-focus',
  'focus-within:outline-0',
  'hover:underline',
  'focus:no-underline',
  'cursor-pointer',
  'active:text-gray-800',
  'active:underline',
  'active:bg-transparent',
  'active:shadow-none',
];

/**
 * Primary UI component for user interaction
 */
export const Button = forwardRef(
  (
    {
      className,
      analyticsClassName,
      children,
      type: typeProp,
      variant = 'primary',
      iconLeft,
      iconRight,
      width,
      as = 'button',
      ...props
    }: ButtonProps,
    ref,
  ) => {
    const Element: any = as === 'a' ? 'a' : 'button';

    const type =
      Element === 'button'
        ? typeof typeProp === 'undefined'
          ? 'submit'
          : typeProp
        : typeProp;

    return (
      <Element
        className={twMerge(
          variant === 'link'
            ? linkClasses
            : variant === 'whiteLink'
            ? whiteLinkClasses
            : classes[variant],
          `t-${variant}-button`,
          width,
          analyticsClassName,
          className,
        )}
        type={type}
        {...props}
        ref={ref}
      >
        {/* @note Span always spat out for consistent display. */}
        <span>{iconLeft}</span>
        {children}
        <span>{iconRight}</span>
      </Element>
    );
  },
);
