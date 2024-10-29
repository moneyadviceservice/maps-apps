import { AnchorHTMLAttributes } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { twMerge } from 'tailwind-merge';
import { classes, whiteLinkClasses } from '../../components/Button/Button';
import { Icon, IconType } from '../../components/Icon';

export type LinkComponentProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> &
  Pick<LinkProps, 'href'> & {
    scroll?: boolean;
    title?: string;
    asButtonVariant?: 'primary' | 'secondary';
    variant?: 'default' | 'whiteText';
    analyticsClassName?: string;
    asInlineText?: boolean;
    className?: string;
  };

export const commonLinkClasses = [
  'items-center',
  'gap-2',
  'text-pink-600',
  'visited:text-purple-700',
  'focus:text-gray-800',
  'focus:bg-yellow-200',
  'focus:shadow-link-focus',
  'focus-within:outline-0',
  'underline',
  'hover:no-underline',
  'focus:no-underline',
  'cursor-pointer',
  'active:text-gray-800',
  'active:underline',
  'active:bg-transparent',
  'active:shadow-none',
];

export const linkClasses = ['inline-flex'].concat(commonLinkClasses);

const inlineLinkClasses = ['inline'].concat(commonLinkClasses);

export const Link = ({
  children,
  href,
  scroll,
  title,
  rel,
  target,
  asButtonVariant,
  analyticsClassName,
  asInlineText = false,
  variant = 'default',
  className,
  ...props
}: LinkComponentProps) => {
  return (
    <NextLink
      href={href}
      scroll={scroll}
      className={twMerge(
        className,
        asButtonVariant
          ? [...classes[asButtonVariant], target === '_blank' ? 'inline' : '']
          : asInlineText
          ? inlineLinkClasses
          : linkClasses,
        variant === 'whiteText' && whiteLinkClasses,
        analyticsClassName,
      )}
      title={title}
      rel={rel}
      target={target}
      {...props}
    >
      {children}
      {target === '_blank' && (
        <>
          <span className="sr-only"> (opens in a new window) </span>
          <Icon
            className="inline ml-[6px] mr-[2px]"
            type={IconType.LINK_ARROW}
          />
        </>
      )}
    </NextLink>
  );
};
