import { GetServerSideProps, NextPage } from 'next';

import { H1, H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';

import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';

import { fetchProgress, fetchShared } from '../../../../utils';
import { PROGRESS_SAVED_PAGES } from '../../../../utils/saveConstants';

type ApptProgressModel = {
  title: string;
  subTitle: string;
  text: JsonRichText;
  primaryButtonLabel: string;
  resendEmailText: string;
  feedbackLink?: string;
  feedbackLinkText?: string;
  feedbackSubText: string;
};

type ApptProgressProps = {
  data: ApptProgressModel;
  buttonLinks: {
    primaryButton: Record<string, string>;
    secondaryButton: Record<string, string>;
  };
};

const buttonLinks = (
  slug: string,
  language: string,
  path: string,
  params: { [key: string]: string | string[] | undefined },
) => {
  let links = {};

  switch (slug) {
    case PROGRESS_SAVED_PAGES.NEXT_STEPS:
      links = {
        primaryButton: {
          pathname: `/${language}/${path}/summary`,
          query: params,
        },
        secondaryButton: {
          pathname: `/${language}/${path}/get-next-steps`,
          query: params,
        },
      };
      break;
    case PROGRESS_SAVED_PAGES.PROGRESS_SAVED:
      links = {
        primaryButton: {
          pathname: `https://www.moneyhelper.org.uk/${language}`,
        },
        secondaryButton: {
          pathname: `/${language}/${path}/save`,
          query: params,
        },
      };
      break;
  }
  return links;
};

const Page: NextPage<PensionWisePageProps & ApptProgressProps> = ({
  data,
  buttonLinks,
  nonce,
  ...pageProps
}) => {
  const {
    title,
    subTitle,
    text,
    primaryButtonLabel,
    resendEmailText,
    feedbackLink,
    feedbackLinkText,
    feedbackSubText,
  } = data;

  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <H1 className="mt-0 mb-8" data-testid="section-title">
        {title}
      </H1>
      <H3 className="mb-4">{subTitle}</H3>
      <div className="mb-6">{mapJsonRichText(text.json)}</div>
      <div className="mt-8 mb-8 md:flex">
        <Link
          href={buttonLinks.primaryButton}
          asButtonVariant="primary"
          className="w-full md:w-auto !justify-center"
          data-testid="progress-saved-primary"
        >
          {primaryButtonLabel}
        </Link>

        <Link
          href={buttonLinks.secondaryButton}
          asButtonVariant="secondary"
          className="ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-auto !justify-center"
          data-testid="resend-email"
        >
          {resendEmailText}
        </Link>
      </div>
      {feedbackLink && feedbackLinkText && (
        <>
          <Link href={feedbackLink} target="_blank">
            {feedbackLinkText}
          </Link>{' '}
          <span className="ml-6">{feedbackSubText}</span>
        </>
      )}
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { language, slug, ...rest } = query;

  const data = await fetchProgress(query, slug as string);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      buttonLinks: buttonLinks(
        String(slug),
        String(language),
        process.env.appUrl ?? 'pension-wise-appointment',
        rest,
      ),
      pageTitle: data.browserPageTitle,
      route: {
        query,
        app: process.env.appUrl,
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
