import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { PensionProviderDetailsTable } from '../PensionProviderDetailsTable';

type PensionProviderSectionProps = {
  data: PensionArrangement;
};

export const PensionProviderSection = ({
  data,
}: PensionProviderSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Heading level="h2">
        {t('pages.pension-details.pension-provider.heading')}
      </Heading>
      <PensionProviderDetailsTable data={data} />
    </>
  );
};
