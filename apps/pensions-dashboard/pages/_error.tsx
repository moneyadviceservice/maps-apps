import { NextPage } from 'next';
import { PensionsDashboardLayout } from '../layouts/PensionsDashboardLayout';
import { Heading } from '@maps-react/common/components/Heading';
import { PROTOCOL } from '../lib/constants';

type Props = {
  host: string;
};

const ErrorPage: NextPage<Props> = ({ host }) => {
  return (
    <PensionsDashboardLayout title="Sorry we couldn't find the page you're looking for">
      <p>It may no longer exist, or the link contained an error</p>
      <Heading
        fontWeight="semi-bold"
        level="h3"
        component="h2"
        className="mt-10 mb-6"
      >
        What you can do
      </Heading>
      <ul className="list-disc pl-10 space-y-1">
        <li>
          If you typed the URL in the address bar, check it&apos;s correct.
        </li>
        <li>
          You can also{' '}
          <a href={`${PROTOCOL}${host}`} className="underline text-purple-500">
            browse from our homepage
          </a>{' '}
          for the information you need.
        </li>
        <li>
          Try clicking the Back button in your browser to check if you&apos;re
          in the right place.
        </li>
        <li>
          Or use the search box, above, to find what you were looking for.
        </li>
      </ul>
    </PensionsDashboardLayout>
  );
};

export default ErrorPage;

ErrorPage.getInitialProps = ({ req }) => {
  return {
    host: req?.headers.host ?? '',
  };
};
