import {
  QuestionForm,
  H2,
  H3,
  ToolIntro,
  QuestionModel,
  JsonRichText,
  mapJsonRichText,
  ExpandableSection,
  Callout,
  CalloutVariant,
  RichTextAem,
  VariantType,
} from '@maps-digital/shared/ui';
import classNames from 'classnames';

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
  } = data;

  const calloutGrid =
    suitableCallout?.json &&
    unsuitableCallout?.json &&
    'md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2';

  return (
    <div data-testid={testId}>
      <H2 className="mt-2 mb-14" data-testid="section-title">
        {title}
      </H2>

      {toolIntro?.json && (
        <ToolIntro className="mb-10">
          {mapJsonRichText(toolIntro.json)}
        </ToolIntro>
      )}

      {(suitableCallout?.json || unsuitableCallout?.json) && (
        <div
          className={classNames(
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
