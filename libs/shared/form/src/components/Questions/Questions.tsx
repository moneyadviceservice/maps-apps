import { ReactNode, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { ErrorType, Question } from '../../types';
import { Checkbox } from '../Checkbox';
import DateField from '../DateField/DateField';
import { GroupCheckbox } from '../GroupCheckbox';
import { MoneyInput } from '../MoneyInput';
import { RadioButton } from '../RadioButton';
import { Select } from '../Select';
import { StepContainer } from '../StepContainer';

export type AnalyticsPageData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[];
  categoryLevels: string[];
};

type Props = {
  storedData: DataFromQuery;
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
  useValue?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  analyticsData?: AnalyticsPageData;
  inputFieldErrors?: { day?: boolean; month?: boolean; year?: boolean };
  allowNegative?: boolean;
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
  useValue,
  onSubmit,
  analyticsData,
  inputFieldErrors,
  allowNegative,
}: Props) => {
  const router = useRouter();
  const { z } = useTranslation();
  const { addStepPage } = useAnalytics();
  const [displaySubText, setDisplaySubText] = useState<number | null>(null);
  const [isJSoff, setIsJSoff] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [moneyInputValue, setMoneyInputValue] = useState<string>('');

  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;

  if (analyticsData) {
    addStepPage(analyticsData, currentStep);
  }

  useEffect(() => {
    setIsJSoff(false);
  }, []);

  useEffect(() => {
    questions.forEach((question) => {
      if (question.subType === 'inputCheckbox') {
        const storedAnswer = storedData[QUESTION_PREFIX + question.questionNbr];
        if (storedAnswer === ',1') {
          setChecked(true);
          setMoneyInputValue('');
        } else {
          setChecked(false);
        }
      }
    });
  }, [QUESTION_PREFIX, storedData, currentStep, questions]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    if (isChecked) {
      setMoneyInputValue('');
    }
  };

  const handleMoneyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMoneyInputValue(newValue);

    if (checked) {
      setChecked(false);
    }
  };

  const displayError = (questionNumber: number, order = false) => {
    const errorObject =
      errors.find((error) => error.question === questionNumber) ||
      errors.find((error) => error.question === 0);
    return (
      <div
        className={twMerge('mb-4 text-red-700', order && ['order-2', 'mb-0'])}
        data-testid={`errorMessage-${currentStep}`}
      >
        {errorObject?.message}
      </div>
    );
  };

  const renderInput = (question: Question, hasError: boolean) => {
    if (question.type === 'single' && question.subType !== 'text') {
      return renderSingleChoice(question, hasError);
    } else if (question.type === 'multiple') {
      return renderMultipleChoice(question);
    } else if (question.type === 'moneyInput') {
      if (question.subType === 'inputFrequency') {
        return (
          <div className="flex flex-col max-w-sm md:max-w-xl md:flex-row md:space-x-4">
            <div className="mb-4 md:mb-0 md:w-1/2">
              {renderMoneyInput(question)}
            </div>
            <div className="md:w-1/2">
              {renderSelectField(
                question,
                question.inputProps?.additionalLabels?.label1 ?? '',
              )}
            </div>
          </div>
        );
      }
      if (question.subType === 'inputCheckbox') {
        return (
          <div>
            <div className="sm:max-w-sm">{renderMoneyInput(question)}</div>
            <div>{renderCheckbox(question)}</div>
          </div>
        );
      }
      return renderMoneyInput(question);
    } else if (question.type === 'single' && question.subType === 'text') {
      return renderTextInput(question);
    } else if (question.type === 'date') {
      return renderDateField(question);
    }
    return null;
  };

  const renderSingleChoice = (question: Question, hasError: boolean) => (
    <div
      className={`flex ${
        question.subType === 'yesNo' ? 'flex-row' : 'flex-col'
      }`}
    >
      {question.answers.map((answer, index) => (
        <div
          key={`radio-${answer.text}`}
          className={twMerge(
            question.classes,
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
            value={useValue && answer.value ? answer.value : index}
            onChange={(e) => {
              setDisplaySubText(
                e.target.checked && answer.subtext ? index : null,
              );
            }}
            aria-describedby={
              (displaySubText === index || isJSoff || alwaysDisplaySubText) &&
              answer.subtext
                ? `hint-${index}`
                : undefined
            }
            defaultChecked={
              useValue && answer.value
                ? answer.value ===
                  storedData[QUESTION_PREFIX + question.questionNbr]
                : index ===
                  Number(storedData[QUESTION_PREFIX + question.questionNbr])
            }
            className={'my-0'}
            hasError={hasError}
            disabled={answer.disabled}
            radioInputTestId={`radio-input-${index}`}
            aria-label={answer.text}
          >
            {answer.text}
          </RadioButton>
          {(displaySubText === index || isJSoff || alwaysDisplaySubText) &&
            answer.subtext && (
              <Paragraph
                id={`hint-${index}`}
                testId={`hint-${index}`}
                className={twMerge(
                  'pl-1 mb-0 ml-12 -mt-2 text-base text-gray-400',
                  answer.disabled && 'opacity-60 cursor-not-allowed',
                  question.subType === 'yesNoDontKnow' &&
                    'mb-0 ml-3 text-base mt-4 text-gray-800',
                )}
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
        answerRecord={question?.answers}
        storedAnswer={storedData[QUESTION_PREFIX + question.questionNbr]?.split(
          ',',
        )}
      />
    </div>
  );

  const renderMoneyInput = (question: Question) => {
    const value = storedData[QUESTION_PREFIX + question.questionNbr];

    const customValue = value?.includes(',')
      ? value?.split(',').slice(0, -1).join('').replace(/,/g, '')
      : value?.replace(/,/g, '');

    return (
      <div className="space-y-4" data-testid="money-input">
        <label className="text-base" htmlFor={`input-${question.questionNbr}`}>
          {question.inputProps?.labelValue}
        </label>
        <MoneyInput
          name="answer"
          id={`input-${question.questionNbr}`}
          data-testid={`input-${question.questionNbr}`}
          inputClassName={inputClassName}
          value={
            checked
              ? ''
              : question.subType === 'inputFrequency'
              ? customValue
              : moneyInputValue ||
                (storedData[QUESTION_PREFIX + question.questionNbr] === ',1'
                  ? ''
                  : storedData[QUESTION_PREFIX + question.questionNbr])
          }
          isAllowed={({ floatValue }) =>
            (floatValue ?? 0) >= 0 &&
            (floatValue ?? 0) <= (question.inputProps?.maxLimit ?? Infinity)
          }
          allowNegative={allowNegative}
          onChange={handleMoneyInputChange}
        />
      </div>
    );
  };

  const renderSelectField = (question: Question, label?: string) => {
    const data = storedData[QUESTION_PREFIX + question.questionNbr];
    const parts = data?.lastIndexOf(',');
    const frequency = Number(data?.substring(parts + 1));

    return (
      <div className="space-y-4 max-w-[408px]">
        <label
          className="mt-4 text-base"
          htmlFor={`select-${question.questionNbr}`}
        >
          {label}
        </label>

        {question.subType === 'inputFrequency' && (
          <div>
            <Select
              id={`select-${question.questionNbr}`}
              name="answer"
              options={question.answers.map(({ text, value }) => ({
                text: text,
                value: String(value),
              }))}
              defaultValue={frequency}
              hideEmptyItem={true}
              selectClassName="h-12"
              aria-labelledby={`select-${question.questionNbr}`}
              defaultChecked={
                storedData[QUESTION_PREFIX + question.questionNbr]
              }
              data-testid={`select-${question.questionNbr}`}
            />
          </div>
        )}
      </div>
    );
  };

  const renderCheckbox = (question: Question) => (
    <div className="pt-8 space-y-4">
      <div>{question.exampleText}</div>
      <div className="flex">
        <Checkbox
          name="answer"
          id={`checkbox-${question.questionNbr}`}
          data-testid={`checkbox-${question.questionNbr}`}
          value={question.answers[0].value}
          className="w-6 h-6"
          onChange={handleCheckboxChange}
          checked={checked}
        >
          <span className="sr-only">{question.answers[0].text}</span>
        </Checkbox>

        <div className="flex flex-col ml-8">
          {question.answers.map((answer, index) => (
            <div key={index}>
              <Paragraph>{answer.text}</Paragraph>
              {answer.subtext && (
                <div className="text-gray-400">
                  <Paragraph>{answer.subtext}</Paragraph>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTextInput = (question: Question) => (
    <>
      <label
        className="order-1 block text-2xl"
        htmlFor={`q-${question.questionNbr}`}
      >
        {question.inputProps?.labelValue}
      </label>
      <input
        name="answer"
        type="text"
        id={`q-${question.questionNbr}`}
        data-testid={`q-${question.questionNbr}`}
        defaultValue={storedData[QUESTION_PREFIX + question.questionNbr]}
        className="order-3 w-full block md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-purple-700 focus:shadow-focus-outline"
      />
    </>
  );

  const renderDateField = (question: Question) => {
    return (
      <div data-testid="date-field">
        <span className="text-[#676767] text-md">{question.exampleText}</span>
        <div className="flex w-full mt-0 space-x-4">
          <DateField
            threePartDate={question.subType === 'dayMonthYear'}
            questions={questions}
            currentStep={currentStep}
            defaultValues={storedData[QUESTION_PREFIX + question.questionNbr]}
            fieldErrors={inputFieldErrors}
          />
        </div>
      </div>
    );
  };

  const renderCallout = (question: Question) => (
    <div className="pt-12 lg:max-w-[840px]" key={question.questionNbr}>
      <Callout
        className="px-8 pb-8 sm:px-[40px] sm:pb-[40px]"
        variant={CalloutVariant.WARNING}
      >
        {question.calloutData}
      </Callout>
    </div>
  );

  return (
    <>
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
        onSubmit={onSubmit}
      >
        <div className="mt-8 lg:max-w-[840px]">
          {topInfo}
          {!isNaN(currentStep) &&
            questions.map((question) => {
              if (question.questionNbr !== currentStep) return null;
              const isTextInput = question?.subType === 'text';
              return (
                <div key={`question-${question.questionNbr}`}>
                  <input
                    type="hidden"
                    name="question"
                    value={QUESTION_PREFIX + String(question.questionNbr)}
                  />
                  <input type="hidden" name="type" value={question.type} />
                  <input
                    type="hidden"
                    name="subType"
                    value={question.subType}
                  />
                  <input type="hidden" name="target" value={question.target} />

                  <fieldset>
                    <div className="mb-8">
                      {displayQuestionNumber && (
                        <Paragraph>{`${z({ en: 'Question', cy: 'Cwestiwn' })} ${
                          question.questionNbr
                        } ${z({ en: 'of', cy: 'o' })} ${
                          questions.length
                        }`}</Paragraph>
                      )}
                      <legend>
                        <Heading level={'h1'} className="pb-4">
                          {question.title}
                        </Heading>
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
                      className={twMerge(isTextInput && ['flex', 'flex-col'])}
                      id={isTextInput ? '' : `${QUESTION_PREFIX}${currentStep}`}
                    >
                      {hasError &&
                        displayError(question.questionNbr, isTextInput)}
                      {renderInput(question, hasError)}
                    </Errors>
                  </fieldset>
                </div>
              );
            })}

          {bottomInfo}
        </div>
      </StepContainer>
      {questions.map((question) => {
        if (question.questionNbr !== currentStep) return null;
        return (
          question.calloutData && (
            <Container
              key={question.questionNbr}
              data-testid="callout-container"
            >
              {renderCallout(question)}
            </Container>
          )
        );
      })}
    </>
  );
};
