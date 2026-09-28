import { useCallback } from 'react';

import { LoginConfirmOrg } from 'components/LoginConfirmOrg';
import { APIS } from 'CONSTANTS';
import { FormFields, loginContent, loginFields } from 'data/login';
import { FormField } from 'data/login/types';
import { ErrorField } from 'pages/api/auth';
import { twMerge } from 'tailwind-merge';
import { getLoginErrors } from 'utils/getLoginErrors';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const inputClasses =
  'w-full md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline';

export type Props = {
  lang?: string;
  user?: {
    referrerId: string;
    organisationConfirmed?: boolean;
    organisationName?: string;
  };
  errors: ErrorField[];
};

export const Login = ({ user, lang, errors }: Props) => {
  const { z } = useTranslation();

  const content = loginContent(z);
  const fields = loginFields(z) as FormFields;
  const referrerId = fields.find((f) => f.name === 'referrerId') as FormField;
  const { name, label, info } = referrerId;

  const getErrors = useCallback(
    (errors: ErrorField[]) => getLoginErrors(errors, fields),
    [fields],
  );

  const formErrors = getErrors(errors);

  const hasError = (field: FormField | undefined) => {
    return formErrors[field?.name as string]?.length > 0;
  };

  const showConfirmStep = user?.organisationName;

  return (
    <Container className={twMerge('my-8 lg:max-w-[1294px] lg:px-16 2xl:px-0')}>
      <Heading level="h1" className="mb-2 md:text-6xl md:max-w-[800px]">
        {content.title}
      </Heading>
      <Heading level="h2" className="md:text-5xl">
        {content.landing}
      </Heading>
      <ErrorSummary
        classNames="mt-8"
        title={content.errorTitle as string}
        errors={formErrors}
        titleLevel={'h4'}
      />
      <div className="grid gap-2 mt-14 lg:gap-20 xl:gap-4 lg:grid-cols-2">
        <div className="mb-8 lg:order-2">{content.debtAdviceContent}</div>
        <div className="lg:order-1">
          <Heading level="h3" className="md:text-4xl">
            {content.formTitle}
          </Heading>
          <form
            action={showConfirmStep ? '/api/auth-confirm' : '/api/auth'}
            method="POST"
            noValidate
            className="mb-16 mt-8 max-w-[495px]"
          >
            <input type="hidden" name="language" value={lang} />
            <Errors errors={formErrors[name]} className="mb-6">
              <label className="block mb-0 text-2xl" htmlFor={name}>
                {label}
              </label>
              <span className="text-lg text-gray-650 block">{info}</span>
              {formErrors[name] && (
                <div
                  className="text-red-700 text-[18px] my-1"
                  aria-describedby={name}
                >
                  {formErrors[name].toString()}
                </div>
              )}
              <input
                className={twMerge(
                  inputClasses,
                  hasError(referrerId) && 'border-red-700 border-[2px]',
                  showConfirmStep && 'bg-gray-95 text-gray-650 border-gray-650',
                )}
                id={name}
                defaultValue={user?.referrerId ?? ''}
                name={name}
                type="text"
                disabled={!!showConfirmStep}
              />
            </Errors>

            {showConfirmStep && (
              <LoginConfirmOrg user={user} formErrors={formErrors} />
            )}

            <Button
              className="mt-8 w-full text-lg md:w-auto"
              data-testid="sign-in"
            >
              {showConfirmStep
                ? z({
                    en: 'Confirm',
                    cy: 'Cadarnhau',
                  })
                : z({
                    en: 'Continue',
                    cy: 'Parhau',
                  })}
            </Button>

            {showConfirmStep && (
              <Button
                variant="link"
                type="button"
                as="a"
                href={`/${APIS.LOGOUT}`}
                data-testid="sign-out-button"
                data-cy="sign-out-button"
                className="w-full sm:w-auto sm:ml-none ml-4"
              >
                {z({
                  en: 'Back',
                  cy: 'Yn ôl',
                })}
              </Button>
            )}
          </form>
          {content.formContent}
        </div>
      </div>
    </Container>
  );
};
