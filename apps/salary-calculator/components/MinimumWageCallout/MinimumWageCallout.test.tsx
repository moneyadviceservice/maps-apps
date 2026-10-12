import { render, screen } from '@testing-library/react';

import { MinimumWageCallout } from './MinimumWageCallout';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string }) => en,
  }),
}));

describe('MinimumWageCallout', () => {
  Element.prototype.scrollIntoView = jest.fn();

  it('renders the minimum wage warning for an hourly rate below minimum wage', () => {
    render(
      <MinimumWageCallout
        salary={{ grossIncome: '12.70', grossIncomeFrequency: 'hourly' }}
        className="hidden lg:block"
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Your hourly rate may be below minimum wage',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent ===
            "If you're 21 or over, by law you should be earning at least £12.71 an hour.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('21').tagName).toBe('STRONG');
    expect(screen.getByText('£12.71').tagName).toBe('STRONG');
    expect(
      screen.getByRole('link', { name: /National Minimum Wage rates/ }),
    ).toHaveAttribute('href', 'https://www.gov.uk/national-minimum-wage-rates');
    expect(
      screen.getByTestId('notification-box-warning').parentElement,
    ).toHaveClass('hidden', 'lg:block');
  });

  it('renders nothing for an hourly rate at or above minimum wage', () => {
    const { container } = render(
      <MinimumWageCallout
        salary={{ grossIncome: '12.71', grossIncomeFrequency: 'hourly' }}
        className="hidden lg:block"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a non-hourly salary', () => {
    const { container } = render(
      <MinimumWageCallout
        salary={{ grossIncome: '10', grossIncomeFrequency: 'annual' }}
        className="hidden lg:block"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
