import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  forwardRef,
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
      variant?: 'primary' | 'secondary' | 'loading' | 'link' | 'close';
      width?: string;
      as: 'a';
    });

export const commonClasses = [
  't-button',
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
  'disabled:text-gray-500',
  'disabled:shadow-none',

  'focus:bg-yellow-200',
  'focus:outline-purple-700',
  'focus:outline-[3px]',
  'focus:outline-offset-0',
  'focus:text-gray-800',
  'focus:shadow-none',

  'active:shadow-none',
  'active:outline-[3px]',
  'active:outline-offset-0',
];

export const classes = {
  primary: [
    'border-0',
    'text-white',
    'bg-pink-600',

    'hover:bg-pink-800',
    'hover:shadow-none',

    'active:bg-pink-900',
    'active:outline-yellow-200',
    'active:text-white',
  ].concat(commonClasses, commonActiveButtonClasses),
  secondary: [
    'border',
    'border-pink-600',
    'text-pink-600',
    'bg-white',

    'hover:border-pink-800',
    'hover:text-pink-800',
    'hover:shadow-none',

    'focus:border-transparent',

    'active:text-slate-900',
    'active:outline-purple-700',
    'active:bg-white',
    'active:border-transparent',
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
  'focus:bg-yellow-200',
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
          className,
          variant === 'link'
            ? linkClasses
            : variant === 'whiteLink'
            ? whiteLinkClasses
            : classes[variant],
          `t-${variant}-button`,
          width,
          analyticsClassName,
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
