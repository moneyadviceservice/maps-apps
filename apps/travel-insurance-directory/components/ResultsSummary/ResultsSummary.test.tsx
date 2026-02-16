import { render, screen } from '@testing-library/react';

import { ResultsSummary } from './ResultsSummary';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }, vars?: Record<string, string>) => {
      if (vars) {
        let s = t.en;
        Object.entries(vars).forEach(([k, v]) => {
          s = s.replaceAll(`{${k}}`, v);
        });
        return s;
      }
      return t.en;
    },
  }),
}));

describe('ResultsSummary', () => {
  it('renders with results-summary test id', () => {
    render(<ResultsSummary startIndex={0} endIndex={5} totalItems={29} />);
    expect(screen.getByTestId('results-summary')).toBeInTheDocument();
  });

  it('shows range and total when items exist', () => {
    render(<ResultsSummary startIndex={0} endIndex={5} totalItems={29} />);
    expect(screen.getByText(/Showing 1 – 5 of 29 firms/)).toBeInTheDocument();
  });

  it('shows from as 1 when startIndex is 0', () => {
    render(<ResultsSummary startIndex={0} endIndex={10} totalItems={50} />);
    expect(screen.getByText(/Showing 1 – 10 of 50 firms/)).toBeInTheDocument();
  });

  it('shows correct range for second page', () => {
    render(<ResultsSummary startIndex={5} endIndex={10} totalItems={29} />);
    expect(screen.getByText(/Showing 6 – 10 of 29 firms/)).toBeInTheDocument();
  });

  it('shows 0 when totalItems is 0', () => {
    render(<ResultsSummary startIndex={0} endIndex={0} totalItems={0} />);
    expect(screen.getByText(/Showing 0 – 0 of 0 firms/)).toBeInTheDocument();
  });

  it('includes firms order text', () => {
    render(<ResultsSummary startIndex={0} endIndex={5} totalItems={10} />);
    expect(
      screen.getByText('Firms presented in no particular order.'),
    ).toBeInTheDocument();
  });
});
