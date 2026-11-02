import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';

export const QuickLinks = ({
  testId = 'quick-links',
  linkText,
}: {
  testId?: string;
  linkText: string[];
}) => {
  const router = useRouter();

  // Focus on the section with the ID from the URL hash when navigating to section
  // to aid keyboard navigation and accessibility.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute('tabindex', '-1');
        el.focus();
      }
    }
  }, [router.asPath]);

  if (!linkText || linkText.length === 0) {
    return null;
  }

  return (
    <div
      className="lg:grid lg:grid-cols-12 focus-visible:outline-none"
      id="quick-links"
    >
      <ol
        data-testid={testId}
        className="mb-8 border-t border-slate-400 lg:col-span-8 xl:col-span-6 2xl:col-span-5"
      >
        {linkText.map((text, i) => {
          const index = i + 1;
          return (
            <li
              key={`section${index}`}
              className="pb-1 border-b border-slate-400"
            >
              <Link
                href={`#section${index}`}
                data-testid={`section-${index}-link`}
                color="text-blue-500"
                className="inline-block w-full pt-1 pb-[2px] no-underline hover:underline"
              >
                {text}
                <Icon
                  type={IconType.ARROW_UP}
                  className="rotate-[180deg] -mt-[1px] inline-block ml-1"
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
