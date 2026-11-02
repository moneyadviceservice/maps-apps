import { NextPage } from 'next';

import { ErrorPageLayout } from '@maps-react/layouts/ErrorPageLayout';

const ErrorPage: NextPage = () => {
  return <ErrorPageLayout isEmbedded={false} />;
};

export default ErrorPage;
