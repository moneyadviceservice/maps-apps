import { render, screen } from '@testing-library/react';
import { BenefitsCallout } from './BenefitsCallout';
import '@testing-library/jest-dom';

// Mock the useTranslation hook
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string }) => en,
  }),
}));

describe('BenefitsCallout', () => {
  it('renders with default testId', () => {
    render(<BenefitsCallout />);
    const callout = screen.getByTestId(
      'callout-information-salary-calculator-benefits-callout',
    );
    expect(callout).toBeInTheDocument();
  });

  it('renders with custom testId', () => {
    render(<BenefitsCallout testId="custom-id" />);
    const callout = screen.getByTestId('callout-information-custom-id');
    expect(callout).toBeInTheDocument();
  });

  it('renders heading and paragraph text', () => {
    render(<BenefitsCallout />);
    expect(
      screen.getByText('Are you missing out on extra help?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You could still get benefits even if you are working/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/10-minute benefits calculator/),
    ).toBeInTheDocument();
  });

  it('applies a custom className if provided', () => {
    render(<BenefitsCallout className="my-custom-class" />);
    const callout = screen.getByTestId(
      'callout-information-salary-calculator-benefits-callout',
    );
    expect(callout).toHaveClass('my-custom-class');
  });
});
