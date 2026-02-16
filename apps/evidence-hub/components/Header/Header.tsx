import { MutableRefObject, useRef, useState } from 'react';

import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';

import { Navigation } from 'components/Navigation';
import { SearchForm } from 'components/SearchForm';
import FocusTrap from 'focus-trap-react';
import { twMerge } from 'tailwind-merge';
import { Logo, NavigationItem } from 'types/@adobe/components';

import {
  ExpandableSection,
  Icon,
  IconType,
  Link,
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

export const Header = ({
  assetPath,
  logo,
  navigation,
}: {
  assetPath: string;
  logo: Logo;
  navigation: NavigationItem[];
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
        logo={logo}
        activePath={activePath}
        navigationItems={navigation}
        router={router}
      />

      <DesktopHeader
        navigationItems={navigation}
        router={router}
        language={language}
        assetPath={assetPath}
        logo={logo}
      />
    </header>
  );
};

const MobileNavItem = ({
  item,
  language,
  activePath,
  level = 0,
  index,
}: {
  item: NavigationItem;
  language: string;
  activePath: string;
  level?: number;
  index: number;
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isNested = level > 0;
  const isGrandchild = level === 1;

  // Base text styles
  const textSizeClass = level === 0 ? 'text-lg' : 'text-base';
  const fontWeightClass = level === 0 ? 'font-bold' : 'font-semibold';
  const paddingClass = isGrandchild ? 'pl-8' : level === 0 ? 'px-0' : 'pl-4';

  if (hasChildren) {
    // Item with children - render as expandable details/summary
    return (
      <li key={`mobile-nav-${item.text}-${index}-${level}`} className="block">
        <ExpandableSection
          variant="main"
          type={isNested ? 'nested' : undefined}
          className={twMerge('border-0', paddingClass)}
          title={item.text}
          contentTestClassName="mb-0 pt-0"
        >
          <ul className={twMerge('mb-4 pt-2', isGrandchild ? 'pl-4' : '')}>
            {item.children?.map((child, childIndex) => (
              <MobileNavItem
                key={`mobile-nav-child-${child.text}-${childIndex}`}
                item={child}
                language={language}
                activePath={activePath}
                level={level + 1}
                index={childIndex}
              />
            ))}
          </ul>
        </ExpandableSection>
      </li>
    );
  }

  return (
    <li key={`mobile-nav-link-${item.text}-${index}-${level}`}>
      <Link
        href={item.linkTo ?? '#'}
        className={twMerge(
          'py-2 w-full relative flex items-center no-underline visited:text-magenta-500',
          textSizeClass,
          fontWeightClass,
          paddingClass,
        )}
      >
        {item.text}
      </Link>
    </li>
  );
};

const MobileHeader = ({
  language,
  assetPath,
  logo,
  activePath,
  navigationItems,
  router,
}: {
  language: string;
  assetPath: string;
  logo: Logo;
  activePath: string;
  navigationItems: NavigationItem[];
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
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 t-menu-overlay" />
      )}
      <div className="relative z-20 flex items-center px-4 lg:hidden print:hidden">
        <a
          href={`https://maps.org.uk/${language}`}
          aria-label={z({
            en: 'Money and Pensions Service Website',
            cy: 'Gwefan y Gwasanaeth Arian a Phensiynau',
          })}
          className="min-w-[149px] absolute top-4 left-4"
        >
          {logo?.image?._path && (
            <Image
              src={`${assetPath}${logo.image._path}`}
              alt="Evidence Hub Logo"
              height={74}
              width={149}
              className="h-[74px] w-auto"
            />
          )}
        </a>
        <FocusTrap
          active={isNavigationOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <Container className="m-0 flex p-0 max-w-[1200px]">
            <details
              className="group/mobile-menu w-full min-h-[115px]"
              open={isNavigationOpen}
              ref={navRef}
            >
              <summary
                className={`${
                  isNavigationOpen ? 'close' : 'open'
                } h-[40px] w-[40px] ml-auto list-none [&::-webkit-details-marker]:hidden text-center text-sm relative top-[40px] cursor-pointer`}
                title={
                  isNavigationOpen
                    ? z({ en: 'Close menu', cy: 'Cau dewislen' })
                    : z({ en: 'Open menu', cy: 'Agor dewislen' })
                }
                onClick={(e) => handleToggleNav(e)}
                onKeyDown={(e) => handleToggleNav(e)}
                data-testid="toggle-nav"
              >
                <div className="group-open/mobile-menu:hidden flex flex-col h-[40px] w-[40px] text-left absolute align-middle justify-center items-center flex">
                  <Icon
                    type={IconType.BURGER_ICON_CURVED}
                    className="text-gray-800"
                  />
                </div>
                <div className="hidden text-center group-open/mobile-menu:block rounded-[6px] bg-magenta-500 text-white">
                  <div className="flex h-[40px] w-[40px] justify-center items-center flex">
                    <Icon type={IconType.BURGER_CLOSE} className="w-[30px]" />
                  </div>
                </div>
              </summary>
              <div className="bg-white pt-[70px] w-full left-0">
                <div className="pb-10 mt-4">
                  <div className="mb-2">
                    <SearchForm language={language} />
                  </div>
                  <nav className="mb-4 mt-4">
                    <ul>
                      {navigationItems?.map((item, index) => (
                        <MobileNavItem
                          key={`mobile-nav-top-${item.text}-${index}`}
                          item={item}
                          language={language}
                          activePath={activePath}
                          level={0}
                          index={index}
                        />
                      ))}
                    </ul>
                  </nav>
                  <div className="flex">
                    <LanguageLink
                      router={router}
                      classNames={[
                        'text-gray-600 visited:text-gray-600 p-0 underline text-sm font-bold',
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
  logo,
  navigationItems,
  router,
}: {
  language: string;
  assetPath: string;
  logo: Logo;
  navigationItems: NavigationItem[];
  router: NextRouter;
}) => {
  const { z } = useTranslation();

  return (
    <div className="hidden lg:block">
      <div className="relative print:hidden">
        <Container className="flex items-center justify-center lg:justify-normal max-w-[1200px] pt-5 pb-4">
          <a
            href={`https://maps.org.uk/${language}`}
            aria-label={z({
              en: 'Money and Pensions Service Website',
              cy: 'Gwefan y Gwasanaeth Arian a Phensiynau',
            })}
            className="h-[94px]"
          >
            {logo?.image?._path && (
              <Image
                src={`${assetPath}${logo.image._path}`}
                alt=""
                height={94}
                width={149}
                className="h-[94px] w-auto"
              />
            )}
          </a>
          <div className="items-center hidden ml-auto lg:flex">
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
        <Container className="max-w-[1200px]">
          <Navigation items={navigationItems} />
        </Container>
      </div>
    </div>
  );
};
