import { Button, Errors, Heading } from '@maps-digital/shared/ui';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import {
  signInContent,
  SignInFields,
  signInFields,
} from '../../data/sign-in/sign-in';
import { ErrorField } from '../../pages/api/auth';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = {
  lang?: string;
  user: { username: string; password: string };
  errors: ErrorField[];
};

export const SignIn = ({ user, lang, errors }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [jsEnabled, setJsEnabled] = useState(false);

  const { z } = useTranslation();
  const content = signInContent(z);
  const fields = signInFields(z);
  const username = fields.find((f) => f.name === 'username') as SignInFields;
  const password = fields.find((f) => f.name === 'password') as SignInFields;

  const getErrors = useCallback(
    (errors: ErrorField[]): Record<string, string[]> => {
      const errorMap: Record<string, string[]> = {};

      errors.forEach((e) => {
        const field = fields.find((f) => f.name === e.field);
        const err =
          (field?.errors &&
            (field?.errors as Record<string, string>)[e.type]) ||
          null;

        if (field && err) {
          if (errorMap[e.field]) {
            errorMap[e.field].push('\n');
            errorMap[e.field].push(err);
          } else {
            errorMap[e.field] = [err];
          }
        }
      });

      return errorMap;
    },
    [fields],
  );

  const formErrors = getErrors(errors);

  const hasError = (field: SignInFields | undefined) => {
    return formErrors[field?.name as string]?.length > 0;
  };

  const inputClasses =
    'w-full md:max-w-[408px] h-10 px-3 m-px mt-2 text-lg border border-gray-800 rounded focus:outline-purple-700 focus:shadow-focus-outline';

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  return (
    <Container className={twMerge('lg:max-w-[1294px] my-8 lg:px-16 2xl:px-0')}>
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
      />
      <div className="grid gap-2 mt-14 lg:gap-20 xl:gap-4 lg:grid-cols-2">
        <div className="mb-8 lg:order-2">{content.debtAdviceContent}</div>
        <div className="lg:order-1">
          <Heading level="h3" className="md:text-4xl">
            {content.formTitle}
          </Heading>
          <form
            action="/api/auth"
            method="POST"
            noValidate
            className="mb-16 mt-8 max-w-[495px]"
          >
            <input type="hidden" name="language" value={lang} />
            <Errors errors={formErrors[username.name]} className="mb-6">
              <label className="block mb-0 text-2xl" htmlFor={username.name}>
                {username.label}
              </label>
              <span className="text-lg text-gray-400">{username.info}</span>
              {formErrors[username.name] && (
                <div
                  className="text-red-700 text-[18px] my-1"
                  aria-describedby={username.name}
                >
                  {formErrors[username.name].toString()}
                </div>
              )}
              <input
                className={twMerge(
                  inputClasses,
                  hasError(username) && 'border-red-700 border-[2px]',
                )}
                id={username.name}
                defaultValue={user?.username ?? ''}
                name={username.name}
                type="text"
              />
            </Errors>
            <Errors errors={formErrors[password.name]} className="mb-6">
              <label className="block mb-0 text-2xl" htmlFor={password.name}>
                {password.label}
              </label>
              {formErrors[password.name] && (
                <div
                  className="text-red-700 text-[18px] mt-1 mb-3"
                  aria-describedby={password.name}
                >
                  {formErrors[password.name].toString()}
                </div>
              )}
              <div
                className={twMerge(
                  'flex md:max-w-[408px] pl-3 m-px mt-2 h-10 border border-gray-800 rounded focus-within:outline-purple-700 focus-within:shadow-focus-outline',
                  hasError(password) && 'border-red-700 border-[2px]',
                )}
              >
                <input
                  className={twMerge(
                    'w-full m-px text-lg focus-visible:outline-none',
                  )}
                  id={password.name}
                  name={password.name}
                  defaultValue={user?.password ?? ''}
                  type={showPassword ? 'text' : 'password'}
                />
                {jsEnabled && (
                  <button
                    type="button"
                    className="flex items-center px-3 ml-auto text-sm uppercase "
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={(e) => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
            </Errors>

            <Button
              className="w-full mt-8 text-lg md:w-auto"
              data-testid="sign-in"
            >
              {z({
                en: 'Sign in',
                cy: 'Mewngofnodi',
              })}
            </Button>
          </form>
          {content.formContent}
        </div>
      </div>
    </Container>
  );
};

export default SignIn;
