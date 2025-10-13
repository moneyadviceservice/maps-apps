import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailSummaryIntro } from './PensionDetailSummaryIntro';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[1] as PensionArrangement;

describe('PensionDetailSummary', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
    });
  });

  it('renders the component with correct structure', () => {
    render(<PensionDetailSummaryIntro data={mockData} />);
    expect(screen.getByTestId('detail-summary-intro')).toBeInTheDocument();
    expect(screen.getByTestId('pension-detail-intro')).toBeInTheDocument();
    expect(screen.getByTestId('pension-status')).toBeInTheDocument();
    expect(screen.getByTestId('pension-detail-type')).toBeInTheDocument();
  });

  it('does not render the pension status if not received', () => {
    render(
      <PensionDetailSummaryIntro
        data={{ ...mockData, pensionStatus: undefined }}
      />,
    );
    expect(screen.queryByTestId('pension-status')).not.toBeInTheDocument();
  });
});
