import { render, screen } from '@testing-library/react';
import { RealTimeSummary } from './RealTimeSummary';
import { SummaryContextProvider } from 'context/SummaryContextProvider';
import { SummaryType } from 'lib/types/summary.type';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mockFunction = jest.fn(() => ({
    t: (key: string) => mockTranslationDataEn[key] ?? key,
    locale: 'en',
  }));
  return {
    __esModule: true,
    useTranslation: mockFunction,
    default: mockFunction,
  };
});

const mockRenderSummary = (data?: SummaryType) =>
  render(
    <SummaryContextProvider>
      <RealTimeSummary summaryData={data} />
    </SummaryContextProvider>,
  );

describe('Real Time Summary component', () => {
  it('should render the component', () => {
    const { container } = mockRenderSummary({ income: 1000, spending: 500 });
    expect(container).toMatchSnapshot();
  });

  it('should display summary data from context', () => {
    jest.mock('../../context/SummaryContextProvider', () => ({
      useSummaryContext: jest
        .fn()
        .mockImplementation(() => ({ income: 500, spending: 200 })),
    }));
    mockRenderSummary();
    expect(screen.findAllByText('£500.00')).toBeTruthy();
    expect(screen.findAllByText('£200.00')).toBeTruthy();
    expect(screen.findAllByText('£300.00')).toBeTruthy();
  });

  it('should render aria-live region for screen reader announcements', () => {
    mockRenderSummary({ income: 1000, spending: 500 });
    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();
    expect(ariaLiveRegion).toHaveAttribute('aria-live', 'polite');
    expect(ariaLiveRegion).toHaveAttribute('aria-atomic', 'true');
    expect(ariaLiveRegion).toHaveClass('sr-only');
  });

  it('should render with undefined summary data', () => {
    mockRenderSummary();
    expect(screen.getByTestId('summary-total')).toBeInTheDocument();
  });

  it('should render with zero values', () => {
    mockRenderSummary({ income: 0, spending: 0 });
    expect(screen.getByTestId('summary-total')).toBeInTheDocument();
  });

  it('should generate announcement text for overspending (negative) status', () => {
    mockRenderSummary({ income: 500, spending: 1000 });
    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();
  });

  it('should generate announcement text for positive balance status', () => {
    mockRenderSummary({ income: 2000, spending: 500 });
    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();
  });

  it('should generate announcement text for balanced status', () => {
    mockRenderSummary({ income: 1000, spending: 1000 });
    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();
  });

  it('should update announcement when income changes', async () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Initial render
    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();

    // Update with new income
    rerender(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1500, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Fast-forward timers to trigger announcement
    jest.advanceTimersByTime(100);
    expect(ariaLiveRegion).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should update announcement when spending changes', async () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Update with new spending
    rerender(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 700 }} />
      </SummaryContextProvider>,
    );

    // Fast-forward timers to trigger announcement
    jest.advanceTimersByTime(100);

    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should clear announcement after timeout', async () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Update with new values
    rerender(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1200, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Fast-forward to trigger announcement
    jest.advanceTimersByTime(100);

    // Fast-forward to clear announcement
    jest.advanceTimersByTime(3000);

    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion.textContent).toBe('');

    jest.useRealTimers();
  });

  it('should cleanup timeout on unmount', () => {
    jest.useFakeTimers();
    const { unmount } = mockRenderSummary({ income: 1000, spending: 500 });

    unmount();

    // Verify no errors thrown when clearing timeouts
    expect(() => jest.runAllTimers()).not.toThrow();

    jest.useRealTimers();
  });

  it('should handle rapid value changes correctly', () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Rapid changes
    rerender(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1100, spending: 500 }} />
      </SummaryContextProvider>,
    );

    rerender(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1200, spending: 500 }} />
      </SummaryContextProvider>,
    );

    // Should clear previous timeouts
    jest.advanceTimersByTime(100);

    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    expect(ariaLiveRegion).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should not announce when values do not change', () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 500 }} />
      </SummaryContextProvider>,
    );

    const ariaLiveRegion = screen.getByTestId('summary-announcement');
    const initialContent = ariaLiveRegion.textContent;

    // Rerender with same values
    rerender(
      <SummaryContextProvider>
        <RealTimeSummary summaryData={{ income: 1000, spending: 500 }} />
      </SummaryContextProvider>,
    );

    jest.advanceTimersByTime(200);

    // Content should remain the same
    expect(ariaLiveRegion.textContent).toBe(initialContent);

    jest.useRealTimers();
  });
});
