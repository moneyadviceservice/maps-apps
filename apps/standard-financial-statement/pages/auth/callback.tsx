import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { AdminPageLayout } from 'layouts/AdminPageLayout';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';
import { CryptoProvider } from '@azure/msal-node';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  isAdmin: boolean;
  redirectUrl: string;
};

let called = false;

const cryptoProvider = new CryptoProvider();

const CallbackPage = ({
  siteConfig,
  assetPath,
  isAdmin,
  redirectUrl,
}: Props) => {
  const router = useRouter();

  const [hasError, setHasError] = useState<boolean>(false);

  const refreshToRetry = () => {
    setHasError(false);
    window.location.href = `/auth/callback?code=retry&redirectTo=${encodeURIComponent(
      redirectUrl,
    )}`;
  };

  useEffect(() => {
    const sendCodeToBackend = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code === 'retry') {
        const redirectTo = params.get('redirectTo');
        window.location.href = `/api/auth/signin?redirectTo=${
          redirectTo ?? '/'
        }`;
        return;
      } else if (!code || !state) {
        console.error('Missing auth code or state in URL');
        setHasError(true);

        return;
      }

      if (called) return;
      called = true;

      try {
        const res = await fetch('/api/auth/redirect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code, state }),
        });

        if (res.redirected) {
          window.location.href = res.url;
        } else {
          throw new Error('Auth redirect failed');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setHasError(true);
      }
    };

    sendCodeToBackend();
  }, [router]);

  const children = (
    <Container>
      {hasError ? (
        <>
          <Paragraph className="pt-12 md:pt-24 text-center">
            Something went wrong signing you in. Please retry by clicking login
            below.
          </Paragraph>
          <div className="pb-12 md:pb-24 text-center">
            <Button onClick={refreshToRetry} className="mx-auto my-10">
              Login
            </Button>
          </div>
        </>
      ) : (
        <>
          <Paragraph className="pt-12 text-center">
            Signing you in...{' '}
          </Paragraph>
          <Icon
            type={IconType.SPINNER}
            className="w-[90px] h-[90px] animate-spin mx-auto my-10 text-blue-600"
            data-testid="nonjs-spinner"
          />
        </>
      )}
    </Container>
  );

  const commonProps = {
    siteConfig: siteConfig,
    assetPath: assetPath,
    pageTitle: 'Redirecting',
  };

  return isAdmin ? (
    <AdminPageLayout {...commonProps}>{children}</AdminPageLayout>
  ) : (
    <BasePageLayout {...commonProps} breadcrumbs={[]} slug={[]} lang={''}>
      {children}
    </BasePageLayout>
  );
};

export default CallbackPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lang = 'en';

  const state =
    query?.state &&
    JSON.parse(cryptoProvider.base64Decode(query?.state as string));
  const redirectUrl: string = state?.redirectTo ?? query?.redirectTo ?? '/';

  const siteConfig = await fetchSiteSettings(lang);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      isAdmin: redirectUrl.includes('admin'),
      redirectUrl,
    },
  };
};
