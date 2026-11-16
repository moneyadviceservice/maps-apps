import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Nav } from './Nav';

describe('Nav Component', () => {
  it('should render default Nav correctly', () => {
    render(<Nav />);

    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByText('Create Test Data Scenario')).toBeInTheDocument();
    expect(screen.getByText('Scenarios List')).toBeInTheDocument();
  });
});
