import { render, screen } from '@testing-library/react';

import { SummaryResults } from './SummaryResults';

import '@testing-library/jest-dom';

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

describe('test SummaryResults component', () => {
  it('should render the component', () => {
    render(<SummaryResults />);

    // Test that the mocked child components are rendered
    expect(screen.getByTestId('summary-results-checklist')).toBeInTheDocument();
    expect(screen.getByTestId('summary-results-details')).toBeInTheDocument();
    expect(
      screen.getByTestId('summary-results-other-tools'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('summary-results-share')).toBeInTheDocument();

    // Test that the feedback placeholder is rendered
    expect(screen.getByText(/feedback placeholder/i)).toBeInTheDocument();
  });
});
