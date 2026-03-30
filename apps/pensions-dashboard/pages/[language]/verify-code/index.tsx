import { GetServerSideProps, NextPage } from 'next';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { useVerifyCode } from '../../../lib/hooks';

type VerifyCodePageProps = {
  linkId: string;
};

const Page: NextPage<VerifyCodePageProps> = ({ linkId }) => {
  const { t } = useTranslation('en');
  const titleKey = 'pages.verify-code.title';

  const {
    code,
    handleCodeChange,
    errorMessage,
    loading,
    resendLoading,
    resendSuccess,
    handleSubmit,
    handleResend,
  } = useVerifyCode(linkId);

  return (
    <PensionsDashboardLayout
      title={t(titleKey)}
      seoTitle={t('pages.verify-code.page-title')}
      isOffset={false}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <div className="md:max-w-4xl">
        <Paragraph className="mb-6">{t('pages.verify-code.intro')}</Paragraph>

        <form onSubmit={handleSubmit} className="mb-6">
          <label htmlFor="verify-code" className="block pb-2 text-lg">
            {t('pages.verify-code.code-label')}
          </label>
          <div className="flex items-center gap-4">
            <input
              id="verify-code"
              name="code"
              data-testid="verify-code-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              disabled={loading}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? 'verify-code-error' : undefined}
              className={twMerge(
                'px-3 m-px w-full max-w-xs h-10 rounded border focus:outline-none focus:shadow-focus-outline focus:border-1 focus:border-blue-700',
                errorMessage ? 'border-red-700 border-2' : 'border-gray-400',
              )}
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              data-testid="resend-code"
              className="text-blue-700 underline hover:text-blue-900 disabled:text-gray-400 disabled:no-underline whitespace-nowrap"
            >
              {resendLoading
                ? t('pages.verify-code.resend-loading')
                : t('pages.verify-code.resend')}
            </button>
          </div>

          {errorMessage && (
            <Paragraph
              id="verify-code-error"
              className="mt-2 text-red-700"
              data-testid="verify-code-error"
              role="alert"
            >
              {errorMessage}
            </Paragraph>
          )}

          {resendSuccess && (
            <Paragraph
              className="mt-2 text-green-700"
              data-testid="resend-success"
              role="status"
            >
              {t('pages.verify-code.resend-success')}
            </Paragraph>
          )}

          <div className="mt-6">
            <Button
              data-testid="verify-code-submit"
              type="submit"
              variant="primary"
              disabled={loading || code.length !== 6}
            >
              {loading
                ? t('pages.verify-code.submit-loading')
                : t('pages.verify-code.submit')}
            </Button>
          </div>
        </form>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<
  VerifyCodePageProps
> = async (context) => {
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const lang = context.params?.language;
  const locale = Array.isArray(lang) ? lang[0] : lang;

  if (locale !== 'en') {
    return {
      redirect: {
        destination: `/en/verify-code${(context.resolvedUrl ?? '').replaceAll(
          /^[^?]*/g,
          '',
        )}`,
        permanent: false,
      },
    };
  }

  const linkId = context.query.linkId;

  if (!linkId || typeof linkId !== 'string') {
    return {
      redirect: {
        destination: '/en/link-access-error',
        permanent: false,
      },
    };
  }

  return {
    props: { linkId },
  };
};
