import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { DetailRow } from '../PensionDetailRow';
import { TableSection } from '../TableSection';
import { Row } from './PensionDetailsSection';

const tdClasses = 'pb-3 md:pt-[14px] md:pb-4 text-left align-top max-md:block';
const thClasses =
  'text-left align-top font-bold pt-[10px] pb-[2px] md:pt-[14px] md:pb-4 max-md:block border-b-1 border-b-slate-400';

type DetailsDesktopProps = {
  data: Row[];
  type: PensionType;
};

export const DetailsDesktop = ({ data, type }: DetailsDesktopProps) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block">
      <TableSection heading={t('pages.pension-details.details.title')}>
        <thead>
          <tr>
            <th className={twMerge(thClasses, 'md:w-1/3 lg:w-2/5')}></th>
            <th className={twMerge(thClasses, '')}>
              {t(
                `pages.pension-details.details.${
                  type === PensionType.SP ? 'estimate-today' : 'current-value'
                }`,
              )}
            </th>
            <th className={twMerge(thClasses, '')}>
              {t(
                `pages.pension-details.details.${
                  type === PensionType.SP
                    ? 'forecast'
                    : 'estimate-at-retirement'
                }`,
              )}
            </th>
          </tr>
        </thead>

        <tbody className="max-md:block">
          {data.map(({ title, currentValue, retirementValue }) => (
            <DetailRow
              key={title}
              heading={t(`pages.pension-details.details.${title}`)}
            >
              <td className={tdClasses} data-testid={`current-${title}`}>
                {currentValue}
              </td>
              <td className={tdClasses} data-testid={`retirement-${title}`}>
                {retirementValue}
              </td>
            </DetailRow>
          ))}
        </tbody>
      </TableSection>
    </div>
  );
};
