import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PensionCalculatorBanner } from './PensionCalculatorBanner';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('PensionCalculatorBanner', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders section correctly', () => {
    render(<PensionCalculatorBanner />);

    const cta = screen.getByTestId('pension-calculator-banner-cta');

    expect(screen.getByTestId('pension-calculator-banner')).toBeInTheDocument();

    expect(
      screen.getByTestId('pension-calculator-banner-heading'),
    ).toHaveTextContent('components.pension-calculator-banner.heading');

    expect(
      screen.getByTestId('pension-calculator-banner-body'),
    ).toHaveTextContent('components.pension-calculator-banner.body');

    expect(cta).toHaveAttribute(
      'href',
      'components.pension-calculator-banner.cta-href',
    );
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');

    expect(
      screen.getByTestId('pension-calculator-banner-time'),
    ).toHaveTextContent('components.pension-calculator-banner.time');
  });

  it('merges optional className onto the section', () => {
    render(<PensionCalculatorBanner className="mt-8 md:mt-16" />);

    expect(screen.getByTestId('pension-calculator-banner')).toHaveClass(
      'mt-8',
      'md:mt-16',
    );
  });
});
