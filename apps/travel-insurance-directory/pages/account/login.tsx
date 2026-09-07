import { useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';

import Cookies from 'cookies';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import { getIronSession, IronSessionData } from 'iron-session';
import TravelInsuranceDirectory from 'layouts/TravelInsuranceDirectory';
import { accountSessionOptions } from 'lib/accountAuth/accountSessionOptions';
import { accountAuthCookies } from 'lib/accountAuth/cookies';
import { accountAuthRoutes } from 'lib/accountAuth/routes';
import type { InputErrorTypes } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';
import { getOtpErrorMessage } from 'utils/helper/register/getOtpErrorMessage/getOtpErrorMessage';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { TextInput } from '@maps-react/form/components/TextInput';

type FormErrorsState = Record<string, { error: InputErrorTypes }>;

type Props = {
  initialErrors?: FormErrorsState | null;
  displayOtp?: boolean;
  initialEmail?: string | null;
};

const heading = 'Login';
const analyticsData = getAnalyticsStepData('selfServe', 'login', 0, heading);
const analyticsConfig = getSelfServeConfig('login');

const AccountLoginPage = ({
  initialErrors,
  displayOtp,
  initialEmail,
}: Props) => {
  const isOtpStep = displayOtp;
  const displayBacklink = isOtpStep === false;
  const backLink = isOtpStep ? undefined : accountAuthRoutes.pages.landing;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageError = initialErrors?.page?.error;
  const emailError = initialErrors?.email?.error;
  const otpError = initialErrors?.otp?.error;

  const email = initialEmail ?? ''; // for backwards compatibility with existing code

  const pageMessage = useMemo(() => {
    if (!pageError) return null;
    return 'There is a problem. Try again later.';
  }, [pageError]);

  const emailMessage = useMemo(() => {
    if (!emailError) return null;
    if (emailError === 'required') return 'Enter your email address';
    if (emailError === 'user_not_found') {
      return "We couldn't find an account with this email address";
    }
    if (emailError === 'invalid' || emailError === 'invalid_grant') {
      return 'Enter a valid email address';
    }
    return 'Enter a valid email address';
  }, [emailError]);

  const otpMessage = useMemo(() => {
    if (!otpError) return null;
    return getOtpErrorMessage(otpError, email);
  }, [otpError, email]);

  const errorSummaryErrors = useMemo(() => {
    const e: Record<string, (string | undefined)[]> = {};
    if (pageMessage) e.value = [pageMessage]; // generic, not linked
    if (emailMessage) e.email = [emailMessage]; // links to #email
    if (otpMessage) e.otp = [otpMessage]; // links to #otp
    return Object.keys(e).length ? e : null;
  }, [pageMessage, emailMessage, otpMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
  };

  return (
    <TravelInsuranceDirectory
      browserTitle="Account sign in"
      displayBacklink={displayBacklink}
      backLink={backLink}
      showLanguageSwitcher={false}
      errorSummarySection={
        errorSummaryErrors ? (
          <ErrorSummary
            title={'There is a problem'}
            errors={errorSummaryErrors}
          />
        ) : null
      }
      analyticsData={analyticsData}
      analyticsConfig={analyticsConfig}
    >
      {isOtpStep && (
        <Button
          variant="link"
          type="submit"
          form="account-login-reset-form"
          className="text-magenta-500 group hover:text-pink-800 hover:no-underline"
          data-testid="account-login-back"
          iconLeft={
            <Icon
              type={IconType.CHEVRON_LEFT}
              className="text-magenta-500 group-hover:text-pink-800 w-[8px] h-[15px]"
              aria-hidden="true"
            />
          }
        >
          Back
        </Button>
      )}
      {heading && <Heading level="h1">{heading}</Heading>}
      <form
        method="POST"
        action={
          isOtpStep ? accountAuthRoutes.api.verify : accountAuthRoutes.api.start
        }
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="mt-6"
      >
        <Errors
          errors={emailMessage ? [emailMessage] : undefined}
          className="mb-4"
          testId="email-errors"
        >
          {isOtpStep && <input type="hidden" name="email" value={email} />}
          <div className="[&>label]:text-2xl [&>label]:max-w-2xl">
            <TextInput
              data-testid="email"
              label="Email address"
              hasGlassBoxClass={true}
              className="max-w-[620px]"
              error={emailMessage ?? undefined}
              name="email"
              id="email"
              type="email"
              defaultValue={email}
              disabled={isOtpStep}
            />
          </div>
        </Errors>

        {isOtpStep && (
          <Errors
            errors={otpMessage ? [otpMessage] : undefined}
            className="mb-4 mt-8"
            testId="otp-errors"
          >
            <div className="[&>label]:text-2xl [&>label]:max-w-2xl">
              <TextInput
                data-testid="otp"
                label="Enter the one-time passcode (OTP) we sent to your email address"
                hasGlassBoxClass={true}
                className="max-w-[620px]"
                error={otpMessage ?? undefined}
                name="otp"
                id="otp"
                type="text"
              />
            </div>
          </Errors>
        )}

        <Button
          data-testid="account-login-submit"
          disabled={isSubmitting}
          variant={isSubmitting ? 'loading' : 'primary'}
        >
          {isOtpStep ? 'Sign in' : 'Continue'}
        </Button>
        {isOtpStep && (
          <Button
            data-testid="account-login-reset"
            variant="link"
            type="submit"
            disabled={isSubmitting}
            form="account-login-resend-form"
            className="ml-4"
          >
            Resend OTP code
          </Button>
        )}
      </form>
      {isOtpStep && (
        <>
          <form
            id="account-login-reset-form"
            method="POST"
            action={accountAuthRoutes.api.reset}
          />
          <form
            id="account-login-resend-form"
            method="POST"
            action={accountAuthRoutes.api.start}
          >
            <input type="hidden" name="email" value={email} />
          </form>
        </>
      )}
    </TravelInsuranceDirectory>
  );
};

export default AccountLoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    accountSessionOptions,
  );
  if (session?.isAccountAuthenticated) {
    // Treat a missing email as an invalid auth session, otherwise
    // /account can redirect back here and cause a loop.
    if (session.accountEmail) {
      return {
        redirect: {
          destination: accountAuthRoutes.pages.accountHome,
          permanent: false,
        },
        props: {},
      };
    } else {
      session.isAccountAuthenticated = false;
      session.accountEmail = undefined;
      session.accountIdToken = undefined;
      await session.save();
    }
  }

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);
  const showOtpQuery = query?.showOtp === 'true';
  const cookies = new Cookies(req, res);
  const hasContinuation = !!cookies.get(accountAuthCookies.continuation);
  const initialEmail = cookies.get(accountAuthCookies.loginEmail) ?? null;

  return {
    props: {
      initialErrors: errorCookie?.fields ?? null,
      displayOtp: showOtpQuery && hasContinuation,
      initialEmail,
    },
  };
};
