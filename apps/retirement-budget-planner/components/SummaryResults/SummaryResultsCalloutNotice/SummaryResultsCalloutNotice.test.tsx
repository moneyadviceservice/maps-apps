import { render, screen } from '@testing-library/react';

import { SummaryResultsCalloutNotice } from './SummaryResultsCalloutNotice';

import '@testing-library/jest-dom';

describe('test SummaryResultsCalloutNotice component', () => {
  it('should render the component', () => {
    render(
      <SummaryResultsCalloutNotice
        title="You should have money left over"
        content={
          'Your costs are lower than your estimated retirement income, so you should have money left over.\n\nThe [Retirement Living Standards](https://retirementlivingstandards.org.uk/) can give you an idea of the lifestyle you might be able to afford.'
        }
      />,
    );

    // Heading
    expect(
      screen.getByRole('heading', { name: /you should have money left over/i }),
    ).toBeInTheDocument();

    // Content
    expect(
      screen.getByText(
        /your costs are lower than your estimated retirement income, so you should have money left over/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /retirement living standards/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /retirement living standards/i }),
    ).toHaveAttribute('href', 'https://retirementlivingstandards.org.uk/');
  });
});
