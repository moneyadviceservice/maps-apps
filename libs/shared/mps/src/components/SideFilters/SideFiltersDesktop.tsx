import { twMerge } from 'tailwind-merge';
import { Heading, Link } from '@maps-digital/shared/ui';

import { SideFiltersType } from '.';
import { FilterContent } from './FilterContent';

export const SideFiltersDesktop = ({
  tags,
  searchKeyword,
  title,
  clearAllTitle,
  clearAllLink,
  searchTitle,
  applyFiltersLabel,
  lang,
  className,
  keyProp,
}: SideFiltersType) => (
  <div className={twMerge(className, 'rounded-[4px] max-w-[300px] mb-12')}>
    <div className="border-[3px] border-gray-200">
      <div className="flex items-center p-2 lg:p-6 bg-gray-95 justify-between">
        <Heading level="h5" component={'h2'}>
          {title}
        </Heading>
        <Link
          href={clearAllLink}
          className="text-magenta-700 visited:text-magenta-700 text-sm hover:underline hidden lg:block"
        >
          {clearAllTitle}
        </Link>
      </div>
      <FilterContent
        key={keyProp}
        keyword={searchKeyword}
        lang={lang}
        tags={tags}
        searchLabel={searchTitle}
        submitLabel={applyFiltersLabel}
        formType={'desktop'}
      />
    </div>
  </div>
);
