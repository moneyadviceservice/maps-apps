import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { MINIMUM_HOURLY_WAGE } from 'utils/rates/constants';

import { isBelowMinimumWage, MinimumWageCallout } from '.';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string }) => en,
    locale: 'en',
  }),
}));

jest.mock('@maps-react/common/components/Link', () => ({
  Link: ({
    children,
    href,
    target,
  }: {
    children: ReactNode;
    href: string;
    target?: string;
  }) => (
    <a href={href} target={target}>
      {children}
    </a>
  ),
}));

const renderCallout = (
  grossIncome: string,
  grossIncomeFrequency: 'hourly' | 'annual' = 'hourly',
  showSkipToContent?: boolean,
) =>
  render(
    <MinimumWageCallout
      salary={{ grossIncome, grossIncomeFrequency }}
      className="lg:hidden"
      showSkipToContent={showSkipToContent}
    />,
  );

describe('isBelowMinimumWage', () => {
  it.each([
    ['hourly below the threshold', 'hourly', MINIMUM_HOURLY_WAGE - 0.01, true],
    ['hourly at the threshold', 'hourly', MINIMUM_HOURLY_WAGE, false],
    ['hourly above the threshold', 'hourly', MINIMUM_HOURLY_WAGE + 0.01, false],
    ['annual below the threshold', 'annual', MINIMUM_HOURLY_WAGE - 0.01, false],
  ] as const)(
    'returns %s correctly',
    (_scenario, frequency, income, expected) => {
      expect(
        isBelowMinimumWage({
          grossIncome: String(income),
          grossIncomeFrequency: frequency,
        }),
      ).toBe(expected);
    },
  );
});

describe('MinimumWageCallout', () => {
  it('renders the warning, wage guidance, link, and wrapper class', () => {
    renderCallout(String(MINIMUM_HOURLY_WAGE - 0.01));

    expect(
      screen.getByRole('heading', {
        name: 'Your hourly rate may be below minimum wage',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you should be earning at least/),
    ).toBeInTheDocument();

    const ratesLink = screen.getByRole('link', {
      name: 'National Minimum Wage rates',
    });
    expect(ratesLink).toHaveAttribute(
      'href',
      'https://www.gov.uk/national-minimum-wage-rates',
    );
    expect(ratesLink).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('minimum-wage-notification')).toHaveClass(
      'lg:hidden',
    );
  });

  it.each([
    [undefined, false],
    [false, false],
    [true, true],
  ] as const)(
    'renders the skip link when enabled is %s',
    (showSkipToContent, shouldRenderLink) => {
      renderCallout(
        String(MINIMUM_HOURLY_WAGE - 0.01),
        'hourly',
        showSkipToContent,
      );

      const skipLink = screen.queryByRole('link', { name: 'Skip to results' });
      if (shouldRenderLink) {
        expect(skipLink).toHaveAttribute('href', '#single-results-heading');
      } else {
        expect(skipLink).not.toBeInTheDocument();
      }
    },
  );

  it.each([
    [String(MINIMUM_HOURLY_WAGE), 'hourly'],
    [String(MINIMUM_HOURLY_WAGE + 1), 'hourly'],
    [String(MINIMUM_HOURLY_WAGE - 1), 'annual'],
  ] as const)(
    'renders nothing for income %s with %s frequency',
    (income, frequency) => {
      const { container } = renderCallout(income, frequency);

      expect(container).toBeEmptyDOMElement();
    },
  );
});
