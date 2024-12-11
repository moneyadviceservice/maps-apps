import {
  Dispatch,
  KeyboardEvent,
  MouseEvent,
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

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { LanguageSwitcher } from '@maps-react/core/components/LanguageSwitcher';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Dialog } from '../../components/Dialog/Dialog';

type ChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

const isKeyboardEvent = (
  event: ChangeEvent,
): event is React.KeyboardEvent<HTMLElement> => {
  return 'key' in event;
};

const isMouseEvent = (
  event: ChangeEvent,
): event is React.MouseEvent<HTMLElement> => {
  return !('key' in event);
};

const isActionableEvent = (event: ChangeEvent) => {
  return (
    (isKeyboardEvent(event) &&
      ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
    isMouseEvent(event)
  );
};

type NavProps = {
  setIsLogoutModalOpen: Dispatch<SetStateAction<boolean>>;
  isLoggedInPage: boolean;
  router: NextRouter;
};

const Navigation = ({
  router,
  setIsLogoutModalOpen,
  isLoggedInPage,
}: NavProps) => {
  const { t, z, locale } = useTranslation();

  function handleLogout(event: ChangeEvent) {
    if (isActionableEvent(event)) {
      event.preventDefault();
      setIsLogoutModalOpen(true);
    }
  }

  const menu = [
    {
      title: t('site.header.links.exit'),
      href: `/${locale}/you-are-about-to-leave`,
      exit: true,
    },
  ];

  return (
    <nav className="absolute right-0 z-10 flex pt-4 text-gray-900 t-header-navigation w-80 md:w-96">
      <div className="w-full space-y-4 bg-white border">
        <ul className="divide-y">
          {menu.map(({ title, href, exit }) => {
            if (exit && !isLoggedInPage) {
              return;
            } else
              return (
                <li key={title} className="px-3 py-2">
                  <Link
                    href={href}
                    onClick={exit ? handleLogout : undefined}
                    onKeyDown={exit ? handleLogout : undefined}
                    data-testid={exit ? 'logout-link' : 'nav-link'}
                  >
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
              );
          })}
        </ul>
        <div className="px-3 pb-3 t-header-navigation-button">
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
      </div>
    </nav>
  );
};

type HeaderProps = {
  isLoggedInPage?: boolean;
  isLogoutModalOpen?: boolean;
  setIsLogoutModalOpen?: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({
  isLoggedInPage = true,
  isLogoutModalOpen = false,
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

  const handleModalClose = () => {
    setIsLogoutModalOpen(false);
  };

  const navigationRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  useOnClickOutside(navigationRef, () => setIsNavigationOpen(false));

  const skipToContentFocusStyles =
    'focus:not-sr-only focus:bg-yellow-200 focus:z-20 focus:border-b-4 focus:border-b-blue-800 focus:absolute focus:p-2 focus:rounded focus:top-4 focus:left-4';

  return (
    <header data-testid="header">
      <a className={twMerge('sr-only', skipToContentFocusStyles)} href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>
      {isNavigationOpen && !isLogoutModalOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25 t-menu-overlay" />
      )}
      <div className="relative z-10 flex items-center px-4 h-[96px] bg-blue-800 t-header print:hidden shadow-bottom-gray">
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
        <LanguageSwitcher className="md:hidden lg:block right-[90px]" />

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
                setIsLogoutModalOpen={setIsLogoutModalOpen}
                isLoggedInPage={isLoggedInPage}
              />
            </details>
            <Dialog
              accessibilityLabelClose={t('common.close')}
              accessibilityLabelReset={t('common.reset')}
              isOpen={isLogoutModalOpen}
              onCloseClick={() => handleModalClose()}
              testId="logout-dialog"
            >
              <>
                <H2 className="mb-6 text-4xl text-blue-800 md:text-5xl">
                  {t('site.logout.about-to-leave')}
                </H2>
                <Paragraph>{t('site.logout.we-will-redirect')}</Paragraph>
                <Paragraph>{t('site.logout.are-you-sure')}</Paragraph>
                <div className="my-10 md:flex">
                  <Link
                    asButtonVariant="primary"
                    className="block w-full mb-4 mr-4 text-center md:inline-flex md:text-left md:mb-0 md:w-auto"
                    href={`/${language}/you-have-exited-the-dashboard`}
                    data-testid="logout-yes"
                  >
                    {t('site.logout.yes-exit')}
                  </Link>
                  <Button
                    variant="secondary"
                    className="w-full md:w-auto"
                    onClick={() => handleModalClose()}
                    data-testid="logout-no"
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </>
            </Dialog>
          </div>
        </FocusTrap>
      </div>
    </header>
  );
};
