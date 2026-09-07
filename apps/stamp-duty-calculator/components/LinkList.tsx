import { ReactNode } from 'react';

import Link from 'next/link';

import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

interface LinkItem {
  title: string;
  href: string;
  target?: string;
}

interface CustomLinkProps {
  children: ReactNode;
  href: string;
  scroll?: boolean;
  linkTitle?: string;
  rel?: string;
  target?: string;
}

interface LinkListProps {
  title: string;
  description?: string;
  links: LinkItem[];
  isEmbedded?: boolean;
}

const CustomLink = ({
  children,
  href,
  scroll,
  linkTitle,
  rel,
  target,
}: CustomLinkProps) => {
  return (
    <Link
      href={href}
      scroll={scroll}
      className="block py-2 text-pink-800 cursor-pointer hover:text-pink-900 hover:underline hover:bg-slate-200 focus:bg-yellow-400 focus:underline focus:text-gray-800 focus:shadow-link-focus hover:shadow-transparent focus-within:outline-none active:text-gray-800 active:underline active:bg-transparent visited:text-purple-700"
      title={linkTitle}
      rel={rel}
      target={target}
    >
      {children}
    </Link>
  );
};

/**
 * Component that renders a list of links
 */
export const LinkList = ({
  title,
  description,
  links,
  isEmbedded,
}: LinkListProps) => {
  return (
    <div className="space-y-6">
      <H2 color="text-blue-700">{title}</H2>
      {description && <Paragraph>{description}</Paragraph>}
      <ul className="t-link-list">
        {links.filter(Boolean).map((l) => (
          <li
            key={l.title + l.href}
            className="border-b first:border-t border-slate-400"
          >
            <CustomLink
              href={l.href}
              linkTitle={l.title}
              target={isEmbedded ? '_blank' : l.target}
            >
              <div className="flex items-center">
                {l.title}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42Z"
                  />
                </svg>
              </div>
            </CustomLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
