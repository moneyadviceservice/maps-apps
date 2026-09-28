import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import NextSteps from './NextSteps';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { language: 'en' } }),
}));

describe('NextSteps', () => {
  it('renders the heading', () => {
    render(<NextSteps />);
    expect(
      screen.getByRole('heading', { name: /Next steps/i }),
    ).toBeInTheDocument();
  });

  it('renders all three step headings', () => {
    render(<NextSteps />);
    expect(
      screen.getByRole('heading', { name: /Make your money go further/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Look into support/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Get help with debt/i }),
    ).toBeInTheDocument();
  });

  it('renders body text with links', () => {
    render(<NextSteps />);
    expect(
      screen.getByText(/how to cut your costs and save money on bills/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /the cost of living/i }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining('/en/money-troubles/cost-of-living'),
    );
    expect(
      screen.getByRole('link', { name: /struggling with debt/i }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining(
        '/en/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt',
      ),
    );
    expect(
      screen.getByRole('link', { name: /free debt adviser/i }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining(
        '/en/money-troubles/dealing-with-debt/debt-advice-locator',
      ),
    );
  });

  it('renders as an ordered list', () => {
    const { container } = render(<NextSteps />);
    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
  });
});
