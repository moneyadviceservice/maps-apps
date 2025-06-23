import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { DetailRow } from '../PensionDetailRow';
import { TableSection } from '../TableSection';
import { Row } from './types';

const tdClasses = 'pb-3 md:pt-[14px] md:pb-4 text-left align-top max-md:block';
const thClasses =
  'text-left align-top font-bold pt-[10px] pb-[2px] md:pt-[14px] md:pb-4 max-md:block border-b-1 border-b-slate-400';

type Props = {
  data: Row[];
};

export const TableDesktop = ({ data }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block">
      <TableSection
        heading={t('pages.pension-details.details.title')}
        borderTop={false}
      >
        <thead>
          <tr>
            <th className={twMerge(thClasses, 'w-1/3')} />
            <th className={thClasses}>
              {t(`pages.pension-details.details.monthly-amount`)}
            </th>
            <th className={thClasses}>
              {t(`pages.pension-details.details.yearly-amount`)}
            </th>
            <th className={thClasses}>
              {t(`pages.pension-details.details.payable-date`)}
            </th>
          </tr>
        </thead>

        <tbody className="max-md:block">
          {data.map(({ title, monthlyAmount, yearlyAmount, payableDate }) => (
            <DetailRow
              key={title}
              heading={t(`pages.pension-details.details.${title}`)}
            >
              <td className={tdClasses} data-testid={`monthly-${title}`}>
                {monthlyAmount}
              </td>
              <td className={tdClasses} data-testid={`yearly-${title}`}>
                {yearlyAmount}
              </td>
              <td className={tdClasses} data-testid={`payable-date-${title}`}>
                {payableDate}
              </td>
            </DetailRow>
          ))}
        </tbody>
      </TableSection>
    </div>
  );
};
