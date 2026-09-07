import React from 'react';

import { useIsLg } from 'hooks';
import { twMerge } from 'tailwind-merge';
import { generateQueryKey, type QueryParams } from 'utils/query/queryHelpers';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FilterContent } from '../FilterContent';

export interface FilterOptionsProps {
  className?: string;
  lang: string;
  query?: QueryParams;
}

export const FilterOptions: React.FC<FilterOptionsProps> = ({
  className,
  lang,
  query = {},
}) => {
  const { z } = useTranslation();
  const isLg = useIsLg();

  return (
    <div
      className={twMerge(
        className,
        'w-full lg:w-[300px] lg:min-w-[300px] lg:max-w-[300px] mb-8 lg:mb-12',
      )}
    >
      <details
        open={isLg}
        className="w-full rounded-[4px] border border-gray-300 lg:border-[3px] lg:border-gray-200 group"
      >
        {/* Mobile only: collapsible "+ Filters" / "- Filters" */}
        <summary className="lg:hidden list-none cursor-pointer rounded-[4px] border-b-0 bg-slate-200 p-2 group-open:border-b border-gray-300">
          <span className="flex items-center justify-center gap-2">
            <Icon
              type={IconType.PLUS}
              className="w-4 h-4 text-gray-600 group-open:hidden shrink-0"
            />
            <Icon
              type={IconType.MINUS}
              className="w-4 h-4 text-gray-600 hidden group-open:block fill-gray-600 shrink-0"
            />
            <Heading level="h5" className="font-bold text-gray-900">
              {z({ en: 'Filters', cy: 'Hidlwyr' })}
            </Heading>
          </span>
        </summary>
        {/* Desktop only: static "Filters" + "Clear all" header */}
        <div className="hidden lg:flex items-center justify-between p-6 bg-gray-95 border-b border-gray-200">
          <Heading level="h5" component="h2">
            {z({ en: 'Filters', cy: 'Hidlwyr' })}
          </Heading>
          <Link
            href={`/${lang}/listings`}
            className="text-magenta-700 visited:text-magenta-700 text-sm hover:underline"
            asInlineText
          >
            {z({ en: 'Clear all', cy: 'Clirio popeth' })}
          </Link>
        </div>
        <FilterContent
          key={generateQueryKey(query)}
          query={query}
          idPrefix="filters"
        />
      </details>
    </div>
  );
};
