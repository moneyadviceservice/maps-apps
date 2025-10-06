import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

import NextLink, { LinkProps } from 'next/link';

import { Icon, IconType } from '../Icon';

type Props = LinkProps &
  DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & {
    scroll?: boolean;
    title?: string;
  };

export const BackLink = ({
  scroll,
  title,
  rel,
  target,
  children,
  href,
}: Props) => {
  return (
    <div className="flex items-center text-magenta-500 group">
      <Icon
        type={IconType.CHEVRON_LEFT}
        className="text-magenta-500 group-hover:text-pink-800 w-[8px] h-[15px]"
        aria-hidden="true"
      />
      <NextLink
        href={href}
        className="ml-2 underline tool-nav-prev group-hover:text-pink-800 group-hover:no-underline"
        scroll={scroll}
        title={title}
        rel={rel}
        target={target}
      >
        {children}
      </NextLink>
    </div>
  );
};
