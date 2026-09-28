import type { ComponentProps, ReactNode } from 'react';

import { TrackEvents } from 'components/Analytics/AnalyticsTrigger';
import { fireEvent, render, screen } from '@testing-library/react';

import { TravelInsuranceDirectory } from './TravelInsuranceDirectory';

const mockAnalyticsTrigger = jest.fn();
const mockPageLayout = jest.fn();
const mockRouterBack = jest.fn();

jest.mock('components/Analytics/AnalyticsTrigger', () => ({
  AnalyticsTrigger: ({
    children,
    ...analyticsProps
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => {
    mockAnalyticsTrigger(analyticsProps);
    return <div data-testid="analytics-trigger">{children}</div>;
  },
}));

jest.mock('layouts/TravelInsuranceDirectoryPageLayout', () => ({
  TravelInsuranceDirectoryPageLayout: ({
    children,
    topInfoSection,
    ...layoutProps
  }: {
    children: ReactNode;
    topInfoSection?: ReactNode;
    [key: string]: unknown;
  }) => {
    mockPageLayout({ ...layoutProps, topInfoSection });
    return (
      <div data-testid="directory-page-layout">
        {topInfoSection}
        {children}
      </div>
    );
  },
}));

jest.mock('@maps-react/core/components/Container', () => ({
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    back: mockRouterBack,
  }),
}));

describe('TravelInsuranceDirectory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: ComponentProps<typeof TravelInsuranceDirectory> = {
    browserTitle: 'Register - Test',
    children: <div>Page content</div>,
  };

  const renderLayout = (
    props: Partial<ComponentProps<typeof TravelInsuranceDirectory>> = {},
  ) => {
    return render(<TravelInsuranceDirectory {...defaultProps} {...props} />);
  };

  it('renders children and passes props to its dependencies', () => {
    renderLayout({
      backLink: '/back',
      heading: 'Test heading',
      showLanguageSwitcher: false,
      analyticsData: { tool: { toolStep: '2' } },
      currentFlow: 'firm',
      errorSummarySection: <div data-testid="error-summary">Errors</div>,
    });

    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Test heading' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('error-summary')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/back',
    );

    expect(mockAnalyticsTrigger).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsData: { tool: { toolStep: '2' } },
        currentStep: '2',
        currentFlow: 'firm',
      }),
    );

    expect(mockPageLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        pageTitle: 'Register - Test - Travel insurance directory',
        showLanguageSwitcher: false,
      }),
    );
  });

  it('uses router.back when backLink is not provided', () => {
    renderLayout();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(mockRouterBack).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('link', { name: 'Back' }),
    ).not.toBeInTheDocument();
  });

  it('hides the back link when displayBacklink is false', () => {
    renderLayout({
      backLink: '/back',
      displayBacklink: false,
    });

    expect(
      screen.queryByRole('link', { name: 'Back' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Back' }),
    ).not.toBeInTheDocument();
  });

  it('omits the heading when heading is not provided', () => {
    renderLayout();

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('passes analyticsConfig to AnalyticsTrigger and defaults currentStep to "0" if toolStep is missing', () => {
    const customConfig = {
      lastStep: '9',
      trackEvents: { pageLoad: false, errorMessage: true } as TrackEvents,
    };

    renderLayout({
      analyticsData: {},
      analyticsConfig: customConfig,
    });

    expect(mockAnalyticsTrigger).toHaveBeenCalledWith(
      expect.objectContaining({
        currentStep: '0',
        lastStep: '9',
        trackEvents: customConfig.trackEvents,
      }),
    );
  });

  it('renders the topInfoSection if provided', () => {
    renderLayout({
      topInfoSection: <div data-testid="top-info">Top Info Block</div>,
    });

    expect(screen.getByTestId('top-info')).toBeInTheDocument();
    expect(mockPageLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        topInfoSection: expect.anything(),
      }),
    );
  });
});
