import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

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
      <Markdown
        content={t('results.staticGuidance.benefitsSGR1.paragraph3')}
        withIcon={false}
      />
      <Markdown
        content={t('results.staticGuidance.benefitsSGR1.paragraph4')}
        withIcon={false}
      />
      <ul className="mb-4 ml-6 list-disc">
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.benefitsSGR1.list1')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.benefitsSGR1.list2')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.benefitsSGR1.list3')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.benefitsSGR1.list4')}
        </li>
      </ul>
      <Markdown
        content={t('results.staticGuidance.benefitsSGR1.paragraph5')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
