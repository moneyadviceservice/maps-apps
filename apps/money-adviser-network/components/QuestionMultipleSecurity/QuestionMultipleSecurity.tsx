import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Select } from '@maps-react/form/components/Select';
import { ErrorType, Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { TextInput } from '@maps-react/form/components/TextInput';

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
      <TextInput
        label={z({
          en: "Customer's postcode",
          cy: 'Cod post y cwsmer',
        })}
        name={postcodeField}
        id={postcodeField}
        containerClassName="mb-4 max-w-[410px]"
        className={twMerge(inputClasses)}
        hasErrorWrapper={true}
        error={fpostcode}
        defaultValue={cookieData?.[postcodeField]}
        autoComplete="off"
      />
      <Select
        name={sQuesFeild}
        className="mt-2 obfuscate"
        id={sQuesFeild}
        defaultValue={questionValue?.[sQuesFeild] ?? ''}
        label={z({
          en: 'Security question',
          cy: 'Cwestiwn diogelwch',
        })}
        labelClassName="block text-2xl"
        hasError={!!fquestion}
        error={fquestion}
        hasErrorWrapper={true}
        errorClassName={twMerge('max-w-[410px] mb-4', fquestion && 'pl-4')}
        errorTextClassName="text-red-500 text-[18px] mb-0"
        emptyItemText={z({ en: 'Select an option', cy: 'Dewiswch opsiwn' })}
        options={question.answers.map((l) => ({
          text: l.text,
          value: l.value as string,
        }))}
        onChange={() => securityQuestionUpdated()}
        data-testid="security-question-select"
      />
      <TextInput
        key={questionChangedCount}
        label={z({
          en: 'Answer to security question',
          cy: 'Ateb i gwestiwn diogelwch',
        })}
        name={sAnsField}
        id={sAnsField}
        containerClassName="mb-4 max-w-[410px]"
        className={twMerge(inputClasses)}
        hasErrorWrapper={true}
        error={fanswer}
        defaultValue={
          questionChangedCount === 0 ? questionValue?.[sAnsField] : ''
        }
        autoComplete="off"
      />
    </>
  );
};
