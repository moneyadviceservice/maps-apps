import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { CalculationMethod, PensionType } from '../../lib/constants';
import { BenefitIllustration } from '../../lib/types';

type EstimateCalculationAccordionProps = {
  illustration: BenefitIllustration | null;
  pensionType: PensionType;
};

export const EstimateCalculationAccordion = ({
  illustration,
  pensionType,
}: EstimateCalculationAccordionProps) => {
  const { t } = useTranslation();

  const methodToUse: CalculationMethod =
    pensionType === PensionType.DC
      ? CalculationMethod.SMPI
      : CalculationMethod.BS;

  const showCalculationAccordion = illustration?.illustrationComponents.some(
    (component) => component.calculationMethod === methodToUse,
  );

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
                  `pages.pension-details.information.how-estimate-is-calculated.${pensionType.toLowerCase()}`,
                )
              : t('common.no-data')
          }
        />
      </div>
    </ExpandableSection>
  );
};
