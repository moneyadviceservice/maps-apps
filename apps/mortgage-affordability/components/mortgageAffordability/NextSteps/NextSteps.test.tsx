import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { NextSteps } from './NextSteps';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('data/mortgage-affordability/results', () => ({
  resultsContent: jest.fn(() => ({
    nextSteps: 'Ready for next steps?',
    nextStepsLinks: [
      {
        text: 'Explore all homes and mortgage guides',
        href: 'https://example.com/homes',
      },
      {
        text: 'Understanding mortgages and interest rates',
        href: 'https://example.com/rates',
      },
    ],
    nextStepsRiskLink: {
      success: {
        text: 'How to apply for a mortgage',
        href: 'https://example.com/apply',
      },
      warning: {
        text: 'How to prepare for an interest rate change',
        href: 'https://example.com/rates-change',
      },
    },
  })),
}));

describe('NextSteps', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (value: { en: string; cy: string }) => value.en,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading', () => {
    render(<NextSteps riskLevel="success" />);
    expect(screen.getByText('Ready for next steps?')).toBeInTheDocument();
  });

  it('renders the 2 static links', () => {
    render(<NextSteps riskLevel="success" />);
    expect(
      screen.getByText('Explore all homes and mortgage guides'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Understanding mortgages and interest rates'),
    ).toBeInTheDocument();
  });

  it('renders the success risk link when riskLevel is success', () => {
    render(<NextSteps riskLevel="success" />);
    expect(screen.getByText('How to apply for a mortgage')).toBeInTheDocument();
    expect(
      screen.queryByText('How to prepare for an interest rate change'),
    ).not.toBeInTheDocument();
  });

  it('renders the warning risk link when riskLevel is warning', () => {
    render(<NextSteps riskLevel="warning" />);
    expect(
      screen.getByText('How to prepare for an interest rate change'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('How to apply for a mortgage'),
    ).not.toBeInTheDocument();
  });

  it('renders 3 links in total', () => {
    render(<NextSteps riskLevel="success" />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});
