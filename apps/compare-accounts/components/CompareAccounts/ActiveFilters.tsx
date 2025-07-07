import { useRouter } from 'next/router';

import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  accountAccess,
  accountFeatures,
  accountTypes,
} from '../../data/compare-accounts';
import pageFilters from '../../utils/CompareAccounts/pageFilters';
import Filter from './Filter';

interface FilterItem {
  value: string;
  title: string;
}

const ActiveFilters = () => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();

  const chosenAccountTypes: FilterItem[] = accountTypes(z).filter((a) =>
    filters.accountTypes.includes(a.value),
  );
  const chosenAccountFeatures: FilterItem[] = accountFeatures(z).filter((a) =>
    filters.accountFeatures.includes(a.value),
  );
  const chosenAccountAccess: FilterItem[] = accountAccess(z).filter((a) =>
    filters.accountAccess.includes(a.value),
  );

  const chosenFilters: FilterItem[] = [
    ...chosenAccountTypes,
    ...chosenAccountFeatures,
    ...chosenAccountAccess,
  ];

  const removeFilter = (name: string): string => {
    return z(
      { en: 'Remove filter "{name}"', cy: 'Dileu hidlydd "{name}"' },
      { name: name },
    );
  };

  const filterTag = (value: string): string => {
    return z(
      { en: 'search: {value}', cy: 'Chwilio: {value}' },
      { value: value },
    );
  };

  return (
    <div className="space-y-4 t-active-filters">
      <div
        className="hidden t-filter-announcements"
        aria-live="assertive"
      ></div>
      <div className="flex space-x-2 t-active-filters-summary">
        <div className="text-gray-800">
          {filters.count === 1
            ? z(
                { en: '{count} active filter', cy: '{count} hidlydd actif' },
                { count: String(filters.count) },
              )
            : z(
                {
                  en: '{count} active filters',
                  cy: '{count} hidlyddion actif',
                },
                { count: String(filters.count) },
              )}
        </div>
        <div className="lg:hidden">
          <Link
            href={filters.clearFiltersHref()}
            scroll={false}
            title={z({
              en: 'Clear all',
              cy: 'Clirio popeth',
            })}
          >
            {z({ en: 'Clear all filters', cy: 'Clirio popeth hidlyddion' })}
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 t-active-filters-items">
        {chosenFilters.map((chosenFilter) => (
          <Filter
            key={chosenFilter.value}
            title={chosenFilter.title}
            href={filters.removeFilterHref(chosenFilter.value)}
            description={removeFilter(chosenFilter.title)}
          />
        ))}
        {filters.searchQuery && (
          <Filter
            title={filterTag(filters.searchQuery)}
            href={filters.removeSearchQueryHref()}
            description={z({
              en: 'Remove search filter',
              cy: 'Dileu hidlydd chwilio',
            })}
          />
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
