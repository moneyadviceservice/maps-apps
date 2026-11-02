import { render, screen } from '@testing-library/react';

import { HighEarningsCallout } from './HighEarningsCallout';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

const defaultProps = {
  grossIncome: '100000',
  taxCode: '1257L',
};

describe('HighEarningsCallout', () => {
  it('renders the heading and allowance explanation', () => {
    render(<HighEarningsCallout {...defaultProps} />);

    expect(
      screen.getByRole('heading', {
        name: 'Higher earnings can impact your tax-free allowance',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/your salary could mean that your personal allowance/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/for every £2 you earn over £100,000/i),
    ).toBeInTheDocument();
  });

  it.each(['100000', '120000'])(
    'renders for income %s and tax code 1257L',
    (grossIncome) => {
      render(
        <HighEarningsCallout {...defaultProps} grossIncome={grossIncome} />,
      );

      expect(
        screen.getByTestId('high-earnings-notification'),
      ).toBeInTheDocument();
    },
  );

  it.each([
    { grossIncome: '99999', taxCode: '1257L' },
    { grossIncome: '100000', taxCode: 'BR' },
    { grossIncome: '120000', taxCode: 'BR' },
    { grossIncome: '', taxCode: '1257L' },
  ])(
    'does not render for income "$grossIncome" and tax code $taxCode',
    (props) => {
      const { container } = render(<HighEarningsCallout {...props} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('provides an identifiable, programmatically focusable wrapper', () => {
    render(<HighEarningsCallout {...defaultProps} />);

    const notification = screen.getByTestId('high-earnings-notification');

    expect(notification).toHaveAttribute('id', 'high-earnings-notification');
    expect(notification).toHaveAttribute('tabindex', '-1');

    notification.focus();

    expect(notification).toHaveFocus();
  });

  it.each([
    { isEmbed: true, target: '_blank' },
    { isEmbed: false, target: '_self' },
  ])('uses target $target when isEmbed is $isEmbed', ({ isEmbed, target }) => {
    render(<HighEarningsCallout {...defaultProps} isEmbed={isEmbed} />);

    const link = screen.getByRole('link', {
      name: /more about how the personal allowance works/i,
    });

    expect(link).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/work/employment/how-income-tax-and-personal-allowance-works',
    );
    expect(link).toHaveAttribute('target', target);
  });

  it('applies a supplied className', () => {
    render(<HighEarningsCallout {...defaultProps} className="lg:hidden" />);

    expect(screen.getByTestId('high-earnings-notification')).toHaveClass(
      'lg:hidden',
    );
  });
});
