import { ReactNode } from 'react';

import { getValueByPath } from 'lib/firms/getValueByPath';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler';
import { fireEvent, render, screen } from '@testing-library/react';

import { ConfirmDetails } from './ConfirmDetails';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockSetFormSummaryErrors = jest.fn();
jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: () => ({
    setFormSummaryErrors: mockSetFormSummaryErrors,
  }),
}));

const mockSubmitHandler = jest.fn((e) => e.preventDefault());
jest.mock('utils/helper/form/createSubmitHandler', () => ({
  createSubmitHandler: jest.fn(() => mockSubmitHandler),
}));

jest.mock('lib/firms/getValueByPath', () => ({
  getValueByPath: jest.fn(),
}));

jest.mock('data/pages/account/firm-details/confirm-details', () => ({
  confirmDetailsPage: {
    submitApi: '/api/firm/confirm',
    nextStep: '/account/dashboard',
    formKey: 'confirm_details_form',
    buttonLabel: 'Confirm',
    questionsSections: [
      {
        key: 'contact_section',
        title: 'Contact Information',
        linkToPage: '/account/firm-details/contact',
        questions: [
          {
            key: 'email_address',
            title: 'Email Address',
            dataPath: 'office/contact',
          },
          {
            key: 'saturday_opening',
            title: 'Saturday opening hours',
            dataPath: 'office/opening_times/weekend',
          },
          {
            key: 'saturday_opening_time',
            title: 'Saturday opening time',
            dataPath: 'office/opening_times/weekend',
            hideWhen: {
              field: { key: 'saturday_opening', dataPath: 'office/address' },
              value: 'no',
            },
          },
          {
            key: 'sunday_opening',
            title: 'Sunday opening hours',
            dataPath: 'office/opening_times/weekend',
          },
          {
            key: 'sunday_opening_time',
            title: 'Sunday opening time',
            dataPath: 'office/address',
            hideWhen: {
              field: {
                key: 'sunday_opening',
                dataPath: 'office/opening_times/weekend',
              },
              value: 'no',
            },
          },
        ],
      },
    ],
  },
}));

jest.mock('components/form/FormPage', () => ({
  FormPage: ({
    children,
    submitAction,
  }: {
    children: ReactNode;
    submitAction: () => void;
  }) => (
    <form data-testid="mock-form" onSubmit={submitAction}>
      {children}
    </form>
  ),
}));

const firmIdMock = 'mock-id-firm-123';

describe('ConfirmDetails Component', () => {
  const mockFirmData = {
    id: 'firm_123',
    office: {
      contact: { email_address: 'firm@example.com' },
      address: {
        line_one: '123 street',
        town: 'test town',
        county: 'county',
        postcode: 'AA23WW',
      },
      opening_times: {
        weekend: {
          saturday_opening: 'yes',
          saturday_opening_time: '09:00',
          sunday_opening: 'no',
          sunday_opening_time: '10:00',
        },
      },
    },
  } as unknown as TravelInsuranceFirmDocument;

  beforeEach(() => {
    jest.clearAllMocks();

    (getValueByPath as jest.Mock).mockImplementation(
      (_obj: unknown, path: string) => {
        switch (path) {
          case 'office/contact/email_address':
            return 'firm@example.com';
          case 'office/opening_times/weekend/saturday_opening':
            return 'yes';
          case 'office/opening_times/weekend/saturday_opening_time':
            return '09:00';
          case 'office/opening_times/weekend/sunday_opening':
            return 'no';
          case 'office/opening_times/weekend/sunday_opening_time':
            return '10:00';
          default:
            return undefined;
        }
      },
    );
  });

  it('should render section headings and dynamic table structures correctly', () => {
    render(<ConfirmDetails firmData={mockFirmData} firmId={firmIdMock} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Contact Information' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('table', { name: 'Contact Information' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('question-header')).toBeInTheDocument();
    expect(screen.getByTestId('submission-header')).toBeInTheDocument();
  });

  it('should render the question titles and extract submission data via getValueByPath', () => {
    render(<ConfirmDetails firmData={mockFirmData} firmId={firmIdMock} />);

    expect(getValueByPath).toHaveBeenCalledWith(
      mockFirmData,
      'office/contact/email_address',
    );

    expect(screen.getByTestId('dt-email_address')).toHaveTextContent(
      'Email Address',
    );
    expect(screen.getByTestId('dd-email_address')).toHaveTextContent(
      'firm@example.com',
    );
  });

  it('should evaluate the hideWhen configurations and show/hide fields accordingly', () => {
    render(<ConfirmDetails firmData={mockFirmData} firmId={firmIdMock} />);

    expect(
      screen.queryByTestId('dt-sunday_opening_time'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dd-sunday_opening_time'),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId('dt-saturday_opening_time')).toHaveTextContent(
      'Saturday opening time',
    );
    expect(screen.getByTestId('dd-saturday_opening_time')).toHaveTextContent(
      '09:00',
    );
  });

  it('should correctly attach styles for capitalized Yes/No answers', () => {
    render(<ConfirmDetails firmData={mockFirmData} firmId={firmIdMock} />);

    const sundayOpeningCell = screen.getByTestId('dd-sunday_opening');
    const saturdayOpeningCell = screen.getByTestId('dd-saturday_opening');

    expect(sundayOpeningCell).toHaveClass('capitalize');
    expect(saturdayOpeningCell).toHaveClass('capitalize');
  });

  it('should construct the correct formAction modifications on the change buttons', () => {
    render(<ConfirmDetails firmData={mockFirmData} firmId={firmIdMock} />);

    const changeButton = screen.getByTestId('change-question-email_address');

    expect(changeButton).toHaveAttribute(
      'href',
      '/account/firm-details/contact/mock-id-firm-123?change=true#email_address',
    );

    expect(screen.getByText('your answer for Email Address')).toHaveClass(
      'sr-only',
    );
  });

  it('should initialize the submit handler config and capture form submission clicks', () => {
    render(<ConfirmDetails firmData={mockFirmData} firmId={firmIdMock} />);

    expect(createSubmitHandler).toHaveBeenCalledWith({
      apiUrl: '/api/firm/confirm',
      nextStep: '/account/dashboard',
      setIsPending: expect.any(Function),
      setFormSummaryErrors: mockSetFormSummaryErrors,
      router: expect.any(Object),
    });

    const form = screen.getByTestId('mock-form');
    fireEvent.submit(form);

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
});
