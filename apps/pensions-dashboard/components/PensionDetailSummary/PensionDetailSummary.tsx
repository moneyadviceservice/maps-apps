import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { getMostRecentBenefitIllustration } from '../../lib/utils/data';
import { PensionDetailHeading } from '../PensionDetailHeading';
import { PensionDetailIllustrationDate } from '../PensionDetailIllustrationDate';
import { PensionDetailIntro } from '../PensionDetailIntro';
import { PensionDetailLinked } from '../PensionDetailLinked';
import { PensionDetailSummaryWarnings } from '../PensionDetailSummaryWarnings';
import { PensionDetailType } from '../PensionDetailType';
import { PensionStatus } from '../PensionStatus';

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
      <div data-testid="detail-summary-intro">
        <div className="mb-6 lg:float-left lg:w-2/3 lg:mb-8 lg:pr-2 2xl:w-7/12 ">
          <PensionDetailIntro data={data} unavailableCode={unavailableCode} />
        </div>
        <div className="lg:float-right lg:w-1/3 lg:pl-4 2xl:w-5/12">
          {data.pensionStatus && (
            <PensionStatus data={data} detailStatus={true} />
          )}

          <PensionDetailType pensionType={data.pensionType} />

          <PensionDetailLinked data={data} />
        </div>
      </div>
      <div className="lg:clear-left lg:w-2/3 2xl:w-7/12 lg:pr-2">
        <PensionDetailSummaryWarnings illustration={benefitIllustration} />
        <PensionDetailIllustrationDate data={data} />
      </div>
    </section>
  );
};
