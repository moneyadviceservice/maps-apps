import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { ClaimingYourStatePension } from '../ClaimingYourStatePension';
import { PensionDetailIntro } from '../PensionDetailIntro';
import { PensionDetailStatePensionAccordion } from '../PensionDetailStatePensionAccordion';
import { PensionDetailStatePensionTable } from '../PensionDetailStatePensionTable';
import { StatePensionEstimatedIncome } from '../StatePensionEstimatedIncome';
import { StatePensionMessage } from '../StatePensionMessage';

type Props = {
  data: PensionArrangement;
  unavailableCode?: string;
};

export const DetailsPageSP = ({ data, unavailableCode }: Props) => {
  const { locale } = useTranslation();

  const narrowColClasses = 'xl:col-span-7 2xl:col-span-6';

  return (
    <div className={'xl:grid xl:grid-cols-10'}>
      <div className={narrowColClasses}>
        <PensionDetailIntro
          toolIntroClassName="text-lg leading-[1.5] md:text-2xl md:leading-10 mb-6 md:mb-12 mt-2"
          data={data}
          unavailableCode={unavailableCode}
        />
        <PensionDetailStatePensionAccordion data={data} />
      </div>

      <div className="col-span-10">
        <PensionDetailStatePensionTable data={data} />
      </div>

      <div className={narrowColClasses}>
        <StatePensionEstimatedIncome data={data} />
        <StatePensionMessage data={data} locale={locale} />
        <ClaimingYourStatePension />
      </div>
    </div>
  );
};
