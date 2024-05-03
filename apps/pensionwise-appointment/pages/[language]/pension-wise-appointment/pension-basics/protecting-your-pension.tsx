import { GetServerSideProps, NextPage } from 'next';
import { fetchDetail, Detail, fetchShared } from '../../../../utils';
import {
  DetailPageProps,
  PensionwisePageLayout,
  PensionWisePageProps,
  H2,
  mapJsonRichText,
  Callout,
  CalloutVariant,
  RichTextAem,
} from '@maps-digital/shared/ui';

const Page: NextPage<PensionWisePageProps & DetailPageProps> = ({
  data,
  ...pageProps
}) => {
  return (
    <PensionwisePageLayout {...pageProps}>
      <div>
        {data.title && (
          <H2 className="mt-2 mb-6" data-testid="section-title">
            {data.title}
          </H2>
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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
    },
  };
};
