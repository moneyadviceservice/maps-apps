import { render, screen } from '@testing-library/react';

import { LandingHeading } from './LandingHeading';

import '@testing-library/jest-dom';

describe('test LandingHeading component', () => {
  it('should render the component', () => {
    render(<LandingHeading nextPageLink="/en/about-you" />);
    expect(screen).toMatchSnapshot();
    expect(screen.getByText('Retirement budget planner')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Find out how much money you might need for a comfortable retirement with our free online tool.',
      ),
    ).toBeInTheDocument();
  });
});
