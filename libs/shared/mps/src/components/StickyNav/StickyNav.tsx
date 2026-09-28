import { MouseEvent, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import FocusTrap from 'focus-trap-react';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import useOnClickOutside from '@maps-react/hooks/useOnClickOutside';

import { SideNavigationModel } from '../../types';
import {
  isItemActive,
  normalisePath,
  stripTrailingSlash,
} from '../../utils/navigation';

export type StickyNavProps = {
  lang: string;
  navigation: SideNavigationModel | null;
  navSections?: Record<string, string[]>;
  label?: string;
  closeLabel?: string;
};

export const StickyNav = ({
  lang,
  navigation,
  navSections = {},
  label,
  closeLabel,
}: StickyNavProps) => {
  const { asPath } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(navRef, () => setIsOpen(false));

  useEffect(() => {
    const startBoundary = document.querySelector('h2, [data-sticky-nav-start]');
    const footer = document.querySelector('footer');

    if (!startBoundary || !footer) {
      return;
    }

    const updateVisibility = () => {
      const hasReachedStartBoundary =
        startBoundary.getBoundingClientRect().top <= 0;
      const hasReachedFooter =
        footer.getBoundingClientRect().top <= window.innerHeight;
      const shouldBeVisible = hasReachedStartBoundary && !hasReachedFooter;

      setIsVisible(shouldBeVisible);
      if (!shouldBeVisible) {
        setIsOpen(false);
      }
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const handleToggle = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen((previous) => !previous);
  };

  const links = (navigation?.links ?? []).filter(
    ({ title, link }) => title && link,
  );

  if (links.length === 0) {
    return null;
  }

  const currentPath = normalisePath(asPath);

  return (
    <div
      ref={navRef}
      className={`fixed inset-x-0 bottom-0 z-20 mx-4 md:hidden ${
        isVisible ? '' : 'hidden'
      }`}
      data-testid="sticky-nav"
      aria-hidden={!isVisible}
    >
      {isOpen ? (
        <>
          <div
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 -z-10 bg-gray-800/50"
            data-testid="sticky-nav-overlay"
          />
          <FocusTrap
            active={isOpen}
            focusTrapOptions={{
              escapeDeactivates: true,
              initialFocus: false,
              onDeactivate: () => setIsOpen(false),
            }}
          >
            <div data-testid="sticky-nav-content">
              <button
                id="local-nav-toggle"
                type="button"
                onClick={handleToggle}
                aria-expanded={true}
                aria-controls="local-nav-panel"
                className="flex w-full items-center gap-[13px] rounded-t-[4px] bg-magenta-500 px-4 pb-[11px] pt-[9px] text-white hover:bg-magenta-750 focus-visible:bg-yellow-400 focus-visible:text-gray-800 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-purple-500 active:bg-magenta-500 active:text-white active:outline-none active:ring-[3px] active:ring-inset active:ring-yellow-400"
                data-testid="sticky-nav-toggle"
              >
                <span className="flex-1 text-left text-base font-semibold leading-[23px]">
                  {label}
                </span>
                <span className="flex items-center gap-1">
                  <Icon type={IconType.CLOSE} className="w-4 h-4" />
                  <span className="text-[19px] font-bold leading-[25px]">
                    {closeLabel}
                  </span>
                </span>
              </button>
              <nav
                id="local-nav-panel"
                aria-label={label}
                className="max-h-[546px] overflow-y-auto bg-white pb-[26px] pl-4 pr-[11px] pt-[14px]"
              >
                <p className="mb-3 text-xl font-bold leading-[25px] text-gray-800">
                  {navigation?.navigationTitle}
                </p>
                <ul>
                  {links.map(({ title, link }) => {
                    const href = stripTrailingSlash(`/${lang}${link}`);
                    const sections = navSections[link] ?? [];
                    const isCurrentPage = isItemActive(
                      href,
                      currentPath,
                      sections,
                      lang,
                    );

                    return (
                      <li key={href}>
                        {isCurrentPage ? (
                          <span
                            aria-current="page"
                            className="flex items-center gap-2 border-t border-gray-300 pb-[10px] pt-[11px]"
                          >
                            <span className="flex-1 text-base leading-[23px] text-gray-800">
                              {title}
                            </span>
                          </span>
                        ) : (
                          <Link
                            href={href}
                            className="flex border-t border-gray-300 pb-[10px] pt-[11px] text-pink-800 no-underline visited:text-pink-800 hover:text-pink-900 hover:underline"
                          >
                            <span className="flex-1 text-base leading-[23px]">
                              {title}
                            </span>
                            <Icon
                              type={IconType.CHEVRON_RIGHT}
                              className="w-4 h-4 shrink-0"
                            />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </FocusTrap>
        </>
      ) : (
        <button
          id="local-nav-toggle"
          type="button"
          onClick={handleToggle}
          aria-expanded={false}
          aria-controls="local-nav-panel"
          className="flex w-full items-center gap-[13px] rounded-t-[4px] bg-magenta-500 px-4 pb-3 pt-[10px] text-white hover:bg-magenta-750 focus-visible:bg-yellow-400 focus-visible:text-gray-800 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-purple-500 active:bg-magenta-500 active:text-white active:outline-none active:ring-[3px] active:ring-inset active:ring-yellow-400"
          data-testid="sticky-nav-toggle"
        >
          <span className="flex-1 text-left text-base font-semibold leading-[23px]">
            {label}
          </span>
          <Icon type={IconType.CHEVRON_DOWN} className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
