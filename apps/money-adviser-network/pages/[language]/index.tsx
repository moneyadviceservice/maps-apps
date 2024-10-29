import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { GetServerSideProps } from 'next';
import { SignIn } from 'components/SignIn/SignIn';
import useTranslation from '@maps-react/hooks/useTranslation';
import { pageTitles } from 'data/sign-in/sign-in';
import { decrypt } from 'lib/token';
import { ErrorField } from 'pages/api/auth';

type Props = {
  isEmbed?: boolean;
  lang: string;
  user: { username: string; password: string };
  errors: ErrorField[];
};

export const Page = ({ lang, user, errors }: Readonly<Props>) => {
  const { z } = useTranslation();
  const page = pageTitles(z);
  return (
    <ToolPageLayout pageTitle={page.title} noMargin={true}>
      <SignIn lang={lang} user={user} errors={errors} />
    </ToolPageLayout>
  );
};

export const getServerSidePropsDefault: GetServerSideProps = async ({
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
        destination: `/${lang}/money-adviser-network/q-1`,
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsDefault(context);
};

export default Page;
