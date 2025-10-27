import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

export const SearchForm = ({
  language,
  classNames,
}: {
  language: string;
  classNames?: string[];
}) => {
  const { z } = useTranslation();
  return (
    <form
      className={twMerge([
        'flex lg:w-[266px] w-full h-9 border-gray-600 relative z-1 border-1 rounded pr-8',
        classNames,
      ])}
      data-testid="form-search"
      action={`https://maps.org.uk/${language}/search-results.html`}
      role="search"
    >
      <input
        type="text"
        id="q"
        name="q"
        className="w-full p-2 rounded-l"
        aria-label={z({
          en: 'Search',
          cy: 'Chwilio',
        })}
        required
      />
      <button
        type="submit"
        className="p-1 bg-magenta-500 text-white rounded-r absolute right-[-1px] top-[-1px] shadow-bottom-gray max-h-9 max-w-9"
        aria-label={z({
          en: 'Search',
          cy: 'Chwilio',
        })}
      >
        <Icon type={IconType.SEARCH_ICON} aria-hidden="true" />
      </button>
    </form>
  );
};
