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
        'flex lg:my-4 lg:w-[266px] w-full h-9 border-gray-600 relative z-1 border-1 rounded pr-8',
        classNames,
      ])}
      data-testid="search-form"
      action={`/${language}/search`}
    >
      <label className="sr-only" htmlFor="q">
        {z({
          en: 'Search',
          cy: 'Chwilio',
        })}
      </label>
      <input
        type="text"
        id="q"
        name="q"
        className="w-full p-2 rounded-l"
        required
      />
      <button
        title={z({
          en: 'Search',
          cy: 'Chwilio',
        })}
        className="p-1 bg-green-300 rounded-r absolute right-[-1px] top-[-1px] shadow-bottom-gray max-h-9 max-w-9"
      >
        <Icon type={IconType.SEARCH_ICON} />
      </button>
    </form>
  );
};
