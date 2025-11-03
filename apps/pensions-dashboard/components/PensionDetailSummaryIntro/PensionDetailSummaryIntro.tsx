import { twMerge } from 'tailwind-merge';

import { PensionArrangement } from '../../lib/types';
import { PensionDetailIntro } from '../PensionDetailIntro';
import { PensionDetailType } from '../PensionDetailType';
import { PensionStatus } from '../PensionStatus';

type PensionDetailSummaryIntroProps = {
  data: PensionArrangement;
  unavailableCode?: string;
};

export const PensionDetailSummaryIntro = ({
  data,
  unavailableCode,
}: PensionDetailSummaryIntroProps) => {
  const borderClasses =
    'border-2 border-slate-400 rounded-bl-2xl text-lg md:text-xl font-bold mb-6 py-3';

  return (
    <div
      data-testid="detail-summary-intro"
      className="mb-6 lg:mb-8 lg:gap-6 lg:grid lg:grid-cols-12"
    >
      <div className="lg:col-span-8 2xl:col-span-7">
        <PensionDetailIntro data={data} unavailableCode={unavailableCode} />
      </div>
      <div className="lg:col-span-4 2xl:col-span-5">
        {data.pensionStatus && (
          <PensionStatus
            data={data}
            showShortText
            className={twMerge(borderClasses)}
            iconClassName="w-[18px] h-[18px]"
            showTooltip
          />
        )}

        <PensionDetailType data={data} />
      </div>
    </div>
  );
};
