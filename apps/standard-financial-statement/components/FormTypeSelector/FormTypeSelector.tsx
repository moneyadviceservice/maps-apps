import { ChangeEvent } from 'react';

import { FormType, signUpType } from 'data/form-data/org_signup';

import { RadioButton } from '@maps-react/form/components/RadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

export const FormTypeSelector = ({
  flow,
  onChange,
}: {
  flow: FormType;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { z } = useTranslation();
  const input = signUpType(z);

  return (
    <fieldset className="relative">
      <legend className="mb-4 text-2xl text-gray-900">
        {z({
          en: 'Is your organisation a member of SFS?',
          cy: 'Ydy’ch sefydliad yn aelod o SFS?',
        })}
      </legend>
      {input.map((answer) => (
        <div key={`radio-${answer.text}`} className="mb-4">
          <RadioButton
            name="sfs-status"
            id={`${answer.value}`}
            value={answer.value}
            defaultChecked={flow === answer.value}
            classNameLabel="peer-checked:after:border-blue-600"
            onChange={onChange}
            hasError={false}
          >
            {answer.text}
          </RadioButton>
        </div>
      ))}
    </fieldset>
  );
};
