import { summaryResultsChecklistData } from 'data/summaryResultsData';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const SummaryResultsChecklist = () => {
  const { t, tList } = useTranslation();

  const content = summaryResultsChecklistData({ t, tList });

  return (
    <div>
      {/* Title */}
      <H2 className="mb-8 text-blue-700">{content.title}</H2>

      {/* Accordion sections */}
      {content.sections.map((section) => (
        <ExpandableSection
          key={section.id}
          variant="mainLeftIcon"
          title={section.title}
        >
          {section.content.map((contentItem) => {
            if (contentItem.type === 'list') {
              return (
                <ListElement
                  key={contentItem.id}
                  variant="unordered"
                  color="dark"
                  items={contentItem.content}
                  className="pl-1 mb-4 list-inside"
                />
              );
            } else {
              return (
                <Markdown key={contentItem.id} content={contentItem.content} />
              );
            }
          })}
        </ExpandableSection>
      ))}
    </div>
  );
};
