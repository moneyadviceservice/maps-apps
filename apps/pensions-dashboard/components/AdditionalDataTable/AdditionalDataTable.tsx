import { Fragment } from 'react';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

import { InformationType, NO_DATA, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { DetailRow } from '../PensionDetailRow';
import { TableSection } from '../TableSection';

const cellClasses =
  'pb-3 md:pt-[14px] md:pb-4 text-left align-top max-md:block';

type AdditionalDataTableProps = {
  data: PensionArrangement;
};
export const AdditionalDataTable = ({
  data: { additionalDataSources, pensionType },
}: AdditionalDataTableProps) => {
  const { t } = useTranslation();

  const filteredTypes = Object.values(InformationType).filter(
    (type) =>
      (pensionType === PensionType.SP) === (type === InformationType.SP),
  );

  return (
    <TableSection heading={t('pages.pension-details.headings.additional-data')}>
      <tbody className="max-md:block">
        {filteredTypes.map((type) => {
          const source = additionalDataSources?.find(
            (dataSource) => dataSource.informationType === type,
          );

          return (
            <Fragment key={type}>
              <DetailRow heading={t(`data.pensions.additional-types.${type}`)}>
                <td className={cellClasses}>
                  {source ? (
                    <Link
                      asInlineText
                      target="_blank"
                      href={source.url}
                      className="break-all"
                    >
                      {source.url}
                    </Link>
                  ) : (
                    NO_DATA
                  )}
                </td>
              </DetailRow>
            </Fragment>
          );
        })}
      </tbody>
    </TableSection>
  );
};
