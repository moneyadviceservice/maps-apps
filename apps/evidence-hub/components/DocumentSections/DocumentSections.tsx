import { BackToTop } from 'components/BackToTop/BackToTop';

import { H2 } from '@maps-react/common/index';
import { mapJsonRichText, Node } from '@maps-react/vendor/utils/RenderRichText';

import { RichTextWrapper } from '../RichTextWrapper';

export interface Section {
  header: {
    text: string;
    id: string;
  };
  json: Node[];
}

export const DocumentSections = ({ sections }: { sections: Section[] }) => {
  return (
    <div data-testid="section" className="mt-6 lg:mt-10">
      {sections?.map((sec) => {
        const sections = sec.json.map((s) => mapJsonRichText([s]));

        return (
          <>
            <RichTextWrapper key={sec.header.id}>
              <H2 level="h2" id={sec.header.id} className="mb-4">
                {sec.header.text}
              </H2>
              {sections}
            </RichTextWrapper>
            <div className="flex justify-start justify-items-start mb-4">
              <BackToTop />
            </div>
          </>
        );
      })}
    </div>
  );
};
