import React from 'react';

import { twMerge } from 'tailwind-merge';
import { TagGroup } from 'types/@adobe/page';
import { YEAR_OPTIONS } from 'utils/filter/filterConstants';
import { getQueryValue, QueryParams } from 'utils/query/queryHelpers';

import {
  Button,
  ExpandableSection,
  Heading,
  Icon,
  IconType,
  Link,
} from '@maps-react/common/index';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { TextInput } from '@maps-react/form/components/TextInput';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  children?: FilterOption[];
}

export interface SideNavigationProps {
  className?: string;
  lang: string;
  tags?: TagGroup[];
  query?: QueryParams;
}

/**
 * Generate a stable key from query params for React component remounting
 * Sorts keys to ensure consistent key generation for the same query
 */
function generateQueryKey(query: QueryParams): string {
  const sortedKeys = Object.keys(query).sort((a, b) => a.localeCompare(b));
  const sortedQuery = sortedKeys.reduce((acc, key) => {
    acc[key] = query[key];
    return acc;
  }, {} as QueryParams);
  return JSON.stringify(sortedQuery);
}

// Filter content component
interface FilterContentProps {
  query: QueryParams;
  lang: string;
  tags: TagGroup[];
}

const FilterContent: React.FC<FilterContentProps> = ({
  query,
  lang,
  tags = [],
}) => {
  return (
    <div data-testid={'testId'}>
      <div className="px-6">
        <div className="py-8">
          <label
            className="block pb-2 font-bold text-[18px]"
            htmlFor={`keyword`}
          >
            Keyword search
          </label>
          <TextInput
            id={`keyword`}
            name={`keyword`}
            defaultValue={(query.keyword as string) || ''}
            className="w-full text-sm mb-4"
          />
          <input
            type="hidden"
            name="keyword-current"
            value={(query.keyword as string) || ''}
          />
          <Button
            type="submit"
            variant="primary"
            name="search"
            value="true"
            className="text-[16px] p-2 w-full lg:w-auto"
          >
            Search
          </Button>
        </div>

        {tags?.map((tagGroup, index) => {
          // Get selected tags for this group using the helper function
          const selectedTagsForGroup = getQueryValue(
            query,
            tagGroup?.key || '',
          );

          const isChecked = (tagKey: string) => {
            if (!selectedTagsForGroup) return false;

            if (Array.isArray(selectedTagsForGroup)) {
              return selectedTagsForGroup.some(
                (value) => String(value).trim() === tagKey,
              );
            }

            // Handle comma-separated string values
            return String(selectedTagsForGroup)
              .split(',')
              .some((value) => value.trim() === tagKey);
          };

          const hasSelectedItem =
            tagGroup.tags.some(({ key }) => isChecked(key)) || index === 0;

          const currentYear = getQueryValue(query, 'year');
          const hasYearSelected = Boolean(currentYear);

          return (
            <React.Fragment key={tagGroup.key || `tag-group-${index}`}>
              {index === 1 && (
                <ExpandableSection
                  title="Year of publication"
                  open={hasYearSelected}
                  variant="mainLeftIcon"
                  className={twMerge(
                    '[&>summary]:text-[20px] [&>summary]:lg:text-xl [&>summary]:py-4 [&>summary]:border-gray-300 [&>summary]:border-t-1 border-0 [&[open]>summary]:border-b-1 [&>div]:m-0 [&>div]:p-0',
                  )}
                >
                  <div
                    key="year-options-container"
                    className="my-4 flex flex-col justify-center align-middle align-items-center"
                  >
                    {YEAR_OPTIONS.map((option) => {
                      const isChecked =
                        String(currentYear) === String(option.value);
                      return (
                        <div key={option.id} className="mb-4">
                          <RadioButton
                            id={`${option.id}`}
                            name="year"
                            value={option.value}
                            defaultChecked={isChecked}
                            classNameLabel="pl-3 text-[18px]"
                          >
                            {option.label}
                          </RadioButton>
                        </div>
                      );
                    })}
                  </div>
                </ExpandableSection>
              )}
              <ExpandableSection
                title={tagGroup.label}
                open={hasSelectedItem}
                variant="mainLeftIcon"
                className={twMerge(
                  '[&>summary]:border-gray-300 [&>summary]:py-4 [&>summary]:border-t-1 [&>summary]:text-[20px] [&>summary]:lg:text-xl border-0 [&[open]>summary]:border-b-1 [&>summary:last-of-type]:border-b-1 [&>div]:m-0 [&>div]:p-0',
                )}
              >
                <div className={twMerge(!tagGroup.slug && ['my-4'])}>
                  {tagGroup.slug && (
                    <Link
                      href={`/${lang}/${tagGroup.slug}`}
                      className="text-pink-500 text-sm hover:underline my-4 block"
                      asInlineText
                    >
                      Show definitions
                    </Link>
                  )}
                  {tagGroup.tags.map(({ name, key }) => {
                    return (
                      <Checkbox
                        key={`${tagGroup.key}-${key}`}
                        id={key}
                        name={`${tagGroup.key}[]`}
                        value={key}
                        defaultChecked={isChecked(key)}
                        className={twMerge(
                          'text-[18px] mb-4 last-of-type:mb-8',
                          index === tags.length - 1 && 'last-of-type:mb-0',
                        )}
                      >
                        {name}
                      </Checkbox>
                    );
                  })}
                </div>
              </ExpandableSection>
            </React.Fragment>
          );
        })}
      </div>

      <div className="px-4 py-8">
        <Button
          type="submit"
          variant="primary"
          className="text-[16px] p-2 w-full lg:w-auto"
        >
          Apply filters
        </Button>
      </div>
    </div>
  );
};

export const SideNavigationDesktop: React.FC<SideNavigationProps> = ({
  className,
  lang,
  tags = [],
  query = {},
}) => {
  return (
    <div className={twMerge(className, 'rounded-[4px] max-w-[300px] mb-12')}>
      <div className="border-[3px] border-gray-200">
        <div className="flex items-center p-2 lg:p-6 bg-gray-95 justify-between">
          <Heading level="h5" className="font-bold text-gray-900">
            Filters
          </Heading>
          <Link
            href={`/${lang}/evidence-library`}
            className="text-pink-500 visited:text-pink-500 text-sm hover:underline hidden lg:block"
            asInlineText
          >
            Clear all
          </Link>
        </div>
        <FilterContent
          key={generateQueryKey(query)}
          query={query}
          tags={tags}
          lang={lang}
        />
      </div>
    </div>
  );
};

export const SideNavigationMobile: React.FC<SideNavigationProps> = ({
  className,
  lang,
  tags = [],
  query = {},
}) => {
  return (
    <div className={twMerge(className, 'lg:hidden mb-8')}>
      <details className="group border-1 border-gray-300 rounded-[4px]">
        <summary className="p-0.5 lg:p-6 bg-slate-200 cursor-pointer group-open:border-b-1 border-gray-300 list-none rounded-[4px]">
          <div className="flex items-center justify-center lg:justify-between gap-2">
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
              Filters
            </Heading>
          </div>
        </summary>
        <FilterContent
          key={generateQueryKey(query)}
          query={query}
          tags={tags}
          lang={lang}
        />
      </details>
    </div>
  );
};
