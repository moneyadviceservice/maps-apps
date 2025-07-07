import { PensionArrangement } from '../../lib/types';
import { AdditionalDataTable } from '../AdditionalDataTable';
import { OtherDetailsTable } from '../OtherDetailsTable';
import { PensionDetailAccordions } from '../PensionDetailAccordions';
import { PensionDetailIntro } from '../PensionDetailIntro';
import { PensionDetailsContactTable } from '../PensionDetailsContactTable';
import { PensionDetailsSection } from '../PensionDetailsSection';
import { PensionStatus } from '../PensionStatus';
import { PlanDetailsTable } from '../PlanDetailsTable';

type Props = {
  data: PensionArrangement;
  unavailableCode?: string;
};

export const DetailsPage = ({ data, unavailableCode }: Props) => {
  return (
    <>
      <div className="xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          <PensionDetailIntro data={data} unavailableCode={unavailableCode} />
          <PensionStatus data={data} />
          <PensionDetailAccordions data={data} />
        </div>
      </div>

      <PensionDetailsSection data={data} />
      <PlanDetailsTable data={data} />
      <OtherDetailsTable data={data} />
      <PensionDetailsContactTable data={data} />
      <AdditionalDataTable data={data} />
    </>
  );
};
