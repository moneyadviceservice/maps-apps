import { NextPage } from 'next';

import { ErrorComponent } from '../components';
import { ContactFormsLayout } from '../layouts/ContactFormsLayout';

const ErrorPage: NextPage = () => {
  return (
    <ContactFormsLayout step="error" hasLayoutContent={false}>
      <ErrorComponent step="error" />
    </ContactFormsLayout>
  );
};

export default ErrorPage;
