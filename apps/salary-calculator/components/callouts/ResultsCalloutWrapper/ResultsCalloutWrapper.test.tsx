import { render, screen } from '@testing-library/react';

import { ResultsCalloutWrapper } from './ResultsCalloutWrapper';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

describe('ResultsCalloutWrapper', () => {
  it('renders its children in a focusable, identifiable wrapper', () => {
    render(
      <ResultsCalloutWrapper id="results-callout" className="lg:hidden">
        <p>Calculation results</p>
      </ResultsCalloutWrapper>,
    );

    const wrapper = screen.getByTestId('results-callout');

    expect(wrapper).toHaveAttribute('id', 'results-callout');
    expect(wrapper).toHaveAttribute('tabindex', '-1');
    expect(wrapper).toHaveClass('col-span-12', 'xl:col-span-10', 'lg:hidden');
    expect(screen.getByText('Calculation results')).toBeInTheDocument();
  });

  it('renders its base classes when no className is provided', () => {
    render(
      <ResultsCalloutWrapper id="results-callout">
        <p>Calculation results</p>
      </ResultsCalloutWrapper>,
    );

    expect(screen.getByTestId('results-callout')).toHaveClass(
      'col-span-12',
      'xl:col-span-10',
      'mb-6',
      'lg:mb-8',
      'focus:outline-none',
    );
  });
});
