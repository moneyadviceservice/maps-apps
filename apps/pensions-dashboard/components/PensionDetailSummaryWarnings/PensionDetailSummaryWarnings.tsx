import { Callout } from '@maps-react/common/components/Callout';
import { H4 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  BenefitType,
  IllustrationWarning,
  PensionType,
} from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type DetailsSummaryValues = {
  data: PensionArrangement;
};

export const PensionDetailSummaryWarnings = ({
  data,
}: DetailsSummaryValues) => {
  const { t } = useTranslation();
  const warnings = data.detailData?.warnings ?? [];
  const isDBwithAVC =
    data.pensionType === PensionType.DB &&
    data.hasMultipleTranches &&
    data.benefitIllustrations
      ?.flatMap((illustration) => illustration.illustrationComponents)
      .some((component) => component.benefitType === BenefitType.AVC);

  if (warnings.length === 0 && !isDBwithAVC) {
    return null;
  }

  const warningsToFind = [
    IllustrationWarning.PSO,
    IllustrationWarning.PEO,
    IllustrationWarning.PNR,
    IllustrationWarning.SCP,
    IllustrationWarning.FAS,
  ];

  const filteredWarnings: string[] = Array.from(
    new Set(warnings.filter((warning) => warningsToFind.includes(warning))),
  );

  if (isDBwithAVC) {
    filteredWarnings.unshift('DBAVC');
  }

  return (
    <div data-testid="warnings" className="mb-10">
      {filteredWarnings.map((warning, index) => (
        <Callout
          testId={`warning-${warning}`}
          key={index}
          className="mb-6 lg:mb-8 lg:px-8"
        >
          <H4 data-testid={`warning-title-${warning}`}>
            {t(`data.pensions.warnings.${warning}-title`)}
          </H4>
          <div className="flex mt-4 lg:mt-6">
            <div className="w-[24px] h-[24px] mr-2 lg:w-[30px] lg:h-[30px] lg:mr-4 lg:mt-2">
              <Icon
                type={IconType.WARNING_SQUARE}
                className="text-blue-700 w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]"
              />
            </div>
            <Markdown
              testId={`warning-description-${warning}`}
              className="mb-0 leading-[1.6]"
              content={t(`data.pensions.warnings.${warning}-description`)}
            />
          </div>
        </Callout>
      ))}
    </div>
  );
};
