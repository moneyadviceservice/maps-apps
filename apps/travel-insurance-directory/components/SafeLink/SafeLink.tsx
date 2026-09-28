import { ReactNode } from 'react';

import { LinkProps } from 'next/link';

import { Link } from '@maps-react/common/components/Link';

interface SafeLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  withTextBefore?: string;
  withTextAfter?: string;
  hiddenRoutes: string[];
  fallbackHref?: string;
}

export function SafeLink({
  href,
  children,
  hiddenRoutes,
  withTextBefore,
  withTextAfter,
  fallbackHref,
  ...props
}: Readonly<SafeLinkProps>) {
  const url = href.toString().toLowerCase();

  const isHidden = hiddenRoutes?.some(
    (route) => url === route || url.startsWith(`${route}/`),
  );

  if (isHidden && !fallbackHref) {
    return null;
  }

  return (
    <>
      {withTextBefore && <span>{withTextBefore} </span>}
      <Link href={isHidden && fallbackHref ? fallbackHref : href} {...props}>
        {children}
      </Link>
      {withTextAfter && <span> {withTextAfter}</span>}
    </>
  );
}
