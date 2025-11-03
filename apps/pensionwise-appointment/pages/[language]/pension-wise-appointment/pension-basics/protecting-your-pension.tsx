import { GetServerSideProps, NextPage } from 'next';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { H1 } from '@maps-react/common/components/Heading';
import {
  DetailPageProps,
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { Detail, fetchDetail, fetchShared } from '../../../../utils';

const Page: NextPage<PensionWisePageProps & DetailPageProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <div>
        {data.title && (
          <H1 className="mt-2 mb-6" data-testid="section-title">
            {data.title}
          </H1>
        )}
        {data.content && (
          <Callout variant={CalloutVariant.WARNING}>
            <RichTextAem className="[&_h3]:mt-0">
              {mapJsonRichText(data.content.json)}
            </RichTextAem>
          </Callout>
        )}
      </div>
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const data = await fetchDetail(Detail.PROTECTING_YOUR_PENSION, query);
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
        back: '/pension-basics',
        next: '/pension-basics/keeping-track-of-pensions',
        saveReturnLink: true,
        query,
        app: process.env.appUrl,
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
