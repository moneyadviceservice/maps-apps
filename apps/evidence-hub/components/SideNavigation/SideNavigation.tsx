import React from 'react';

import { twMerge } from 'tailwind-merge';
import { Tag } from 'types/@adobe/page';
import { v4 } from 'uuid';

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
  tags?: {
    label: string;
    key?: string;
    tags: Tag[];
  }[];
  query?: Record<string, string | string[] | undefined>;
}

// Year options constant
const yearOptions = [
  { id: 'all-years', label: 'All years', value: 'all' },
  { id: 'last-2-years', label: 'Last 2 years', value: 'last-2' },
  { id: 'last-5-years', label: 'Last 5 years', value: 'last-5' },
  {
    id: 'more-than-5-years',
    label: 'More than 5 years ago',
    value: 'more-than-5',
  },
];

// Filter form component
interface FilterFormProps {
  query: Record<string, string | string[] | undefined>;
  tags: {
    label: string;
    key?: string;
    tags: Tag[];
  }[];
  testId: string;
  formId: string;
}

const FilterForm: React.FC<FilterFormProps> = ({
  query,
  tags = [],
  testId,
  formId,
}) => {
  return (
    <form method="POST" action="/api/evidence-hub/filter" data-testid={testId}>
      <div className="px-6">
        <div className="py-8">
          <label
            className="block pb-2 font-bold text-[18px]"
            htmlFor={`keyword-${formId}`}
          >
            Keyword search
          </label>
          <TextInput
            id={`keyword-${formId}`}
            name={`keyword-${formId}`}
            defaultValue={(query.keyword as string) || ''}
            className="w-full text-sm mb-4"
          />
          <Button
            type="submit"
            variant="primary"
            className="text-[16px] p-2 w-full lg:w-auto"
          >
            Search
          </Button>
        </div>

        {tags?.map((tagGroup, index) => {
          const selectedTagsForGroup = query[tagGroup?.key || ''];
          const isChecked = (tagKey: string) => {
            if (!selectedTagsForGroup) return false;
 
            if (Array.isArray(selectedTagsForGroup)) {
              return selectedTagsForGroup.includes(tagKey);
            }
    
            return selectedTagsForGroup.split(',').includes(tagKey);
          };

          const hasSelectedItem =
            tagGroup.tags.some(({ key }) => isChecked(key)) || index === 0;

          return (
            <>
              {index === 1 && (
                <ExpandableSection
                  title="Year of publication"
                  open={hasSelectedItem}
                  variant="mainLeftIcon"
                  className={twMerge(
                    '[&>summary]:text-[20px] [&>summary]:lg:text-xl [&>summary]:py-4 [&>summary]:border-gray-300 [&>summary]:border-t-1 border-0 [&[open]>summary]:border-b-1 [&>div]:m-0 [&>div]:p-0',
                  )}
                >
                  <div
                    key={v4()}
                    className="my-4 flex flex-col justify-center align-middle align-items-center"
                  >
                    {yearOptions.map((option) => {
                      const isChecked =
                        String(query.year) === String(option.value);
                      return (
                        <div key={v4()} className="mb-4">
                          <RadioButton
                            id={`${option.id}-${formId}`}
                            name={`yearOfPublication-${formId}`}
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
                key={v4()}
                title={tagGroup.label}
                open={hasSelectedItem}
                variant="mainLeftIcon"
                className={twMerge(
                  '[&>summary]:border-gray-300 [&>summary]:py-4 [&>summary]:border-t-1 [&>summary]:text-[20px] [&>summary]:lg:text-xl border-0 [&[open]>summary]:border-b-1 [&>summary:last-of-type]:border-b-1 [&>div]:m-0 [&>div]:p-0',
                )}
              >
                <div className="">
                  <Link
                    href="#"
                    className="text-pink-500 text-sm hover:underline my-4 block"
                    asInlineText
                  >
                    Show definitions
                  </Link>
                  {tagGroup.tags.map(({ name, key }) => {
                    return (
                      <Checkbox
                        key={v4()}
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
            </>
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
    </form>
  );
};

export const SideNavigation: React.FC<SideNavigationProps> = ({
  className,
  tags = [],
  query = {},
}) => {
  return (
    <>
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
          <FilterForm
            query={query}
            tags={tags}
            testId="filter-form-mobile"
            formId="mobile"
          />
        </details>
      </div>

      <div
        className={twMerge(
          className,
          'hidden lg:block rounded-[4px] max-w-[300px]',
        )}
      >
        <div className="border-[3px] border-gray-200">
          <div className="flex items-center p-2 lg:p-6 bg-gray-95 justify-between">
            <Heading level="h5" className="font-bold text-gray-900">
              Filters
            </Heading>
            <Link
              href="/en/evidence-hub"
              className="text-pink-500 visited:text-pink-500 text-sm hover:underline hidden lg:block"
              asInlineText
            >
              Clear all
            </Link>
          </div>
          <FilterForm
            query={query}
            tags={tags}
            testId="filter-form"
            formId="desktop"
          />
        </div>
      </div>
    </>
  );
};
