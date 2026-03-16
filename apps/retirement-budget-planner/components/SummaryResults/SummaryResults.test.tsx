import { render, screen } from '@testing-library/react';

import { SummaryResults } from './SummaryResults';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

// Mock all child components
jest.mock('./SummaryResultsChecklist', () => ({
  SummaryResultsChecklist: () => (
    <div data-testid="summary-results-checklist">
      SummaryResultsChecklist Mock
    </div>
  ),
}));

jest.mock('./SummaryResultsDetails', () => ({
  SummaryResultsDetails: () => (
    <div data-testid="summary-results-details">SummaryResultsDetails Mock</div>
  ),
}));

jest.mock('./SummaryResultsOtherTools', () => ({
  SummaryResultsOtherTools: () => (
    <div data-testid="summary-results-other-tools">
      SummaryResultsOtherTools Mock
    </div>
  ),
}));

jest.mock('./SummaryResultsShare', () => ({
  SummaryResultsShare: () => (
    <div data-testid="summary-results-share">SummaryResultsShare Mock</div>
  ),
}));

const renderComponent = () =>
  render(
    <SummaryResults
      income={{ privatePension: '2000', privatePensionFrequency: 'month' }}
      costs={{ water: '20' }}
      divisor="month"
      tabName="summary"
      partner={{
        id: 1,
        dob: { day: '01', month: '01', year: '1960' },
        gender: 'male',
        retireAge: '67',
      }}
    />,
  );

describe('test SummaryResults component', () => {
  it('should render the component', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();

    // Test that the mocked child components are rendered
    expect(screen.getByTestId('summary-results-checklist')).toBeInTheDocument();
    expect(screen.getByTestId('summary-results-details')).toBeInTheDocument();
    expect(
      screen.getByTestId('summary-results-other-tools'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('summary-results-share')).toBeInTheDocument();
  });
});
