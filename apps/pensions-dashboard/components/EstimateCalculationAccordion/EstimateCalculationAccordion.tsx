import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { CalculationMethod, PensionType } from '../../lib/constants';
import { ChartIllustration } from '../../lib/types';

type EstimateCalculationAccordionProps = {
  illustration: ChartIllustration | undefined;
  calcType: PensionType;
};

export const EstimateCalculationAccordion = ({
  illustration,
  calcType,
}: EstimateCalculationAccordionProps) => {
  const { t } = useTranslation();

  const methodToUse: CalculationMethod =
    calcType === PensionType.AVC || calcType === PensionType.DC
      ? CalculationMethod.SMPI
      : CalculationMethod.BS;

  const illArray = [
    illustration?.ap?.calculationMethod,
    illustration?.eri?.calculationMethod,
  ];
  const showCalculationAccordion = illArray.includes(methodToUse);

  return (
    <ExpandableSection
      title={t(
        'pages.pension-details.information.how-estimate-is-calculated.title',
      )}
    >
      <div
        className="leading-[1.6] mb-6 lg:mb-6"
        data-testid="calculation-content"
      >
        <Markdown
          content={
            showCalculationAccordion
              ? t(
                  `pages.pension-details.information.how-estimate-is-calculated.${calcType.toLowerCase()}`,
                )
              : t('common.unavailable')
          }
        />
      </div>
    </ExpandableSection>
  );
};
