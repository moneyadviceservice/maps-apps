import { Markdown } from '@maps-react/vendor/components/Markdown';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

export const DeathBenefitsSGR4 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.deathBenefitsSGR4.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="death-benefits-sgr4-section"
      contentId="death-benefits-sgr4-content"
    >
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR4.paragraph1')}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR4.paragraph2')}
        withIcon={false}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR4.paragraph3')}
      />
      <ul className="mb-4 ml-6 list-disc">
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.deathBenefitsSGR4.list1')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.deathBenefitsSGR4.list2')}
        </li>
      </ul>
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR4.paragraph4')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
