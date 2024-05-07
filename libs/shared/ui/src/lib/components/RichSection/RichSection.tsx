import { H2 } from '../../components/Heading';
import { JsonRichText, mapJsonRichText } from '../../utils/RenderRichText';
import { RichTextAem } from '../../components/RichTextAem';

export type RichSectionProps = {
  testId?: string;
  title?: string;
  content?: JsonRichText;
};

export const RichSection = ({ testId, title, content }: RichSectionProps) => {
  return (
    <div data-testid={testId}>
      {title && (
        <H2 className="mt-2 mb-6" data-testid="section-title">
          {title}
        </H2>
      )}
      {content && <RichTextAem>{mapJsonRichText(content.json)}</RichTextAem>}
    </div>
  );
};
