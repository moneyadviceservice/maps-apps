import { GetServerSideProps } from 'next';

import { SignIn } from 'components/SignIn/SignIn';
import { MANAnalytics } from 'data/analytics/analytics';
import { pageTitles, signInFields } from 'data/sign-in/sign-in';
import { decrypt } from 'lib/token';
import { ErrorField } from 'pages/api/auth';

import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { getLoginAcdlErrors } from 'utils/getLoginErrors';
import { PATHS } from '../../CONSTANTS';

type Props = {
  lang: string;
  user: { username: string; password: string };
  errors: ErrorField[];
};

export const Login = ({ lang, user, errors }: Readonly<Props>) => {
  const { z } = useTranslation();
  const { z: enTranslation } = useTranslation('en');

  const page = pageTitles(z);
  const pageEn = pageTitles(enTranslation);

  const fields = signInFields(z);

  const stepData = {
    pageName: '',
    pageTitle: page.title,
    stepName: pageEn.title,
  };

  const acdlErrors = getLoginAcdlErrors(errors, fields);

  return (
    <ToolPageLayout pageTitle={page.title} noMargin={true}>
      <Analytics
        analyticsData={MANAnalytics(z, 0, stepData)}
        currentStep={0}
        formData={{}}
        errors={acdlErrors}
      >
        <SignIn lang={lang} user={user} errors={errors} />
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
  let user = null;
  let errors = [] as ErrorField[];
  if (req.cookies.user) {
    user = (await decrypt(req.cookies.user)).payload;
  }

  if (query.errors) {
    errors = JSON.parse(query.errors as string) as ErrorField[];
  }

  if (req.cookies.accessToken) {
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
      user: user,
      errors: errors,
    },
  };
};

export default Login;
