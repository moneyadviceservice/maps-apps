import { GetServerSideProps, NextPage } from 'next';

import { H1, H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';

import { fetchProgress, fetchShared } from '../../..//utils';

type ApptProgressModel = {
  title: string;
  subTitle: string;
  text: JsonRichText;
  moneyHelperLinkText: string;
  resendEmailText: string;
  feedbackLinkText: string;
  feedbackSubText: string;
};

type ApptProgressProps = {
  data: ApptProgressModel;
};

const Page: NextPage<PensionWisePageProps & ApptProgressProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  const {
    route: { query },
  } = pageProps;
  const { language, ...newQuery } = query;
  const {
    title,
    subTitle,
    text,
    moneyHelperLinkText,
    resendEmailText,
    feedbackLinkText,
    feedbackSubText,
  } = data;
  const { z } = useTranslation();

  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <H1 className="mt-0 mb-8" data-testid="section-title">
        {title}
      </H1>
      <H3 className="mb-4">{subTitle}</H3>
      <div className="mb-6">{mapJsonRichText(text.json)}</div>
      <div className="mt-8 mb-8 md:flex">
        <Link
          href={`https://www.moneyhelper.org.uk/${language}`}
          asButtonVariant="primary"
          className="w-full md:w-auto !justify-center"
          data-testid="moneyhelper"
        >
          {moneyHelperLinkText}
        </Link>

        <Link
          href={{
            pathname: `/${language}/${process.env.appUrl}/save`,
            query: newQuery,
          }}
          asButtonVariant="secondary"
          className="ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-auto !justify-center"
          data-testid="resend-email"
        >
          {resendEmailText}
        </Link>
      </div>
      <Link
        href={z({
          en: 'https://forms.office.com/e/5k3b567kJ5',
          cy: 'https://forms.office.com/e/7FwWzGLHjv',
        })}
        target="_blank"
      >
        {feedbackLinkText}
      </Link>{' '}
      <span className="ml-6">{feedbackSubText}</span>
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const data = await fetchProgress(query);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data.browserPageTitle,
      route: {
        query,
        app: process.env.appUrl,
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
