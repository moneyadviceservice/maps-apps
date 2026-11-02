import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { hasAvailableSummaryValue } from '../../lib/utils/data';
import { PensionDetailHeading } from '../PensionDetailHeading';
import { PensionDetailIntro } from '../PensionDetailIntro';
import { PensionDetailLinked } from '../PensionDetailLinked';
import { PensionDetailSummaryWarnings } from '../PensionDetailSummaryWarnings';
import { PensionDetailType } from '../PensionDetailType';
import { PensionDetailValuesAccordion } from '../PensionDetailValuesAccordion';
import { PensionStatus } from '../PensionStatus';
import { PotValue } from '../PotValue';

type DetailsSummaryValues = {
  data: PensionArrangement;
};

export const PensionDetailSummary = ({ data }: DetailsSummaryValues) => {
  const { t } = useTranslation();
  const showValuesAccordion = hasAvailableSummaryValue(data);

  return (
    <section>
      <PensionDetailHeading title={t('pages.pension-details.header.summary')} />
      <div data-testid="detail-summary-intro" className="mt-10 md:mt-12">
        <div className="mb-6 lg:float-left lg:w-2/3 lg:pr-2 2xl:w-7/12">
          <PensionDetailIntro data={data} />
        </div>
        <div className="lg:float-right lg:w-1/3 lg:pl-4 2xl:w-5/12">
          <PotValue data={data} />

          {data.pensionStatus && (
            <PensionStatus data={data} detailStatus={true} />
          )}

          {data.pensionType && (
            <PensionDetailType pensionType={data.pensionType} />
          )}

          <PensionDetailLinked data={data} />
        </div>
      </div>
      <div className="lg:clear-left lg:w-2/3 2xl:w-7/12 lg:pr-2">
        {showValuesAccordion && (
          <PensionDetailValuesAccordion
            contentKey="summary"
            testId="value-illustration-date-accordion"
          />
        )}
        <PensionDetailSummaryWarnings data={data} />
      </div>
    </section>
  );
};
