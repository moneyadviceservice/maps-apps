import { Callout } from '@maps-react/common/components/Callout';
import { H4 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { BenefitIllustration } from '../../lib/types';

type DetailsSummaryValues = {
  illustration: BenefitIllustration | null;
};

export const PensionDetailSummaryWarnings = ({
  illustration,
}: DetailsSummaryValues) => {
  const { t } = useTranslation();
  if (!illustration) {
    return null;
  }

  const warningsToFind = [
    IllustrationWarning.PSO,
    IllustrationWarning.PEO,
    IllustrationWarning.PNR,
    IllustrationWarning.SCP,
    IllustrationWarning.FAS,
  ];

  const warnings = Array.from(
    new Set(
      illustration.illustrationComponents
        .flatMap((component) => component.illustrationWarnings || [])
        .filter((warning) => warningsToFind.includes(warning)),
    ),
  );

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="warnings"
      className="mb-10 lg:grid lg:grid-cols-12 lg:gap-6"
    >
      <div className="lg:col-span-8 2xl:col-span-7">
        {warnings.map((warning, index) => (
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
              <Paragraph
                testId={`warning-description-${warning}`}
                className="mb-0 leading-[1.6]"
              >
                {t(`data.pensions.warnings.${warning}-description`)}
              </Paragraph>
            </div>
          </Callout>
        ))}
      </div>
    </div>
  );
};
