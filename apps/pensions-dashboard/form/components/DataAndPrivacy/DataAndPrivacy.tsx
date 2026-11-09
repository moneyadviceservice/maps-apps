import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { FlowName, FORM_BASE_PATH, StepName } from '../../constants';

const markdownItems = (items: string[], testId: string) =>
  items.map((item, index) => (
    <Markdown
      key={`${testId}-${index}`}
      content={item}
      testId={`${testId}-${index}`}
    />
  ));

export const DataAndPrivacy: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;

  return (
    <div>
      <section className="flex flex-col gap-4" data-testid={`${step}-section`}>
        <Markdown content={t(`${contentKey}.intro`)} testId={`${step}-intro`} />
        <Markdown
          content={t(`${contentKey}.these-are`)}
          testId={`${step}-these-are`}
        />
        <ListElement
          items={markdownItems(
            tList(`${contentKey}.identifiers`),
            `${step}-identifier`,
          )}
          variant="unordered"
          color="blue"
          className="mb-2 ml-10"
          dataTestId={`${step}-identifiers`}
        />

        <Heading
          level="h2"
          className="mt-8 mb-2"
          data-testid={`${step}-research-heading`}
        >
          {t(`${contentKey}.research-heading`)}
        </Heading>
        {markdownItems(
          tList(`${contentKey}.research-paragraphs`),
          `${step}-research-paragraph`,
        )}
        <ListElement
          items={markdownItems(
            tList(`${contentKey}.research-list`),
            `${step}-research-item`,
          )}
          variant="unordered"
          color="blue"
          className="mb-2 ml-10"
          dataTestId={`${step}-research-list`}
        />
        <Markdown
          content={t(`${contentKey}.privacy-notice`)}
          testId={`${step}-privacy-notice`}
        />

        <Heading
          level="h2"
          className="mt-8 mb-2"
          data-testid={`${step}-removing-heading`}
        >
          {t(`${contentKey}.removing-heading`)}
        </Heading>
        <Markdown
          content={t(`${contentKey}.removing-intro`)}
          testId={`${step}-removing-intro`}
        />
        <ListElement
          items={markdownItems(
            tList(`${contentKey}.removing-list`),
            `${step}-removing-item`,
          )}
          variant="unordered"
          color="blue"
          className="mb-2 ml-10"
          dataTestId={`${step}-removing-list`}
        />
      </section>

      <FormWrapper
        step={step}
        nextStep={StepName.AGREEMENT_AND_CONSENT}
        className="pt-0 md:pt-0"
      >
        {/* Required for the form to function */}
        <input type="hidden" name="flow" value={FlowName.BASE} />
      </FormWrapper>
    </div>
  );
};
