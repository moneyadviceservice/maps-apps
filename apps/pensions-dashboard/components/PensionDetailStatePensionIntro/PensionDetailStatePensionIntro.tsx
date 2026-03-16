import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { currencyAmount, formatDate } from '../../lib/utils/ui';
type PensionDetailStatePensionIntroProps = {
  data: PensionArrangement | null;
};

export const PensionDetailStatePensionIntro = ({
  data,
}: PensionDetailStatePensionIntroProps) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const { detailData } = data;

  if (detailData?.monthlyAmount === undefined || !detailData?.retirementDate) {
    return null;
  }

  const summaryContent = (() => {
    return (
      <Markdown
        content={t(`pages.pension-details.toolIntro.estimate-SP`, {
          type: t(`data.pensions.types.SP`),
          monthly: currencyAmount(detailData.monthlyAmount) ?? `£${NO_DATA}`,
          date: formatDate(detailData.retirementDate),
          tooltip: t('tooltips.state-pension-age'),
        })}
      />
    );
  })();

  return (
    <ToolIntro className="text-lg leading-[1.5] md:text-2xl md:leading-10 mb-6 md:mb-12 mt-2 [&_p]:mb-6 md:[&_p]:mb-10">
      {summaryContent}
    </ToolIntro>
  );
};
