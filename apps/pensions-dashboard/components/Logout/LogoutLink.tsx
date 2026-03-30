import { KeyboardEvent, MouseEvent } from 'react';

import { Link } from '@maps-react/common/components/Link';

export type LogoutLinkProps = {
  children: React.ReactNode;
  href: string;
  testId?: string;
  className?: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

export const LogoutLink = ({
  children,
  href,
  testId = 'logout-link',
  className,
  onClick,
  onKeyDown,
}: LogoutLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-testid={testId}
      className={className}
    >
      {children}
    </Link>
  );
};
