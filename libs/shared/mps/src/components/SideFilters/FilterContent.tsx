import React from 'react';

import { twMerge } from 'tailwind-merge';
import { Button, ExpandableSection, Link } from '@maps-digital/shared/ui';

import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { TextInput } from '@maps-react/form/components/TextInput';

import { Tags } from '../../types/index';

interface FilterContentProps {
  keyword: string | undefined;
  lang: string;
  tags: Tags[];
  searchLabel: string;
  submitLabel?: string;
  clearAllLabel?: string;
  clearAllLink?: string;
  formType: 'desktop' | 'mobile';
}

export const FilterContent = ({
  keyword,
  lang,
  tags = [],
  searchLabel,
  formType,
  submitLabel,
  clearAllLabel,
  clearAllLink,
}: FilterContentProps) => {
  const idPrefix = formType === 'desktop' ? 'desktop' : 'mobile';

  return (
    <div data-testid={'testId'}>
      <div className="px-6">
        <fieldset className="py-8 border-0">
          <label
            className="block pb-2 font-bold text-[18px]"
            htmlFor={`${idPrefix}-keyword`}
          >
            {searchLabel}
          </label>
          <legend className="sr-only">{searchLabel}</legend>
          <TextInput
            id={`${idPrefix}-keyword`}
            name={`keyword`}
            defaultValue={keyword || ''}
            className="w-full text-sm mb-4"
          />
          <input type="hidden" name="keyword-current" value={keyword || ''} />

          <Button
            type="submit"
            variant="primary"
            name="search"
            value="true"
            className="text-[16px] p-2 w-full lg:w-auto"
          >
            Search
          </Button>
        </fieldset>

        {tags?.map((tagGroup, index) => {
          return (
            <React.Fragment key={tagGroup.key || `tag-group-${index}`}>
              <ExpandableSection
                title={tagGroup.group}
                testId={tagGroup.key}
                open={!!tagGroup?.checked?.length || index === 0}
                variant="mainLeftIcon"
                className={twMerge(
                  '[&>summary]:border-gray-300 [&>summary]:py-4 [&>summary]:border-t-1 [&>summary]:text-[20px] [&>summary]:lg:text-xl border-0 [&[open]>summary]:border-b-1 [&>summary:last-of-type]:border-b-1 [&>div]:m-0 [&>div]:p-0',
                )}
              >
                <CheckboxGroup
                  key={`${tagGroup.key}-${index}`}
                  testId={`${idPrefix}-${tagGroup.key}`}
                  name={`${tagGroup.key}`}
                  items={tagGroup.tags}
                  defaultChecked={tagGroup.checked ?? []}
                  className={twMerge(
                    'text-[18px] mb-4 last-of-type:mb-8',
                    !tagGroup.key && ['my-4'],
                    'border-0',
                    index === tags.length - 1 && 'last-of-type:mb-0',
                  )}
                  label={tagGroup.group}
                  hideLabel={true}
                />
              </ExpandableSection>
            </React.Fragment>
          );
        })}
      </div>

      <div className="px-4 py-8 flex-col lg:flex space-y-6">
        <Button
          type="submit"
          variant="primary"
          className="text-[16px] p-2 w-full lg:w-auto"
        >
          {submitLabel}
        </Button>
        {clearAllLabel && clearAllLink && (
          <Link
            href={clearAllLink}
            className="block text-magenta-700 visited:text-magenta-700 text-sm hover:underline w-full text-center"
          >
            {clearAllLabel}
          </Link>
        )}
      </div>
    </div>
  );
};
