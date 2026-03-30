import { render } from '@testing-library/react';

import {
  mockEntry,
  mockFlow,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { FormError } from '@maps-react/mhf/types';

import { routeFlow } from '../../routes/routeFlow';
import { ContactDetails } from './ContactDetails';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../routes/routeFlow', () => ({
  routeFlow: new Map(),
}));

describe('ContactDetails', () => {
  let mockErrors: FormError;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
    (routeFlow as Map<string, unknown>).clear();
    mockErrors = {
      email: ['Invalid email'],
      'phone-number': ['Invalid phone'],
      'post-code': ['Invalid postcode'],
    };
  });

  it('renders the component with no errors', () => {
    const { container } = render(<ContactDetails step={mockSteps[0]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with all field errors', () => {
    const { container } = render(
      <ContactDetails errors={mockErrors} step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with required phone number label', () => {
    routeFlow.set(mockFlow, {
      steps: ['contact-details'],
      phoneNumberRequired: true,
    });
    const { container } = render(
      <ContactDetails flow={mockFlow} step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with optional phone number label', () => {
    routeFlow.set('other-flow', {
      steps: mockSteps,
      phoneNumberRequired: false,
    });
    const { container } = render(
      <ContactDetails flow="other-flow" step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with entry data populated', () => {
    const entryWithData = {
      ...mockEntry,
      data: {
        ...mockEntry.data,
        email: 'test@example.com',
        'phone-number': '07123456789',
        'post-code': 'SW1A 1AA',
      },
    };
    const { container } = render(
      <ContactDetails
        entry={entryWithData}
        flow="test-flow"
        step={mockSteps[0]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
