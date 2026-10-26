import { CookieData, FORM_FIELDS } from 'data/questions/types';
import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { ErrorType, Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

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
        <div className="block text-2xl" id={`label-${variant}`}>
          {z({
            en: 'Does the customer give consent?',
            cy: "Ydy'r cwsmer wedi cydsynio?",
          })}
        </div>
        {hasError && (
          <div
            className="text-red-500 text-[18px]"
            data-testid="errorMessage-consent"
            id={variant}
          >
            {question.errors?.message}
          </div>
        )}
        <div className={`flex flex-row mt-4`}>
          {question.answers.map((answer, index) => {
            // If in error state, append error container id to aria-describedby
            const describedBy = hasError
              ? `hint-${index} label-${variant} ${variant}`
              : `hint-${index} label-${variant}`;

            return (
              <div
                key={`radio-${answer.text}`}
                className={twMerge(
                  question.classes,
                  index === 0 ? ['mr-8'] : [],
                )}
              >
                <RadioButton
                  name={fieldName}
                  id={`id-${index}`}
                  value={index}
                  aria-describedby={describedBy}
                  defaultChecked={
                    (validAnswer && Number(validAnswer) === index) || undefined
                  }
                  className={'my-0'}
                  hasError={hasError}
                >
                  {answer.text}
                </RadioButton>
              </div>
            );
          })}
        </div>
      </Errors>
    </div>
  );
};
