import NextLink from 'next/link';
import { Icon, IconType } from '@maps-digital/ui/components/Icon';
import { Link } from '@maps-digital/ui/components/Link';

const SearchForm = () => {
  return (
    <form
      className="t-header-search-form flex absolute px-4 pb-6 left-0 right-0 top-full bg-blue-800 shadow-bottom-gray"
      method="get"
      action={'/'}
    >
      <label className="sr-only" htmlFor="q">
        Search MoneyHelper
      </label>
      <input
        type="text"
        id="q"
        name="q"
        className="rounded-l p-2 w-full"
        required
        placeholder="How can we help you today?"
      />
      <button
        title="Search MoneyHelper"
        className="bg-pink-600 text-white rounded-r p-1"
      >
        <Icon type={IconType.SEARCH_ICON} />
      </button>
    </form>
  );
};

const Navigation = () => {
  const menu = [
    {
      title: 'Benefits',
      href: '/',
    },
    {
      title: 'Everyday money',
      href: '/',
    },
    {
      title: 'Family & care',
      href: '/',
    },
    {
      title: 'Homes',
      href: '/',
    },
    {
      title: 'Money troubles',
      href: '/',
    },
    {
      title: 'Pensions & retirement',
      href: '/',
    },
    {
      title: 'Savings',
      href: '/',
    },
    {
      title: 'Work',
      href: '/',
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
          <Link href="/" asButtonVariant="secondary">
            Cymraeg
          </Link>
        </div>
      </div>
    </nav>
  );
};

export const Header = () => {
  return (
    <header data-testid="header">
      <div className="t-header print:hidden relative flex items-center bg-blue-800 p-4 shadow-bottom-gray z-10">
        <details className="group relative" open={false}>
          <summary
            title="Open menu"
            className={`t-header-menu-open cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-sm`}
            data-testid="nav-toggle"
          >
            <div>
              <div className="group-open:hidden">
                <Icon type={IconType.BURGER_ICON} />
                <span>menu</span>
              </div>
              <div className="hidden group-open:block">
                <Icon type={IconType.BURGER_CLOSE} />
                <span>close</span>
              </div>
            </div>
          </summary>
          <Navigation />
        </details>

        <div className="t-header-logo mx-auto">
          <NextLink href="/" aria-label="Money helper">
            <>
              <span className="hidden md:inline">
                <Icon type={IconType.LOGO_ICON} />
              </span>
              <span className="md:hidden">
                <Icon type={IconType.LOGO_COMPACT_ICON} />
              </span>
            </>
          </NextLink>
        </div>
        <details className="group" open={false}>
          <summary
            title="Open search"
            className={`t-header-search-open cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-pink-600 text-white rounded p-1 flex`}
            data-testid="search-toggle"
          >
            <Icon type={IconType.SEARCH_ICON} className="group-open:hidden" />
            <Icon
              type={IconType.SEARCH_CLOSE_ICON}
              className="hidden group-open:block"
            />
          </summary>
          <SearchForm />
        </details>
      </div>
    </header>
  );
};
