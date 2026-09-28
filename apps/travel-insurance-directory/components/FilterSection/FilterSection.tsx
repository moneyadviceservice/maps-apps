import React from 'react';

import type { FilterSectionConfig } from 'data/components/filterOptions/filterConstants';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { RadioButton } from '@maps-react/form/components/RadioButton';

export interface FilterSectionProps {
  config: FilterSectionConfig;
  idPrefix: string;
  radioValue: (paramKey: string) => string;
  checkboxValues: (paramKey: string) => string[];
  z: (t: { en: string; cy: string }) => string;
}

const moreInfoClass =
  'border-0 [&>summary]:border-0 [&>summary]:py-0 [&>summary]:text-sm [&>div]:pt-2 [&>div]:pb-0 [&>div]:mb-0';

export const FilterSection: React.FC<FilterSectionProps> = ({
  config,
  idPrefix,
  radioValue,
  checkboxValues,
  z,
}) => {
  const isCheckbox = config.control === 'checkbox';
  const options =
    !isCheckbox && config.emptyItemText
      ? [
          {
            id: `${config.paramKey}-empty`,
            label: z(config.emptyItemText),
            value: '',
          },
          ...config.options,
        ]
      : config.options;

  const selectedCheckboxValues = isCheckbox
    ? checkboxValues(config.paramKey)
    : [];

  const renderControls = () => {
    if (isCheckbox) {
      return options.map((opt) => (
        <div key={opt.id} className="mb-4">
          <Checkbox
            id={`${idPrefix}-${config.paramKey}-${opt.id}`}
            name={config.name}
            value={opt.value}
            defaultChecked={selectedCheckboxValues.includes(opt.value)}
            className="text-[18px]"
          >
            {typeof opt.label === 'string' ? opt.label : z(opt.label)}
          </Checkbox>
        </div>
      ));
    }

    return options.map((opt) => (
      <div key={opt.id} className="mb-4">
        <RadioButton
          id={`${idPrefix}-${config.paramKey}-${opt.id}`}
          name={config.name}
          value={opt.value}
          defaultChecked={radioValue(config.paramKey) === opt.value}
          classNameLabel="pl-3 text-[18px]"
        >
          {typeof opt.label === 'string' ? opt.label : z(opt.label)}
        </RadioButton>
      </div>
    ));
  };

  return (
    <div>
      <div className="mb-2">
        <h3 className="font-bold text-[18px] lg:text-xl text-gray-900 mb-1">
          {z(config.title)}
        </h3>
        {/* Stop propagation so opening "More information" doesn't close the parent Filters details panel (mobile) */}
        <button
          type="button"
          tabIndex={-1}
          className="contents border-0 bg-transparent p-0 text-left"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <ExpandableSection
            title={
              <span className="text-sm font-medium">
                {z({ en: 'More information', cy: 'Rhagor o wybodaeth' })}
              </span>
            }
            variant="hyperlink"
            type="nested"
            className={moreInfoClass}
          >
            {config.moreInfoTitle && (
              <h3 className="font-bold text-gray-900 mb-1">
                {z(config.moreInfoTitle)}
              </h3>
            )}
            <p className="text-sm text-gray-800 whitespace-pre-line mb-6">
              {z(config.moreInfo)}
            </p>
          </ExpandableSection>
        </button>
        <fieldset className="mt-3 border-0 p-0 m-0">
          <legend className="sr-only">{z(config.title)}</legend>
          {renderControls()}
        </fieldset>
      </div>
    </div>
  );
};
