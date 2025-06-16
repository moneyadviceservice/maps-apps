import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Row } from './types';

type Props = {
  data: Row[];
};

export const TableMobile = ({ data }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="md:hidden mt-14 md:mt-16">
      <Heading
        data-testid="table-section-heading"
        level="h2"
        className="max-md:mb-4 md:text-5xl md:mb-4"
      >
        {t('pages.pension-details.details.title')}
      </Heading>

      {data.map(({ title, monthlyAmount, yearlyAmount, payableDate }) => (
        <div
          key={title}
          className="max-md:mb-8 *:border-b-1 *:border-b-slate-400 *:py-2"
        >
          <Heading level="h3" className="font-semibold">
            {t(`pages.pension-details.details.${title}`)}
          </Heading>

          <div className="">
            <div className="font-bold">
              {t(`pages.pension-details.details.monthly-amount`)}
            </div>
            <div data-testid={`current-${title}-mobile`}>{monthlyAmount}</div>
          </div>

          <div>
            <div className="font-bold">
              {t(`pages.pension-details.details.yearly-amount`)}
            </div>
            <div data-testid={`current-${title}-mobile`}>{yearlyAmount}</div>
          </div>

          <div>
            <div className="font-bold">
              {t(`pages.pension-details.details.payable-date`)}
            </div>
            <div data-testid={`current-${title}-mobile`}>{payableDate}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
