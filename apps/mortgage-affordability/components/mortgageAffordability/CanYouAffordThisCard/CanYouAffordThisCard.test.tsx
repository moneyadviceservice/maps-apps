import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import { CanYouAffordThisCard } from './CanYouAffordThisCard';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/pension-tools/utils/formatCurrency');
jest.mock('data/mortgage-affordability/can-you-afford-this', () => ({
  CanYouAffordThisCopy: jest.fn((_z, i) => ({
    title: 'Can you afford this?',
    takeHomePay: 'Take-home pay',
    newMortgagePayment: 'New mortgage payment',
    otherHouseholdCosts: 'Other household costs',
    leftOver: 'Left over',
    description: `After paying your costs, you have ${i.fLeftOver} left`,
  })),
}));

const defaultProps = {
  monthlyIncome: 3000,
  monthlyPayment: 500,
  fixedAndCommittedCosts: 800,
  leftOver: 1700,
};

describe('CanYouAffordThisCard', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (value: { en: string; cy: string }) => value.en,
    });
    (formatCurrency as jest.Mock).mockImplementation(
      (val: number) => `£${val.toFixed(2)}`,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the card title', () => {
    render(<CanYouAffordThisCard {...defaultProps} />);
    expect(screen.getByText('Can you afford this?')).toBeInTheDocument();
  });

  it.each([
    ['Take-home pay', '£3000.00'],
    ['New mortgage payment', '£500.00'],
    ['Other household costs', '£800.00'],
    ['Left over', '£1700.00'],
  ])('renders "%s" row with value %s', (label, value) => {
    render(<CanYouAffordThisCard {...defaultProps} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it('renders description with formatted leftOver amount', () => {
    render(<CanYouAffordThisCard {...defaultProps} />);
    expect(
      screen.getByText(/After paying your costs, you have/),
    ).toBeInTheDocument();
  });
});
