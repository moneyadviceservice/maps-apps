import { LIMIT_OPTIONS } from 'data/components/filterOptions/filterConstants';
import { getLimit } from 'utils/listingsPageFilters';
import type { QueryParams } from 'utils/query/queryHelpers';

import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface ViewPerPageProps {
  query: QueryParams;
}

export const ViewPerPage = ({ query }: ViewPerPageProps) => {
  const { z } = useTranslation();
  const currentLimit = getLimit(query);

  return (
    <div className="inline-flex items-center gap-2" data-testid="view-per-page">
      <span className="text-[18px] text-gray-800">
        {z({ en: 'View per page', cy: 'Golwg fesul dudalen' })}
      </span>
      <label htmlFor="listings-limit" className="sr-only">
        {z({ en: 'Items per page', cy: 'Eitemau fesul dudalen' })}
      </label>
      <Select
        id="listings-limit"
        name="limit"
        key={String(currentLimit)}
        defaultValue={String(currentLimit)}
        options={LIMIT_OPTIONS.map((n) => ({
          text: String(n),
          value: String(n),
        }))}
        hideEmptyItem
        selectClassName="min-w-[80px]"
        aria-label={z({ en: 'Items per page', cy: 'Eitemau fesul dudalen' })}
      />
    </div>
  );
};
