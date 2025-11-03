import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Select } from '@maps-react/form/components/Select';
import { ErrorType, Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';

type Props = {
  question: Question;
  cookieData: CookieData['securityQuestions'];
  errors: ErrorType[];
};

export const QuestionMultipleSecurity = ({
  question,
  cookieData,
  errors,
}: Props) => {
  const [questionChangedCount, setQuestionChangedCount] = useState(0);

  const inputClasses =
    'w-full md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline obfuscate';

  const { z } = useTranslation();

  const questionValue = cookieData;

  const sQuesFeild = FORM_FIELDS.securityQuestion;
  const sAnsField = FORM_FIELDS.securityAnswer;
  const postcodeField = FORM_FIELDS.postcode;

  const fpostcode = errors.find(
    (error) => error.question === postcodeField,
  )?.message;
  const fquestion = errors.find(
    (error) => error.question === sQuesFeild,
  )?.message;
  const fanswer = errors.find((error) => error.question === sAnsField)?.message;

  const securityQuestionUpdated = () => {
    setQuestionChangedCount((prev) => prev + 1);
  };

  return (
    <>
      {question.description && (
        <div className="max-w-[840px] mb-10">
          <Paragraph className="text-[18px]">{question.description}</Paragraph>
        </div>
      )}
      <Errors
        errors={fpostcode ? [fpostcode] : []}
        className={twMerge('max-w-[410px] mb-4', fpostcode && 'pl-4')}
      >
        <label className="block mb-0 text-2xl" htmlFor={postcodeField}>
          {z({
            en: "Customer's postcode",
            cy: 'Cod post y cwsmer',
          })}
        </label>
        {fpostcode && (
          <Paragraph className="text-red-500 text-[18px] mb-0">
            {fpostcode}
          </Paragraph>
        )}
        <input
          id={postcodeField}
          className={twMerge(inputClasses)}
          defaultValue={questionValue?.[postcodeField]}
          name={postcodeField}
          type="text"
          data-testid="postcode-input"
          autoComplete="off"
        />
      </Errors>
      <Errors
        errors={fquestion ? [fquestion] : []}
        className={twMerge('max-w-[410px] mb-4', fquestion && 'pl-4')}
      >
        <label className="block text-2xl" htmlFor={sQuesFeild}>
          {z({
            en: 'Security question',
            cy: 'Cwestiwn diogelwch',
          })}
        </label>
        {fquestion && (
          <Paragraph className="text-red-500 text-[18px] mb-0">
            {fquestion}
          </Paragraph>
        )}
        <Select
          name={sQuesFeild}
          className="mt-2 obfuscate"
          id={sQuesFeild}
          defaultValue={questionValue?.[sQuesFeild] ?? ''}
          emptyItemText={z({ en: 'Select an option', cy: 'Dewiswch opsiwn' })}
          options={question.answers.map((l) => ({
            text: l.text,
            value: l.value as string,
          }))}
          onChange={() => securityQuestionUpdated()}
          data-testid="security-question-select"
        />
      </Errors>
      <Errors
        className={twMerge('max-w-[410px] mb-4', fanswer && 'pl-4')}
        errors={fanswer ? [fanswer] : []}
      >
        <label className="block mb-0 text-2xl" htmlFor={sAnsField}>
          {z({
            en: 'Answer to security question',
            cy: 'Ateb i gwestiwn diogelwch',
          })}
        </label>
        {fanswer && (
          <Paragraph className="text-red-500 text-[18px] mb-0">
            {fanswer}
          </Paragraph>
        )}
        <input
          key={questionChangedCount}
          className={twMerge(inputClasses)}
          id={sAnsField}
          defaultValue={
            questionChangedCount === 0 ? questionValue?.[sAnsField] : ''
          }
          name={sAnsField}
          type="text"
          data-testid="security-answer-input"
          autoComplete="off"
        />
      </Errors>
    </>
  );
};
