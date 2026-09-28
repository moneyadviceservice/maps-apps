import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import OtherTools from './OtherTools';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { language: 'en' } }),
}));

describe('OtherTools', () => {
  it('renders the heading', () => {
    render(<OtherTools />);
    expect(
      screen.getByRole('heading', { name: /Other tools to try/i }),
    ).toBeInTheDocument();
  });

  it('renders all three teaser cards', () => {
    render(<OtherTools />);
    expect(
      screen.getByRole('heading', { name: /Budget planner/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Bill prioritiser/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Benefits calculator/i }),
    ).toBeInTheDocument();
  });

  it('renders descriptions for each tool', () => {
    render(<OtherTools />);
    expect(
      screen.getByText(/Get in control of your household spending/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sorts out the bills you need to deal with/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/use our Benefits calculator to quickly find out/i),
    ).toBeInTheDocument();
  });

  it('renders correct links with language prefix', () => {
    render(<OtherTools />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      'href',
      expect.stringContaining('/en/everyday-money/budgeting/budget-planner'),
    );
    expect(links[1]).toHaveAttribute(
      'href',
      expect.stringContaining(
        '/en/money-troubles/cost-of-living/bill-prioritiser',
      ),
    );
    expect(links[2]).toHaveAttribute(
      'href',
      expect.stringContaining('/en/benefits/benefits-calculator'),
    );
  });
});
