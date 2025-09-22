import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { getMostRecentBenefitIllustration } from '../../lib/utils';
import { PensionDetailHeading } from '../PensionDetailHeading';
import { PensionDetailSummaryIntro } from '../PensionDetailSummaryIntro';
import { PensionDetailSummaryWarnings } from '../PensionDetailSummaryWarnings';

type DetailsSummaryValues = {
  data: PensionArrangement;
  unavailableCode?: string;
};

export const PensionDetailSummary = ({
  data,
  unavailableCode,
}: DetailsSummaryValues) => {
  const { t } = useTranslation();
  const benefitIllustration = getMostRecentBenefitIllustration(
    data.benefitIllustrations,
  );

  return (
    <section>
      <PensionDetailHeading title={t('pages.pension-details.header.summary')} />
      <PensionDetailSummaryIntro
        data={data}
        unavailableCode={unavailableCode}
      />
      <PensionDetailSummaryWarnings illustration={benefitIllustration} />
    </section>
  );
};
