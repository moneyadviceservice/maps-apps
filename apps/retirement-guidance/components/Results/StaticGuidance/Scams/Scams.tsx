import { Markdown } from '@maps-react/vendor/components/Markdown';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

export const ScamsSGR6 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.scamsSGR6.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="scams-sgr6-section"
      contentId="scams-sgr6-content"
    >
      <Markdown content={t('results.staticGuidance.scamsSGR6.paragraph1')} />
      <Markdown content={t('results.staticGuidance.scamsSGR6.paragraph2')} />
      <Markdown
        content={t('results.staticGuidance.scamsSGR6.paragraph3')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
