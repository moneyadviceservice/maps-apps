import { twMerge } from 'tailwind-merge';
import { Heading, Icon, IconType } from '@maps-digital/shared/ui';

import { SideFiltersType } from '.';
import { FilterContent } from './FilterContent';

export const SideFiltersMobile = ({
  tags,
  searchKeyword,
  title,
  clearAllTitle,
  clearAllLink,
  searchTitle,
  applyFiltersLabel,
  lang,
  className,
  isOpen,
  keyProp,
}: SideFiltersType) => (
  <div className={twMerge('lg:hidden mb-8', className)}>
    <details
      className="group border-1 border-gray-300 rounded-[4px]"
      open={isOpen}
    >
      <summary className="p-0.5 lg:p-6 bg-slate-200 cursor-pointer group-open:border-b-1 border-gray-300 list-none rounded-[4px]">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <Icon
              type={IconType.PLUS}
              className="w-4 h-4 text-gray-600 group-open:hidden"
            />
            <Icon
              type={IconType.MINUS}
              className="w-4 h-4 text-gray-600 hidden group-open:block fill-gray-600"
            />
          </div>
          <Heading level="h5" className="font-bold text-gray-900">
            {title}
          </Heading>
        </div>
      </summary>
      <FilterContent
        key={keyProp}
        keyword={searchKeyword}
        lang={lang}
        tags={tags}
        searchLabel={searchTitle}
        submitLabel={applyFiltersLabel}
        clearAllLabel={clearAllTitle}
        clearAllLink={clearAllLink}
        formType={'mobile'}
      />
    </details>
  </div>
);
