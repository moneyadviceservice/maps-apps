import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { ErrorType, Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';

type Variant =
  | typeof FORM_FIELDS.consentReferral
  | typeof FORM_FIELDS.consentDetails
  | typeof FORM_FIELDS.consentOnline;

type Props = {
  question: Question;
  variant: Variant;
  cookieData: CookieData[Variant];
  errors: ErrorType[];
};

export const ConsentWrapper = ({
  question,
  variant,
  cookieData,
  errors,
}: Props) => {
  const { z } = useTranslation();
  const hasError = errors.length > 0;
  const validAnswer = cookieData?.value ?? '';

  const fieldName = FORM_FIELDS[variant];

  return (
    <div className="mt-4">
      <Errors
        className={twMerge('mb-8', hasError ? ['pl-4'] : '')}
        errors={hasError ? ['error'] : []}
      >
        <label className="block text-2xl" htmlFor={fieldName}>
          {z({
            en: 'Does the customer give consent?',
            cy: "Ydy'r cwsmer wedi cydsynio?",
          })}
        </label>
        {hasError && (
          <div className="text-red-500 text-[18px]" id={variant}>
            {question.errors?.message}
          </div>
        )}
        <div className={`flex flex-row mt-4`}>
          {question.answers.map((answer, index) => (
            <div
              key={`radio-${answer.text}`}
              className={twMerge(question.classes, index === 0 ? ['mr-8'] : [])}
            >
              <RadioButton
                name={fieldName}
                id={`id-${index}`}
                value={index}
                aria-describedby={`hint-${index}`}
                defaultChecked={
                  (validAnswer && Number(validAnswer) === index) || undefined
                }
                className={'my-0'}
                hasError={hasError}
              >
                {answer.text}
              </RadioButton>
            </div>
          ))}
        </div>
      </Errors>
    </div>
  );
};
