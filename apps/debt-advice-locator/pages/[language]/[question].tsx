import { useEffect } from 'react';

import { QUESTION_PREFIX, SUBMIT_ANSWER_API } from 'CONSTANTS';
import { debtAdviceLocatorAnalytics } from 'data/form-content/analytics';
import { debtAdviceLocatorErrorMessages } from 'data/form-content/errors';
import { debtAdviceLocatorQuestions } from 'data/form-content/questions';
import { questionHelp } from 'data/form-content/text/debt-advice-locator';

import { Analytics } from '@maps-react/core/components/Analytics';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Questions } from '@maps-react/form/components/Questions';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import DebtAdviceLocator, {
  DebtAdviceLocatorIndex,
  getServerSidePropsDefault,
} from '.';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: DebtAdviceLocatorIndex;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const { z } = useTranslation();
  const { z: enTranslation } = useTranslation('en');

  const { addEvent } = useAnalytics();

  const errors = debtAdviceLocatorErrorMessages(z);
  const currentError = errors.find((error) => error.question === currentStep);
  const helpSection = questionHelp(z)[currentStep as number];

  const qs = debtAdviceLocatorQuestions(z);
  const qsEnTranslationErrors = debtAdviceLocatorErrorMessages(enTranslation);
  const currentErrorEn = qsEnTranslationErrors.find(
    (error) => error.question === currentStep,
  );
  const analyticsData = debtAdviceLocatorAnalytics(z, currentStep);

  useEffect(() => {
    if (hasError) {
      addEvent({
        event: 'errorMessage',
        eventInfo: {
          toolName: analyticsData.tool.toolName,
          toolStep: analyticsData.tool.toolStep,
          stepName: analyticsData.tool.stepName,
          errorDetails: [
            {
              reactCompType:
                currentStep === 4 ? 'QuestionInputText' : 'QuestionRadioButton',
              reactCompName: qs[(currentStep as number) - 1].group,
              errorMessage: `Error: ${currentErrorEn?.message}`,
            },
          ],
        },
      } as AnalyticsData);
    }
  }, [addEvent, hasError, currentErrorEn, analyticsData, qs, currentStep]);

  const submitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    const inputText = analyticsData.tool.toolStep === '5';
    const question = qs[(currentStep as number) - 1];
    const form = e.target as HTMLFormElement;
    const elements = form.elements;
    const answer = (elements.namedItem('answer') as HTMLInputElement)?.value;

    addEvent({
      event: 'componentInteraction',
      eventInfo: {
        toolName: analyticsData.tool.toolName,
        toolStep: analyticsData.tool.toolStep,
        stepName: question.title,
        reactCompType: inputText ? 'QuestionInputText' : 'QuestionRadioButton',
        reactCompName: question.title,
        fieldValue: inputText ? answer : question.answers[Number(answer)].text,
      },
    });
  };

  return (
    <DebtAdviceLocator step={currentStep} isEmbed={isEmbed}>
      <Analytics
        analyticsData={analyticsData}
        currentStep={currentStep}
        formData={{}}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: false,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Questions
          storedData={storedData}
          data={data}
          questions={qs}
          errors={errors}
          currentStep={currentStep as number}
          backLink={links.question.backLink}
          dataPath={'/'}
          apiCall={SUBMIT_ANSWER_API}
          isEmbed={isEmbed}
          bottomInfo={
            helpSection ? <div className="mt-6">{helpSection}</div> : null
          }
          onSubmit={(e) => submitEvent(e)}
          alwaysDisplaySubText={true}
          topInfo={
            <ErrorSummary
              title={z({
                en: 'There is a problem',
                cy: 'Mae yna broblem',
              })}
              errors={
                hasError && currentError
                  ? { [currentStep]: [currentError.message] }
                  : {}
              }
              errorKeyPrefix={'q-'}
              classNames="mb-8"
            />
          }
        />
      </Analytics>
    </DebtAdviceLocator>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
