import {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import NextLink from 'next/link';
import { NextRouter, useRouter } from 'next/router';

import FocusTrap from 'focus-trap-react';
import { twMerge } from 'tailwind-merge';

import { classes } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { GridContainer } from '../GridContainer';
import { HeaderSearch } from '../HeaderSearch';
import { LanguageSwitcher, resolveLanguageHref } from '../LanguageSwitcher';
import { HeaderLinks } from './data/HeaderLinks';

export type ChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export const isKeyboardEvent = (
  event: ChangeEvent,
): event is React.KeyboardEvent<HTMLElement> => {
  return 'key' in event;
};

export const isMouseEvent = (
  event: ChangeEvent,
): event is React.MouseEvent<HTMLElement> => {
  return !('key' in event);
};

type NavProps = {
  router: NextRouter;
  showLanguageSwitcher: boolean;
  headerEndSlot?: ReactNode;
};

const Navigation = ({
  router,
  showLanguageSwitcher,
  headerEndSlot,
}: NavProps) => {
  const { z } = useTranslation();
  const { menu } = HeaderLinks();

  return (
    <nav className="absolute z-10 flex pt-4 text-gray-900 t-header-navigation w-80 md:w-96">
      <div className="w-full pb-3 space-y-4 bg-white border">
        <ul className="divide-y">
          {menu.map(({ title, href }) => (
            <li key={title} className="px-3 py-2">
              <Link href={href}>
                <div className="flex items-center">
                  <div>{title}</div>
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
              </Link>
            </li>
          ))}
        </ul>
        {showLanguageSwitcher && (
          <div
            className="px-3 t-header-navigation-button"
            data-testid="nav-lang-link-container"
          >
            <a
              href={resolveLanguageHref(router, {
                query: {
                  ...router?.query,
                  language: z({ en: 'cy', cy: 'en' }),
                },
              })}
              lang={z({ en: 'cy', cy: 'en' })}
              className={twMerge(classes['secondary'])}
              data-testid="nav-lang-link"
            >
              {z({ en: 'Cymraeg', cy: 'English' })}
            </a>
          </div>
        )}
        {headerEndSlot && (
          <div className="px-3 t-header-navigation-button lg:hidden">
            {headerEndSlot}
          </div>
        )}
      </div>
    </nav>
  );
};

type HeaderProps = {
  layout?: string;
  showLanguageSwitcher?: boolean;
  headerEndSlot?: ReactNode;
};

export const Header = ({
  layout,
  showLanguageSwitcher = true,
  headerEndSlot,
}: HeaderProps) => {
  const router = useRouter();
  const { z } = useTranslation();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const language = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  });

  function handleNavigation(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      setIsSearchOpen(false);
      setIsNavigationOpen(!isNavigationOpen);
    }
  }

  const navigationRef = useRef<HTMLDetailsElement>(null);
  useOnClickOutside(navigationRef, () => setIsNavigationOpen(false));

  const skipToContentFocusStyles =
    'focus:not-sr-only focus:outline-none focus:bg-yellow-400 focus:z-20 focus:shadow-darkbg-link-focus focus:absolute focus:p-2 focus:top-4 focus:left-4';

  const burger_icon = isNavigationOpen
    ? IconType.BURGER_CLOSE
    : IconType.BURGER_ICON;
  const burger_text = isNavigationOpen
    ? z({ en: 'close', cy: 'cau' })
    : z({ en: 'menu', cy: 'dewislen' });

  const headerRow = (
    <div className="flex w-full min-w-0 items-center gap-2">
      <div className="shrink-0">
        <FocusTrap
          active={isNavigationOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <details
            className="relative group"
            open={isNavigationOpen}
            ref={navigationRef}
          >
            <summary
              title={
                isNavigationOpen
                  ? z({ en: 'Close menu', cy: 'Cau dewislen' })
                  : z({ en: 'Open menu', cy: 'Agor dewislen' })
              }
              className={`t-header-menu-${
                isNavigationOpen ? 'close' : 'open'
              } cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-sm focus:shadow-darkbg-link-focus focus:bg-yellow-400 focus:text-gray-800 focus:outline-none`}
              onClick={handleNavigation}
              onKeyDown={handleNavigation}
              data-testid="nav-toggle"
            >
              <div>
                <Icon type={burger_icon} />
                <span>{burger_text}</span>
              </div>
            </summary>
            <Navigation
              router={router}
              showLanguageSwitcher={showLanguageSwitcher}
              headerEndSlot={headerEndSlot}
            />
          </details>
        </FocusTrap>
      </div>
      <div className="flex min-w-0 flex-1 justify-center t-header-logo">
        <NextLink
          href="https://moneyhelper.org.uk/"
          className="inline-block text-white focus:bg-yellow-400 focus:outline-none focus:shadow-darkbg-link-focus focus:bg-yellow-400 focus:text-gray-800"
          aria-label={z({ en: 'Money helper', cy: 'Helpwr Arian' })}
        >
          <>
            <span className="hidden lg:inline">
              {z({
                en: <Icon type={IconType.LOGO_ICON} />,
                cy: <Icon type={IconType.LOGO_CY_ICON} />,
              })}
            </span>
            <span className="block lg:hidden">
              {z({
                en: (
                  <Icon
                    className="w-[99px] h-[51px]"
                    type={IconType.LOGO_COMPACT_ICON}
                  />
                ),
                cy: (
                  <Icon
                    className="w-[104px] h-[55px]"
                    type={IconType.LOGO_COMPACT_CY}
                  />
                ),
              })}
            </span>
          </>
        </NextLink>
      </div>
      <div
        className="flex shrink-0 items-center gap-2"
        data-testid="header-end-cluster"
      >
        {showLanguageSwitcher && (
          <div className="hidden lg:flex items-center">
            <LanguageSwitcher />
          </div>
        )}
        {!headerEndSlot && (
          <HeaderSearch
            language={language}
            isOpen={isSearchOpen}
            setIsOpen={setIsSearchOpen}
            closeNavigation={() => setIsNavigationOpen(false)}
          />
        )}
        {headerEndSlot && (
          <div className="hidden lg:block" data-testid="header-end-slot">
            {headerEndSlot}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <header data-testid="header">
      <a className={twMerge('sr-only', skipToContentFocusStyles)} href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>
      {(isNavigationOpen || isSearchOpen) && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25 t-menu-overlay" />
      )}
      <div className="bg-blue-700 shadow-bottom-gray t-header print:hidden">
        {layout === 'grid' ? (
          <GridContainer>
            <div className="relative z-10 col-span-12 flex w-full items-center py-4">
              {headerRow}
            </div>
          </GridContainer>
        ) : (
          <div className="relative z-10 flex w-full items-center p-4 container-auto">
            {headerRow}
          </div>
        )}
      </div>
    </header>
  );
};
