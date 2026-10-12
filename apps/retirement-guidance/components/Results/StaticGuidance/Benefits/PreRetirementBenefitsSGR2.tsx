import { Markdown } from '@maps-react/vendor/components/Markdown';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

export const PreRetirementBenefitsSGR2 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.preRetirementBenefitsSGR2.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="retirement-pre-benefits-section"
      contentId="pre-retirement-benefits-content"
    >
      <Markdown
        content={t(
          'results.staticGuidance.preRetirementBenefitsSGR2.paragraph1',
        )}
        withIcon={false}
      />
      <Markdown
        content={t(
          'results.staticGuidance.preRetirementBenefitsSGR2.paragraph2',
        )}
        withIcon={false}
      />
      <Markdown
        content={t(
          'results.staticGuidance.preRetirementBenefitsSGR2.paragraph3',
        )}
      />
      <ul className="mb-4 ml-6 list-disc">
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.preRetirementBenefitsSGR2.list1')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.preRetirementBenefitsSGR2.list2')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.preRetirementBenefitsSGR2.list3')}
        </li>
        <li className="mt-1 mb-1">
          {t('results.staticGuidance.preRetirementBenefitsSGR2.list4')}
        </li>
      </ul>
      <Markdown
        content={t(
          'results.staticGuidance.preRetirementBenefitsSGR2.paragraph4',
        )}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
