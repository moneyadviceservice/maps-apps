import { Heading, ListElement } from '@maps-digital/shared/ui';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export type SectionsRendererProps = {
  title?: string;
  content?: string;
  items?: string[];
  footer?: string;
};

export const SectionsRenderer = ({
  sections,
  testIdPrefix,
}: {
  sections: SectionsRendererProps[];
  testIdPrefix: string;
}) => (
  <>
    {sections.map((section, idx) => (
      <section key={idx} className="flex flex-col gap-4">
        {section.title && (
          <Heading
            level="h3"
            component="h2"
            data-testid={`components-${testIdPrefix}-title-${idx}`}
          >
            {section.title}
          </Heading>
        )}
        {section.content && (
          <Markdown content={section.content} className="mb-2" />
        )}
        {section.items && (
          <ListElement
            items={section.items.map((item: string) => (
              <Markdown key={item.slice(0, 8)} content={item} />
            ))}
            variant="unordered"
            color="blue"
            className="mb-2 ml-8"
            data-testid={`${testIdPrefix}-list-${idx}`}
          />
        )}
        {section.footer && (
          <Paragraph testId={`components-${testIdPrefix}-footer-${idx}`}>
            {section.footer}
          </Paragraph>
        )}
      </section>
    ))}
  </>
);
