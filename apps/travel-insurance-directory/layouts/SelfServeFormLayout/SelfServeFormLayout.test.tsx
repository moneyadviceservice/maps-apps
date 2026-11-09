import type { ComponentProps, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import { SelfServeFormLayout } from './SelfServeFormLayout';

const mockErrorSummaryProvider = jest.fn();
const mockTravelInsuranceDirectory = jest.fn();

type ErrorSummaryProviderProps = {
  children: (args: { errorSummarySection: ReactNode }) => ReactNode;
};

type TravelInsuranceDirectoryProps = {
  children: ReactNode;
};

jest.mock('context/ErrorSummaryProvider', () => ({
  ErrorSummaryProvider: (props: ErrorSummaryProviderProps) => {
    mockErrorSummaryProvider(props);

    return props.children({
      errorSummarySection: <div data-testid="error-summary" />,
    });
  },
}));

jest.mock('layouts/TravelInsuranceDirectory', () => ({
  TravelInsuranceDirectory: (props: TravelInsuranceDirectoryProps) => {
    mockTravelInsuranceDirectory(props);

    return <div data-testid="travel-insurance-directory">{props.children}</div>;
  },
}));

describe('SelfServeFormLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: ComponentProps<typeof SelfServeFormLayout> = {
    title: 'Default Title',
    backLink: '/back',
    initialErrors: null,
    children: <div>Page content</div>,
  };

  const renderLayout = (
    props: Partial<ComponentProps<typeof SelfServeFormLayout>> = {},
  ) => {
    return render(<SelfServeFormLayout {...defaultProps} {...props} />);
  };

  it('renders children and passes props to its dependencies', () => {
    renderLayout({
      title: 'My Title',
      initialErrors: { field: { error: 'required' } },
    });

    expect(screen.getByText('Page content')).toBeInTheDocument();

    expect(mockErrorSummaryProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        initialErrors: { field: { error: 'required' } },
        isRadio: false,
      }),
    );

    expect(mockTravelInsuranceDirectory).toHaveBeenCalledWith(
      expect.objectContaining({
        browserTitle: 'Self Serve - My Title',
        backLink: '/back',
        heading: 'My Title',
        showLanguageSwitcher: false,
      }),
    );
  });

  it('forwards errorMessageOverrides to ErrorSummaryProvider', () => {
    const errorMessageOverrides = {
      offers_telephone_quote:
        'Select whether you offer a telephone quote service',
    };

    renderLayout({ isRadio: true, errorMessageOverrides });

    expect(mockErrorSummaryProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        isRadio: true,
        errorMessageOverrides,
      }),
    );
  });

  it('forwards fieldLabels to ErrorSummaryProvider', () => {
    const fieldLabels = { test_field: 'Test Field Label' };

    renderLayout({ fieldLabels });

    expect(mockErrorSummaryProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldLabels,
      }),
    );
  });

  it('forwards analyticsData and analyticsConfig to TravelInsuranceDirectory', () => {
    const mockAnalyticsData = { page: { name: 'test' } };
    const mockAnalyticsConfig = { lastStep: '5' };

    renderLayout({
      analyticsData: mockAnalyticsData as AnalyticsData,
      analyticsConfig: mockAnalyticsConfig,
    });

    expect(mockTravelInsuranceDirectory).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: mockAnalyticsData,
        analyticsConfig: mockAnalyticsConfig,
      }),
    );
  });

  it('defaults initialErrors to an empty object if undefined', () => {
    renderLayout({ initialErrors: undefined });

    expect(mockErrorSummaryProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        initialErrors: {},
      }),
    );
  });
});
