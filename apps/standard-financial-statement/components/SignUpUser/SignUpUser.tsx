import { FormType, QuestionOrg } from 'data/form-data/org_signup';
import { userForm } from 'data/form-data/user_signup';
import React from 'react';

import { Button, Errors, H2 } from '@maps-react/common/index';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

const SignUpUser = ({
  formType,
  errors,
  onSubmit,
}: {
  formType: FormType;
  errors: Record<string, string[]>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) => {
  const { z } = useTranslation();
  const inputs = userForm(z, formType) as QuestionOrg[];

  return (
    <form
      method="POST"
      className="mt-6"
      action="/api/sign-up-user"
      noValidate
      onSubmit={(e) => onSubmit(e)}
    >
      {inputs.map((input, index) => {
        const hasError = errors[input.name] ?? false;

        return (
          <div key={input.name} className="mb-8">
            {formType === FormType.NEW_ORG_USER && index === 0 && (
              <H2 className="my-8 text-5xl">
                {z({
                  en: 'Part 2 - Register as a user',
                  cy: 'Part 2 - Register as a user',
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
                {input.name !== 'codeOfConduct' && (
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
                      defaultValue={''}
                    />
                  </div>
                )}

                {input.name === 'codeOfConduct' && (
                  <div className="mb-4">
                    <label htmlFor={input.name} className="text-5xl block mb-4">
                      {input.title}
                    </label>
                    {input.description && <p>{input.description}</p>}
                    {hasError && input?.errors && (
                      <div className="text-red-500 text-[18px] mb-1 -mt-2">
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
      <Button className="bg-green-300 text-blue-600">
        {z({
          en: 'Continue',
          cy: 'Parhau',
        })}
      </Button>
    </form>
  );
};

export default SignUpUser;
