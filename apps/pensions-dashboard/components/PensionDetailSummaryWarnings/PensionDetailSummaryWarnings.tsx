import { Callout } from '@maps-react/common/components/Callout';
import { H4 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';

type DetailsSummaryValues = {
  warnings: IllustrationWarning[] | undefined;
};

export const PensionDetailSummaryWarnings = ({
  warnings,
}: DetailsSummaryValues) => {
  const { t } = useTranslation();
  if (!warnings || warnings.length === 0) {
    return null;
  }

  const warningsToFind = [
    IllustrationWarning.PSO,
    IllustrationWarning.PEO,
    IllustrationWarning.PNR,
    IllustrationWarning.SCP,
    IllustrationWarning.FAS,
  ];

  const filteredWarnings = Array.from(
    new Set(warnings.filter((warning) => warningsToFind.includes(warning))),
  );

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
  );
};
