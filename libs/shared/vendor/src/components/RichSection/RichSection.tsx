import { H1 } from '@maps-react/common/components/Heading';
import { JsonRichText, mapJsonRichText } from '../../utils/RenderRichText';
import { RichTextAem } from '../../components/RichTextAem';
import { twMerge } from 'tailwind-merge';

export type RichSectionProps = {
  testId?: string;
  title?: string;
  content?: JsonRichText;
  richTextClasses?: string;
};

export const RichSection = ({
  testId,
  title,
  content,
  richTextClasses,
}: RichSectionProps) => {
  return (
    <div data-testid={testId}>
      {title && (
        <H1 className="mt-2 mb-6" data-testid="section-title">
          {title}
        </H1>
      )}
      {content && (
        <RichTextAem className={twMerge(richTextClasses)}>
          {mapJsonRichText(content.json)}
        </RichTextAem>
      )}
    </div>
  );
};
