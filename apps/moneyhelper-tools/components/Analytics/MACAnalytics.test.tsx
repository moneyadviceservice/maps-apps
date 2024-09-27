import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MACAnalytics } from './MACAnalytics';
import { Analytics } from './Analytics';
import { MacSteps } from 'pages/[language]/mortgage-affordability-calculator';
import { macAnalyticsData } from 'data/form-content/analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

jest.mock('./Analytics', () => ({
  Analytics: jest.fn(() => <div>Analytics Component</div>),
}));
jest.mock('data/form-content/analytics', () => ({
  macAnalyticsData: jest.fn(),
}));
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

describe('MACAnalytics Component', () => {
  const mockAnalyticsData = { some: 'data' };
  const mockTranslation = { z: 'test-translation' };

  const defaultProps = {
    currentStep: 1 as MacSteps,
    formData: {},
    acdlErrors: undefined,
    toolStarted: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (macAnalyticsData as jest.Mock).mockReturnValue(mockAnalyticsData);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  it('renders without crashing', () => {
    const { getByText } = render(<MACAnalytics {...defaultProps} />);
    expect(getByText('Analytics Component')).toBeInTheDocument();
  });

  it('calls useTranslation and passes translation data to macAnalyticsData', () => {
    render(<MACAnalytics {...defaultProps} />);

    expect(useTranslation).toHaveBeenCalled();
    expect(macAnalyticsData).toHaveBeenCalledWith('test-translation', 1);
  });

  it('returns correct input type for acdlErrors', () => {
    const acdlErrors = {
      'r-term': { error: { label: 'Term', message: 'Invalid term' } },
      'r-interest': {
        error: { label: 'Interest', message: 'Invalid interest' },
      },
      'other-error': { error: { label: 'Other', message: 'Invalid amount' } },
    };

    render(<MACAnalytics {...defaultProps} acdlErrors={acdlErrors} />);

    expect(Analytics).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [
          {
            reactCompType: 'NumberInput',
            reactCompName: 'Term',
            errorMessage: 'Invalid term',
          },
          {
            reactCompType: 'PercentageInput',
            reactCompName: 'Interest',
            errorMessage: 'Invalid interest',
          },
          {
            reactCompType: 'MoneyInput',
            reactCompName: 'Other',
            errorMessage: 'Invalid amount',
          },
        ],
      }),
      expect.anything(),
    );
  });

  it('passes the correct props to the Analytics component', () => {
    const toolStarted = true;

    render(<MACAnalytics {...defaultProps} toolStarted={toolStarted} />);

    expect(Analytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: mockAnalyticsData,
        currentStep: defaultProps.currentStep,
        formData: defaultProps.formData,
        trackDefaults: {
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: true,
          errorMessage: true,
        },
        lastStep: 3,
      }),
      expect.anything(),
    );
  });
});
