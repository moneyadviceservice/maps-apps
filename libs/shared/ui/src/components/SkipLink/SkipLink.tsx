import { AnchorHTMLAttributes, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export const SkipLink = ({ children, className, ...props }: SkipLinkProps) => {
  return (
    <a
      {...props}
      className={twMerge(
        'absolute bottom-full right-full z-50 bg-yellow-400 text-gray-800 border-b-4 border-b-blue-700 p-2 rounded opacity-0 focus:opacity-100 focus:outline focus:outline-2 focus:outline-blue-700',
        className,
      )}
    >
      {children}
    </a>
  );
};
