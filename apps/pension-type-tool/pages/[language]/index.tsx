import { GetServerSideProps } from 'next';

export default function LanguageIndex() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = params?.language === 'cy' ? 'cy' : 'en';
  return {
    redirect: {
      destination: `/${lang}/pension-type`,
      permanent: false,
    },
  };
};
