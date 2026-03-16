import { useRouter } from 'next/router';

import { getLimit, setLimitHref } from 'utils/listingsPageFilters';
import type { QueryParams } from 'utils/query/queryHelpers';

import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const LIMIT_OPTIONS = [5, 10, 20, 30];

export interface ViewPerPageProps {
  query: QueryParams;
  lang?: string;
}

export const ViewPerPage = ({ query, lang }: ViewPerPageProps) => {
  const router = useRouter();
  const { z } = useTranslation();
  const currentLimit = getLimit(query);
  const basePath = `/${lang ?? router.query.language ?? 'en'}/listings`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = Number.parseInt(e.target.value, 10);
    const href = setLimitHref(query, limit);
    router.push(
      basePath + (href.startsWith('?') ? href : `?${href}`),
      undefined,
      {
        scroll: false,
      },
    );
  };

  return (
    <div className="flex items-center gap-2" data-testid="view-per-page">
      <span className="text-[18px] text-gray-800">
        {z({ en: 'View per page', cy: 'Golwg fesul dudalen' })}
      </span>
      <label htmlFor="listings-limit" className="sr-only">
        {z({ en: 'Items per page', cy: 'Eitemau fesul tudalen' })}
      </label>
      <Select
        id="listings-limit"
        name="limit"
        defaultValue={String(currentLimit)}
        options={LIMIT_OPTIONS.map((n) => ({
          text: String(n),
          value: String(n),
        }))}
        hideEmptyItem
        selectClassName="min-w-[80px]"
        onChange={handleChange}
        aria-label={z({ en: 'Items per page', cy: 'Eitemau fesul tudalen' })}
      />
    </div>
  );
};
