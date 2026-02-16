import { ErrorField } from 'pages/api/auth';
import { render } from '@testing-library/react';

import { Login } from './Login';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string }) => (typeof t === 'string' ? t : t.en),
  }),
}));

jest.mock('utils/getLoginErrors', () => ({
  getLoginErrors: (errors: ErrorField[]) => ({
    referrerId: errors.map((e: ErrorField) => e.field),
  }),
}));

describe('Login', () => {
  it('renders component', () => {
    render(<Login lang="en" user={{ referrerId: 'ABC123' }} errors={[]} />);
  });

  it('renders errors and no LoginConfirmOrg', () => {
    const { getByTestId, queryByTestId } = render(
      <Login lang="en" errors={[{ field: 'referrerId', type: '' }]} />,
    );

    expect(getByTestId('error-summary-container')).toBeInTheDocument();
    expect(queryByTestId('confirmOrganisation-errors')).not.toBeInTheDocument();
  });

  it('renders LoginConfirmOrg component when referrerId is set', () => {
    const { getByTestId } = render(
      <Login
        lang="en"
        user={{ referrerId: 'ABC123', organisationName: 'Test Account' }}
        errors={[{ field: 'referrerId', type: '' }]}
      />,
    );

    expect(getByTestId('confirmOrganisation-errors')).toBeInTheDocument();
  });
});
