import { render, screen } from '@testing-library/react';

import { StatePensionCallout } from './StatePensionCallout';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

describe('StatePensionCallout', () => {
  it('renders the heading and guidance', () => {
    render(<StatePensionCallout />);

    expect(
      screen.getByRole('heading', {
        name: 'Are you about to reach State Pension age?',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you could be nearing the State Pension age soon/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'free guidance' })).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches',
    );
    expect(
      screen.getByRole('link', {
        name: /check the official State Pension age here/,
      }),
    ).toHaveAttribute('href', 'https://www.gov.uk/state-pension-age');
  });

  it.each([
    { isEmbed: true, target: '_blank' },
    { isEmbed: false, target: '_self' },
  ])('uses target $target when isEmbed is $isEmbed', ({ isEmbed, target }) => {
    render(<StatePensionCallout isEmbed={isEmbed} />);

    expect(screen.getByRole('link', { name: /free guidance/ })).toHaveAttribute(
      'target',
      target,
    );
  });

  it('provides an identifiable, programmatically focusable wrapper', () => {
    render(<StatePensionCallout />);

    const notification = screen.getByTestId('state-pension-notification');

    expect(notification).toHaveAttribute('id', 'state-pension-notification');
    expect(notification).toHaveAttribute('tabindex', '-1');

    notification.focus();

    expect(notification).toHaveFocus();
  });

  it('applies a supplied className', () => {
    render(<StatePensionCallout className="lg:hidden" />);

    expect(screen.getByTestId('state-pension-notification')).toHaveClass(
      'lg:hidden',
    );
  });
});
