import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H6 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const DeathBenefitsSGR5 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.deathBenefitsSGR5.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="death-benefits-sgr5-section"
      contentId="death-benefits-sgr5-content"
    >
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph1')}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph2')}
        withIcon={false}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph3')}
      />
      <ul className="mb-4 ml-6 list-disc">
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.deathBenefitsSGR5.list1')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.deathBenefitsSGR5.list2')}
        </li>
      </ul>
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph4')}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph5')}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph6')}
        withIcon={false}
      />
      <H6 className="mt-2 mb-2">
        {t('results.staticGuidance.deathBenefitsSGR5.subHeading')}
      </H6>
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph7')}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph8')}
      />
      <Markdown
        content={t('results.staticGuidance.deathBenefitsSGR5.paragraph9')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
