import NextLink from 'next/link';
import { useRouter, NextRouter } from 'next/router';
import {
  MouseEvent,
  KeyboardEvent,
  useState,
  useRef,
  MutableRefObject,
  useEffect,
} from 'react';
import FocusTrap from 'focus-trap-react';
import {
  useLanguage,
  useTranslation,
  useOnClickOutside,
} from '@maps-digital/shared/hooks';
import { Icon, IconType } from '../../components/Icon';
import { Link } from '../../components/Link';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

const SearchForm = ({ language }: { language: string }) => {
  const { z } = useTranslation();
  return (
    <form
      className="t-header-search-form flex absolute px-4 pb-6 left-0 right-0 top-full bg-blue-800 shadow-bottom-gray"
      method="get"
      action={`https://www.moneyhelper.org.uk/${language}/search-results.html`}
    >
      <label className="sr-only" htmlFor="q">
        {z({
          en: 'Search MoneyHelper',
          cy: 'Chwilio HelpwrArian',
        })}
      </label>
      <input
        type="text"
        id="q"
        name="q"
        className="rounded-l p-2 w-full"
        required
        placeholder={z({
          en: 'How can we help you today?',
          cy: 'Sut allwn ni eich helpu chi heddiw?',
        })}
      />
      <button
        title={z({
          en: 'Search MoneyHelper',
          cy: 'Chwilio HelpwrArian',
        })}
        className="bg-pink-600 text-white rounded-r p-1"
      >
        <Icon type={IconType.SEARCH_ICON} />
      </button>
    </form>
  );
};

const Navigation = ({ router }: { router: NextRouter }) => {
  const { z } = useTranslation();

  const menu = [
    {
      title: z({ en: 'Benefits', cy: 'Budd-daliadau' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/benefits',
        cy: 'https://www.moneyhelper.org.uk/cy/benefits',
      }),
    },
    {
      title: z({ en: 'Everyday money', cy: 'Arian bob dydd' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/everyday-money',
        cy: 'https://www.moneyhelper.org.uk/cy/everyday-money',
      }),
    },
    {
      title: z({ en: 'Family & care', cy: 'Teulu a gofal' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/family-and-care',
        cy: 'https://www.moneyhelper.org.uk/cy/family-and-care',
      }),
    },
    {
      title: z({ en: 'Homes', cy: 'Cartrefi' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/homes',
        cy: 'https://www.moneyhelper.org.uk/cy/homes',
      }),
    },
    {
      title: z({ en: 'Money troubles', cy: 'Problemau ariannol' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/money-troubles',
        cy: 'https://www.moneyhelper.org.uk/cy/money-troubles',
      }),
    },
    {
      title: z({ en: 'Pensions & retirement', cy: 'Pensiynau ac ymddeoliad' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement',
        cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement',
      }),
    },
    {
      title: z({ en: 'Savings', cy: 'Cynilion' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/savings',
        cy: 'https://www.moneyhelper.org.uk/cy/savings',
      }),
    },
    {
      title: z({ en: 'Work', cy: 'Gwaith' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/work',
        cy: 'https://www.moneyhelper.org.uk/cy/work',
      }),
    },
  ];

  return (
    <nav className="t-header-navigation flex w-80 md:w-96 pt-4 text-gray-900 absolute z-10">
      <div className="border bg-white pb-3 space-y-4 w-full">
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
        <div className="t-header-navigation-button px-3">
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      setIsSearchOpen(false);
      setIsNavigationOpen(!isNavigationOpen);
    }
  }

  function handleSearch(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      setIsNavigationOpen(false);
      setIsSearchOpen(!isSearchOpen);
    }
  }

  const navigationRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  const searchRef = useRef() as MutableRefObject<HTMLDetailsElement>;
  useOnClickOutside(navigationRef, () => setIsNavigationOpen(false));
  useOnClickOutside(searchRef, () => setIsSearchOpen(false));

  return (
    <header data-testid="header">
      <a className="sr-only" href="#main">
        {z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' })}
      </a>
      {(isNavigationOpen || isSearchOpen) && (
        <div className="t-menu-overlay fixed bottom-0 left-0 right-0 top-0 bg-black opacity-25 z-10" />
      )}
      <div className="t-header print:hidden relative flex items-center bg-blue-800 p-4 shadow-bottom-gray z-10">
        <FocusTrap
          active={isNavigationOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <details
            className="group relative"
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
        <div className="t-header-logo mx-auto">
          <NextLink
            href="https://moneyhelper.org.uk/"
            aria-label={z({ en: 'Money helper', cy: 'Helpwr Arian' })}
          >
            <>
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
            </>
          </NextLink>
        </div>
        <LanguageSwitcher />
        <FocusTrap
          active={isSearchOpen}
          focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
        >
          <details className="group" open={isSearchOpen} ref={searchRef}>
            <summary
              title={z({ en: 'Open search', cy: 'Chwilio agored' })}
              className={`t-header-search-${
                isSearchOpen ? 'close' : 'open'
              } cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-pink-600 text-white rounded p-1 flex`}
              onClick={(e) => handleSearch(e)}
              onKeyDown={(e) => handleSearch(e)}
              data-testid="search-toggle"
            >
              <Icon type={IconType.SEARCH_ICON} className="group-open:hidden" />
              <Icon
                type={IconType.SEARCH_CLOSE_ICON}
                className="hidden group-open:block"
              />
            </summary>
            <SearchForm language={language} />
          </details>
        </FocusTrap>
      </div>
    </header>
  );
};
