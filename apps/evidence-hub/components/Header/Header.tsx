import { MutableRefObject, useRef, useState } from 'react';

import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';

import { SearchForm } from 'components/SearchForm';
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
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const activeLinkClasses =
  'after:contents-[""] after:absolute after:bottom-0 after:h-1 after:bg-green-300 after:w-full';

export const Header = ({
  assetPath,
  logoPath,
  mainNavigation,
}: {
  assetPath: string;
  logoPath: string;
  mainNavigation: LinkType[];
}) => {
  const router = useRouter();
  const { z } = useTranslation();
  const language = useLanguage();
  const activePath =
    router.asPath.replace(`/${language}/`, '').split('/')[0] || '';

  const skipMainFocusStyles =
    'focus:z-20 focus:not-sr-only focus:bg-yellow-400 focus:border-b-4 focus:border-b-blue-700 focus:absolute focus:p-2 focus:rounded focus:top-4 focus:left-4 focus:z-50';

  return (
    <header data-testid="header">
      <a className={twMerge('sr-only', skipMainFocusStyles)} href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>

      <MobileHeader
        language={language}
        assetPath={assetPath}
        logoPath={logoPath}
        activePath={activePath}
        mainNavigation={mainNavigation}
        router={router}
      />

      <DesktopHeader
        activePath={activePath}
        mainNav={mainNavigation}
        router={router}
        language={language}
        assetPath={assetPath}
        logoPath={logoPath}
      />
    </header>
  );
};

const MobileHeader = ({
  language,
  assetPath,
  logoPath,
  activePath,
  mainNavigation,
  router,
}: {
  language: string;
  assetPath: string;
  logoPath: string;
  activePath: string;
  mainNavigation: LinkType[];
  router: NextRouter;
}) => {
  const { z } = useTranslation();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  function handleToggleNav(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      setIsNavigationOpen(!isNavigationOpen);
    }
  }

  const navRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  useOnClickOutside(navRef, () => setIsNavigationOpen(false));

  return (
    <>
      {isNavigationOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25 t-menu-overlay" />
      )}
      <div className="relative z-20 flex items-center px-4 lg:hidden print:hidden">
        <a
          href={`/${language}`}
          aria-label={z({ en: 'Evidence Hub', cy: 'Evidence Hub' })}
          className="mx-auto min-w-[170px]"
        >
          {logoPath && (
            <Image
              src={`${assetPath}${logoPath}`}
              alt="Evidence Hub Logo"
              height={77.56}
              width={170}
            />
          )}
        </a>
        <FocusTrap
          active={isNavigationOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <Container className="h-[134px] p-0 m-0 flex justify-center">
            <details
              className="group w-[31px] ml-auto"
              open={isNavigationOpen}
              ref={navRef}
            >
              <summary
                className={`${
                  isNavigationOpen ? 'close' : 'open'
                } h-[134px] flex items-center justify-center cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-sm`}
                title={
                  isNavigationOpen
                    ? z({ en: 'Close menu', cy: 'Cau dewislen' })
                    : z({ en: 'Open menu', cy: 'Agor dewislen' })
                }
                onClick={(e) => handleToggleNav(e)}
                onKeyDown={(e) => handleToggleNav(e)}
                data-testid="toggle-nav"
              >
                <div className="group-open:hidden flex flex-col h-[38px] w-[38px] text-left absolute align-middle justify-center">
                  <Icon
                    type={IconType.BURGER_ICON_CURVED}
                    className="text-gray-800"
                  />
                </div>
                <div className="hidden text-center group-open:block">
                  <div className="flex flex-col">
                    <Icon type={IconType.BURGER_CLOSE} className="w-[30px]" />
                  </div>
                </div>
              </summary>
              <div className="bg-white absolute z-10 top-[134px] w-full left-0">
                <SearchForm language={language} />
                <div className="pb-10">
                  <nav className="mb-4">
                    <ul>
                      {mainNavigation?.map((i, index) => (
                        <li key={`mobile-nav-${i.linkTo}-${index}`}>
                          <Link
                            href={`/${language}${i.linkTo}`}
                            className={twMerge(
                              i.linkTo === `/${activePath}` ? [] : '',
                              'py-2 w-full relative px-4 no-underline text-lg font-bold text-magenta-500 visited:text-gray-600',
                            )}
                          >
                            {i.text}
                            <Icon
                              type={IconType.CHEVRON}
                              className="ml-auto text-magenta-500"
                            ></Icon>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="flex mx-4">
                    <LanguageLink
                      router={router}
                      classNames={[
                        'text-gray-600 visited:text-gray-600 p-0 underline text-sm ml-auto font-bold',
                      ]}
                    />
                  </div>
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
  assetPath,
  logoPath,
  activePath,
  mainNav,
  router,
}: {
  language: string;
  assetPath: string;
  logoPath: string;
  activePath: string;
  mainNav: LinkType[];
  router: NextRouter;
}) => {
  const { z } = useTranslation();
  return (
    <div className="hidden lg:block">
      <div className="relative print:hidden">
        <Container className="flex items-center justify-center lg:justify-normal max-w-[1272px]">
          <a
            href={`/${language}`}
            aria-label={z({ en: 'Evidence Hub', cy: 'Evidence Hub' })}
          >
            {logoPath && (
              <Image
                src={`${assetPath}${logoPath}`}
                alt=""
                height={73}
                width={160}
              />
            )}
          </a>
          <div className="items-center hidden ml-auto lg:flex py-7">
            <LanguageLink
              router={router}
              classNames={[
                'text-gray-600 visited:text-gray-600 mr-6 p-0 underline text-sm ml-6',
              ]}
            />
            <SearchForm language={language} />
          </div>
        </Container>
      </div>
      <div className="hidden lg:block">
        <Container className="max-w-[1272px] mt-5 mb-2">
          <nav>
            <ul className="flex h-[40px] items-center">
              {mainNav?.map((i, index) => (
                <li key={`desktop-nav-${i.linkTo}-${index}`}>
                  <Link
                    href={`/${language}${i.linkTo}`}
                    className={twMerge(
                      i.linkTo === `/${activePath}` ? activeLinkClasses : '',
                      whiteLinkClasses,
                      'text-pink-700 font-bold relative mr-8 h-[40px] text-sm hover:text-green-300 hover:no-underline',
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
