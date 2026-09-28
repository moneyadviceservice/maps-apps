import { KeyboardEvent, MouseEvent, useRef } from 'react';

import FocusTrap from 'focus-trap-react';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { useOnClickOutside } from '@maps-react/hooks/useOnClickOutside';
import { useTranslation } from '@maps-react/hooks/useTranslation';

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

const SearchForm = ({ language }: { language: string }) => {
  const { z } = useTranslation();
  // Handle form submission to redirect to search results page
  // This is needed to work around Google Analytics tracking query params
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const query = new FormData(form).get('q');
    if (query) {
      globalThis.location.href = `${form.action}?q=${encodeURIComponent(
        String(query),
      )}`;
    }
  };

  return (
    <form
      className="absolute left-0 right-0 flex px-4 pb-6 bg-blue-700 t-header-search-form top-full shadow-bottom-gray"
      method="get"
      action={`https://www.moneyhelper.org.uk/${language}/search-results.html`}
      onSubmit={handleSubmit}
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
        className="w-full rounded focus:outline-none focus:shadow-focus-outline tool-field focus:border-blue-700 border-gray-400 p-2 rounded-l border-0 focus:border-0 h-auto m-0 relative focus:z-10"
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
        className="p-1 text-white rounded-r bg-magenta-500"
      >
        <Icon type={IconType.SEARCH_ICON} />
      </button>
    </form>
  );
};

export type HeaderSearchProps = {
  language: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeNavigation: () => void;
};

export const HeaderSearch = ({
  language,
  isOpen,
  setIsOpen,
  closeNavigation,
}: HeaderSearchProps) => {
  const { z } = useTranslation();
  const searchRef = useRef<HTMLDetailsElement>(null);
  useOnClickOutside(searchRef, () => setIsOpen(false));

  function handleSearch(event: ChangeEvent) {
    if (
      (isKeyboardEvent(event) &&
        ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
      isMouseEvent(event)
    ) {
      event.preventDefault();
      if (!isOpen) {
        closeNavigation();
      }
      setIsOpen(!isOpen);
    }
  }

  return (
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}
    >
      <details className="group" open={isOpen} ref={searchRef}>
        <summary
          title={z({ en: 'Open search', cy: 'Chwilio agored' })}
          className={`t-header-search-${
            isOpen ? 'close' : 'open'
          } cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-magenta-500 text-white rounded p-1 flex focus:bg-yellow-400 focus:text-gray-800 focus:outline-none focus:shadow-darkbg-link-focus`}
          onClick={handleSearch}
          onKeyDown={handleSearch}
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
  );
};
