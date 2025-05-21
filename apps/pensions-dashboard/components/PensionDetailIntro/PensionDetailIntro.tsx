import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { IllustrationType, NO_DATA, PensionGroup } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  filterUnavailableCode,
  getLatestIllustration,
  getMonthlyAmount,
  getMostRecentBenefitIllustration,
  getPotValue,
  getRetirementDate,
  toLowerCaseFirstChar,
} from '../../lib/utils';

type PensionDetailIntroProps = {
  data: PensionArrangement | null;
  unavailableCode?: string;
};

export const PensionDetailIntro = ({
  data,
  unavailableCode,
}: PensionDetailIntroProps) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const latest = getMostRecentBenefitIllustration(data.benefitIllustrations);
  const eriIllustration = getLatestIllustration(IllustrationType.ERI, data);

  const pensionTypeMessage = t(`data.pensions.types.${data.pensionType}`);
  const noEstimateReasonMessage = t(
    `data.pensions.unavailable-reasons.${filterUnavailableCode(
      data.matchType,
      unavailableCode,
    )}`,
    {
      pensionProvider: data.pensionAdministrator?.name,
    },
  );

  const summaryContent = (() => {
    switch (data.group) {
      case PensionGroup.GREEN:
        return getRetirementDate(data) !== NO_DATA ||
          getMonthlyAmount(eriIllustration) ? (
          <Markdown
            content={t(
              `pages.pension-details.toolIntro.estimate-${data.pensionType}`,
              {
                type: pensionTypeMessage,
                pot: getPotValue(latest, IllustrationType.AP) ?? NO_DATA,
                monthly: getMonthlyAmount(eriIllustration) ?? `£${NO_DATA}`,
                date: getRetirementDate(data) ?? NO_DATA,
              },
            )}
          />
        ) : null;

      case PensionGroup.GREEN_NO_INCOME:
      case PensionGroup.YELLOW:
        return unavailableCode === 'WU' ? (
          <Markdown
            content={t(`pages.pension-details.toolIntro.no-estimate-wu`, {
              type: pensionTypeMessage,
              reason: noEstimateReasonMessage,
            })}
          />
        ) : (
          <Markdown
            content={t(`pages.pension-details.toolIntro.no-estimate`, {
              type: pensionTypeMessage,
              reason: toLowerCaseFirstChar(noEstimateReasonMessage),
            })}
          />
        );

      default:
        return null;
    }
  })();

  if (!summaryContent) {
    return null;
  }

  return <ToolIntro className="mb-10">{summaryContent}</ToolIntro>;
};
