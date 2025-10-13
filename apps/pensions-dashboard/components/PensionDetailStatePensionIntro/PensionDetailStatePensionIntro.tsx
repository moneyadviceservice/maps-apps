import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { IllustrationType, NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  getLatestIllustration,
  getMonthlyAmount,
  getRetirementDate,
} from '../../lib/utils';
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

  const eriIllustration = getLatestIllustration(IllustrationType.ERI, data);

  const pensionTypeMessage = t(`data.pensions.types.SP`);

  if (
    getMonthlyAmount(eriIllustration) === undefined ||
    getRetirementDate(data) === NO_DATA
  ) {
    return null;
  }

  const summaryContent = (() => {
    return (
      <Markdown
        content={t(`pages.pension-details.toolIntro.estimate-SP`, {
          type: pensionTypeMessage,
          monthly: getMonthlyAmount(eriIllustration) ?? `£${NO_DATA}`,
          date: getRetirementDate(data) ?? NO_DATA,
          tooltip: t('tooltips.state-pension-age'),
        })}
      />
    );
  })();

  return (
    <ToolIntro className="text-lg leading-[1.5] md:text-2xl md:leading-10 mb-6 md:mb-12 mt-2">
      {summaryContent}
    </ToolIntro>
  );
};
