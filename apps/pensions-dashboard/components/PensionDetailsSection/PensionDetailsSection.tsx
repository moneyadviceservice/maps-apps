import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { BenefitsIllustrationsTable } from '../BenefitIllustrationsTable/BenefitIllustrationsTable';

type PensionDetailMoreInfoProps = {
  data: PensionArrangement;
  hasPayableDetails: boolean;
};

export const PensionDetailsSection = ({
  data,
  hasPayableDetails,
}: PensionDetailMoreInfoProps) => {
  const { t } = useTranslation();

  if (!data.benefitIllustrations) {
    return null;
  }

  return (
    <>
      <Heading level="h2">{t('pages.pension-details.details.heading')}</Heading>
      <BenefitsIllustrationsTable
        data={data.benefitIllustrations}
        hasPayableDetails={hasPayableDetails}
      />
    </>
  );
};
