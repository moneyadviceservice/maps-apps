import { NextPage } from 'next';
import { ErrorPageLayout } from '@maps-digital/shared/ui';

type Props = {
  isEmbedded: boolean;
};

const ErrorPage: NextPage<Props> = ({ isEmbedded }: Props) => {
  return <ErrorPageLayout isEmbedded={isEmbedded} />;
};

export default ErrorPage;

ErrorPage.getInitialProps = ({ query }) => {
  return {
    isEmbedded: query.isEmbedded === 'true',
  };
};
