import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
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
  const fNameError = fNError ? [fNError] : [];

  const sNError = errors.find(
    (error) => error.question === sNameField,
  )?.message;
  const sNameError = sNError ? [sNError] : [];

  const eError = errors.find((error) => error.question === emailField)?.message;
  const emailError = eError ? [eError] : [];

  const pError = errors.find((error) => error.question === phoneField)?.message;
  const phoneError = pError ? [pError] : [];

  return (
    <>
      <Errors errors={fNameError} className="mb-4 max-w-[410px]">
        <label className="block mb-0 text-2xl" htmlFor={fNameField}>
          {z({
            en: "Customer's first name",
            cy: 'Enw cyntaf y cwsmer',
          })}
        </label>
        {fNameError.length > 0 && (
          <Paragraph
            id={`${variant}-${fNameField}`}
            className="text-red-500 text-[18px] mb-0"
          >
            {fNameError}
          </Paragraph>
        )}
        <input
          id={fNameField}
          className={twMerge(inputClasses)}
          defaultValue={cookieData?.[fNameField]}
          aria-describedby={
            fNameError.length > 0 ? `${variant}-${fNameField}` : undefined
          }
          name={fNameField}
          type="text"
          autoComplete="off"
        />
      </Errors>
      <Errors errors={sNameError} className="mb-4 max-w-[410px]">
        <label className="block mb-0 text-2xl" htmlFor={sNameField}>
          {z({
            en: "Customer's last name",
            cy: 'Cyfenw y cwsmer',
          })}
        </label>
        {sNameError.length > 0 && (
          <Paragraph
            id={`${variant}-${sNameField}`}
            className="text-red-500 text-[18px] mb-0"
          >
            {sNameError}
          </Paragraph>
        )}
        <input
          id={sNameField}
          className={twMerge(inputClasses)}
          defaultValue={cookieData?.[sNameField]}
          aria-describedby={
            sNameError.length > 0 ? `${variant}-${sNameField}` : undefined
          }
          name={sNameField}
          type="text"
          autoComplete="off"
        />
      </Errors>
      {variant === FLOW.ONLINE ? (
        <Errors errors={emailError} className="mb-4 max-w-[410px]">
          <label className="block mb-0 text-2xl" htmlFor={emailField}>
            {z({
              en: "Customer's email address",
              cy: 'Cyfeiriad e-bost y cwsmer',
            })}
          </label>
          {emailError.length > 0 && (
            <Paragraph
              id={`${variant}-${emailField}`}
              className="text-red-500 text-[18px] mb-0"
            >
              {emailError}
            </Paragraph>
          )}
          <input
            id={emailField}
            className={twMerge(inputClasses)}
            defaultValue={cookieData?.[emailField]}
            aria-describedby={
              emailError.length > 0 ? `${variant}-${emailField}` : undefined
            }
            name={emailField}
            type="text"
            autoComplete="off"
          />
        </Errors>
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
