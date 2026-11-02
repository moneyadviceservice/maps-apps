import { twMerge } from 'tailwind-merge';

import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { TextInput } from '@maps-react/form/components/TextInput';

type Props = {
  errors: ErrorType[];
  cookieData: CookieData['reference'];
};

const inputClasses =
  'w-full md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline obfuscate';

export const QuestionReferenceDetails = ({ errors, cookieData }: Props) => {
  const { z } = useTranslation();
  const cRefField = FORM_FIELDS.customerReference;
  const dNameField = FORM_FIELDS.departmentName;

  const cRError = errors.find((error) => error.question === cRefField)?.message;

  const dNError = errors.find(
    (error) => error.question === dNameField,
  )?.message;

  return (
    <>
      <TextInput
        label={z({
          en: 'Your Internal Customer Reference (optional)',
          cy: 'Eich Cyfeirnod Cwsmer Mewnol (dewisol)',
        })}
        name={cRefField}
        id={cRefField}
        className={twMerge(inputClasses)}
        containerClassName="mb-4 max-w-[410px]"
        hasErrorWrapper={true}
        error={cRError}
        defaultValue={cookieData?.[cRefField]}
        autoComplete="off"
      />
      <TextInput
        label={z({
          en: 'Your Name / Department name (optional)',
          cy: "Eich enw / Enw'r adran (dewisol)",
        })}
        name={dNameField}
        id={dNameField}
        className={twMerge(inputClasses)}
        containerClassName="mb-4 max-w-[410px]"
        hasErrorWrapper={true}
        error={dNError}
        defaultValue={cookieData?.[dNameField]}
        autoComplete="off"
      />
    </>
  );
};
