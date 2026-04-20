import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { FormError } from '@maps-react/mhf/types';

import { ContactFlowConfigMap } from '../../lib/types';
import { flowConfig } from '../../routes/flowConfig';
import { Enquiry } from './Enquiry';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../routes/flowConfig', () => ({
  flowConfig: new Map() as ContactFlowConfigMap,
}));

describe('Enquiry Component', () => {
  let mockErrors: FormError;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (translations: { en: JSX.Element; cy: JSX.Element }) =>
        translations.en,
    });
    flowConfig.clear();
    mockErrors = {
      'text-area': ['Description is required'],
      'booking-reference': ['Booking reference is required'],
    };
  });

  it('renders the component with no errors', () => {
    const { container } = render(<Enquiry step={mockSteps[0]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with all field errors', () => {
    flowConfig.set('mock-flow', {
      showBookingReferenceField: true,
    });
    const { container } = render(
      <Enquiry errors={mockErrors} flow="mock-flow" step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with booking reference field when showBookingReferenceField is true', () => {
    flowConfig.set('mock-flow', {
      showBookingReferenceField: true,
    });
    const { container } = render(
      <Enquiry flow="mock-flow" step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders without booking reference field when showBookingReferenceField is false', () => {
    flowConfig.set('other-flow', {
      showBookingReferenceField: false,
    });
    const { container } = render(
      <Enquiry flow="other-flow" step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with entry data populated', () => {
    const entryWithData = {
      ...mockEntry,
      data: {
        ...mockEntry.data,
        'text-area': 'This is a test enquiry with more than fifty characters',
        'booking-reference': 'REF123456',
      },
    };
    flowConfig.set('mock-flow', {
      showBookingReferenceField: true,
    });
    const { container } = render(
      <Enquiry entry={entryWithData} flow="mock-flow" step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
