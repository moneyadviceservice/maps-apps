import React, { useState } from 'react';

import { QuestionOrg } from 'data/form-data/org_signup';
import { twMerge } from 'tailwind-merge';

import { NumberInput } from '@maps-react/form/components/NumberInput';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

const inputClasses =
  'border-gray-650 w-full h-10 px-3 m-px border rounded focus:outline-purple-700 focus:shadow-focus-outline tool-field';

export const FormField = ({
  input,
  id,
  hasError,
  errorId,
  onChange,
  isPassword,
  errorMsg,
}: {
  input: QuestionOrg;
  id: string;
  hasError: boolean;
  errorId?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  isPassword?: boolean;
  errorMsg?: string;
}) => {
  return (
    <div className="max-w-sm">
      <label htmlFor={id} className="block mb-2 text-2xl">
        {input.title}
      </label>
      {hasError && errorMsg && (
        <div
          id={errorId}
          data-testid={errorId}
          className="text-red-700 text-[18px] mb-1 -mt-2"
          aria-live="assertive"
          role="alert"
        >
          {errorMsg}
        </div>
      )}
      {isPassword ? (
        <PasswordInput
          input={input}
          hasError={hasError}
          errorId={errorId}
          id={id}
        />
      ) : input.type === 'number' ? (
        <NumberInput
          data-testid={input.name}
          name={input.name}
          id={id}
          hasGlassBoxClass={true}
          className={twMerge(
            inputClasses,
            hasError ? 'border-red-700 border-[2px]' : 'border-gray-650',
          )}
          aria-invalid={!!hasError}
          aria-describedby={errorId}
        />
      ) : (
        <TextInput
          data-testid={input.name}
          hint={input.hint}
          hasGlassBoxClass={true}
          className={twMerge(
            inputClasses,
            hasError ? 'border-red-700 border-[2px]' : 'border-gray-650',
          )}
          onChange={onChange}
          name={input.name}
          id={id}
          type={input.type}
          aria-invalid={!!hasError}
          aria-describedby={errorId}
        />
      )}
    </div>
  );
};

const PasswordInput = ({
  input,
  id,
  hasError = false,
  errorId,
}: {
  input: QuestionOrg;
  id: string;
  hasError: boolean;
  errorId?: string;
}) => {
  const { z } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={twMerge('relative')}>
      <TextInput
        data-testid={input.name}
        hint={input.hint}
        className={twMerge(
          inputClasses,
          'pr-24 mb-1 obfuscate',
          hasError ? 'border-red-700 border-[2px]' : 'border-gray-650',
        )}
        name={input.name}
        id={id}
        type={showPassword ? 'text' : input.type}
        aria-invalid={!!hasError}
        aria-describedby={errorId}
      />
      {input.type === 'password' && (
        <button
          type="button"
          className={twMerge('absolute right-3 bottom-2.5 text-sm uppercase')}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword
            ? z({
                en: 'HIDE',
                cy: 'CUDDIO',
              })
            : z({
                en: 'SHOW',
                cy: 'DANGOS',
              })}
        </button>
      )}
    </div>
  );
};
