import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';
import { CryptoProvider } from '@azure/msal-node';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  redirectUrl: string;
};

let called = false;

const cryptoProvider = new CryptoProvider();

const CallbackPage = ({ redirectUrl }: Props) => {
  const router = useRouter();
  const { z } = useTranslation();
  const title = appTitle(z);

  const [hasError, setHasError] = useState<boolean>(false);

  const refreshToRetry = () => {
    setHasError(false);
    globalThis.location.href = `/auth/callback?code=retry&redirectTo=${encodeURIComponent(
      redirectUrl,
    )}`;
  };

  useEffect(() => {
    const sendCodeToBackend = async () => {
      const params = new URLSearchParams(globalThis.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code === 'retry') {
        const redirectTo = params.get('redirectTo');
        globalThis.location.href = `/api/auth/signin?redirectTo=${
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
          globalThis.location.href = res.url;
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

  return (
    <ToolPageLayout
      pageTitle={pageTitle('Redirecting', z)}
      title={title}
      titleTag="span"
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
    >
      <Container>
        {hasError ? (
          <>
            <Paragraph className="pt-12 md:pt-24 text-center">
              Something went wrong signing you in. Please retry by clicking
              login below.
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
    </ToolPageLayout>
  );
};

export default CallbackPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const state =
    query?.state &&
    JSON.parse(cryptoProvider.base64Decode(query?.state as string));
  const redirectUrl: string = state?.redirectTo ?? query?.redirectTo ?? '/';

  return {
    props: {
      redirectUrl,
    },
  };
};
