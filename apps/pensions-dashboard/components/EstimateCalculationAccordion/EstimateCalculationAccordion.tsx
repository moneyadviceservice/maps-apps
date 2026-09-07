import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  BenefitType,
  CalculationMethod,
  PensionType,
} from '../../lib/constants';
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

  const methodMap: Partial<Record<PensionType, CalculationMethod>> = {
    [PensionType.AVC]: CalculationMethod.SMPI,
    [PensionType.DC]: CalculationMethod.SMPI,
    [PensionType.CB]: CalculationMethod.CBI,
  };

  const methodToUse =
    calcType === PensionType.CDC
      ? undefined
      : methodMap[calcType] ?? CalculationMethod.BS;

  const ap = illustration?.ap;
  const eri = illustration?.eri;

  const showCDCAccordion = [ap?.benefitType, eri?.benefitType].some(
    (type) => type === BenefitType.CDI || type === BenefitType.CDL,
  );

  const showCalculationAccordion =
    showCDCAccordion ||
    [ap?.calculationMethod, eri?.calculationMethod].includes(methodToUse);

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
              : t(
                  'pages.pension-details.information.how-estimate-is-calculated.missing',
                )
          }
        />
      </div>
    </ExpandableSection>
  );
};
