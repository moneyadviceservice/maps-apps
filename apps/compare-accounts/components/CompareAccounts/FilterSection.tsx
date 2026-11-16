/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';

import slug from 'slug';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H5 } from '@maps-react/common/components/Heading';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import pageFilters from '../../utils/CompareAccounts/pageFilters';

interface FilterItem {
  value: string;
  title: string;
  details: string;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
}

const FilterSection = ({ title, items }: FilterSectionProps) => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();

  return (
    <div className="t-filter-section">
      <H5>{title}</H5>
      <ExpandableSection
        closedTitle={z({ en: 'Hide definitions', cy: 'Cuddio diffiniadau' })}
        title={z({ en: 'Show definitions', cy: 'Dangos diffiniadau' })}
        variant="hyperlink"
      >
        {items.map(({ title, details }: any) => {
          return (
            <div key={title}>
              <p>
                <strong>{title}</strong> : {details}
              </p>
            </div>
          );
        })}
      </ExpandableSection>
      <fieldset className="mt-3">
        <legend className="sr-only">{title}</legend>
        <div className="grid space-y-4 sm:grid-cols-2 lg:block">
          {items.map(({ title, value }: any) => {
            const name = slug(value);

            return (
              <div key={name} className="relative flex">
                <Checkbox
                  id={name}
                  name={name}
                  defaultChecked={filters.isFilterActive(value)}
                >
                  {title}
                </Checkbox>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default FilterSection;
