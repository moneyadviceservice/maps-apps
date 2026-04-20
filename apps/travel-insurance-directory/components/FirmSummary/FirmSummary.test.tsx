import {
  MedicalCoverage,
  Office,
  OpeningTimes,
  ServiceDetails,
} from 'types/travel-insurance-firm';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FirmSummary } from './FirmSummary';
import { createMockFirm } from './mockFirm';

import '@testing-library/jest-dom';

const mockAddEvent = jest.fn();

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ addEvent: mockAddEvent }),
}));

const office = createMockFirm()?.offices?.[0] as Office;
const medicalCoverage = createMockFirm().medical_coverage as MedicalCoverage;
const serviceDetails = createMockFirm().service_details as ServiceDetails;

function renderOpeningTimes(openingTimes: OpeningTimes[]) {
  const mockFirm = createMockFirm({
    offices: [
      {
        ...office,
        opening_times: openingTimes,
      },
    ],
  });
  render(<FirmSummary firm={mockFirm} />);
  return screen.getByTestId('office-opening-times-0');
}

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      language: 'en',
    },
    asPath: '/en/listings',
    push: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

describe('FirmSummary', () => {
  beforeEach(() => {
    mockAddEvent.mockClear();
  });

  it('renders firm name', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(
      screen.getByText('Holiday Extras Cover Limited'),
    ).toBeInTheDocument();
  });

  it('renders contact details in an expandable section', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByTestId('expandable-section')).toBeInTheDocument();
    expect(screen.getByText('Contact details')).toBeInTheDocument();
  });

  it('renders policy table column headers', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Policy feature')).toBeInTheDocument();
    expect(screen.getByText('Coverage details')).toBeInTheDocument();
  });

  it('renders office opening times and contact when offices exist', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Call')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    const openingTimesContainer = screen.getByTestId('office-opening-times-0');
    expect(openingTimesContainer).toHaveTextContent('Monday-Friday');
    expect(openingTimesContainer).toHaveTextContent('9am');
    expect(openingTimesContainer).toHaveTextContent('5pm');
    expect(screen.getByTestId('office-telephone-0')).toHaveTextContent(
      '0333 999 2679',
    );
    expect(screen.getByTestId('office-email-0')).toHaveTextContent(
      'insurancewithenquiries@holidayextras.com',
    );
  });

  it('renders office telephone number', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    const telephoneLink = screen.getByText('0333 999 2679');
    expect(telephoneLink).toBeInTheDocument();
    expect(telephoneLink.closest('a')).toHaveAttribute(
      'href',
      'tel:0333 999 2679',
    );
  });

  it('renders office email address', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    const emailLink = screen.getByText(
      'insurancewithenquiries@holidayextras.com',
    );
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute(
      'href',
      'mailto:insurancewithenquiries@holidayextras.com',
    );
  });

  it('renders "No contact details available" when no offices exist', () => {
    const mockFirm = createMockFirm({ offices: [] });
    render(<FirmSummary firm={mockFirm} />);

    expect(
      screen.getByText('No contact details available.'),
    ).toBeInTheDocument();
  });

  it('does not render website link when no website_address and no offices', () => {
    const mockFirm = createMockFirm({
      website_address: null,
      offices: [],
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(
      screen.queryByText('Visit provider website (opens in new tab)'),
    ).not.toBeInTheDocument();
  });

  it('renders website link when website_address exists', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    const websiteLink = screen.getByText(
      'Visit provider website (opens in new tab)',
    );
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink.closest('a')).toHaveAttribute(
      'href',
      'https://www.holidayextras.com',
    );
    expect(websiteLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('pushes outboundClick when visit provider website link is clicked', async () => {
    const user = userEvent.setup();
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    await user.click(
      screen.getByText('Visit provider website (opens in new tab)'),
    );

    expect(mockAddEvent).toHaveBeenCalledTimes(1);
    expect(mockAddEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'outboundClick',
        eventInfo: {
          link: {
            url: 'https://www.holidayextras.com',
            text: 'Visit provider website (opens in new tab)',
            type: 'external',
          },
          provider: 'Holiday Extras Cover Limited',
        },
        page: expect.objectContaining({
          pageName: 'travel-insurance-directory--firm-listings',
        }),
        tool: expect.objectContaining({
          toolName: 'Travel Insurance Directory',
          toolStep: '3',
        }),
      }),
    );
  });

  it('renders website link from office contact when website_address is null', () => {
    const mockFirm = createMockFirm({
      website_address: null,
    });
    render(<FirmSummary firm={mockFirm} />);

    const websiteLink = screen.getByText(
      'Visit provider website (opens in new tab)',
    );
    expect(websiteLink.closest('a')).toHaveAttribute(
      'href',
      'https://www.holidayextras.com',
    );
  });

  it('renders medical conditions coverage as "Most conditions covered" when coverage is "all"', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Medical conditions covered')).toBeInTheDocument();
    expect(screen.getByText('Most conditions covered')).toBeInTheDocument();
  });

  it('renders "Not specified" when medical conditions coverage is null', () => {
    const mockFirm = createMockFirm({
      medical_coverage: {
        ...medicalCoverage,
        covers_medical_condition_question: null,
      },
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('renders medical conditions coverage value when not "all"', () => {
    const mockFirm = createMockFirm({
      medical_coverage: {
        ...medicalCoverage,
        covers_medical_condition_question: 'one_specific',
      },
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('one_specific')).toBeInTheDocument();
  });

  it('renders medical equipment cover with amount when available', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Medical equipment cover')).toBeInTheDocument();
    expect(screen.getByText('Yes, up to £3,000')).toBeInTheDocument();
  });

  it('renders "Yes" for medical equipment when covered but no amount', () => {
    const mockFirm = createMockFirm({
      service_details: {
        ...serviceDetails,
        will_cover_specialist_equipment: true,
        cover_for_specialist_equipment: null,
      },
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Medical equipment cover')).toBeInTheDocument();
    const yesElements = screen.getAllByText('Yes');
    expect(yesElements.length).toBeGreaterThan(0);
  });

  it('renders "No" for medical equipment cover when not available', () => {
    const mockFirm = createMockFirm({
      service_details: {
        ...serviceDetails,
        will_cover_specialist_equipment: false,
      },
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders cruise cover as "Yes"', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Cruise cover')).toBeInTheDocument();
    const cruiseCoverYes = screen.getByTestId('cruise-cover-yes');
    expect(cruiseCoverYes).toHaveTextContent('Yes');
  });

  it('renders medical screening company name with tick when specified', () => {
    const mockFirm = createMockFirm();
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('Medical screening')).toBeInTheDocument();
    const screeningCell = screen.getByTestId('medical-screening-value');
    expect(screeningCell).toHaveTextContent('Verisk');
  });

  it('renders "Not specified" for medical screening when company is null', () => {
    const mockFirm = createMockFirm({
      service_details: {
        ...serviceDetails,
        medical_screening_company: null,
      },
    });
    render(<FirmSummary firm={mockFirm} />);

    const notSpecified = screen.getAllByText('Not specified');
    expect(notSpecified.length).toBeGreaterThanOrEqual(1);
  });

  it('handles firm with no service details', () => {
    const mockFirm = createMockFirm({ service_details: null });
    render(<FirmSummary firm={mockFirm} />);

    expect(
      screen.getByText('Holiday Extras Cover Limited'),
    ).toBeInTheDocument();
    expect(screen.getByText('Not specified')).toBeInTheDocument();
    expect(screen.getByTestId('medical-screening-value')).toHaveTextContent(
      'Not specified',
    );
  });

  it('renders with different language', () => {
    const mockFirm = createMockFirm();
    const { container } = render(<FirmSummary firm={mockFirm} />);

    expect(container).toBeInTheDocument();
    expect(
      screen.getByText('Holiday Extras Cover Limited'),
    ).toBeInTheDocument();
  });

  it('renders office with only email when no telephone', () => {
    const mockFirm = createMockFirm({
      offices: [
        {
          ...office,
          contact: {
            ...office.contact,
            telephone_number: null,
            email_address: 'only-email@example.com',
            website: null,
          },
          opening_times: [],
        },
      ],
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByText('only-email@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('office-email-0')).toBeInTheDocument();
    expect(screen.queryByTestId('office-telephone-0')).not.toBeInTheDocument();
  });

  it('renders office with no opening times', () => {
    const mockFirm = createMockFirm({
      offices: [
        {
          ...office,
          opening_times: [],
        },
      ],
    });
    render(<FirmSummary firm={mockFirm} />);

    expect(screen.getByTestId('office-telephone-0')).toHaveTextContent(
      '0333 999 2679',
    );
    expect(
      screen.queryByTestId('office-opening-times-0'),
    ).not.toBeInTheDocument();
  });

  it('renders opening times with Saturday only', () => {
    const openingTimes = renderOpeningTimes([
      {
        weekday: { opening: null, closing: null },
        saturday: { opening: '10:00:00', closing: '14:00:00' },
        sunday: { opening: null, closing: null },
      },
    ]);
    expect(openingTimes).toHaveTextContent('Saturday');
    expect(openingTimes).toHaveTextContent('10am');
    expect(openingTimes).toHaveTextContent('2pm');
  });

  it('renders opening times with 12pm and 12am', () => {
    const openingTimes = renderOpeningTimes([
      {
        weekday: {
          opening: '00:00:00',
          closing: '12:00:00',
        },
        saturday: { opening: null, closing: null },
        sunday: { opening: null, closing: null },
      },
    ]);
    expect(openingTimes).toHaveTextContent('12am');
    expect(openingTimes).toHaveTextContent('12pm');
  });

  it('renders opening times with minutes (e.g. 2:30pm)', () => {
    const openingTimes = renderOpeningTimes([
      {
        weekday: {
          opening: '09:30:00',
          closing: '14:30:00',
        },
        saturday: { opening: null, closing: null },
        sunday: { opening: null, closing: null },
      },
    ]);
    expect(openingTimes).toHaveTextContent('9:30am');
    expect(openingTimes).toHaveTextContent('2:30pm');
  });

  it('renders opening times with Sunday only', () => {
    const openingTimes = renderOpeningTimes([
      {
        weekday: { opening: null, closing: null },
        saturday: { opening: null, closing: null },
        sunday: { opening: '10:00:00', closing: '16:00:00' },
      },
    ]);
    expect(openingTimes).toHaveTextContent('Sunday');
    expect(openingTimes).toHaveTextContent('10am');
    expect(openingTimes).toHaveTextContent('4pm');
  });

  it('renders multiple offices with separators', () => {
    const offices = createMockFirm().offices as Office[];
    const mockFirm = createMockFirm({
      offices: [
        ...offices,
        {
          address: {
            line_one: 'Second Office',
            line_two: null,
            town: 'London',
            county: null,
            postcode: 'SW1A 1AA',
          },
          contact: {
            email_address: 'second@example.com',
            telephone_number: '020 1234 5678',
            website: null,
          },
          location: {
            latitude: 51.5074,
            longitude: -0.1278,
          },
          disabled_access: true,
          opening_times: [],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-12-01T00:00:00Z',
        },
      ],
    });
    render(<FirmSummary firm={mockFirm} />);

    const firstOfficeContact = screen.getByTestId('office-contact-0');
    expect(firstOfficeContact).toHaveTextContent('0333 999 2679');

    const secondOfficeContact = screen.getByTestId('office-contact-1');
    expect(secondOfficeContact).toHaveTextContent('020 1234 5678');
  });
});
