import { render, screen } from '@testing-library/react';

import useLanguage from '@maps-react/hooks/useLanguage';

import { TaxReliefCallout } from './TaxReliefCallout';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(() => 'en'),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
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
    jest.mocked(useLanguage).mockReturnValue('en');
  });

  it.each([
    { isScottishTaxPayer: false, grossIncome: 50269.99, visible: false },
    { isScottishTaxPayer: false, grossIncome: 50270, visible: false },
    { isScottishTaxPayer: false, grossIncome: 50270.01, visible: true },
    { isScottishTaxPayer: true, grossIncome: 29526, visible: false },
    { isScottishTaxPayer: true, grossIncome: 29526.99, visible: false },
    { isScottishTaxPayer: true, grossIncome: 29527, visible: true },
    { isScottishTaxPayer: true, grossIncome: 29527.01, visible: true },
    { isScottishTaxPayer: false, grossIncome: 0, visible: false },
    { isScottishTaxPayer: false, grossIncome: -1, visible: false },
    { isScottishTaxPayer: false, grossIncome: undefined, visible: false },
  ])(
    'visibility is $visible for income $grossIncome, Scottish: $isScottishTaxPayer',
    ({ visible, ...props }) => {
      render(<TaxReliefCallout {...defaultProps} {...props} />);

      expect(screen.queryByTestId('tax-relief-notification') !== null).toBe(
        visible,
      );
    },
  );

  it.each([
    { employeePensionValue: 5, employerPensionValue: 0, visible: true },
    { employeePensionValue: 0, employerPensionValue: 5, visible: true },
    { employeePensionValue: 5, employerPensionValue: 5, visible: true },
    { employeePensionValue: 0, employerPensionValue: 0, visible: false },
  ])(
    'visibility is $visible with employee $employeePensionValue and employer $employerPensionValue',
    ({ visible, ...props }) => {
      render(<TaxReliefCallout {...defaultProps} {...props} />);

      expect(screen.queryByTestId('tax-relief-notification') !== null).toBe(
        visible,
      );
    },
  );

  it('uses the Scottish bracket for the selected tax year', () => {
    render(
      <TaxReliefCallout
        {...defaultProps}
        isScottishTaxPayer
        taxYear="2024/25"
        grossIncome={26562}
      />,
    );

    expect(screen.getByTestId('tax-relief-notification')).toBeInTheDocument();
  });

  it('renders the heading and a focusable wrapper with the supplied className', () => {
    render(<TaxReliefCallout {...defaultProps} className="hidden lg:block" />);

    expect(
      screen.getByRole('heading', {
        name: 'You might be eligible for extra tax relief',
      }),
    ).toBeInTheDocument();

    const notification = screen.getByTestId('tax-relief-notification');
    expect(notification).toHaveAttribute('id', 'tax-relief-notification');
    expect(notification).toHaveAttribute('tabindex', '-1');
    expect(notification).toHaveClass('hidden', 'lg:block');
    notification.focus();
    expect(notification).toHaveFocus();
  });

  it.each(['en', 'cy'] as const)('uses the %s guidance link', (language) => {
    jest.mocked(useLanguage).mockReturnValue(language);
    render(<TaxReliefCallout {...defaultProps} />);

    const link = screen.getByRole('link', { name: /Gov\.uk/ });
    expect(link).toHaveAttribute(
      'href',
      `https://www.gov.uk/guidance/claim-tax-relief-on-your-private-pension-payments${
        language === 'cy' ? '.cy' : ''
      }`,
    );
    expect(link).toHaveAttribute('target', '_blank');
  });
});
