import { ReactNode } from 'react';

import { STATE_PENSION_FORECAST_URL } from 'data/state-pension';
import { useStatePensionForm } from 'hooks/useStatePensionForm';
import type { StatePensionErrors } from 'types/statePension';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

import { StatePensionForm, StatePensionIntro } from './StatePensionForm';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
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

type WrapperProps = {
  initialWeeklyAmount?: string;
  maxWeeklyAmount?: string;
  initialErrors?: StatePensionErrors;
};

const Wrapper = ({
  initialWeeklyAmount = '',
  maxWeeklyAmount = '250.00',
  initialErrors = {},
}: WrapperProps) => {
  const form = useStatePensionForm({
    sessionId: 'abc',
    initialWeeklyAmount,
    maxWeeklyAmount,
    initialErrors,
  });

  return (
    <>
      {form.hasErrors && (
        <ErrorSummary
          ref={form.errorSummaryRef}
          title={form.copy.errorSummaryTitle}
          errors={form.errors}
          classNames="mb-2"
        />
      )}
      <StatePensionIntro maxWeeklyAmount={maxWeeklyAmount} />
      <StatePensionForm form={form} />
    </>
  );
};

const wrapper = (props?: WrapperProps) => render(<Wrapper {...props} />);

describe('StatePensionForm', () => {
  it('renders the forecast link, assumption and actions', () => {
    wrapper();

    expect(
      screen.queryByRole('heading', { name: 'Your State Pension' }),
    ).not.toBeInTheDocument();

    const forecastLink = screen.getByRole('link', {
      name: 'check your State Pension forecast',
    });
    expect(forecastLink).toHaveAttribute('href', STATE_PENSION_FORECAST_URL);
    expect(forecastLink).toHaveAttribute('target', '_blank');
    expect(
      screen.getByText(
        'Or, press continue and we’ll assume you qualify for the maximum amount of State Pension – currently £250.00 a week.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(
      screen.getByRole('button', { name: /Save and come back later/ }),
    ).toHaveAttribute('formAction', '/api/state-pension?action=save');
  });

  it('shows a stored weekly amount', () => {
    wrapper({ initialWeeklyAmount: '180' });

    expect(screen.getByLabelText('Weekly amount')).toHaveValue('180');
  });

  it('shows the non-numeric amount error', () => {
    wrapper({
      initialWeeklyAmount: 'abc',
      initialErrors: {
        statePensionWeeklyAmount: ['Enter an amount in pounds, like 250.00'],
      },
    });

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(
      screen.getAllByText('Enter an amount in pounds, like 250.00').length,
    ).toBeGreaterThan(0);
  });

  it('keeps the weekly amount in local state', async () => {
    const user = userEvent.setup();
    wrapper();

    const amount = screen.getByLabelText('Weekly amount');
    expect(amount).toHaveValue('');

    await user.type(amount, '180');

    expect(amount).toHaveValue('180');
  });
});
