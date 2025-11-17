import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ContactDetails } from './ContactDetails';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/constants', () => ({
  ...jest.requireActual('../../lib/constants'),
  FLOWS_WITH_REQUIRED_PHONE_NUMBER: ['mock-flow'],
}));
const mockFlow = 'mock-flow';
const mockStep = 'mock-step';

const mockUseTranslation = useTranslation as jest.Mock;
describe('ContactDetails', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders the component with no errors', () => {
    const { container } = render(<ContactDetails step={mockStep} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with errors', () => {
    const mockErrors = {
      email: ['Field 1 is required'],
      'phone-number': ['Field 1 is required'],
      'post-code': ['Field 2 is required'],
    };

    const { container } = render(
      <ContactDetails errors={mockErrors} step={mockStep} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the required phone number label when flow is in FLOWS_WITH_REQUIRED_PHONE_NUMBER', () => {
    const { getByLabelText } = render(
      <ContactDetails flow={mockFlow} step={mockStep} />,
    );
    expect(
      getByLabelText('components.contact-details.form.phone-number.label'),
    ).toBeInTheDocument();
  });

  it('renders the optional phone number label when flow is not in FLOWS_WITH_REQUIRED_PHONE_NUMBER', () => {
    const { getByLabelText } = render(
      <ContactDetails flow="not-in-list" step={mockStep} />,
    );
    expect(
      getByLabelText(
        'components.contact-details.form.phone-number.optional.label',
      ),
    ).toBeInTheDocument();
  });
});
