import { GetServerSideProps } from 'next';

import { Login } from 'components/Login';
import { MANAnalytics } from 'data/analytics/analytics';
import { config } from 'data/civic-cookies';
import { loginFields, pageTitles } from 'data/login';
import { decrypt } from 'lib/token';
import { ErrorField } from 'pages/api/auth';
import { getCookiePolicyLink } from 'utils/getCookiePolicyLink';
import { getLoginAcdlErrors } from 'utils/getLoginErrors';
import { checkSessionValidity } from 'utils/session/checkSessionValidity';

import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { PATHS } from '../../CONSTANTS';

type Props = {
  lang: string;
  user: { referrerId: string; organisationName?: string };
  errors: ErrorField[];
};

const LoginPage = ({ lang, user, errors }: Readonly<Props>) => {
  const { z } = useTranslation();
  const { z: enTranslation } = useTranslation('en');

  const page = pageTitles(z);
  const pageEn = pageTitles(enTranslation);

  const fields = loginFields(z);

  const stepData = {
    pageName: '',
    pageTitle: page.title,
    stepName: pageEn.title,
  };

  const acdlErrors = getLoginAcdlErrors(errors, fields);

  return (
    <ToolPageLayout
      pageTitle={page.title}
      noMargin={true}
      cookieConfig={config}
      altCookieLink={getCookiePolicyLink(z)}
    >
      <Analytics
        analyticsData={MANAnalytics(z, 0, stepData)}
        currentStep={0}
        formData={{}}
        errors={acdlErrors}
      >
        <Login lang={lang} user={user} errors={errors} />
      </Analytics>
    </ToolPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  query,
}) => {
  const lang = params?.language;
  let session = null;
  let errors = [] as ErrorField[];
  if (req.cookies.session) {
    session = await decrypt(req.cookies.session);
  }

  if (query.errors) {
    errors = JSON.parse(query.errors as string) as ErrorField[];
  }

  const isSessionValid = session && (await checkSessionValidity(session));
  if (isSessionValid) {
    return {
      redirect: {
        destination: `/${lang}/${PATHS.START}/q-1`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      lang: lang,
      user: session?.payload ?? null,
      errors: errors,
    },
  };
};

export default LoginPage;
