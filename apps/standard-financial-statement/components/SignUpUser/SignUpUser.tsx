import React, { useState } from 'react';

import { FormType, QuestionOrg } from 'data/form-data/org_signup';
import { userForm, userFormOTP } from 'data/form-data/user_signup';
import { twMerge } from 'tailwind-merge';

import { Button, Errors, H2, H3 } from '@maps-react/common/index';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

const inputClasses =
  'border-gray-400 w-full h-10 px-3 m-px border rounded focus:outline-purple-700 focus:shadow-focus-outline tool-field';

const SignUpUser = ({
  formType,
  errors,
  emailAddress = '',
  showOTP = false,
  continuationToken,
  disabledCTA = false,
  onChange,
  onSubmit,
}: {
  formType: FormType;
  errors: Record<string, string[]>;
  emailAddress: string;
  showOTP: boolean;
  continuationToken: string;
  disabledCTA?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) => {
  const { z } = useTranslation();
  const inputs = userForm(z, formType) as QuestionOrg[];
  const inputOTP = userFormOTP(z) as QuestionOrg[];

  return (
    <form
      data-testid="signUpUserForm"
      method="POST"
      className="mt-6"
      id="sign-up-user-form"
      action="/api/sign-up-user"
      noValidate
      onSubmit={(e) => onSubmit(e)}
    >
      {continuationToken && (
        <input
          type="hidden"
          name="continuation_token"
          value={continuationToken}
        />
      )}
      {inputs.map((input, index) => {
        const hasError = errors[input.name] ?? false;

        return (
          <div key={input.name} className="mb-8">
            {formType === FormType.NEW_ORG_USER && index === 0 && (
              <H2 className="my-8 md:text-5xl">
                {z({
                  en: 'Part 2 - Register as a user',
                  cy: 'Rhan 2 – Cofrestru fel defnyddiwr',
                })}
              </H2>
            )}
            {formType === FormType.ACTIVE_ORG && index === 1 && (
              <H2 className="my-8 md:text-5xl">
                {z({
                  en: 'Register as a user of your organisation',
                  cy: 'Cofrestrwch fel defnyddiwr eich sefydliad',
                })}
              </H2>
            )}

            <Errors errors={hasError ? ['error'] : []} key={input.name}>
              <div key={input.name} className="mb-8">
                {input.name !== 'codeOfConduct' && input.type !== 'number' && (
                  <div className="max-w-sm">
                    <label htmlFor={input.name} className="block mb-2 text-2xl">
                      {input.title}
                    </label>
                    {hasError && input?.errors && (
                      <div className="text-red-500 text-[18px] mb-1 -mt-2">
                        {hasError[0].split('-')[1].trim()}
                      </div>
                    )}

                    {input.type === 'password' ? (
                      <PasswordInput input={input} hasError={!!hasError} />
                    ) : (
                      <TextInput
                        data-testid={input.name}
                        className={twMerge(
                          inputClasses,
                          hasError ? 'border-red-500 border-[2px]' : '',
                        )}
                        onChange={onChange}
                        name={input.name}
                        id={input.name}
                        type={input.type}
                      />
                    )}
                  </div>
                )}

                {input.name !== 'codeOfConduct' && input.type === 'number' && (
                  <div className="max-w-sm">
                    <label htmlFor={input.name} className="block mb-2 text-2xl">
                      {input.title}
                    </label>
                    {hasError && input?.errors && (
                      <div className="text-red-500 text-[18px] mb-1 -mt-2">
                        {hasError[0].split('-')[1].trim()}
                      </div>
                    )}
                    <NumberInput
                      data-testid={input.name}
                      name={input.name}
                      id={input.name}
                      className={twMerge(
                        inputClasses,
                        hasError ? 'border-red-500 border-[2px]' : '',
                      )}
                    />
                  </div>
                )}

                {input.name === 'codeOfConduct' && (
                  <div className="mb-4">
                    <label
                      htmlFor={input.name}
                      className="block mb-8 text-3xl font-bold md:text-5xl"
                    >
                      {input.title}
                    </label>
                    {input.description && <p>{input.description}</p>}
                    {hasError && input?.errors && (
                      <div className="text-red-500 text-[18px] mt-2 -mb-4">
                        {hasError[0].split('-')[1].trim()}
                      </div>
                    )}

                    <div className="grid gap-4 mt-10 mb-16 md:grid-cols-2">
                      <Checkbox
                        data-testid={input.name}
                        key={input.name}
                        id={input.name}
                        name={input.name}
                        value="true"
                        checkboxClassName={twMerge(
                          hasError ? 'border-red-500 border-[2px]' : '',
                          'peer-checked:text-blue-600',
                        )}
                      >
                        {input.definition}
                      </Checkbox>
                    </div>
                  </div>
                )}
              </div>
            </Errors>
          </div>
        );
      })}

      {showOTP && (
        <>
          {inputOTP.map((input) => {
            const hasError = errors[input.name] ?? false;

            return (
              <div key={input.name} className="mb-16 -mt-6">
                <H3 className="mb-8 text-3xl font-bold md:text-5xl">
                  {input.title}
                </H3>
                <div className="text-gray-500">
                  {input.description}
                  <span className="block mb-8">{emailAddress}</span>
                </div>
                <Errors errors={hasError ? ['error'] : []} key={input.name}>
                  <div key={input.name} className="mb-8">
                    <div>
                      <label
                        htmlFor={input.name}
                        className="block mb-2 text-2xl"
                      >
                        {input.title}
                      </label>

                      {hasError && input?.errors && (
                        <div className="text-red-500 text-[18px] mb-1 -mt-2 max-w-lg">
                          {hasError[0].split(' - ').pop()?.trim()}
                        </div>
                      )}
                      <div className="max-w-sm mt-2">
                        <NumberInput
                          data-testid={input.name}
                          className={twMerge(
                            inputClasses,
                            hasError
                              ? 'border-red-700 border-[2px]'
                              : 'border-gray-400',
                          )}
                          name={input.name}
                          id={input.name}
                          defaultValue={''}
                        />
                      </div>
                    </div>
                  </div>
                </Errors>
              </div>
            );
          })}
        </>
      )}

      <Button
        disabled={disabledCTA}
        className="text-blue-600 bg-green-300"
        data-testid="signupUser"
      >
        {showOTP
          ? z({
              en: 'Apply now',
              cy: 'Cymhwyswch nawr',
            })
          : z({
              en: 'Next',
              cy: 'Nesaf',
            })}
      </Button>
    </form>
  );
};

const PasswordInput = ({
  input,
  hasError = false,
}: {
  input: QuestionOrg;
  hasError: boolean;
}) => {
  const { z } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={twMerge('relative')}>
      <TextInput
        data-testid={input.name}
        className={twMerge(
          inputClasses,
          'pr-24',
          hasError ? 'border-red-500 border-[2px]' : '',
        )}
        name={input.name}
        id={input.name}
        type={showPassword ? 'text' : input.type}
      />

      {input.type === 'password' && (
        <button
          type="button"
          className={twMerge(
            'absolute right-3 top-0 bottom-0  text-sm uppercase',
          )}
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

export default SignUpUser;
