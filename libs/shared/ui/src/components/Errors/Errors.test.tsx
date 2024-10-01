import React from 'react';
import { render, screen } from '@testing-library/react';
import { Errors } from '.';

describe('Errors component', () => {
  it('renders correctly', () => {
    render(<Errors errors={['errors']}>This contains errors</Errors>);
    const container = screen.getByTestId('errors');
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when there are no errors', () => {
    render(<Errors errors={[]}>This contains errors</Errors>);
    const container = screen.getByTestId('errors');
    expect(container).toMatchSnapshot();
  });
});
