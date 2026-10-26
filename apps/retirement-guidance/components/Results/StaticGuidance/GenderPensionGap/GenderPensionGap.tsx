import { Markdown } from '@maps-react/vendor/components/Markdown';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

export const GenderPensionGapSGR3 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.genderPensionGapSGR3.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="gender-pension-gap-sgr3-section"
      contentId="gender-pension-gap-sgr3-content"
    >
      <Markdown
        content={t('results.staticGuidance.genderPensionGapSGR3.paragraph1')}
      />
      <Markdown
        content={t('results.staticGuidance.genderPensionGapSGR3.paragraph2')}
      />
      <Markdown
        content={t('results.staticGuidance.genderPensionGapSGR3.paragraph3')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
