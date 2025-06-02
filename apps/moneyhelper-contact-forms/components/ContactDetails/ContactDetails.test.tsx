import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ContactDetails } from './ContactDetails';

jest.mock('@maps-react/hooks/useTranslation');

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
});
