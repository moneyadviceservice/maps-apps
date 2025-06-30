import { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { AdminPageLayout } from 'layouts/AdminPageLayout';
import { BasePageLayout } from 'layouts/BasePageLayout';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';
import { CryptoProvider } from '@azure/msal-node';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  isAdmin: boolean;
};

let called = false;

const cryptoProvider = new CryptoProvider();

const CallbackPage = ({ siteConfig, assetPath, isAdmin }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const sendCodeToBackend = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) {
        console.error('Missing auth code or state in URL');
        return;
      }

      if (called) return;
      called = true;

      const res = await fetch('/api/auth/redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, state }),
      });

      if (res.redirected) {
        window.location.href = res.url;
      } else {
        console.error('Auth redirect failed');
      }
    };

    sendCodeToBackend();
  }, [router]);

  const children = (
    <Container>
      <Paragraph className="pt-12 text-center">
        Signing you in...{' '}
        <Icon
          type={IconType.SPINNER}
          className="w-[90px] h-[90px] animate-spin mx-auto my-10 text-blue-600"
          data-testid="nonjs-spinner"
        />
      </Paragraph>
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

  const state = JSON.parse(cryptoProvider.base64Decode(query?.state as string));
  const redirectUrl: string = state?.redirectTo ?? '/';

  const siteConfig = await fetchSiteSettings(lang);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      isAdmin: redirectUrl.includes('admin'),
    },
  };
};
