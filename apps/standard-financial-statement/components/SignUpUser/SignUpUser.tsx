import { ChangeEventHandler, SubmitEventHandler } from 'react';

import { buttonStyles, checkboxStyles } from 'components/RichTextWrapper';
import {
  FormFlowType,
  FormStep,
  QuestionOrg,
  SIGN_UP_PART_2_ID,
} from 'data/form-data/org_signup';
import { userForm, userFormOTP } from 'data/form-data/user_signup';
import { useSignUpPart2FormScroll } from 'hooks/useSignUpPart2FormScroll';
import { twMerge } from 'tailwind-merge';

import { Button, Errors, H2, H3 } from '@maps-react/common/index';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import useTranslation from '@maps-react/hooks/useTranslation';

import { FormField } from '../FormField/FormField';

type Props = {
  formStep: FormStep;
  formFlowType?: FormFlowType;
  errors: Record<string, string[]>;
  inputIdPrefix: string;
  emailAddress: string;
  showOTP: boolean;
  disabledCTA?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

const SignUpUser = ({
  formStep,
  formFlowType,
  errors,
  inputIdPrefix,
  emailAddress = '',
  showOTP = false,
  disabledCTA = false,
  onChange,
  onSubmit,
}: Props) => {
  const { z } = useTranslation();
  const inputs = userForm(z, formStep, formFlowType);
  const inputOTP = userFormOTP(z) as QuestionOrg[];

  useSignUpPart2FormScroll(formStep, formFlowType);

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
      {inputs.map((input, index) => {
        const errorArr = errors[input.name] as string[] | undefined;
        const hasError = !!errorArr && errorArr.length > 0;
        const errorMsg = hasError
          ? errorArr[0].split('-').pop()?.trim() || errorArr[0]
          : undefined;
        const inputId = `${inputIdPrefix}${input.name}`;
        const errorId = hasError ? `${inputId}-error` : undefined;

        return (
          <div key={input.name} className="mb-8">
            {formFlowType === FormFlowType.NEW_ORG && index === 0 && (
              <H2 className="my-8 md:text-5xl" id={SIGN_UP_PART_2_ID}>
                {z({
                  en: 'Part 2 - Register as a user',
                  cy: 'Rhan 2 - Cofrestru fel defnyddiwr',
                })}
              </H2>
            )}
            {formFlowType === FormFlowType.EXISTING_ORG && index === 1 && (
              <H2 className="my-8 md:text-5xl">
                {z({
                  en: 'Register as a user of your organisation',
                  cy: 'Cofrestrwch fel defnyddiwr eich sefydliad',
                })}
              </H2>
            )}

            <Errors errors={hasError ? ['error'] : []} key={input.name}>
              <div key={input.name} className="mb-8">
                {input.name === 'codeOfConduct' ? (
                  <fieldset className="mb-4">
                    <legend className="block mb-8 text-3xl font-bold md:text-5xl">
                      {input.title}
                    </legend>
                    {input.description && <p>{input.description}</p>}
                    {hasError && errorMsg && (
                      <div
                        id={errorId}
                        className="text-red-700 text-[18px] mt-2 -mb-4"
                        aria-live="assertive"
                        role="alert"
                      >
                        {errorMsg}
                      </div>
                    )}
                    <div className="grid gap-4 mt-10 md:grid-cols-2">
                      <Checkbox
                        data-testid={input.name}
                        key={input.name}
                        id={inputId}
                        name={input.name}
                        value="true"
                        checkboxClassName={twMerge(
                          hasError ? 'border-red-700 border-[2px]' : '',
                          checkboxStyles,
                        )}
                        aria-invalid={!!hasError}
                        aria-describedby={errorId}
                      >
                        {input.definition}
                      </Checkbox>
                    </div>
                  </fieldset>
                ) : (
                  <FormField
                    input={input}
                    id={inputId}
                    hasError={hasError}
                    errorId={errorId}
                    onChange={onChange}
                    isPassword={input.type === 'password'}
                    errorMsg={errorMsg}
                  />
                )}
              </div>
            </Errors>
          </div>
        );
      })}

      {showOTP && (
        <>
          {inputOTP.map((input) => {
            const errorArr = errors[input.name] as string[] | undefined;
            const hasError = !!errorArr && errorArr.length > 0;
            const errorMsg = hasError
              ? errorArr[0].split(' - ').pop()?.trim() || errorArr[0]
              : undefined;
            const errorId = hasError ? `${input.name}-error` : undefined;
            const inputId = `${inputIdPrefix}${input.name}`;
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
                    <FormField
                      input={input}
                      id={inputId}
                      hasError={hasError}
                      errorId={errorId}
                      onChange={onChange}
                      isPassword={input.type === 'password'}
                      errorMsg={errorMsg}
                    />
                  </div>
                </Errors>
              </div>
            );
          })}
        </>
      )}

      <Button
        disabled={disabledCTA}
        className={twMerge(buttonStyles, 'mt-16')}
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

export default SignUpUser;
