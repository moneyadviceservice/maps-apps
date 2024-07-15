import { useEffect, useState } from 'react';
import {
  Errors,
  RadioButton,
  Paragraph,
  Heading,
} from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';
import { StepContainer } from 'components/StepContainer';
import { useRouter } from 'next/router';
import { useAnalytics } from 'hooks/useAnalytics';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { GroupCheckbox } from '../GroupCheckbox';
import { MoneyInput } from 'components/MoneyInput';
import { FormContentAnlyticsData, DataPath, Question, ErrorType } from 'types';

type Props = {
  storedData: any;
  data: string;
  questions: Question[];
  errors: ErrorType[];
  dataPath: DataPath;
  currentStep: number;
  backLink: string;
  apiCall: string;
  isEmbed: boolean;
  displayQuestionNumber?: boolean;
  analyticsData?: FormContentAnlyticsData;
  inputClassName?: string;
};

let eventDataPushed = false;

export const Questions = ({
  storedData,
  data,
  questions,
  errors,
  dataPath,
  currentStep,
  backLink,
  apiCall,
  isEmbed,
  displayQuestionNumber,
  analyticsData,
  inputClassName,
}: Props) => {
  const router = useRouter();
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const [displaySubText, setDisplaySubText] = useState<boolean>();
  const [isJSoff, setIsJSoff] = useState<boolean>(true);
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const questionName = analyticsData?.stepNames[currentStep - 1];
  const restart = router.query.restart === 'true';

  useEffect(() => {
    const toolStarted = Object.keys(storedData).length > 0 || eventDataPushed;
    const fireEvent = () => {
      if (currentStep === 1 && (!toolStarted || restart)) {
        addEvent({
          page: {
            pageName: analyticsData?.pageName,
            pageTitle: analyticsData?.pageTitle,
          },
          tool: {
            toolName: analyticsData?.toolName,
            toolStep: currentStep,
            stepName: questionName,
          },
          event: restart ? 'toolRestart' : 'toolStart',
        });
        eventDataPushed = true;
      }
    };
    if (!eventDataPushed) {
      fireEvent();
    }
  }, [eventDataPushed]);

  useEffect(() => {
    setIsJSoff(false);
  }, []);

  const displayError = (questionNumber: number) => {
    const errorObject =
      errors.find((error) => error.question === questionNumber) ||
      errors.find((error) => error.question === 0);
    return (
      <div className="text-red-700" data-testid={`errorMessage-${currentStep}`}>
        {errorObject?.message}
      </div>
    );
  };

  const renderInput = (question: Question) => {
    if (question.type === 'single') {
      return renderSingleChoice(question);
    } else if (question.type === 'multiple') {
      return renderMultipleChoice(question);
    } else if (question.type === 'moneyInput') {
      return renderMoneyInput(question);
    }
    return null;
  };

  const renderSingleChoice = (question: Question) => (
    <div
      className={`flex ${
        question.subType === 'yesNo' ? 'flex-row' : 'flex-col'
      } "pt-2"`}
    >
      {question.answers.map((answer, index) => (
        <div
          key={`radio-${answer.text}`}
          className={question.subType === 'yesNo' ? 'mr-16' : 'space-y-4'}
        >
          {answer.score !== undefined && (
            <input type="hidden" name={'score'} value={answer.score} />
          )}

          <RadioButton
            name="answer"
            id={`id-${index}`}
            value={index}
            onChange={(e) =>
              e.target['checked'] && answer.subtext
                ? setDisplaySubText(true)
                : setDisplaySubText(false)
            }
            aria-describedby={`hint-${index}`}
            defaultChecked={
              index ===
              Number(storedData[QUESTION_PREFIX + question.questionNbr])
            }
            className={'my-2'}
          >
            {answer.text}
          </RadioButton>
          {((displaySubText &&
            index ===
              Number(storedData[QUESTION_PREFIX + question.questionNbr])) ||
            isJSoff) && (
            <Paragraph
              id={`hint-${index}`}
              className="text-gray-400 text-base ml-14"
            >
              {answer.subtext}
            </Paragraph>
          )}
        </div>
      ))}
    </div>
  );

  const renderMultipleChoice = (question: Question) => (
    <div className="space-y-4">
      <GroupCheckbox
        answerRecord={question.answers}
        storedAnswer={storedData[QUESTION_PREFIX + question.questionNbr]?.split(
          ',',
        )}
      />
    </div>
  );

  const renderMoneyInput = (question: Question) => (
    <div className="space-y-4">
      <label className="text-base" htmlFor={`input-${question.questionNbr}`}>
        {question.inputProps?.labelValue}
      </label>
      <MoneyInput
        name="answer"
        id={`input-${question.questionNbr}`}
        data-testid={`input-${question.questionNbr}`}
        inputClassName={inputClassName}
        defaultValue={storedData[QUESTION_PREFIX + question.questionNbr]}
        isAllowed={({ floatValue }) =>
          (floatValue ?? 0) >= 0 &&
          (floatValue ?? 0) <= (question.inputProps?.maxLimit ?? Infinity)
        }
      />
    </div>
  );

  return (
    <StepContainer
      backLink={backLink}
      data={data}
      lang={router.query.language}
      action={apiCall}
      buttonText={
        storedData[`changeAnswer`] === String(QUESTION_PREFIX + currentStep)
          ? z({ en: 'Save changes', cy: 'Arbed newidiadau' })
          : z({ en: 'Continue', cy: 'Parhau' })
      }
      dataPath={dataPath}
      isEmbed={isEmbed}
      buttonClassName={'w-full sm:w-auto'}
      currentStep={currentStep}
    >
      <div className="space-y-9 lg:max-w-[840px]">
        {!isNaN(currentStep) &&
          questions.map((question) => {
            if (question.questionNbr !== currentStep) return null;
            return (
              <div key={`question-${question.questionNbr}`}>
                <input
                  type="hidden"
                  name="question"
                  value={QUESTION_PREFIX + String(question.questionNbr)}
                />
                <input type="hidden" name="type" value={question.type} />
                <input type="hidden" name="target" value={question.target} />
                <fieldset className="space-y-4">
                  <div className="space-y-4">
                    {displayQuestionNumber && (
                      <Paragraph>{`Question ${question.questionNbr} of ${questions.length}`}</Paragraph>
                    )}
                    <legend>
                      <Heading level={'h1'}>{question.title}</Heading>
                    </legend>
                    {typeof question.definition === 'string' ? (
                      <Paragraph className="pb-4">
                        {question.definition}
                      </Paragraph>
                    ) : (
                      <div>{question.definition}</div>
                    )}
                    {question.description && (
                      <Paragraph>{question.description}</Paragraph>
                    )}
                  </div>
                  <Errors
                    errors={hasError ? errors : []}
                    testId={`error-${currentStep}`}
                  >
                    {hasError && displayError(question.questionNbr)}
                    {renderInput(question)}
                  </Errors>
                </fieldset>
              </div>
            );
          })}
      </div>
    </StepContainer>
  );
};
