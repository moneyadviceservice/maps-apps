import React from 'react';

import type { FilterSectionConfig } from 'data/components/filterOptions/filterConstants';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { RadioButton } from '@maps-react/form/components/RadioButton';

export interface FilterSectionProps {
  config: FilterSectionConfig;
  idPrefix: string;
  radioValue: (paramKey: string) => string;
  z: (t: { en: string; cy: string }) => string;
}

const moreInfoClass =
  'border-0 [&>summary]:border-0 [&>summary]:py-0 [&>summary]:text-sm [&>div]:pt-2 [&>div]:pb-0 [&>div]:mb-0';

export const FilterSection: React.FC<FilterSectionProps> = ({
  config,
  idPrefix,
  radioValue,
  z,
}) => {
  const isNumberInput = config.control === 'number' && config.numberInput;
  const options =
    !isNumberInput && config.emptyItemText
      ? [
          {
            id: `${config.paramKey}-empty`,
            label: z(config.emptyItemText),
            value: '',
          },
          ...config.options,
        ]
      : config.options;

  const isPlaceholderOnly =
    config.placeholderCopy && config.options.length === 0;

  const sectionContent = isPlaceholderOnly ? (
    <div className="mb-6">
      <h3 className="font-bold text-[18px] lg:text-xl text-gray-900 mb-1">
        {z(config.title)}
      </h3>
      <p className="text-sm text-gray-800">{z(config.placeholderCopy!)}</p>
    </div>
  ) : (
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
              {z({ en: 'More information', cy: 'Mwy o wybodaeth' })}
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
        {isNumberInput ? (
          <div className="mb-4">
            <NumberInput
              id={`${idPrefix}-${config.paramKey}`}
              name={config.name}
              defaultValue={radioValue(config.paramKey)}
              placeholder={
                config.numberInput!.placeholder
                  ? z(config.numberInput!.placeholder)
                  : undefined
              }
              decimalScale={0}
              isAllowed={({ floatValue }) =>
                floatValue == null ||
                (floatValue >= config.numberInput!.min &&
                  floatValue <= config.numberInput!.max)
              }
              isFullWidth={false}
              className="w-full text-[18px] py-2 border-gray-300 rounded"
              aria-label={z(config.title)}
            />
          </div>
        ) : (
          options.map((opt) => (
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
          ))
        )}
      </fieldset>
    </div>
  );

  const wrapperClass = config.wrapperClassName;
  if (wrapperClass) {
    return <div className={wrapperClass}>{sectionContent}</div>;
  }
  return <div>{sectionContent}</div>;
};
