import { NextRouter, useRouter } from 'next/router';
import {
  MouseEvent,
  KeyboardEvent,
  useState,
  useRef,
  MutableRefObject,
  useEffect,
} from 'react';
import FocusTrap from 'focus-trap-react';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { LanguageSwitcher } from '@maps-react/core/components/LanguageSwitcher';
import { twMerge } from 'tailwind-merge';

const Navigation = ({ router }: { router: NextRouter }) => {
  const { t, z, locale } = useTranslation();

  const menu = [
    {
      title: t('site.header.links.exit'),
      href: `/${locale}`,
    },
  ];

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
        <div className="px-3 t-header-navigation-button">
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

type ChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export const Header = () => {
  const router = useRouter();
  const { z } = useTranslation();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const language = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  });

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

  function handleNavigation(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      setIsNavigationOpen(!isNavigationOpen);
    }
  }

  const navigationRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  useOnClickOutside(navigationRef, () => setIsNavigationOpen(false));

  const skipToContentFocusStyles =
    'focus:not-sr-only focus:bg-yellow-200 focus:z-20 focus:border-b-4 focus:border-b-blue-800 focus:absolute focus:p-2 focus:rounded focus:top-4 focus:left-4';

  return (
    <header data-testid="header">
      <a className={twMerge('sr-only', skipToContentFocusStyles)} href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>
      {isNavigationOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25 t-menu-overlay" />
      )}
      <div className="relative z-10 flex items-center p-4 bg-blue-800 t-header print:hidden shadow-bottom-gray">
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
              } cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-sm`}
              onClick={(e) => handleNavigation(e)}
              onKeyDown={(e) => handleNavigation(e)}
              data-testid="nav-toggle"
            >
              <div>
                <div className="group-open:hidden">
                  <Icon type={IconType.BURGER_ICON} />
                  <span>{z({ en: 'menu', cy: 'dewislen' })}</span>
                </div>
                <div className="hidden group-open:block">
                  <Icon type={IconType.BURGER_CLOSE} />
                  <span>{z({ en: 'close', cy: 'cau' })}</span>
                </div>
              </div>
            </summary>
            <Navigation router={router} />
          </details>
        </FocusTrap>
        <div className="mx-auto t-header-logo">
          <span className="hidden md:inline">
            {z({
              en: <Icon type={IconType.LOGO_ICON} />,
              cy: <Icon type={IconType.LOGO_CY_ICON} />,
            })}
          </span>
          <span className="md:hidden">
            {z({
              en: <Icon type={IconType.LOGO_COMPACT_ICON} />,
              cy: <Icon type={IconType.LOGO_COMPACT_CY} />,
            })}
          </span>
        </div>
        <LanguageSwitcher className="right-4" />
      </div>
    </header>
  );
};
