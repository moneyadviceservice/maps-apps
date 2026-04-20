import { useRouter } from 'next/router';

import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { perPageOptions, sortOptions } from '../../data/fuel-finder';
import pageFilters from '../../utils/FuelFinder/filters/pageFilters';

const SortBar = () => {
  const router = useRouter();
  const filters = pageFilters(router);
  const { z } = useTranslation();

  const allSortOptions = sortOptions(z);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-2 lg:flex-row">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 sm:space-x-4">
          <label htmlFor="perPage" className="text-lg text-gray-800">
            {z({ en: 'View per page', cy: 'Golwg fesul dudalen' })}
          </label>
          <Select
            className="lg:min-w-24 grow"
            defaultValue={'3'}
            value={String(filters.perPage)}
            hideEmptyItem={true}
            id="perPage"
            name="perPage"
            onChange={(e) => filters.setPerPage(e.target.value)}
            options={perPageOptions.map((o) => ({
              text: o.text,
              value: o.value,
            }))}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 sm:space-x-4 t-sort">
          <label
            htmlFor="sort"
            className="text-lg text-gray-800 whitespace-nowrap"
          >
            {z({ en: 'Sort results by', cy: 'Trefnu' })}
          </label>
          <div className="grow">
            <Select
              id="sort"
              name="sort"
              className="truncate"
              hideEmptyItem={true}
              value={filters.sort}
              onChange={(e) => filters.setSort(e.target.value)}
              options={allSortOptions.map((o) => ({
                text: o.text,
                value: o.value,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortBar;
