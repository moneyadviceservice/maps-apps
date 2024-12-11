import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { InformationType } from '../../lib/constants';
import { AdditionalDataSource, PensionArrangement } from '../../lib/types';

type PensionDetailMoreInfoProps = {
  data: PensionArrangement;
};

export const PensionDetailMoreInfo = ({ data }: PensionDetailMoreInfoProps) => {
  const { t } = useTranslation();

  const getMoreInfoMessage = ({ informationType }: AdditionalDataSource) => {
    switch (informationType) {
      case InformationType.C_AND_C:
        return t('pages.pension-details.more-info.costs');
      case InformationType.SP:
        return t('pages.pension-details.more-info.sp');
      default:
        return '';
    }
  };

  return data.additionalDataSources?.map((additionalData, idx) => {
    return (
      <Paragraph key={`${additionalData.informationType}-${idx}`}>
        {getMoreInfoMessage(additionalData)}{' '}
        <Link asInlineText target="_blank" href={additionalData.url}>
          {additionalData.url}
        </Link>
        .
      </Paragraph>
    );
  });
};
