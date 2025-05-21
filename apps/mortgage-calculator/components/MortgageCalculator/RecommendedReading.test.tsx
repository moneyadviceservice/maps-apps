import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import { RecommendedReading } from './RecommendedReading';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RecommendedReading Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
    });
  });

  it('renders the heading', () => {
    render(<RecommendedReading calculationType="repayment" />);
    const heading = screen.getByRole('heading', {
      name: /Recommended reading/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders all expandable sections with correct titles', () => {
    render(<RecommendedReading calculationType="repayment" />);

    const expectedSections = [
      'First-time buyers',
      'Mortgage essentials',
      'Budget planning',
      'Struggling to pay?',
    ];

    expectedSections.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('shows interest-only section when calculationType is interestonly', () => {
    render(<RecommendedReading calculationType="interestonly" />);

    expect(screen.getByText('Repay your mortgage quicker')).toBeInTheDocument();
    expect(
      screen.getByText(/ways of repaying an interest-only mortgage/i),
    ).toBeInTheDocument();
  });

  it('does not show interest-only section when calculationType is repayment', () => {
    render(<RecommendedReading calculationType="repayment" />);

    expect(
      screen.queryByText('Repay your mortgage quicker'),
    ).not.toBeInTheDocument();
  });

  it('opens links in a new tab when isEmbedded is true', () => {
    render(
      <RecommendedReading calculationType="repayment" isEmbedded={true} />,
    );
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('does not open links in a new tab when isEmbedded is false', () => {
    render(
      <RecommendedReading calculationType="repayment" isEmbedded={false} />,
    );
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).not.toHaveAttribute('target', '_blank');
    });
  });

  it('renders all links with correct language parameter', () => {
    render(<RecommendedReading calculationType="repayment" />);
    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveAttribute('href', expect.stringContaining('/en/'));
    });
  });
});
