import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const Divorce17 = () => {
  const { t, tList } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.variableGuidance.divorce17.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="divorce-17-section"
      contentId="divorce-17-content"
    >
      <Markdown content={t('results.variableGuidance.divorce17.paragraph1')} />
      <Markdown content={t('results.variableGuidance.divorce17.paragraph2')} />
      <Markdown content={t('results.variableGuidance.divorce17.paragraph3')} />
      <ListElement
        items={tList('results.variableGuidance.divorce17.list1')}
        color="dark"
        variant="unordered"
        className="mb-4 list-inside"
        dataTestId="divorce-17-list-1"
      />
      <Markdown content={t('results.variableGuidance.divorce17.paragraph4')} />
      <Markdown
        content={t('results.variableGuidance.divorce17.paragraph5')}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
