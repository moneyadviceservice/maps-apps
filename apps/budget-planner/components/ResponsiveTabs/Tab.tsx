import { ButtonHTMLAttributes, forwardRef, RefObject } from 'react';

import { twMerge } from 'tailwind-merge';

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  testClassName?: string;
  ref?: RefObject<HTMLButtonElement>;
};

const ResponsiveTab = forwardRef<HTMLButtonElement, Props>(
  ({ children, isActive, testClassName = '', ...props }, ref) => {
    const commonClassNames =
      't-button t-step-navigation__button p-3 border-b-3 border-[4c6272] snap-start leading-4 flex-none font-bold text-pink-800 !gap-0 underline whitespace-nowrap  hover:bg-gray-100 hover:no-underline max-sm:w-full max-sm:text-center max-sm:flex max-sm:justify-center';

    const activeTabClassNames = isActive
      ? 'border-b-3 border-blue-700 text-blue-700 no-underline'
      : '';

    const focusClassNames =
      'focus:bg-yellow-400 focus:outline-none focus:text-blue-700 focus:border-purple-800 focus:no-underline active:bg-yellow-400';

    return (
      <button
        {...props}
        ref={ref}
        className={twMerge(
          testClassName,
          commonClassNames,
          'tool-nav-tab',
          activeTabClassNames,
          focusClassNames,
        )}
        role="tab"
        aria-selected={isActive}
      >
        {children}
      </button>
    );
  },
);

ResponsiveTab.displayName = 'Tab';

export default ResponsiveTab;
