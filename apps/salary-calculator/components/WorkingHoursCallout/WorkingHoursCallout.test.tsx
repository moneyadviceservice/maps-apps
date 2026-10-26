import { render, screen } from '@testing-library/react';

import { WorkingHoursCallout } from './WorkingHoursCallout';

import '@testing-library/jest-dom';

let mockLocale: 'en' | 'cy' = 'en';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (copy: { en: string; cy: string }) => copy[mockLocale],
  }),
}));

describe('WorkingHoursCallout', () => {
  Element.prototype.scrollIntoView = jest.fn();

  it.each(['en', 'cy'] as const)(
    'renders the working hours warning in %s for hourly pay over 48 hours a week',
    (locale) => {
      mockLocale = locale;
      const { container } = render(
        <WorkingHoursCallout
          salary={{ grossIncomeFrequency: 'hourly', hoursPerWeek: '49' }}
          className="hidden lg:block"
        />,
      );

      expect(
        Array.from(container.querySelectorAll('h3, p'), (el) => el.textContent),
      ).toMatchSnapshot();
      expect(screen.getByRole('link', { name: /Acas/ })).toHaveAttribute(
        'href',
        'https://www.acas.org.uk/',
      );
      expect(
        screen.getByRole('link', { name: /Labour Relations/ }),
      ).toHaveAttribute('href', 'https://www.lra.org.uk/');
      expect(
        screen.getByTestId('notification-box-warning').parentElement,
      ).toHaveClass('hidden', 'lg:block');
    },
  );

  it('renders nothing for hourly pay at 48 hours a week or fewer', () => {
    const { container } = render(
      <WorkingHoursCallout
        salary={{ grossIncomeFrequency: 'hourly', hoursPerWeek: '48' }}
        className="hidden lg:block"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for non-hourly pay', () => {
    const { container } = render(
      <WorkingHoursCallout
        salary={{ grossIncomeFrequency: 'annual', hoursPerWeek: '60' }}
        className="hidden lg:block"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
