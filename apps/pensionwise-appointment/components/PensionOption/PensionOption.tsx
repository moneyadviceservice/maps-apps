import { twMerge } from 'tailwind-merge';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H1, H3 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import {
  EmbeddedTool,
  EmbeddedToolData,
} from '@maps-react/core/components/EmbeddedTool';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { QuestionForm } from '@maps-react/pwd/components/QuestionForm';
import { QuestionModel } from '@maps-react/pwd/layouts/PensionwisePageLayout';
import {
  RichTextAem,
  VariantType,
} from '@maps-react/vendor/components/RichTextAem';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';

type Expand = {
  title: string;
  content: JsonRichText;
};

export type PensionOptionData = {
  id: number;
  title: string;
  toolIntro?: JsonRichText;
  suitableCallout?: JsonRichText;
  unsuitableCallout?: JsonRichText;
  keyFactsTitle: string;
  keyFactsText: JsonRichText;
  warningCallout?: JsonRichText;
  expandableSectionsTitle?: string;
  expandableSection?: Expand[];
  question: QuestionModel;
  embeddedTool?: EmbeddedToolData;
};

export type PensionOptionProps = {
  data: PensionOptionData;
  query: Record<string, string>;
  testId?: string;
};

export const PensionOption = ({
  data,
  query,
  testId = 'pension-option',
}: PensionOptionProps) => {
  const {
    title,
    toolIntro,
    suitableCallout,
    unsuitableCallout,
    keyFactsTitle,
    keyFactsText,
    warningCallout,
    question,
    expandableSectionsTitle,
    expandableSection,
    embeddedTool,
  } = data;

  const calloutGrid =
    suitableCallout?.json &&
    unsuitableCallout?.json &&
    'md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2';

  const { z } = useTranslation();

  return (
    <div data-testid={testId}>
      <H1 className="mt-2 mb-14" data-testid="section-title">
        {title}
      </H1>

      {toolIntro?.json && (
        <ToolIntro className="mb-10">
          {mapJsonRichText(toolIntro.json)}
        </ToolIntro>
      )}

      {(suitableCallout?.json || unsuitableCallout?.json) && (
        <div
          className={twMerge(
            `grid grid-cols-1 items-start gap-8 mb-8`,
            calloutGrid,
          )}
        >
          {suitableCallout?.json && (
            <Callout variant={CalloutVariant.POSITIVE}>
              <RichTextAem
                listVariant={VariantType.POSITIVE}
                className="[&_h3]:mt-0 [&_h3]:md:text-lg"
              >
                {mapJsonRichText(suitableCallout.json)}
              </RichTextAem>
            </Callout>
          )}
          {unsuitableCallout?.json && (
            <Callout variant={CalloutVariant.NEGATIVE}>
              <RichTextAem
                listVariant={VariantType.NEGATIVE}
                className="[&_h3]:mt-0 [&_h3]:md:text-lg"
              >
                {mapJsonRichText(unsuitableCallout.json)}
              </RichTextAem>
            </Callout>
          )}
        </div>
      )}

      <H3 className="mb-6" data-testid="key-facts-title">
        {keyFactsTitle}
      </H3>

      <RichTextAem className="mb-8 [&_ul>li]:mb-2" testId="key-facts">
        {mapJsonRichText(keyFactsText.json)}
      </RichTextAem>

      {warningCallout?.json && (
        <div className="mb-8">
          <Callout variant={CalloutVariant.WARNING}>
            <RichTextAem className="[&_h3]:mt-0 [&_h3]:md:text-lg">
              {mapJsonRichText(warningCallout.json)}
            </RichTextAem>
          </Callout>
        </div>
      )}

      {embeddedTool && (
        <>
          <H3 className="mb-6" data-testid="calculator-title">
            {z({ en: 'Calculator', cy: 'Cyfrifiannell' })}
          </H3>

          <Paragraph className="mb-6">
            {z({
              en: `Results are guides only and won't be saved. We don't store your data.`,
              cy: `Canllawiau yn unig yw'r canlyniadau ac ni fyddant yn cael eu harbed. Nid ydym yn storio eich data.`,
            })}
          </Paragraph>

          <EmbeddedTool
            toolData={embeddedTool}
            testId={'tool-iframe-' + embeddedTool.id}
            classes="mb-12"
          />
        </>
      )}

      {expandableSectionsTitle && expandableSection && (
        <>
          <H3 className="mb-4" data-testid="more-info-title">
            {expandableSectionsTitle}
          </H3>

          {expandableSection.map((section, idx) => {
            return (
              <ExpandableSection
                title={section.title}
                variant="mainLeftIcon"
                key={idx}
              >
                <RichTextAem>
                  {mapJsonRichText(section.content.json)}
                </RichTextAem>
              </ExpandableSection>
            );
          })}
        </>
      )}

      <QuestionForm
        data={{
          ...question,
          taskId: query?.['task'],
          footerForm: true,
        }}
        query={query}
        formAction="/api/submit-options"
        saveReturnLink
      />
    </div>
  );
};
