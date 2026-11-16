import { twMerge } from 'tailwind-merge';

import { H2 } from '@maps-react/common/index';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText, Node } from '@maps-react/vendor/utils/RenderRichText';

import { RichTextWrapper } from '../RichTextWrapper';

export interface PageSection {
  header: {
    text: string;
    id: string;
  };
  json: Node[];
}

export const SectionPageWithLinks = ({
  sections,
}: {
  sections: PageSection[];
}) => {
  return (
    <div data-testid="section" className="mt-6 lg:mt-10">
      {sections.map((section) => {
        const sections = section.json.map((s, i) => {
          const table = s.nodeType === 'table';
          return (
            <RichTextAem
              key={`${s.nodeType}${i}`}
              className={twMerge(table ? 'overflow-x-scroll' : '')}
            >
              {mapJsonRichText([s])}
            </RichTextAem>
          );
        });

        return (
          <RichTextWrapper key={section.header.id}>
            <H2 level="h2" id={section.header.id} className="mb-4">
              {section.header.text}
            </H2>
            {sections}
          </RichTextWrapper>
        );
      })}
    </div>
  );
};
