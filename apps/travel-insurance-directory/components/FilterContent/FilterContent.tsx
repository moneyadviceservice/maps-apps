import React from 'react';

import { FILTER_SECTIONS } from 'data/components/filterOptions/filterConstants';
import { getQueryValue, type QueryParams } from 'utils/query/queryHelpers';

import { Button } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FilterSection } from '../FilterSection';

export interface FilterContentProps {
  query: QueryParams;
  idPrefix?: string;
}

export const FilterContent: React.FC<FilterContentProps> = ({
  query,
  idPrefix: idPrefixProp,
}) => {
  const { z } = useTranslation();
  const idPrefix = idPrefixProp ?? 'filters';

  const radioValue = (paramKey: string): string => {
    const val = getQueryValue(query, paramKey);
    if (typeof val === 'string') return val;
    if (Array.isArray(val) && val.length > 0) return String(val[0]);
    return '';
  };

  const checkboxValues = (paramKey: string): string[] => {
    const val = getQueryValue(query, paramKey);
    if (typeof val === 'string') return val ? [val] : [];
    if (Array.isArray(val)) return val.map(String);
    return [];
  };

  return (
    <div data-testid="travel-insurance-filters">
      <div className="px-6 pt-6 flex flex-col">
        {FILTER_SECTIONS.map((config) => (
          <FilterSection
            key={config.testId}
            config={config}
            idPrefix={idPrefix}
            radioValue={radioValue}
            checkboxValues={checkboxValues}
            z={z}
          />
        ))}
      </div>

      <noscript>
        <div className="px-6 pt-2 pb-8">
          <Button
            type="submit"
            variant="primary"
            className="text-[16px] p-2 w-full lg:w-auto"
          >
            {z({ en: 'Apply filters', cy: 'Gosod hidlyddion' })}
          </Button>
        </div>
      </noscript>
    </div>
  );
};
