import { render, screen } from '@testing-library/react';
import { RealTimeSummary } from './RealTimeSummary';
import { SummaryContextProvider } from 'context/SummaryContextProvider';

import { SummaryType } from 'lib/types/summary.type';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

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
    expect(screen.findAllByText('£500')).toBeTruthy();
    expect(screen.findAllByText('£200')).toBeTruthy();
    expect(screen.findAllByText('£300')).toBeTruthy();
  });
});
