import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Entry, EntryData, FormError } from '../../lib/types';
import { Enquiry } from './Enquiry';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/constants', () => ({
  ...jest.requireActual('../../lib/constants'),
  FLOWS_WITH_BOOKING_REFERENCE: ['mock-flow'],
}));

const mockUseTranslation = useTranslation as jest.Mock;

describe('Enquiry Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (translations: { en: JSX.Element; cy: JSX.Element }) =>
        translations.en, // Always return the English translation for tests
    });
  });

  it('renders the component with title and form', () => {
    const { container } = render(<Enquiry />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const mockErrors: FormError[] = [
      { field: 'text-area', message: 'Description is required' },
    ];

    const { container } = render(<Enquiry errors={mockErrors} />);

    expect(
      screen.getByText('components.enquiry.form.text-area.error'),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders booking reference field when flow is in FLOWS_WITH_BOOKING_REFERENCE', () => {
    render(<Enquiry flow="mock-flow" />);
    expect(
      screen.getByLabelText('components.enquiry.form.booking-reference.label'),
    ).toBeInTheDocument();
  });

  it('does not render booking reference field when flow is not in FLOWS_WITH_BOOKING_REFERENCE', () => {
    render(<Enquiry flow="not-in-list" />);
    expect(
      screen.queryByLabelText(
        'components.enquiry.form.booking-reference.label',
      ),
    ).not.toBeInTheDocument();
  });

  it('renders booking reference with error', () => {
    const mockErrors: FormError[] = [
      { field: 'booking-reference', message: 'Booking reference is required' },
    ];
    render(<Enquiry errors={mockErrors} flow="mock-flow" />);
    expect(
      screen.getByText('components.enquiry.form.booking-reference.error'),
    ).toBeInTheDocument();
  });

  it('renders text area with default value', () => {
    const mockEntry = {
      data: {
        'text-area': 'Default text',
        flow: 'mock-flow',
        lang: 'en',
      } as EntryData,
    } as Entry;
    render(<Enquiry entry={mockEntry} />);
    expect(screen.getByRole('textbox')).toHaveValue('Default text');
  });
});
