import { ReactNode, useEffect, useState } from 'react';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { RadioButton } from '../RadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { StepContainer } from '../StepContainer';
import { useRouter } from 'next/router';
import { GroupCheckbox } from '../GroupCheckbox';
import { MoneyInput } from '../MoneyInput';
import { Question, ErrorType } from '../../types';
import { twMerge } from 'tailwind-merge';

type Props = {
  storedData: any;
  data: string;
  questions: Question[];
  errors: ErrorType[];
  dataPath: string;
  currentStep: number;
  backLink: string;
  apiCall: string;
  isEmbed: boolean;
  displayQuestionNumber?: boolean;
  inputClassName?: string;
  QUESTION_PREFIX?: string;
  alwaysDisplaySubText?: boolean;
  bottomInfo?: ReactNode;
  topInfo?: ReactNode;
};

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
  inputClassName,
  QUESTION_PREFIX = 'q-',
  alwaysDisplaySubText,
  bottomInfo,
  topInfo,
}: Props) => {
  const router = useRouter();
  const { z } = useTranslation();
  const [displaySubText, setDisplaySubText] = useState<number | null>(null);
  const [isJSoff, setIsJSoff] = useState<boolean>(true);
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;

  useEffect(() => {
    setIsJSoff(false);
  }, []);

  const displayError = (questionNumber: number) => {
    const errorObject =
      errors.find((error) => error.question === questionNumber) ||
      errors.find((error) => error.question === 0);
    return (
      <div
        className="text-red-700 mb-4"
        data-testid={`errorMessage-${currentStep}`}
      >
        {errorObject?.message}
      </div>
    );
  };

  const renderInput = (question: Question, hasError: boolean) => {
    if (question.type === 'single') {
      return renderSingleChoice(question, hasError);
    } else if (question.type === 'multiple') {
      return renderMultipleChoice(question);
    } else if (question.type === 'moneyInput') {
      return renderMoneyInput(question);
    }
    return null;
  };

  const renderSingleChoice = (question: Question, hasError: boolean) => (
    <div
      className={`flex ${
        question.subType === 'yesNo' ? 'flex-row' : 'flex-col'
      } "pt-2"`}
    >
      {question.answers.map((answer, index) => (
        <div
          key={`radio-${answer.text}`}
          className={twMerge(
            question.subType === 'yesNo' && 'mr-16',
            question.subType !== 'yesNo' &&
              question.answers.length !== index + 1 &&
              'mb-6',
          )}
        >
          {answer.score !== undefined && (
            <input type="hidden" name={'score'} value={answer.score} />
          )}

          <RadioButton
            name="answer"
            id={`id-${index}`}
            value={index}
            onChange={(e) => {
              setDisplaySubText(
                e.target.checked && answer.subtext ? index : null,
              );
            }}
            aria-describedby={`hint-${index}`}
            defaultChecked={
              index ===
              Number(storedData[QUESTION_PREFIX + question.questionNbr])
            }
            className={'my-0'}
            hasError={hasError}
          >
            {answer.text}
          </RadioButton>
          {(displaySubText === index || isJSoff || alwaysDisplaySubText) &&
            answer.subtext && (
              <Paragraph
                id={`hint-${index}`}
                testId={`hint-${index}`}
                className="mb-0 text-gray-400 text-base ml-12 pl-1 -mt-2"
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
        {topInfo}
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
                    id={`q-${currentStep}`}
                  >
                    {hasError && displayError(question.questionNbr)}
                    {renderInput(question, hasError)}
                  </Errors>
                </fieldset>
              </div>
            );
          })}

        {bottomInfo}
      </div>
    </StepContainer>
  );
};