import { useRouter } from 'next/router';

import { getLimit, setLimitHref } from 'utils/listingsPageFilters';
import type { QueryParams } from 'utils/query/queryHelpers';

import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const LIMIT_OPTIONS = [
  { text: '5', value: '5' },
  { text: '10', value: '10' },
  { text: '20', value: '20' },
];

export interface ViewPerPageProps {
  query: QueryParams;
}

export const ViewPerPage = ({ query }: ViewPerPageProps) => {
  const router = useRouter();
  const { z } = useTranslation();
  const currentLimit = getLimit(query);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = Number.parseInt(e.target.value, 10);
    const href = setLimitHref(query, limit);
    const basePath =
      router.asPath.split('?')[0] ||
      `/${router.query.language || 'en'}/listings`;
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
      <label htmlFor="listings-limit" className="text-[18px] text-gray-800">
        {z({ en: 'View per page', cy: 'Golwg fesul dudalen' })}
      </label>
      <Select
        id="listings-limit"
        name="limit"
        defaultValue={String(currentLimit)}
        options={LIMIT_OPTIONS}
        hideEmptyItem
        selectClassName="min-w-[80px]"
        onChange={handleChange}
        aria-label={z({ en: 'Items per page', cy: 'Eitemau fesul tudalen' })}
      />
    </div>
  );
};
