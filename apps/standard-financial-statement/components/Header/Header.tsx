import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Image, { StaticImageData } from 'next/image';
import { NextRouter, useRouter } from 'next/router';

import FocusTrap from 'focus-trap-react';
import { twMerge } from 'tailwind-merge';
import { LinkType } from 'types/@adobe/components';

import {
  Icon,
  IconType,
  Link,
  whiteLinkClasses,
} from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import {
  ChangeEvent,
  isKeyboardEvent,
  isMouseEvent,
} from '@maps-react/core/components/Header';
import { LanguageLink } from '@maps-react/core/components/LanguageSwitcher';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SearchForm } from '../../components/SearchForm';

const activeLinkClasses =
  'after:contents-[""] after:absolute after:bottom-0 after:h-1 after:bg-green-300 after:w-full';

export const Header = ({
  headerLogo,
  headerLogoMobile,
  accountLinks,
  headerLinks,
  mainNavigation,
  isAuthenticated,
}: {
  headerLogo: StaticImageData;
  headerLogoMobile: StaticImageData;
  headerLinks: LinkType[];
  accountLinks: LinkType[];
  mainNavigation: LinkType[];
  isAuthenticated?: boolean;
}) => {
  const router = useRouter();
  const { z } = useTranslation();
  const language = useLanguage();
  const activePath =
    router.asPath.replace(`/${language}/`, '').split('/')[0] || '';
  const [jsEnabled, setJsEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
    setJsEnabled(true);
  }, [setJsEnabled, language]);

  const skipToContentFocusStyles =
    'focus:not-sr-only focus:bg-yellow-400 focus:z-20 focus:border-b-4 focus:border-b-blue-700 focus:absolute focus:p-2 focus:rounded focus:top-4 focus:left-4 focus:z-50';

  return (
    <header data-testid="header">
      <a className={twMerge('sr-only', skipToContentFocusStyles)} href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>
      <DesktopHeader
        accountLinks={accountLinks}
        headerLinks={headerLinks}
        activePath={activePath}
        mainNav={mainNavigation}
        router={router}
        language={language}
        headerLogo={headerLogo}
        isAuthenticated={isAuthenticated}
        jsEnabled={jsEnabled}
      />

      <MobileHeader
        language={language}
        headerLogoMobile={headerLogoMobile}
        accountLinks={accountLinks}
        headerLinks={headerLinks}
        activePath={activePath}
        mainNavigation={mainNavigation}
        router={router}
        isAuthenticated={isAuthenticated}
        jsEnabled={jsEnabled}
      />
    </header>
  );
};

const MobileHeader = ({
  language,
  headerLogoMobile,
  accountLinks,
  headerLinks,
  activePath,
  mainNavigation,
  router,
  isAuthenticated,
  jsEnabled,
}: {
  language: string;
  headerLogoMobile: StaticImageData;
  accountLinks: LinkType[];
  headerLinks: LinkType[];
  activePath: string;
  mainNavigation: LinkType[];
  router: NextRouter;
  isAuthenticated?: boolean;
  jsEnabled: boolean;
}) => {
  const { z } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function handleSearch(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      setIsNavOpen(false);
      setIsSearchOpen(!isSearchOpen);
    }
  }

  function handleNav(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      setIsSearchOpen(false);
      setIsNavOpen(!isNavOpen);
    }
  }

  const navigationRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  const searchRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  useOnClickOutside(navigationRef, () => setIsNavOpen(false));
  useOnClickOutside(searchRef, () => setIsSearchOpen(false));

  return (
    <>
      {(isNavOpen || isSearchOpen) && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25 t-menu-overlay" />
      )}
      <div className="relative z-20 flex items-center px-4 bg-blue-600 lg:hidden print:hidden">
        <FocusTrap
          active={isNavOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <Container className="w-auto p-0 m-0">
            <details
              className="relative group w-[31px]"
              open={isNavOpen}
              ref={navigationRef}
            >
              <summary
                title={
                  isNavOpen
                    ? z({ en: 'Close menu', cy: 'Cau dewislen' })
                    : z({ en: 'Open menu', cy: 'Agor dewislen' })
                }
                className={`${
                  isNavOpen ? 'close' : 'open'
                } cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-sm`}
                onClick={(e) => handleNav(e)}
                onKeyDown={(e) => handleNav(e)}
                data-testid="nav-toggle"
              >
                <div className="group-open:hidden flex flex-col h-[38px] w-[38px] text-left">
                  <Icon type={IconType.BURGER_ICON_CURVED} />
                  <span className="relative text-xs font-bold top-1">
                    {z({ en: 'menu', cy: 'dewislen' })}
                  </span>
                </div>
                <div className="hidden text-center group-open:block">
                  <div className="flex flex-col">
                    <Icon type={IconType.BURGER_CLOSE} className="w-[30px]" />
                    <span className="relative text-xs -top-1">
                      {z({ en: 'close', cy: 'cau' })}
                    </span>
                  </div>
                </div>
              </summary>
              <div className="bg-white absolute z-10 w-[320px] -left-4 top-[60px] h-screen">
                <div className="pb-8 bg-white">
                  <nav className="mb-6">
                    <ul>
                      {mainNavigation?.map((i) => (
                        <li
                          key={i.linkTo}
                          className="border-b border-slate-400"
                        >
                          <Link
                            href={`/${language}${i.linkTo}`}
                            className={twMerge(
                              i.linkTo === `/${activePath}` ? [] : '',
                              'relative px-4 py-2 w-full hover:text-green-300 hover:no-underline no-underline text-lg font-bold text-blue-600 visited:text-blue-600',
                            )}
                          >
                            {i.text}
                            <Icon
                              className="ml-auto text-blue-600"
                              type={IconType.CHEVRON}
                            ></Icon>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="flex mx-4">
                    {jsEnabled && (
                      <div className="flex items-center">
                        <AccountLinks
                          accountLinks={accountLinks}
                          language={language}
                          classNames={['font-bold']}
                          isAuthenticated={isAuthenticated}
                        />
                      </div>
                    )}
                    <nav aria-label="Language switcher">
                      <ul>
                        <li>
                          <LanguageLink
                            router={router}
                            classNames={[
                              'text-gray-600 visited:text-gray-600 mr-6 p-0 underline text-sm ml-6',
                            ]}
                          />
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <nav className="mx-4 mt-4 mb-6">
                    <HeaderLinks
                      headerLinks={headerLinks}
                      language={language}
                      className="font-bold"
                    />
                  </nav>
                </div>
              </div>
            </details>
          </Container>
        </FocusTrap>
        <a
          href={`/${language}`}
          aria-label={z({ en: 'SFS', cy: 'SFS' })}
          className="mx-auto h-[64px]"
        >
          {headerLogoMobile && (
            <Image src={headerLogoMobile} alt="SFS" priority={true} />
          )}
        </a>
        <FocusTrap
          active={isSearchOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <Container className="w-auto p-0 m-0">
            <details className="group" open={isSearchOpen} ref={searchRef}>
              <summary
                title={z({ en: 'Open search', cy: 'Chwilio agored' })}
                className={`${
                  isSearchOpen ? 'close' : 'open'
                } cursor-pointer list-none [&::-webkit-details-marker]:hidden  text-white rounded flex`}
                onClick={(e) => handleSearch(e)}
                onKeyDown={(e) => handleSearch(e)}
                data-testid="search-toggle"
              >
                <span
                  className={twMerge(
                    'h-9 w-9 border-1 border-gray-300 flex items-center justify-center rounded-[4px]',
                    !isSearchOpen ? 'hidden' : '',
                  )}
                >
                  <Icon
                    type={IconType.CHEVRON_DOWN}
                    className={twMerge('h-6 w-6 rotate-180')}
                    fill="#ffffff"
                  />
                </span>
                <span
                  className={twMerge(
                    'h-9 w-9 border-1 border-green-300 bg-green-300 flex items-center justify-center rounded-[4px]',
                    isSearchOpen ? 'hidden' : '',
                  )}
                >
                  <Icon type={IconType.SEARCH_ICON} className="text-blue-600" />
                </span>
              </summary>
              <div className="absolute bottom-0 left-0 right-0 bg-blue-600 top-full">
                <div className="p-4 pt-2 bg-blue-600">
                  <SearchForm language={language} />
                </div>
              </div>
            </details>
          </Container>
        </FocusTrap>
      </div>
    </>
  );
};

const DesktopHeader = ({
  language,
  headerLogo,
  accountLinks,
  headerLinks,
  activePath,
  mainNav,
  router,
  isAuthenticated,
  jsEnabled,
}: {
  language: string;
  headerLogo: StaticImageData;
  accountLinks: LinkType[];
  headerLinks: LinkType[];
  activePath: string;
  mainNav: LinkType[];
  router: NextRouter;
  isAuthenticated?: boolean;
  jsEnabled: boolean;
}) => {
  const { z } = useTranslation();

  return (
    <div className="hidden lg:block">
      <div className="relative bg-blue-600 print:hidden lg:bg-gray-150 lg:h-[101px]">
        <Container className="flex items-center justify-center lg:justify-normal max-w-[1272px]">
          <a
            href={`/${language}`}
            aria-label={z({ en: 'SFS', cy: 'SFS' })}
            className="max-h-[64px] max-w-[116px] lg:max-w-[186px] lg:max-h-[102px]"
          >
            {headerLogo && <Image src={headerLogo} alt="SFS" priority={true} />}
          </a>
          <div className="items-center hidden ml-auto lg:flex">
            {jsEnabled && (
              <AccountLinks
                accountLinks={accountLinks}
                language={language}
                isAuthenticated={isAuthenticated}
              />
            )}
            <nav aria-label="Language switcher">
              <ul>
                <li>
                  <LanguageLink
                    router={router}
                    classNames={[
                      'text-gray-600 visited:text-gray-600 mr-6 p-0 underline text-sm ml-6',
                    ]}
                  />
                </li>
              </ul>
            </nav>
            <nav>
              <HeaderLinks headerLinks={headerLinks} language={language} />
            </nav>
            <SearchForm language={language} />
          </div>
        </Container>
      </div>
      <div className="hidden text-white bg-blue-600 lg:block shadow-bottom-gray">
        <Container className="max-w-[1272px]">
          <nav>
            <ul className="flex h-[40px] items-center">
              {mainNav?.map((i) => (
                <li key={i.linkTo}>
                  <Link
                    href={`/${language}${i.linkTo}`}
                    className={twMerge(
                      i.linkTo === `/${activePath}` ? activeLinkClasses : '',
                      whiteLinkClasses,
                      'relative mr-8 h-[40px] text-sm hover:text-green-300 hover:no-underline',
                    )}
                  >
                    {i.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </div>
  );
};

const AccountLinks = ({
  accountLinks,
  language,
  classNames,
  isAuthenticated,
}: {
  accountLinks: LinkType[];
  language: string;
  classNames?: string[];
  isAuthenticated?: boolean;
}) => {
  const { addEvent } = useAnalytics();

  const trackSignIn = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = event.currentTarget;
      if (target.href.includes('/api/auth/signin')) {
        event.preventDefault();

        addEvent({
          event: 'login',
          eventInfo: {
            linkText: 'Header Login',
            destinationURL: 'Entra Login',
          },
        });

        window.location.href = target.href;
      }
    },
    [addEvent],
  );
  return (
    <>
      <Icon type={IconType.PROFILE} className="h-[18px] w-[18px] mr-2" />
      <nav>
        <ul className="flex">
          {isAuthenticated ? (
            <Link
              href="/api/auth/signout"
              className={twMerge([
                'text-sm text-gray-500 visited:text-gray-500',
                classNames,
              ])}
            >
              Logout
            </Link>
          ) : (
            accountLinks?.map((i, index) => {
              const space =
                index === 0 ? <span className="px-1">/</span> : <></>;
              return (
                <li key={i.linkTo} className="">
                  <Link
                    className={twMerge([
                      'text-sm text-gray-500 visited:text-gray-500',
                      classNames,
                    ])}
                    onClick={trackSignIn}
                    aria-label={i.description ?? undefined}
                    href={
                      i.linkTo === '/login'
                        ? '/api/auth/signin'
                        : `/${language}${i.linkTo}`
                    }
                  >
                    {i.text}
                  </Link>
                  {space}
                </li>
              );
            })
          )}
        </ul>
      </nav>
    </>
  );
};

const HeaderLinks = ({
  headerLinks,
  language,
  className,
}: {
  headerLinks: LinkType[];
  language: string;
  className?: string;
}) => {
  return (
    <ul className="flex mr-6">
      {headerLinks?.map((i) => {
        return (
          <li key={i.linkTo}>
            <Link
              className={twMerge(
                'text-gray-500 visited:text-gray-500 text-sm',
                className,
              )}
              href={`/${language}${i.linkTo}`}
            >
              {i.text}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
