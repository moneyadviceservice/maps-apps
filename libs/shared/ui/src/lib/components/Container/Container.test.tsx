import React from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from '.';

describe('Container component', () => {
  it('renders correctly', () => {
    render(<Container data-testid="container">Container</Container>);
    const container = screen.getByTestId('container');
    expect(container).toMatchSnapshot();
  });
});
