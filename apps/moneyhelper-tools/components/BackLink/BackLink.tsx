import NextLink, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import ChevronLeft from 'public/icons/chevron-left.svg';

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
    <div className="flex items-center text-pink-600 group">
      <ChevronLeft
        className="text-pink-600 group-hover:text-pink-800"
        width="8"
        height="15"
        viewBox="0 0 8 15"
        xmlns="http://www.w3.org/2000/svg"
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
