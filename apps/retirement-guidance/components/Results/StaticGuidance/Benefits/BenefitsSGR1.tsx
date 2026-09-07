import { Markdown } from '@maps-react/vendor/components/Markdown';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

export const BenefitsSGR1 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.benefitsSGR1.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="retirement-benefits-section"
    >
      <Markdown
        content={t('results.staticGuidance.benefitsSGR1.paragraph1')}
        withIcon={false}
      />
      <Markdown
        content={t('results.staticGuidance.benefitsSGR1.paragraph2')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
