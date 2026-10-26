import { renderToStaticMarkup } from 'react-dom/server';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RetirementIncomeForm } from './RetirementIncomeForm';

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

const renderScreen = (
  overrides?: Partial<Parameters<typeof RetirementIncomeForm>[0]>,
) =>
  render(
    <RetirementIncomeForm
      sessionId="abc"
      language="en"
      annualTarget={14000}
      initialFrequency="year"
      {...overrides}
    />,
  );

describe('RetirementIncomeForm', () => {
  it('shows the yearly target and updates it when the duration changes', async () => {
    const user = userEvent.setup();
    renderScreen();

    expect(screen.getByTestId('target-amount')).toHaveTextContent('£14,000');

    await user.selectOptions(
      screen.getByLabelText('Show the target retirement income'),
      'month',
    );
    expect(screen.getByTestId('target-amount')).toHaveTextContent('£1,167');

    await user.selectOptions(
      screen.getByLabelText('Show the target retirement income'),
      'week',
    );
    expect(screen.getByTestId('target-amount')).toHaveTextContent('£269');
  });

  it('renders a weekly amount from the server frequency', () => {
    renderScreen({ initialFrequency: 'week' });

    expect(screen.getByTestId('target-amount')).toHaveTextContent('£269');
    expect(
      screen.getByLabelText('Show the target retirement income'),
    ).toHaveValue('week');
  });

  it('puts Apply in a noscript submit that is separate from Continue', () => {
    const { container } = renderScreen();
    const noscript = container.querySelector('noscript');
    const frequencyForm = noscript?.closest('form') ?? null;
    const html = renderToStaticMarkup(
      <RetirementIncomeForm
        sessionId="abc"
        language="en"
        annualTarget={14000}
        initialFrequency="year"
      />,
    );

    const noscriptHtml = html.slice(
      html.indexOf('<noscript>'),
      html.indexOf('</noscript>'),
    );

    expect(noscriptHtml).toContain('type="submit"');
    expect(noscriptHtml).toContain('Apply');
    expect(
      screen.queryByRole('button', { name: 'Apply' }),
    ).not.toBeInTheDocument();
    expect(frequencyForm).toHaveAttribute('method', 'get');
    expect(frequencyForm).toHaveAttribute('action', '/en/retirement-income');
    expect(screen.getByTestId('callout')).toContainElement(frequencyForm);
    expect(frequencyForm?.querySelector('[name="sessionId"]')).toHaveValue(
      'abc',
    );
    expect(frequencyForm?.querySelector('[name="frequency"]')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Continue' }).closest('form'),
    ).not.toBe(frequencyForm);
  });

  it('shows the salary bands used for the percentage', () => {
    renderScreen();

    expect(screen.getByText('Up to £15,899')).toBeInTheDocument();
    expect(screen.getByText('£15,900 to £29,000')).toBeInTheDocument();
    expect(screen.getByText('£29,001 to £42,000')).toBeInTheDocument();
    expect(screen.getByText('£42,001 to £66,999')).toBeInTheDocument();
    expect(screen.getByText('£67,000 and above')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
