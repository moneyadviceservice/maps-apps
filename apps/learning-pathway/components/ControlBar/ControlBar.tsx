import SortBar from 'components/SortBar';
import { cardsPerPageData } from 'data';
import { SortOrder } from 'lib/utils/sortCards/sortCards';
import { Paragraph } from '@maps-digital/shared/ui';

import { Select } from '@maps-react/form/components/Select';
import useTranslation from '@maps-react/hooks/useTranslation';

type ControlBarType = {
  order: SortOrder;
  orderList: readonly SortOrder[];
  limit: string;
  total: number;
  onCardsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ControlBar = ({
  order,
  orderList,
  limit,
  total,
  onCardsPerPageChange,
}: ControlBarType) => {
  const { t } = useTranslation();
  return (
    <>
      <Paragraph className="m-0 font-bold" data-testid="documents-found">
        {total} {''}
        {t('learning-pathway-list.documentsNumberText')}
      </Paragraph>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <Select
            id="items-per-page"
            options={cardsPerPageData}
            defaultValue={cardsPerPageData[0].value}
            value={limit}
            name="limit"
            label={t('learning-pathway-list.cardsPerPageDropdown')}
            labelClassName="self-center"
            onChange={onCardsPerPageChange}
            data-testid={'cards-per-page-select'}
          />
        </div>
        <SortBar order={order} orders={orderList} />
      </div>
    </>
  );
};

export default ControlBar;
