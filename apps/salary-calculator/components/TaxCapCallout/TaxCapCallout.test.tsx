import { render, screen } from '@testing-library/react';

import { isTaxCapApplied, TaxCapCallout } from './TaxCapCallout';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

describe('isTaxCapApplied', () => {
  it.each([
    { grossIncome: 40000, incomeTax: 40460, expected: true },
    { grossIncome: 40000, incomeTax: 20000.01, expected: true },
    { grossIncome: 40000, incomeTax: 20000, expected: false },
    { grossIncome: 40000, incomeTax: 6000, expected: false },
    { grossIncome: 0, incomeTax: 0, expected: false },
  ])(
    'returns $expected for gross $grossIncome and uncapped tax $incomeTax',
    ({ grossIncome, incomeTax, expected }) => {
      expect(isTaxCapApplied(grossIncome, incomeTax)).toBe(expected);
    },
  );
});

describe('TaxCapCallout', () => {
  it('renders the heading when uncapped income tax is over 50% of gross', () => {
    render(<TaxCapCallout grossIncome={40000} uncappedIncomeTax={40460} />);

    expect(screen.getByTestId('tax-cap-notification')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Your tax code has triggered a 50% tax cap',
      }),
    ).toBeInTheDocument();
  });

  it('does not render when uncapped income tax is at or below 50% of gross', () => {
    const { container } = render(
      <TaxCapCallout grossIncome={40000} uncappedIncomeTax={20000} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('provides an identifiable, programmatically focusable wrapper', () => {
    render(<TaxCapCallout grossIncome={40000} uncappedIncomeTax={40460} />);

    const notification = screen.getByTestId('tax-cap-notification');

    expect(notification).toHaveAttribute('id', 'tax-cap-notification');
    expect(notification).toHaveAttribute('tabindex', '-1');
  });

  it('applies a supplied className', () => {
    render(
      <TaxCapCallout
        grossIncome={40000}
        uncappedIncomeTax={40460}
        className="lg:hidden"
      />,
    );

    expect(screen.getByTestId('tax-cap-notification')).toHaveClass('lg:hidden');
  });
});
