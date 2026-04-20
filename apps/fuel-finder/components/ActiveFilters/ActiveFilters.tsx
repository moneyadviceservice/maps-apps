import { useRouter } from 'next/router';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { stationTypeOptions } from '../../data/fuel-finder';
import pageFilters from '../../utils/FuelFinder/filters/pageFilters';
import FilterTag from '../FilterTag';
import ActiveFiltersSummary from './ActiveFiltersSummary';

interface ActiveFilterItem {
  slug: string;
  title: string;
}

const ActiveFilters = () => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();

  const allStationTypes = stationTypeOptions(z);

  const allChosen: ActiveFilterItem[] = allStationTypes
    .filter((s) => filters.isFilterActive(s.value))
    .map((s) => ({ slug: s.value, title: s.title }));

  const removeFilter = (name: string): string =>
    z({ en: 'Remove filter "{name}"', cy: 'Dileu hidlydd "{name}"' }, { name });

  return (
    <div className="space-y-4 t-active-filters">
      <div
        className="hidden t-filter-announcements"
        aria-live="assertive"
      ></div>
      <ActiveFiltersSummary
        count={filters.count}
        clearHref={filters.clearAllFiltersHref}
      />
      <div className="flex flex-wrap gap-4 t-active-filters-items">
        {allChosen.map((chosen) => (
          <FilterTag
            key={chosen.slug}
            title={chosen.title}
            href={filters.removeFilterHref(chosen.slug)}
            description={removeFilter(chosen.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
