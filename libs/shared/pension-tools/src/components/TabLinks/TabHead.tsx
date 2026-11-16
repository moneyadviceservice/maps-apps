import { forwardRef, ReactNode, useRef } from 'react';

import { twMerge } from 'tailwind-merge';

type Props = {
  children: ReactNode;
};

const navClasses = `print:hidden t-step-navigation mx-0 mb-6 max-sm:mb-0 flex flex-wrap sm:flex max-sm:grid max-sm:grid-cols-2 max-sm:grid-rows-4 py-6 md:py-8`;

export const TabHead = forwardRef(({ children }: Props) => {
  const navRef = useRef<HTMLElement>(null);

  return (
    <div className="relative">
      <nav
        ref={navRef}
        className={twMerge(navClasses)}
        data-testid={'nav-tab-list'}
        role="tablist"
      >
        {children}
      </nav>
    </div>
  );
});

TabHead.displayName = 'TabHead';
