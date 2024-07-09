import React from 'react';
import { render, screen } from '@testing-library/react';
import { Typography } from '.';

describe('Typography component', () => {
  it('renders correctly', () => {
    render(<Typography />);
    const colors = screen.getByTestId('typography');
    expect(colors).toMatchSnapshot();
  });
});
