import { render, screen } from '@testing-library/react';

import useLanguage from '@maps-react/hooks/useLanguage';

import { TaxReliefCallout, isTaxReliefApplicable } from './TaxReliefCallout';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('../ResultsCallout', () => ({
  ResultsCallout: ({ title, children, showSkipToContent }: any) => (
    <div data-testid="results-callout" data-skip={showSkipToContent}>
      {showSkipToContent && (
        <a href="#single-results-heading">Skip to results</a>
      )}
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(() => 'en'),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

const defaultProps = {
  grossIncome: 60000,
  employeePensionValue: 5,
  employerPensionValue: 0,
  isScottishTaxPayer: false,
  taxYear: '2026/27' as const,
};

describe('TaxReliefCallout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLanguage as jest.Mock).mockReturnValue('en');
  });

  describe('rendering and visibility', () => {
    it('renders when eligible (income above threshold + pension contributions)', () => {
      const { container } = render(<TaxReliefCallout {...defaultProps} />);
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });

    it('does not render when no pension contributions', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          employeePensionValue={0}
          employerPensionValue={0}
        />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('renders with employer pension contributions only', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          employeePensionValue={0}
          employerPensionValue={5}
        />,
      );
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });

    it('renders with both employee and employer pension contributions', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          employeePensionValue={3}
          employerPensionValue={5}
        />,
      );
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });
  });

  describe('income thresholds', () => {
    it('does not render when income is below threshold (£50,269)', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          grossIncome={50269}
          isScottishTaxPayer={false}
        />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('renders when income is at threshold (£50,270)', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          grossIncome={50270}
          isScottishTaxPayer={false}
        />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('renders when income is above threshold (£50,271)', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          grossIncome={50271}
          isScottishTaxPayer={false}
        />,
      );
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });

    it('handles very high income', () => {
      const { container } = render(
        <TaxReliefCallout {...defaultProps} grossIncome={1000000} />,
      );
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });
  });

  describe('Scottish tax thresholds', () => {
    it('does not render when Scottish income is below threshold (£29,526)', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          isScottishTaxPayer={true}
          grossIncome={29526}
        />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('renders when Scottish income is at threshold (£29,527)', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          isScottishTaxPayer={true}
          grossIncome={29527}
        />,
      );
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });

    it('renders when Scottish income is above threshold (£29,528)', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          isScottishTaxPayer={true}
          grossIncome={29528}
        />,
      );
      expect(container.textContent).toContain(
        'You might be eligible for extra tax relief',
      );
    });
  });

  describe('skip to content link', () => {
    it('omits skip link by default', () => {
      render(<TaxReliefCallout {...defaultProps} />);
      expect(
        screen.queryByRole('link', { name: 'Skip to results' }),
      ).not.toBeInTheDocument();
    });

    it('renders skip link when showSkipToContent is true', () => {
      render(<TaxReliefCallout {...defaultProps} showSkipToContent />);
      expect(
        screen.getByRole('link', { name: 'Skip to results' }),
      ).toHaveAttribute('href', '#single-results-heading');
    });
  });

  describe('language support', () => {
    it('renders English guidance link when language is en', () => {
      (useLanguage as jest.Mock).mockReturnValue('en');
      render(<TaxReliefCallout {...defaultProps} />);

      const link = screen.getByRole('link', { name: /Gov\.uk/ });
      expect(link).toHaveAttribute(
        'href',
        'https://www.gov.uk/guidance/claim-tax-relief-on-your-private-pension-payments',
      );
    });

    it('renders Welsh guidance link when language is cy', () => {
      (useLanguage as jest.Mock).mockReturnValue('cy');
      render(<TaxReliefCallout {...defaultProps} />);

      const link = screen.getByRole('link', { name: /Gov\.uk/ });
      expect(link).toHaveAttribute(
        'href',
        'https://www.gov.uk/guidance/claim-tax-relief-on-your-private-pension-payments.cy',
      );
    });

    it('opens link in new tab', () => {
      render(<TaxReliefCallout {...defaultProps} />);
      const link = screen.getByRole('link', { name: /Gov\.uk/ });
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('styling and attributes', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(
        <TaxReliefCallout {...defaultProps} className="hidden lg:block" />,
      );
      const wrapper = container.querySelector(
        '[data-testid="tax-relief-notification"]',
      );
      expect(wrapper).toHaveClass('hidden', 'lg:block');
    });

    it('sets wrapper id and tabindex attributes', () => {
      const { container } = render(<TaxReliefCallout {...defaultProps} />);
      const wrapper = container.querySelector(
        '[data-testid="tax-relief-notification"]',
      );
      expect(wrapper).toHaveAttribute('id', 'tax-relief-notification');
      expect(wrapper).toHaveAttribute('tabindex', '-1');
    });

    it('wrapper is focusable', () => {
      const { container } = render(<TaxReliefCallout {...defaultProps} />);
      const wrapper = container.querySelector(
        '[data-testid="tax-relief-notification"]',
      ) as HTMLElement;
      wrapper.focus();
      expect(wrapper).toHaveFocus();
    });
  });

  describe('tax year support', () => {
    it('uses correct threshold for 2024/25 tax year (Scottish)', () => {
      render(
        <TaxReliefCallout
          {...defaultProps}
          isScottishTaxPayer={true}
          taxYear="2024/25"
          grossIncome={26562}
        />,
      );
      expect(screen.getByTestId('results-callout')).toBeInTheDocument();
    });

    it('uses correct threshold for 2025/26 tax year', () => {
      render(
        <TaxReliefCallout
          {...defaultProps}
          isScottishTaxPayer={false}
          taxYear="2025/26"
          grossIncome={50271}
        />,
      );
      expect(screen.getByTestId('results-callout')).toBeInTheDocument();
    });

    it('uses correct threshold for 2026/27 tax year', () => {
      render(
        <TaxReliefCallout
          {...defaultProps}
          isScottishTaxPayer={false}
          taxYear="2026/27"
          grossIncome={50271}
        />,
      );
      expect(screen.getByTestId('results-callout')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles undefined grossIncome gracefully', () => {
      const { container } = render(
        <TaxReliefCallout {...defaultProps} grossIncome={undefined} />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('handles zero grossIncome', () => {
      const { container } = render(
        <TaxReliefCallout {...defaultProps} grossIncome={0} />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('handles negative grossIncome', () => {
      const { container } = render(
        <TaxReliefCallout {...defaultProps} grossIncome={-1} />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });

    it('combines low income with high pension contributions', () => {
      const { container } = render(
        <TaxReliefCallout
          {...defaultProps}
          grossIncome={10000}
          employeePensionValue={10}
        />,
      );
      expect(screen.queryByTestId('results-callout')).not.toBeInTheDocument();
    });
  });

  describe('ResultsCallout component integration', () => {
    it('passes correct title to ResultsCallout', () => {
      render(<TaxReliefCallout {...defaultProps} />);
      expect(
        screen.getByRole('heading', {
          name: 'You might be eligible for extra tax relief',
        }),
      ).toBeInTheDocument();
    });

    it('passes showSkipToContent prop to ResultsCallout', () => {
      const { container } = render(
        <TaxReliefCallout {...defaultProps} showSkipToContent />,
      );
      const resultCallout = container.querySelector(
        '[data-testid="results-callout"]',
      );
      expect(resultCallout).toHaveAttribute('data-skip', 'true');
    });

    it('renders children content inside ResultsCallout', () => {
      render(<TaxReliefCallout {...defaultProps} />);
      const content = screen.getAllByText(/higher rate tax payer/i)[0];
      expect(content).toBeInTheDocument();
    });
  });
});

describe('isTaxReliefApplicable helper function', () => {
  it('returns true when income exceeds threshold and has employee pension', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 60000,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: false,
      taxYear: '2026/27',
    });
    expect(result).toBe(true);
  });

  it('returns true when income exceeds threshold and has employer pension', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 60000,
      employeePensionValue: 0,
      employerPensionValue: 5,
      isScottishTaxPayer: false,
      taxYear: '2026/27',
    });
    expect(result).toBe(true);
  });

  it('returns false when income is below threshold', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 50269,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: false,
      taxYear: '2026/27',
    });
    expect(result).toBe(false);
  });

  it('returns false when no pension contributions', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 60000,
      employeePensionValue: 0,
      employerPensionValue: 0,
      isScottishTaxPayer: false,
      taxYear: '2026/27',
    });
    expect(result).toBe(false);
  });

  it('returns true for Scottish taxpayer above Scottish threshold', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 29527,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: true,
      taxYear: '2026/27',
    });
    expect(result).toBe(true);
  });

  it('returns false for Scottish taxpayer below Scottish threshold', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 29526,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: true,
      taxYear: '2026/27',
    });
    expect(result).toBe(false);
  });

  it('handles undefined grossIncome', () => {
    const result = isTaxReliefApplicable({
      grossIncome: undefined,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: false,
      taxYear: '2026/27',
    });
    expect(result).toBe(false);
  });

  it('handles zero grossIncome', () => {
    const result = isTaxReliefApplicable({
      grossIncome: 0,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: false,
      taxYear: '2026/27',
    });
    expect(result).toBe(false);
  });

  it('handles different tax years correctly', () => {
    const result2024 = isTaxReliefApplicable({
      grossIncome: 26562,
      employeePensionValue: 5,
      employerPensionValue: 0,
      isScottishTaxPayer: true,
      taxYear: '2024/25',
    });
    expect(result2024).toBe(true);
  });
});
