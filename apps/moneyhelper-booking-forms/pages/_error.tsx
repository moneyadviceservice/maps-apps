import { NextPage } from 'next';

import { ErrorComponent } from '../components';
import { BookingFormsLayout } from '../layouts/BookingFormsLayout';

const ErrorPage: NextPage = () => {
  return (
    <BookingFormsLayout step="error">
      <ErrorComponent step="error" />
    </BookingFormsLayout>
  );
};

export default ErrorPage;
