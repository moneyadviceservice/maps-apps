import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';

import { ApptSaveProps, fetchSave, fetchShared } from '../../../utils';
import SaveAndReturn from '../../../components/SaveAndReturn/SaveAndReturn';
import { SAVE_PAGE_OPTIONS } from '../../../utils/saveConstants';

const Page: NextPage<PensionWisePageProps & ApptSaveProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  const { route } = pageProps;

  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <SaveAndReturn data={data} nonce={nonce} pageProps={route} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const data = await fetchSave(query, SAVE_PAGE_OPTIONS.SAVE_AND_RETURN);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  const cookies = new Cookies(req, res);
  const BASE_URL = `/${query.language}/${process.env.appUrl}`;

  // split the the url at the app name
  const backUrlArray = req.headers.referer?.split(
    process.env.appUrl ?? BASE_URL,
  );

  // get the second part of the array (after the app name)
  const backUrlPath =
    backUrlArray && backUrlArray[1] !== '' ? backUrlArray[1] : '/';

  // remove the query params
  // if there are no params you have come from the appointment page
  const backUrl =
    backUrlPath.split('?')[0] !== '' ? backUrlPath.split('?')[0] : '/';

  let backLink;

  if (backUrl !== '/save' && backUrl !== '/progress-saved') {
    // not coming from progress-saved or itself
    // set the set saveBack cookie for future reference and backUrl
    cookies.set('saveBack', backUrl, {
      httpOnly: true,
    });
    backLink = backUrl;
  } else {
    //coming from progress-saved or itself
    // set backUrl to the saveBack cookie value or '/' if no cookie set
    backLink = cookies.get('saveBack') ?? '/';
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data?.browserPageTitle ?? '',
      route: {
        query,
        back: backLink,
        app: process.env.appUrl ?? '',
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
