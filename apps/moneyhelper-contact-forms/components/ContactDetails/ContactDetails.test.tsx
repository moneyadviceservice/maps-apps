import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ContactDetails } from './ContactDetails';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/constants', () => ({
  ...jest.requireActual('../../lib/constants'),
  FLOWS_WITH_REQUIRED_PHONE_NUMBER: ['mock-flow'],
}));

const mockUseTranslation = useTranslation as jest.Mock;

describe('ContactDetails', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders the component with no errors', () => {
    const { container } = render(<ContactDetails />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with errors', () => {
    const mockErrors = [
      { field: 'email', message: 'Invalid email address' },
      { field: 'phone-number', message: 'Invalid phone number' },
      { field: 'post-code', message: 'Invalid postcode' },
    ];

    const { container } = render(<ContactDetails errors={mockErrors} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the required phone number label when flow is in FLOWS_WITH_REQUIRED_PHONE_NUMBER', () => {
    const { getByLabelText } = render(<ContactDetails flow="mock-flow" />);
    expect(
      getByLabelText('components.contact-details.form.phone-number.label'),
    ).toBeInTheDocument();
  });

  it('renders the optional phone number label when flow is not in FLOWS_WITH_REQUIRED_PHONE_NUMBER', () => {
    const { getByLabelText } = render(<ContactDetails flow="not-in-list" />);
    expect(
      getByLabelText(
        'components.contact-details.form.phone-number.optional.label',
      ),
    ).toBeInTheDocument();
  });
});
