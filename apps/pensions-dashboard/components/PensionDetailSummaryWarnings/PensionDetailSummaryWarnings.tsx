import { twMerge } from 'tailwind-merge';

import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
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
  className?: string;
};

export const PensionDetailSummaryWarnings = ({
  className,
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

  const hasMcCloud = data.hasMultipleIncomeOptions;
  const isCDC = data.pensionType === PensionType.CDC;
  const isCashBalanceLump =
    data.benefitIllustrations
      ?.flatMap((illustration) => illustration.illustrationComponents)
      .some((component) => component.benefitType === BenefitType.CBL) ?? false;
  const isVAR = data.pensionType === PensionType.VAR;

  if (
    warnings.length === 0 &&
    !isDBwithAVC &&
    !hasMcCloud &&
    !isCDC &&
    !isCashBalanceLump &&
    !isVAR
  ) {
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

  if (isCDC) {
    filteredWarnings.unshift('CDC');
  }

  if (hasMcCloud) {
    filteredWarnings.unshift('MCCLOUD');
  }

  if (isCashBalanceLump) {
    filteredWarnings.unshift('CBLUMP');
  }

  if (isVAR) {
    filteredWarnings.unshift('VAR');
  }

  return (
    <div data-testid="warnings" className={twMerge('mb-10', className)}>
      {filteredWarnings.map((warning, index) => (
        <Callout
          testId={`warning-${warning}`}
          key={index}
          className="mb-6 lg:mb-8 lg:px-8"
        >
          <Heading
            level="h4"
            component="h3"
            data-testid={`warning-title-${warning}`}
          >
            {t(`data/warnings.${warning}-title`)}
          </Heading>
          <div className="flex mt-4 lg:mt-6">
            <div className="w-[24px] h-[24px] mr-2 lg:w-[30px] lg:h-[30px] lg:mr-4 lg:mt-2">
              <Icon
                type={IconType.WARNING_SQUARE}
                className="text-blue-700 w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]"
              />
            </div>
            <div className="[&>p:last-of-type]:mb-0">
              <Markdown
                testId={`warning-description-${warning}`}
                className="mb-4 leading-[1.6]"
                content={t(`data/warnings.${warning}-description`)}
              />
            </div>
          </div>
        </Callout>
      ))}
    </div>
  );
};
