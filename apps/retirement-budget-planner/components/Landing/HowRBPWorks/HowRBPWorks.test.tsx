import { render, screen, within } from '@testing-library/react';

import { HowRBPWorks } from '../HowRBPWorks/HowRBPWorks';

import '@testing-library/jest-dom';

describe('test HowRBPWorks component', () => {
  it('should render the component', () => {
    render(<HowRBPWorks />);
    expect(screen).toMatchSnapshot();
    expect(
      screen.getByText('How our Retirement budget planner works'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'You can create a household budget by adding these details for another person.',
      ),
    ).toBeInTheDocument();
  });
  it('should render the list elements correctly', () => {
    render(<HowRBPWorks />);
    const list = screen.getByTestId('list-element');

    const listItems = within(list).getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('the age you would like to retire.');
    expect(list).toMatchSnapshot();
  });
});
