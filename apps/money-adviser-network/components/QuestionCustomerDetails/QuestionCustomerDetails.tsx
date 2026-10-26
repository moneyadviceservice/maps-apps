import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';
import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { FLOW } from '../../utils/getQuestions';

type Props = {
  errors: ErrorType[];
  cookieData: CookieData['customerDetails'];
  variant: FLOW.ONLINE | FLOW.TELEPHONE;
};

const inputClasses =
  'w-full md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline obfuscate';

export const QuestionCustomerDetails = ({
  errors,
  cookieData,
  variant,
}: Props) => {
  const { z } = useTranslation();
  const fNameField = FORM_FIELDS.firstName;
  const sNameField = FORM_FIELDS.lastName;
  const emailField = FORM_FIELDS.email;
  const phoneField = FORM_FIELDS.telephone;

  const fNError = errors.find(
    (error) => error.question === fNameField,
  )?.message;

  const sNError = errors.find(
    (error) => error.question === sNameField,
  )?.message;

  const eError = errors.find((error) => error.question === emailField)?.message;

  const pError = errors.find((error) => error.question === phoneField)?.message;
  const phoneError = pError ? [pError] : [];

  return (
    <>
      <TextInput
        label={z({
          en: "Customer's first name",
          cy: 'Enw cyntaf y cwsmer',
        })}
        name={fNameField}
        id={fNameField}
        className={twMerge(inputClasses)}
        hasErrorWrapper={true}
        error={fNError}
        defaultValue={cookieData?.[fNameField]}
        autoComplete="off"
      />
      <TextInput
        label={z({
          en: "Customer's last name",
          cy: 'Cyfenw y cwsmer',
        })}
        name={sNameField}
        id={sNameField}
        className={twMerge(inputClasses)}
        hasErrorWrapper={true}
        error={sNError}
        defaultValue={cookieData?.[sNameField]}
        autoComplete="off"
      />
      {variant === FLOW.ONLINE ? (
        <TextInput
          label={z({
            en: "Customer's email address",
            cy: 'Cyfeiriad e-bost y cwsmer',
          })}
          name={emailField}
          id={emailField}
          className={twMerge(inputClasses)}
          hasErrorWrapper={true}
          error={eError}
          defaultValue={cookieData?.[emailField]}
          autoComplete="off"
        />
      ) : (
        <Errors errors={phoneError} className="mb-4 max-w-[410px]">
          <label className="block mb-0 text-2xl" htmlFor={phoneField}>
            {z({
              en: "Customer's telephone number",
              cy: 'Rhif ffôn y cwsmer',
            })}
          </label>
          {phoneError.length > 0 && (
            <Paragraph
              id={`${variant}-${phoneField}`}
              className="text-red-500 text-[18px] mb-0"
            >
              {phoneError}
            </Paragraph>
          )}
          <div className="flex w-full">
            <span
              aria-hidden
              className="bg-gray-100 h-10 py-1 px-2 m-px mt-2 mr-0 text-lg rounded-l border-gray-800 border border-solid leading-[31px]"
            >
              +44
            </span>
            <input
              id={phoneField}
              className={twMerge(
                'px-3 m-px mt-2 ml-0 w-full h-10 text-lg rounded-r border-t border-r border-b border-l-0 border-gray-800 md:max-w-[408px] focus:outline-none focus:shadow-focus-outline obfuscate',
              )}
              defaultValue={cookieData?.[phoneField]?.replace(/^\+44/, '')}
              aria-describedby={
                phoneError.length > 0 ? `${variant}-${phoneField}` : undefined
              }
              name={phoneField}
              type="text"
              inputMode="numeric"
              autoComplete="off"
            />
          </div>
        </Errors>
      )}
    </>
  );
};
