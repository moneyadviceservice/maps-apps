import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';

export type SupportCategory = {
  title: string;
  description: string;
  cy_title: string;
  cy_description: string;
  faqs: SupportFaq[];
};

export type SupportFaq = {
  title: string;
  content: JsonRichText;
  cy_title: string;
  cy_content: JsonRichText;
};

export type SupportFaqListProps = {
  faqs: SupportFaq[];
  locale?: string;
  className?: string;
};

export const SupportFaqList = ({
  faqs,
  locale = 'en',
  className,
}: SupportFaqListProps) => {
  return (
    <div className={className}>
      {faqs.map((faq) => {
        const title = locale === 'cy' ? faq.cy_title : faq.title;
        const content = locale === 'cy' ? faq.cy_content : faq.content;

        return (
          <div key={faq.title}>
            <ExpandableSection title={title} variant="mainLeftIcon">
              <RichTextAem>{mapJsonRichText(content.json)}</RichTextAem>
            </ExpandableSection>
          </div>
        );
      })}
    </div>
  );
};
