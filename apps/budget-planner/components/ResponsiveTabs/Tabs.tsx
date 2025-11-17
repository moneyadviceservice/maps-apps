import { HTMLAttributes, MutableRefObject, ReactNode, useRef } from 'react';

import { twMerge } from 'tailwind-merge';

export type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  testClassName?: string;
};

const ResponsiveTabs = ({ children, testClassName = '', ...props }: Props) => {
  const classNames =
    'mb-6 max-sm:mb-0 flex flex-wrap sm:flex max-sm:grid max-sm:grid-cols-2 max-sm:grid-rows-4 ';
  const navRef = useRef<HTMLElement>() as MutableRefObject<HTMLElement>;

  return (
    <div className="relative print:hidden">
      <nav
        id="slideNav"
        ref={navRef}
        {...props}
        className={twMerge(testClassName, classNames)}
      >
        {children}
      </nav>
    </div>
  );
};

export default ResponsiveTabs;
