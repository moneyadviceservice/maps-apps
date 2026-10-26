import { useRouter } from 'next/router';

import { SortOrder } from 'lib/utils/sortCards/sortCards';

import { Select } from '@maps-react/form/components/Select';
import useTranslation from '@maps-react/hooks/useTranslation';

type SortBarType = {
  order: SortOrder;
  orders: readonly SortOrder[];
};

const SortBar = ({ order, orders }: SortBarType) => {
  const router = useRouter();
  const { t } = useTranslation();

  const setOrder = (value: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, order: value },
      },
      undefined,
      { scroll: false, shallow: false },
    );
  };

  return (
    <div className="flex items-center space-x-4 t-sort">
      <label
        htmlFor="order"
        className="text-lg text-gray-800 whitespace-nowrap"
      >
        {t('learning-pathway-list.sortLabel')}
      </label>
      <div className="grow">
        <Select
          id="order"
          name="order"
          className="truncate"
          hideEmptyItem={true}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          options={orders.map((value) => ({
            text: t(`learning-pathway-list.sort.${value}`),
            value,
          }))}
        />
      </div>
      {/* Announce the reorder to screen readers. */}
      <div aria-live="polite" role="status" className="sr-only">
        {t('learning-pathway-list.sortAnnouncement', {
          order: t(`learning-pathway-list.sort.${order}`),
        })}
      </div>
    </div>
  );
};

export default SortBar;
