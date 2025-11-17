import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import NextLink from 'next/link';
import { NextRouter, useRouter } from 'next/router';

import FocusTrap from 'focus-trap-react';
import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';
import { LanguageSwitcher } from '@maps-react/core/components/LanguageSwitcher';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  ChangeEvent,
  isActionableEvent,
  LogoutDialog,
  LogoutLink,
} from '../Logout';

type NavProps = {
  isLoggedInPage: boolean;
  handleLogout: (event: ChangeEvent) => void;
  router: NextRouter;
  showLanguageSwitchers: boolean;
};

const Navigation = ({
  router,
  isLoggedInPage,
  handleLogout,
  showLanguageSwitchers,
}: NavProps) => {
  const { t, z, locale } = useTranslation();

  return (
    <nav className="absolute right-0 z-10 flex pt-4 text-gray-900 t-header-navigation w-72 md:w-96">
      <div className="w-full space-y-4 bg-white border">
        <ul className="divide-y">
          {isLoggedInPage && (
            <li className="px-3 py-2">
              <LogoutLink
                href={`/${locale}/you-are-about-to-leave`}
                onClick={handleLogout}
                onKeyDown={handleLogout}
              >
                <div className="flex items-center">
                  <div>{t('site.header.links.exit')}</div>
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
              </LogoutLink>
            </li>
          )}
        </ul>
        {showLanguageSwitchers && (
          <div
            className="px-3 pb-3 t-header-navigation-button"
            data-testid="language-switcher-btn"
          >
            <Link
              href={{
                query: {
                  ...router?.query,
                  language: z({ en: 'cy', cy: 'en' }),
                },
              }}
              lang={z({ en: 'cy', cy: 'en' })}
              asButtonVariant="secondary"
            >
              {z({ en: 'Cymraeg', cy: 'English' })}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

type HeaderProps = {
  isLoggedInPage?: boolean;
  isLogoutModalOpen?: boolean;
  setIsLogoutModalOpen?: Dispatch<SetStateAction<boolean>>;
  handleLogout: (event: ChangeEvent) => void;
  showLanguageSwitchers?: boolean;
};

export const Header = ({
  isLoggedInPage = true,
  isLogoutModalOpen = false,
  handleLogout,
  showLanguageSwitchers = true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLogoutModalOpen = () => {},
}: HeaderProps) => {
  const router = useRouter();
  const { z, t } = useTranslation();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const language = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  });

  function handleNavigation(event: ChangeEvent) {
    if (isActionableEvent(event)) {
      event.preventDefault();
      setIsNavigationOpen(!isNavigationOpen);
    }
  }

  const navigationRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  useOnClickOutside(navigationRef, () => setIsNavigationOpen(false));

  const skipToContentFocusStyles =
    'focus:not-sr-only focus:bg-yellow-400 focus:z-20 focus:border-b-4 focus:border-b-blue-700 focus:absolute focus:p-2 focus:rounded focus:top-4 focus:left-4';

  return (
    <header data-testid="header">
      <a className={twMerge('sr-only', skipToContentFocusStyles)} href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>
      {isNavigationOpen && !isLogoutModalOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25 t-menu-overlay" />
      )}
      <div className="relative z-10 bg-blue-700 t-header print:hidden shadow-bottom-gray">
        <Container className="relative z-10 flex items-center px-4 h-[96px]">
          <NextLink
            href={`https://moneyhelper.org.uk/${language}`}
            aria-label={z({ en: 'Money helper', cy: 'Helpwr Arian' })}
          >
            <span>
              {z({
                en: (
                  <Icon
                    className="w-[72px] h-[44px] sm:w-[99px] sm:h-[51px]"
                    type={IconType.LOGO_COMPACT_ICON}
                  />
                ),
                cy: (
                  <Icon
                    className="w-[72px] h-[38px] sm:w-[104px] sm:h-[55px]"
                    type={IconType.LOGO_COMPACT_CY}
                  />
                ),
              })}
            </span>
          </NextLink>
          <div className="w-[176px] sm:w-auto text-center mx-auto text-white t-header-logo text-[20px] leading-[24px] sm:leading-[43px] sm:text-[34px] font-bold">
            {t('site.header.logo')}
          </div>
          {showLanguageSwitchers && (
            <LanguageSwitcher
              className="md:hidden lg:block right-[90px]"
              testId="language-switcher"
            />
          )}

          <FocusTrap
            active={isNavigationOpen || isLogoutModalOpen}
            focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
          >
            <div>
              <details
                className="relative group"
                open={isNavigationOpen && !isLogoutModalOpen}
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
                  } cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-sm`}
                  onClick={(e) => handleNavigation(e)}
                  onKeyDown={(e) => handleNavigation(e)}
                  data-testid="nav-toggle"
                >
                  <div className="mx-auto w-[72px]">
                    <div className="group-open:hidden">
                      <Icon type={IconType.BURGER_ICON} className="mx-auto" />
                      <span>{z({ en: 'menu', cy: 'dewislen' })}</span>
                    </div>
                    <div className="hidden group-open:block">
                      <Icon type={IconType.BURGER_CLOSE} className="mx-auto" />
                      <span>{z({ en: 'close', cy: 'cau' })}</span>
                    </div>
                  </div>
                </summary>
                <Navigation
                  router={router}
                  isLoggedInPage={isLoggedInPage}
                  handleLogout={handleLogout}
                  showLanguageSwitchers={showLanguageSwitchers}
                />
              </details>
              <LogoutDialog
                isLogoutModalOpen={isLogoutModalOpen}
                setIsLogoutModalOpen={setIsLogoutModalOpen}
              />
            </div>
          </FocusTrap>
        </Container>
      </div>
    </header>
  );
};
