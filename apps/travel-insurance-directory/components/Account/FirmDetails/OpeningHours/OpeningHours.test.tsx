import { useRouter } from 'next/router';

import { useErrorSummary } from 'hooks/useErrorSummary';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler';
import { render, screen } from '@testing-library/react';

import { OpeningHours } from './OpeningHours';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

jest.mock('utils/helper/form/createSubmitHandler', () => ({
  createSubmitHandler: jest.fn(),
}));

jest.mock('data/pages/account/firm-details/opening-hours', () => ({
  openingHoursPage: {
    description: 'Please enter your opening hours.',
    submitApi: '/api/submit',
    nextStep: '/next-step',
    formKey: 'openingHoursForm',
  },
  openingTimeField: { key: 'openingTime' },
  closingTimeField: { key: 'closingTime' },
  saturdayOpeningRadioField: { key: 'satRadio' },
  saturdayOpeningField: { key: 'satOpen' },
  saturdayClosingField: { key: 'satClose' },
  sundayOpeningRadioField: { key: 'sunRadio' },
  sundayOpeningField: { key: 'sunOpen' },
  sundayClosingField: { key: 'sunClose' },
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

jest.mock('components/form/FormPage', () => ({
  FormPage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-form-page">{children}</div>
  ),
}));

jest.mock('components/form/TimeInput', () => ({
  TimeInput: () => <div data-testid="mock-time-input" />,
}));

jest.mock('components/form/ConditionalTimeInput', () => ({
  ConditionalTimeInput: () => <div data-testid="mock-conditional-time-input" />,
}));

const firmIdMock = 'firm-id-mock-321';

describe('OpeningHours Component', () => {
  const mockRouter = { push: jest.fn() };
  const mockSetFormSummaryErrors = jest.fn();
  const mockSubmitHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useErrorSummary as jest.Mock).mockReturnValue({
      setFormSummaryErrors: mockSetFormSummaryErrors,
    });
    (createSubmitHandler as jest.Mock).mockReturnValue(mockSubmitHandler);
  });

  it('renders correctly with description and form elements', () => {
    render(<OpeningHours initialValues={null} firmId={firmIdMock} />);

    expect(
      screen.getByText('Please enter your opening hours.'),
    ).toBeInTheDocument();

    expect(screen.getByTestId('mock-form-page')).toBeInTheDocument();

    const timeInputs = screen.getAllByTestId('mock-time-input');
    expect(timeInputs).toHaveLength(2);

    const conditionalInputs = screen.getAllByTestId(
      'mock-conditional-time-input',
    );
    expect(conditionalInputs).toHaveLength(2);
  });

  it('initializes the submit handler with correct parameters', () => {
    render(<OpeningHours initialValues={null} firmId={firmIdMock} />);

    expect(createSubmitHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        apiUrl: '/api/submit',
        nextStep: '/next-step',
        setFormSummaryErrors: mockSetFormSummaryErrors,
        router: mockRouter,
      }),
    );
  });
});
