import React from 'react';
import { render, screen } from '@testing-library/react';
import { Colors } from '.';

describe('Colors component', () => {
  it('renders correctly', () => {
    render(<Colors />);
    const colors = screen.getByTestId('colors');
    expect(colors).toMatchSnapshot();
  });
});
