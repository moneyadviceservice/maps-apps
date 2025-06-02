import React from 'react';

import { FormType, QuestionOrg } from 'data/form-data/org_signup';
import { userForm, userFormOTP } from 'data/form-data/user_signup';
import { twMerge } from 'tailwind-merge';

import { Button, Errors, H2 } from '@maps-react/common/index';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

const inputClasses =
  'border-gray-400 w-full h-10 px-3 m-px border rounded focus:outline-purple-700 focus:shadow-focus-outline tool-field';

const SignUpUser = ({
  formType,
  errors,
  showOTP = false,
  continuationToken,
  onSubmit,
}: {
  formType: FormType;
  errors: Record<string, string[]>;
  showOTP: boolean;
  continuationToken: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) => {
  const { z } = useTranslation();
  const inputs = userForm(z, formType) as QuestionOrg[];
  const inputOTP = userFormOTP(z) as QuestionOrg[];

  return (
    <form
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
              <H2 className="my-8 text-5xl">
                {z({
                  en: 'Part 2 - Register as a user',
                  cy: 'Rhan 2 – Cofrestru fel defnyddiwr',
                })}
              </H2>
            )}
            {formType === FormType.ACTIVE_ORG && index === 1 && (
              <H2 className="my-8 text-5xl">
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
                    <TextInput
                      name={input.name}
                      id={input.name}
                      type={input.type}
                    />
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
                      name={input.name}
                      id={input.name}
                      className={twMerge(inputClasses)}
                    />
                  </div>
                )}

                {input.name === 'codeOfConduct' && (
                  <div className="mb-4">
                    <label htmlFor={input.name} className="block mb-4 text-5xl">
                      {input.title}
                    </label>
                    {input.description && <p>{input.description}</p>}
                    {hasError && input?.errors && (
                      <div className="text-red-500 text-[18px] mb-1 mt-2">
                        {hasError[0].split('-')[1].trim()}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-6 mb-16">
                      <Checkbox
                        key={input.name}
                        id={input.name}
                        name={input.name}
                        value="true"
                        checkboxClassName="peer-checked:text-blue-600"
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
              <div key={input.name} className="mb-8">
                <Errors errors={hasError ? ['error'] : []} key={input.name}>
                  <div key={input.name} className="mb-8">
                    <div>
                      <label
                        htmlFor={input.name}
                        className="block my-8 mb-2 text-5xl"
                      >
                        {input.title}
                      </label>
                      {input.description}
                      {hasError && input?.errors && (
                        <div className="text-red-500 text-[18px] mb-1 -mt-2">
                          {hasError[0].split('-')[1].trim()}
                        </div>
                      )}
                      <div className="max-w-sm mt-2">
                        <NumberInput
                          className={twMerge(
                            // error ? 'border-red-700' : 'border-gray-400',
                            inputClasses,
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

      <Button className="text-blue-600 bg-green-300" data-testid="signupUser">
        {showOTP
          ? z({
              en: 'Apply now',
              cy: 'Cymhwyswch nawr',
            })
          : z({
              en: 'Continue',
              cy: 'Parhau',
            })}
      </Button>
    </form>
  );
};

export default SignUpUser;
