import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';

type Props = {
  errors: ErrorType[];
  cookieData: CookieData['reference'];
};

const inputClasses =
  'w-full md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-purple-700 focus:shadow-focus-outline';

export const QuestionReferenceDetails = ({ errors, cookieData }: Props) => {
  const { z } = useTranslation();
  const cRefField = FORM_FIELDS.customerReference;
  const dNameField = FORM_FIELDS.departmentName;

  const cRError = errors.find((error) => error.question === cRefField)?.message;
  const cRefError = cRError ? [cRError] : [];

  const dNError = errors.find(
    (error) => error.question === dNameField,
  )?.message;
  const dNameError = dNError ? [dNError] : [];

  return (
    <>
      <Errors errors={cRefError} className="mb-4 max-w-[410px]">
        <label className="block mb-0 text-2xl" htmlFor={cRefField}>
          {z({
            en: 'Your Internal Customer Reference (optional)',
            cy: 'Eich Cyfeirnod Cwsmer Mewnol (dewisol)',
          })}
        </label>
        {cRefError && (
          <Paragraph className="text-red-500 text-[18px] mb-0">
            {cRefError}
          </Paragraph>
        )}
        <input
          id={cRefField}
          className={twMerge(inputClasses)}
          defaultValue={cookieData?.[cRefField]}
          name={cRefField}
          type="text"
          data-testid="c-ref-field"
        />
      </Errors>
      <Errors errors={dNameError} className="mb-4 max-w-[410px]">
        <label className="block mb-0 text-2xl" htmlFor={dNameField}>
          {z({
            en: 'Your Name / Department name (optional)',
            cy: "Eich enw / Enw'r adran (dewisol)",
          })}
        </label>
        {dNameError && (
          <Paragraph className="text-red-500 text-[18px] mb-0">
            {dNameError}
          </Paragraph>
        )}
        <input
          id={dNameField}
          className={twMerge(inputClasses)}
          defaultValue={cookieData?.[dNameField]}
          name={dNameField}
          type="text"
          data-testid="d-name-field"
        />
      </Errors>
    </>
  );
};
