import useTranslation from '@maps-react/hooks/useTranslation';

import { BenefitIllustration } from '../../lib/types';
import { currencyAmount } from '../../lib/utils';
import { DetailRow } from '../PensionDetailRow';

type PensionDCPotRowProps = {
  data: BenefitIllustration[];
};

export const PensionDCPotRow = ({ data }: PensionDCPotRowProps) => {
  const { t } = useTranslation();

  return data?.some(({ illustrationComponents }) =>
    illustrationComponents.some(({ dcPot }) => dcPot),
  ) ? (
    <DetailRow heading={t('pages.pension-details.headings.pot')}>
      {data.map(({ illustrationComponents }) =>
        illustrationComponents.map(({ dcPot }, idx) => {
          return (
            <td className="py-3 text-left align-top" key={`${dcPot}-${idx}`}>
              {dcPot ? currencyAmount(dcPot) : ''}
            </td>
          );
        }),
      )}
    </DetailRow>
  ) : null;
};
