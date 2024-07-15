import { useTranslation } from '@maps-digital/shared/hooks';
import { twMerge } from 'tailwind-merge';
import { mapJsonRichText } from '../../utils/RenderRichText';
import { Button } from '../../components/Button';
import { Errors } from '../../components/Errors';
import { ExpandableSection } from '../../components/ExpandableSection';
import { H2, H3 } from '../../components/Heading';
import { QuestionModel } from '../../layouts/PensionwisePageLayout';
import { QuestionRadioButton } from '../../components/QuestionRadioButton';
import { SaveReturnLink } from '../../components/SaveReturnLink';

export type QuestionFormProps = {
  testId?: string;
  data: QuestionModel;
  formAction: string;
  saveReturnLink?: boolean;
  query: Record<string, string>;
};

export const QuestionForm = ({
  testId,
  formAction,
  saveReturnLink = false,
  query,
  data: {
    id,
    taskId,
    footerForm,
    options,
    questionCounter,
    title,
    definition,
    errorText,
    moreInfoLabel,
    moreInfoText,
  },
}: QuestionFormProps) => {
  const { z } = useTranslation();
  const { language, error, ...newQuery } = query;

  const PREFIX = 'q';
  const TASK_PREFIX = 't';

  const OPTIONS = options.map((option, index) => {
    return {
      text: option?.toString() || '',
      value: `${index}`,
    };
  });

  const isTaskPage = +query[`task`];
  const task = isTaskPage
    ? `${TASK_PREFIX}${taskId}${PREFIX}${id}`
    : `${PREFIX}${id}`;

  const defaultChecked = `${+query[task] - 1}`;
  const defaultValue = task;

  return (
    <form
      data-testid={testId}
      method="POST"
      noValidate
      className={twMerge(
        footerForm && 'mt-10 py-8 border-t-4 border-b-4 border-blue-800',
      )}
    >
      <input type="HIDDEN" name="question" defaultValue={defaultValue} />
      <input type="HIDDEN" name="language" defaultValue={language} />
      <input type="HIDDEN" name="task" defaultValue={taskId} />
      <input type="HIDDEN" name="status" defaultValue="4" />

      {questionCounter && (
        <span className="text-xl text-gray-400 font-normal">
          {questionCounter}
        </span>
      )}
      <fieldset
        {...((definition?.json || error) && {
          'aria-describedby': `${definition?.json ? 'question-hint' : ''} ${
            error ? 'question-error' : ''
          }`,
        })}
      >
        <legend>
          {footerForm ? (
            <H3
              className="mb-3"
              color="text-blue-800"
              data-testid="section-title-footer"
            >
              {title}
            </H3>
          ) : (
            <H2 className="mt-2 mb-6" data-testid="section-title">
              {title}
            </H2>
          )}
        </legend>

        {definition?.json && (
          <span className="text-gray-400" id="question-hint">
            {mapJsonRichText(definition.json)}
          </span>
        )}

        <Errors errors={error ? [error] : []}>
          {error && (
            <div id="question-error" className="text-red-700">
              {errorText}
            </div>
          )}
          <QuestionRadioButton
            name="answer"
            options={OPTIONS}
            defaultChecked={defaultChecked}
          />
        </Errors>
      </fieldset>

      {moreInfoLabel && moreInfoText?.json && (
        <div className="mt-8">
          <ExpandableSection title={moreInfoLabel}>
            {mapJsonRichText(moreInfoText.json)}
          </ExpandableSection>
        </div>
      )}

      <div className="md:flex mt-8">
        <Button
          className="w-full md:w-auto"
          formAction={formAction}
          data-testid="continue"
        >
          {z({
            en: 'Continue',
            cy: 'Parhau',
          })}
        </Button>
        {saveReturnLink && (
          <SaveReturnLink
            href={{
              pathname: `/${language}/${process.env.appUrl}/save`,
              query: newQuery,
            }}
            className="ml-0 md:ml-4 mt-6 md:mt-0 w-full md:w-auto"
          />
        )}
      </div>
    </form>
  );
};
